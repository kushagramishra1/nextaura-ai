import { createFileRoute } from "@tanstack/react-router";
import { getSql } from "@/lib/db";
import { authenticateApiKey, corsHeaders } from "@/lib/nexora/api-auth";
import {
  buildRagPrompt,
  citationsFrom,
  completeAnswer,
  enforceRequestLimit,
  recordAiRequest,
  retrieveContext,
} from "@/lib/nexora/rag";

export const Route = createFileRoute("/api/v1/assistant/query")({
  server: {
    handlers: {
      OPTIONS: () => new Response(null, { status: 204, headers: corsHeaders() }),
      POST: async ({ request }) => {
        const headers = corsHeaders();
        try {
          const principal = await authenticateApiKey(request.headers.get("authorization"));
          if (!principal) {
            return Response.json(
              { error: "Invalid or revoked API key" },
              { status: 401, headers },
            );
          }
          const body = (await request.json()) as {
            knowledge_base_id?: string;
            question?: string;
          };
          const question = (body.question ?? "").trim();
          if (question.length < 3) {
            return Response.json(
              { error: "question is required" },
              { status: 400, headers },
            );
          }
          const sql = await getSql();
          await enforceRequestLimit(sql, principal.orgId, principal.plan);
          const org = await sql<{ name: string }>`
            select name from organizations where id = ${principal.orgId}
          `;
          const chunks = await retrieveContext(
            sql,
            principal.orgId,
            question,
            body.knowledge_base_id,
          );
          const sources = citationsFrom(chunks).map((s) => ({
            document: s.document,
            knowledge_base: s.kbName,
            excerpt: s.excerpt,
          }));
          if (chunks.length === 0) {
            await recordAiRequest(sql, principal.orgId, null, 0);
            return Response.json(
              {
                answer:
                  "No matching documents were found in this workspace knowledge base.",
                sources: [],
              },
              { headers },
            );
          }
          const prompt = buildRagPrompt(org[0]?.name ?? "workspace", question, chunks);
          const result = await completeAnswer(prompt.system, prompt.user);
          await recordAiRequest(sql, principal.orgId, null, result.ok ? result.tokens : 0);
          if (!result.ok) {
            return Response.json(
              { error: result.error, sources },
              { status: 503, headers },
            );
          }
          return Response.json({ answer: result.text, sources }, { headers });
        } catch (err) {
          const message = err instanceof Error ? err.message : "Request failed";
          const status =
            message.toLowerCase().includes("plan") || message.toLowerCase().includes("limit")
              ? 429
              : 500;
          return Response.json({ error: message }, { status, headers });
        }
      },
    },
  },
});
