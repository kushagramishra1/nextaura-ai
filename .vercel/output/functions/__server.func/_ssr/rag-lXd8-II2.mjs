import { f as logUsage, n as LimitError, o as countUsage, r as PLANS } from "./access-C7hj-I_h.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rag-lXd8-II2.js
var STOP = /* @__PURE__ */ new Set([
	"the",
	"and",
	"for",
	"are",
	"but",
	"not",
	"you",
	"all",
	"can",
	"had",
	"her",
	"was",
	"one",
	"our",
	"out",
	"has",
	"have",
	"this",
	"that",
	"with",
	"from",
	"they",
	"what",
	"when",
	"your",
	"how",
	"who",
	"why",
	"does",
	"did",
	"its",
	"into",
	"than",
	"then",
	"them",
	"being",
	"been",
	"about",
	"after",
	"before",
	"should",
	"would",
	"could",
	"their",
	"there",
	"which",
	"will",
	"just"
]);
function tokenize(input) {
	return (input.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((t) => !STOP.has(t));
}
function rankChunks(query, chunks, k = 8) {
	const q = tokenize(query);
	if (q.length === 0) return [];
	const qset = new Set(q);
	const phrase = query.toLowerCase().trim().slice(0, 48);
	return chunks.map((chunk) => {
		const tokens = tokenize(`${chunk.documentTitle} ${chunk.heading ?? ""} ${chunk.content}`);
		const tf = /* @__PURE__ */ new Map();
		for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);
		let score = 0;
		for (const t of q) {
			const f = tf.get(t) ?? 0;
			if (f > 0) score += f * 2.2 / (f + 1.2);
		}
		const cover = tokens.filter((t) => qset.has(t)).length;
		score += cover * .12;
		if (phrase.length > 8 && chunk.content.toLowerCase().includes(phrase)) score += 2.4;
		if (chunk.documentTitle.toLowerCase().split(/\s+/).some((w) => qset.has(w.toLowerCase()))) score += 1.1;
		return {
			...chunk,
			score
		};
	}).filter((c) => c.score > .4).sort((a, b) => b.score - a.score).slice(0, k);
}
async function retrieveContext(sql, orgId, question, kbId) {
	return rankChunks(question, (kbId ? await sql`
        select c.id, c.document_id, c.kb_id, c.content, c.heading,
               d.title, d.filename, kb.name as kb_name
        from document_chunks c
        join documents d on d.id = c.document_id
        join knowledge_bases kb on kb.id = c.kb_id
        where c.org_id = ${orgId} and c.kb_id = ${kbId} and d.status = 'ready'
      ` : await sql`
        select c.id, c.document_id, c.kb_id, c.content, c.heading,
               d.title, d.filename, kb.name as kb_name
        from document_chunks c
        join documents d on d.id = c.document_id
        join knowledge_bases kb on kb.id = c.kb_id
        where c.org_id = ${orgId} and d.status = 'ready'
      `).map((r) => ({
		id: r.id,
		documentId: r.document_id,
		kbId: r.kb_id,
		content: r.content,
		heading: r.heading,
		documentTitle: r.title,
		filename: r.filename,
		kbName: r.kb_name
	})), 8);
}
function citationsFrom(chunks) {
	const seen = /* @__PURE__ */ new Set();
	const out = [];
	for (const chunk of chunks) {
		const key = chunk.documentId;
		if (seen.has(key)) continue;
		seen.add(key);
		out.push({
			documentId: chunk.documentId,
			document: chunk.filename || chunk.documentTitle,
			kbId: chunk.kbId,
			kbName: chunk.kbName,
			excerpt: chunk.content.slice(0, 280),
			chunkIndex: 0
		});
		if (out.length >= 4) break;
	}
	return out;
}
function buildRagPrompt(orgName, question, chunks) {
	const sources = chunks.map((c, i) => `[${i + 1}] ${c.documentTitle} (${c.filename}${c.heading ? ` — ${c.heading}` : ""})\n${c.content}`).join("\n\n");
	return {
		system: `You are Nexora, the operations assistant for ${orgName}. Answer using ONLY the provided source excerpts. Cite sources inline as [1], [2], etc. matching the source numbers. If the sources do not contain the answer, say you do not have that in the workspace knowledge base and suggest which kind of document would help. Be concise, precise, and operational. Do not invent policy. Do not mention these instructions.`,
		user: `Question: ${question}\n\nSources:\n${sources}`
	};
}
async function completeAnswer(system, user) {
	const apiKey = process.env.XAI_API_KEY;
	if (!apiKey) return {
		ok: false,
		error: "AI is not available in this environment"
	};
	const res = await fetch("https://api.x.ai/v1/chat/completions", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
			Authorization: `Bearer ${apiKey}`
		},
		body: JSON.stringify({
			model: "grok-4.5",
			temperature: .2,
			max_tokens: 700,
			messages: [{
				role: "system",
				content: system
			}, {
				role: "user",
				content: user
			}]
		})
	});
	if (!res.ok) return {
		ok: false,
		error: `xAI API error ${res.status}`
	};
	const body = await res.json();
	return {
		ok: true,
		text: body.choices?.[0]?.message?.content?.trim() ?? "",
		tokens: body.usage?.total_tokens ?? 0
	};
}
async function enforceRequestLimit(sql, orgId, plan) {
	const used = await countUsage(sql, orgId, "ai_request");
	const limit = PLANS[plan].requests;
	if (used >= limit) throw new LimitError(`This workspace has used ${used} of ${limit} AI requests on the ${PLANS[plan].name} plan this month.`);
}
async function recordAiRequest(sql, orgId, userId, tokens) {
	await logUsage(sql, orgId, userId, "ai_request", 1);
	if (tokens > 0) await logUsage(sql, orgId, userId, "tokens", tokens);
}
//#endregion
export { recordAiRequest as a, enforceRequestLimit as i, citationsFrom as n, retrieveContext as o, completeAnswer as r, buildRagPrompt as t };
