import { d as logActivity, l as getSql, p as requireMember, t as ForbiddenError } from "./access-C7hj-I_h.mjs";
import { a as recordAiRequest, i as enforceRequestLimit, n as citationsFrom, o as retrieveContext, r as completeAnswer, t as buildRagPrompt } from "./rag-lXd8-II2.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { iso, nid } from "./ids-BTLa109z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant.functions-DOaNyQiO.js
function parseSources(raw) {
	try {
		const parsed = JSON.parse(raw);
		return Array.isArray(parsed) ? parsed : [];
	} catch {
		return [];
	}
}
var listConversations_createServerFn_handler = createServerRpc({
	id: "3844233883584cbaeabe78ff26a43966cb0a497870447ee37427b401defa19ac",
	name: "listConversations",
	filename: "src/lib/nexora/assistant.functions.ts"
}, (opts) => listConversations.__executeServer(opts));
var listConversations = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(listConversations_createServerFn_handler, async ({ context, data: orgId }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, orgId);
	return (await sql`
      select id, title, kb_id, created_at, updated_at
      from conversations
      where org_id = ${orgId} and user_id = ${context.userId}
      order by updated_at desc
      limit 40
    `).map((r) => ({
		id: r.id,
		title: r.title,
		kbId: r.kb_id,
		createdAt: iso(r.created_at),
		updatedAt: iso(r.updated_at)
	}));
});
var getConversation_createServerFn_handler = createServerRpc({
	id: "4b381f2e8652dce49784deed56e792df295913ed47198cf36600e554739fdfaa",
	name: "getConversation",
	filename: "src/lib/nexora/assistant.functions.ts"
}, (opts) => getConversation.__executeServer(opts));
var getConversation = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(getConversation_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, data.orgId);
	const conv = await sql`
      select id, title, kb_id, created_at, updated_at
      from conversations
      where id = ${data.conversationId} and org_id = ${data.orgId} and user_id = ${context.userId}
    `;
	if (!conv[0]) throw new ForbiddenError("Conversation not found");
	const messages = await sql`
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
			updatedAt: iso(conv[0].updated_at)
		},
		messages: messages.map((m) => ({
			id: m.id,
			role: m.role,
			content: m.content,
			sources: parseSources(m.sources_json),
			createdAt: iso(m.created_at)
		}))
	};
});
var createConversation_createServerFn_handler = createServerRpc({
	id: "f3fea6d7088904610efc9749efcf3589af7d7ccf16c8f1bd40806671422670c9",
	name: "createConversation",
	filename: "src/lib/nexora/assistant.functions.ts"
}, (opts) => createConversation.__executeServer(opts));
var createConversation = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createConversation_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, data.orgId);
	const id = nid("con");
	await sql`
      insert into conversations (id, org_id, user_id, kb_id, title)
      values (${id}, ${data.orgId}, ${context.userId}, ${data.kbId ?? null}, ${"New conversation"})
    `;
	return { id };
});
var deleteConversation_createServerFn_handler = createServerRpc({
	id: "bf0334773931e404a451ee40ab9efbef298a178d9421cb629862c70a736fde33",
	name: "deleteConversation",
	filename: "src/lib/nexora/assistant.functions.ts"
}, (opts) => deleteConversation.__executeServer(opts));
var deleteConversation = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(deleteConversation_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, data.orgId);
	await sql`
      delete from messages where conversation_id = ${data.conversationId} and org_id = ${data.orgId}
    `;
	await sql`
      delete from conversations
      where id = ${data.conversationId} and org_id = ${data.orgId} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var askAssistant_createServerFn_handler = createServerRpc({
	id: "d4e5f636d8c76c4d51757798cfab523e338e9bfd0fff2f03b9e2ab5018fc569d",
	name: "askAssistant",
	filename: "src/lib/nexora/assistant.functions.ts"
}, (opts) => askAssistant.__executeServer(opts));
var askAssistant = createServerFn({ method: "POST" }).validator((input) => {
	const question = input.question.trim();
	if (question.length < 3) throw new Error("Ask a more complete question");
	if (question.length > 2e3) throw new Error("Question is too long");
	return {
		...input,
		question
	};
}).middleware([authMiddleware]).handler(askAssistant_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	await enforceRequestLimit(sql, data.orgId, member.plan);
	const conv = await sql`
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
	let answer;
	let tokens = 0;
	if (chunks.length === 0) answer = "I could not find anything in this workspace's knowledge bases that matches that question. Try a different knowledge base, or upload the policy or runbook that should contain the answer.";
	else {
		const prompt = buildRagPrompt(member.name, data.question, chunks);
		const result = await completeAnswer(prompt.system, prompt.user);
		if (!result.ok) answer = result.error === "AI is not available in this environment" ? "AI is not available in this environment. Retrieval still found sources — open them below." : `The model could not complete this answer (${result.error}). Relevant sources are listed below.`;
		else {
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
	if (conv[0].title === "New conversation") await sql`
        update conversations set title = ${data.question.slice(0, 72)}, updated_at = now()
        where id = ${data.conversationId}
      `;
	else await sql`update conversations set updated_at = now() where id = ${data.conversationId}`;
	await recordAiRequest(sql, data.orgId, context.userId, tokens);
	await logActivity(sql, data.orgId, context.userId, "assistant.asked", data.question.slice(0, 80));
	return {
		userMessage: {
			id: userMsgId,
			role: "user",
			content: data.question,
			sources: [],
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		},
		assistantMessage: {
			id: assistantMsgId,
			role: "assistant",
			content: answer,
			sources,
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}
	};
});
//#endregion
export { askAssistant_createServerFn_handler, createConversation_createServerFn_handler, deleteConversation_createServerFn_handler, getConversation_createServerFn_handler, listConversations_createServerFn_handler };
