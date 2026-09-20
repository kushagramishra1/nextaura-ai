import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { ForbiddenError, logActivity, requireMember } from "./access";
import { iso, nid } from "./ids";
import {
  buildRagPrompt,
  citationsFrom,
  completeAnswer,
  enforceRequestLimit,
  recordAiRequest,
  retrieveContext,
} from "./rag";
import type { ChatMessage, Citation, Conversation } from "./types";

function parseSources(raw: string): Citation[] {
  try {
    const parsed = JSON.parse(raw) as Citation[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

export const listConversations = createServerFn({ method: "GET" })
  .validator((orgId: string) => orgId)
  .middleware([authMiddleware])
  .handler(async ({ context, data: orgId }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, orgId);
    const rows = await sql<{
      id: string;
      title: string;
      kb_id: string | null;
      created_at: unknown;
      updated_at: unknown;
    }>`
      select id, title, kb_id, created_at, updated_at
      from conversations
      where org_id = ${orgId} and user_id = ${context.userId}
      order by updated_at desc
      limit 40
    `;
    return rows.map(
      (r): Conversation => ({
        id: r.id,
        title: r.title,
        kbId: r.kb_id,
        createdAt: iso(r.created_at),
        updatedAt: iso(r.updated_at),
      }),
    );
  });

export const getConversation = createServerFn({ method: "GET" })
  .validator((input: { orgId: string; conversationId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, data.orgId);
    const conv = await sql<{
      id: string;
      title: string;
      kb_id: string | null;
      created_at: unknown;
      updated_at: unknown;
    }>`
      select id, title, kb_id, created_at, updated_at
      from conversations
      where id = ${data.conversationId} and org_id = ${data.orgId} and user_id = ${context.userId}
    `;
    if (!conv[0]) throw new ForbiddenError("Conversation not found");
    const messages = await sql<{
      id: string;
      role: "user" | "assistant";
      content: string;
      sources_json: string;
      created_at: unknown;
    }>`
      select id, role, content, sources_json, created_at
      from messages
      where conversation_id = ${data.conversationId} and org_id = ${data.orgId}
      order by created_at asc
    `;
    return {
      conversation: {
        id: conv[0].id,
        title: conv[0].title,
        kbId: conv[0].kb_id,
        createdAt: iso(conv[0].created_at),
        updatedAt: iso(conv[0].updated_at),
      } satisfies Conversation,
      messages: messages.map(
        (m): ChatMessage => ({
          id: m.id,
          role: m.role,
          content: m.content,
          sources: parseSources(m.sources_json),
          createdAt: iso(m.created_at),
        }),
      ),
    };
  });

export const createConversation = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; kbId?: string | null }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, data.orgId);
    const id = nid("con");
    await sql`
      insert into conversations (id, org_id, user_id, kb_id, title)
      values (${id}, ${data.orgId}, ${context.userId}, ${data.kbId ?? null}, ${"New conversation"})
    `;
    return { id };
  });

export const deleteConversation = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; conversationId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, data.orgId);
    await sql`
      delete from messages where conversation_id = ${data.conversationId} and org_id = ${data.orgId}
    `;
    await sql`
      delete from conversations
      where id = ${data.conversationId} and org_id = ${data.orgId} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const askAssistant = createServerFn({ method: "POST" })
  .validator(
    (input: {
      orgId: string;
      conversationId: string;
      question: string;
      kbId?: string | null;
    }) => {
      const question = input.question.trim();
      if (question.length < 3) throw new Error("Ask a more complete question");
      if (question.length > 2000) throw new Error("Question is too long");
      return { ...input, question };
    },
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    await enforceRequestLimit(sql, data.orgId, member.plan);

    const conv = await sql<{ id: string; title: string }>`
      select id, title from conversations
      where id = ${data.conversationId} and org_id = ${data.orgId} and user_id = ${context.userId}
    `;
    if (!conv[0]) throw new ForbiddenError("Conversation not found");

    const userMsgId = nid("msg");
    await sql`
      insert into messages (id, conversation_id, org_id, role, content, sources_json)
      values (${userMsgId}, ${data.conversationId}, ${data.orgId}, ${"user"}, ${data.question}, ${"[]"})
    `;

    const chunks = await retrieveContext(sql, data.orgId, data.question, data.kbId);
    const sources = citationsFrom(chunks);

    let answer: string;
    let tokens = 0;
    if (chunks.length === 0) {
      answer =
        "I could not find anything in this workspace's knowledge bases that matches that question. Try a different knowledge base, or upload the policy or runbook that should contain the answer.";
    } else {
      const prompt = buildRagPrompt(member.name, data.question, chunks);
      const result = await completeAnswer(prompt.system, prompt.user);
      if (!result.ok) {
        answer =
          result.error === "AI is not available in this environment"
            ? "AI is not available in this environment. Retrieval still found sources — open them below."
            : `The model could not complete this answer (${result.error}). Relevant sources are listed below.`;
      } else {
        answer = result.text || "I could not produce an answer from the retrieved sources.";
        tokens = result.tokens;
      }
    }

    const assistantMsgId = nid("msg");
    await sql`
      insert into messages (id, conversation_id, org_id, role, content, sources_json)
      values (
        ${assistantMsgId}, ${data.conversationId}, ${data.orgId}, ${"assistant"},
        ${answer}, ${JSON.stringify(sources)}
      )
    `;

    if (conv[0].title === "New conversation") {
      const title = data.question.slice(0, 72);
      await sql`
        update conversations set title = ${title}, updated_at = now()
        where id = ${data.conversationId}
      `;
    } else {
      await sql`update conversations set updated_at = now() where id = ${data.conversationId}`;
    }

    await recordAiRequest(sql, data.orgId, context.userId, tokens);
    await logActivity(sql, data.orgId, context.userId, "assistant.asked", data.question.slice(0, 80));

    return {
      userMessage: {
        id: userMsgId,
        role: "user" as const,
        content: data.question,
        sources: [],
        createdAt: new Date().toISOString(),
      },
      assistantMessage: {
        id: assistantMsgId,
        role: "assistant" as const,
        content: answer,
        sources,
        createdAt: new Date().toISOString(),
      },
    };
  });
