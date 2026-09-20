import { d as logActivity, l as getSql, m as requireRole, n as LimitError, p as requireMember, r as PLANS, t as ForbiddenError } from "./access-C7hj-I_h.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { iso, nid } from "./ids-BTLa109z.mjs";
import { t as chunkText } from "./chunk-CCwsomoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/knowledge.functions-Czf8jiv9.js
function asKb(row) {
	return {
		id: row.id,
		orgId: row.org_id,
		name: row.name,
		description: row.description,
		createdAt: iso(row.created_at),
		documentCount: Number(row.document_count ?? 0),
		readyCount: Number(row.ready_count ?? 0)
	};
}
function asDoc(row) {
	return {
		id: row.id,
		orgId: row.org_id,
		kbId: row.kb_id,
		title: row.title,
		filename: row.filename,
		mimeType: row.mime_type,
		status: row.status,
		error: row.error,
		sizeBytes: Number(row.size_bytes ?? 0),
		chunkCount: Number(row.chunk_count ?? 0),
		createdAt: iso(row.created_at),
		indexedAt: iso(row.indexed_at)
	};
}
var listKnowledgeBases_createServerFn_handler = createServerRpc({
	id: "0b893903c510505b39db1c0249531b9a701880abf40307fb2434013340e48608",
	name: "listKnowledgeBases",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => listKnowledgeBases.__executeServer(opts));
var listKnowledgeBases = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(listKnowledgeBases_createServerFn_handler, async ({ context, data: orgId }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, orgId);
	return (await sql`
      select
        kb.id, kb.org_id, kb.name, kb.description, kb.created_at,
        (select count(*)::int from documents d where d.kb_id = kb.id) as document_count,
        (select count(*)::int from documents d where d.kb_id = kb.id and d.status = 'ready') as ready_count
      from knowledge_bases kb
      where kb.org_id = ${orgId}
      order by kb.created_at asc
    `).map(asKb);
});
var getKnowledgeBase_createServerFn_handler = createServerRpc({
	id: "656911f9425771340135f97412214d5b73d199c0b77f565626772bd78c30afc6",
	name: "getKnowledgeBase",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => getKnowledgeBase.__executeServer(opts));
var getKnowledgeBase = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(getKnowledgeBase_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, data.orgId);
	const rows = await sql`
      select
        kb.id, kb.org_id, kb.name, kb.description, kb.created_at,
        (select count(*)::int from documents d where d.kb_id = kb.id) as document_count,
        (select count(*)::int from documents d where d.kb_id = kb.id and d.status = 'ready') as ready_count
      from knowledge_bases kb
      where kb.id = ${data.kbId} and kb.org_id = ${data.orgId}
    `;
	if (!rows[0]) throw new ForbiddenError("Knowledge base not found");
	return asKb(rows[0]);
});
var createKnowledgeBase_createServerFn_handler = createServerRpc({
	id: "6ccc4abe59568258d8bf6ee189a49ce414f2511cb237bc550a4fc9ccdcf73a5a",
	name: "createKnowledgeBase",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => createKnowledgeBase.__executeServer(opts));
var createKnowledgeBase = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2) throw new Error("Name is required");
	return {
		orgId: input.orgId,
		name,
		description: input.description.trim()
	};
}).middleware([authMiddleware]).handler(createKnowledgeBase_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, [
		"owner",
		"admin",
		"member"
	]);
	const plan = PLANS[member.plan];
	const count = await sql`
      select count(*)::int as n from knowledge_bases where org_id = ${data.orgId}
    `;
	if (Number(count[0]?.n ?? 0) >= plan.knowledgeBases) throw new LimitError(`The ${plan.name} plan allows ${plan.knowledgeBases} knowledge bases`);
	const id = nid("kb");
	await sql`
      insert into knowledge_bases (id, org_id, name, description, created_by)
      values (${id}, ${data.orgId}, ${data.name}, ${data.description}, ${context.userId})
    `;
	await logActivity(sql, data.orgId, context.userId, "kb.created", data.name);
	return { id };
});
var deleteKnowledgeBase_createServerFn_handler = createServerRpc({
	id: "78a1123669b915f90e53215a1ce7dada95bb48db139303734f3424bb85d099dd",
	name: "deleteKnowledgeBase",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => deleteKnowledgeBase.__executeServer(opts));
var deleteKnowledgeBase = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(deleteKnowledgeBase_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner", "admin"]);
	await sql`delete from document_chunks where kb_id = ${data.kbId} and org_id = ${data.orgId}`;
	await sql`delete from documents where kb_id = ${data.kbId} and org_id = ${data.orgId}`;
	await sql`delete from knowledge_bases where id = ${data.kbId} and org_id = ${data.orgId}`;
	await logActivity(sql, data.orgId, context.userId, "kb.deleted", data.kbId);
	return { ok: true };
});
var listDocuments_createServerFn_handler = createServerRpc({
	id: "47663f4c5287a128afac3cc0ae2da2b071b26315860bd1ffb707b81df756200b",
	name: "listDocuments",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => listDocuments.__executeServer(opts));
var listDocuments = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(listDocuments_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, data.orgId);
	return (await sql`
      select id, org_id, kb_id, title, filename, mime_type, status, error,
             size_bytes, chunk_count, created_at, indexed_at
      from documents
      where kb_id = ${data.kbId} and org_id = ${data.orgId}
      order by created_at desc
    `).map(asDoc);
});
var getDocument_createServerFn_handler = createServerRpc({
	id: "072bfffcc35aaea5f2a799abccbdaad2b5a5bafac74e2540f4093e19b9c3c3e4",
	name: "getDocument",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => getDocument.__executeServer(opts));
var getDocument = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(getDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, data.orgId);
	const rows = await sql`
      select id, org_id, kb_id, title, filename, mime_type, status, error,
             size_bytes, chunk_count, created_at, indexed_at, content
      from documents
      where id = ${data.documentId} and org_id = ${data.orgId}
    `;
	if (!rows[0]) throw new ForbiddenError("Document not found");
	return {
		...asDoc(rows[0]),
		content: rows[0].content
	};
});
var ingestDocument_createServerFn_handler = createServerRpc({
	id: "579f147a54362dc5245a2d8715f7db1cccf7411c2b41e0b69f4db5c899c412c4",
	name: "ingestDocument",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => ingestDocument.__executeServer(opts));
var ingestDocument = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(ingestDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, [
		"owner",
		"admin",
		"member"
	]);
	if (!(await sql`
      select id from knowledge_bases where id = ${data.kbId} and org_id = ${data.orgId}
    `)[0]) throw new ForbiddenError("Knowledge base not found");
	const plan = PLANS[member.plan];
	const docCount = await sql`
      select count(*)::int as n from documents where org_id = ${data.orgId}
    `;
	if (Number(docCount[0]?.n ?? 0) >= plan.documents) throw new LimitError(`The ${plan.name} plan allows ${plan.documents} documents`);
	let text = (data.pastedText ?? "").trim();
	const filename = data.filename.trim() || "note.md";
	if (!text) {
		if (!data.contentBase64) throw new Error("No file contents");
		const raw = Buffer.from(data.contentBase64, "base64");
		if (raw.byteLength > 2e6) throw new Error("Files are limited to 2 MB");
		const { extractDocumentText } = await import("./extract-C4_tIItX.mjs");
		text = await extractDocumentText(filename, data.mimeType, new Uint8Array(raw));
	}
	if (text.length < 20) throw new Error("That document does not contain enough text to index");
	const title = data.title?.trim() || filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
	const docId = nid("doc");
	await sql`
      insert into documents (
        id, org_id, kb_id, title, filename, mime_type, content, status,
        size_bytes, created_by
      )
      values (
        ${docId}, ${data.orgId}, ${data.kbId}, ${title}, ${filename},
        ${data.mimeType || "text/plain"}, ${text}, ${"processing"},
        ${text.length}, ${context.userId}
      )
    `;
	try {
		await sql`update documents set status = ${"indexing"} where id = ${docId} and org_id = ${data.orgId}`;
		const chunks = chunkText(text);
		for (const chunk of chunks) await sql`
          insert into document_chunks (id, org_id, kb_id, document_id, chunk_index, content, heading)
          values (
            ${nid("chk")}, ${data.orgId}, ${data.kbId}, ${docId}, ${chunk.index},
            ${chunk.content}, ${chunk.heading}
          )
        `;
		await sql`
        update documents
        set status = ${"ready"}, chunk_count = ${chunks.length}, indexed_at = now(), error = null
        where id = ${docId} and org_id = ${data.orgId}
      `;
		await logActivity(sql, data.orgId, context.userId, "document.indexed", title);
	} catch (err) {
		await sql`
        update documents set status = ${"failed"}, error = ${err instanceof Error ? err.message : "Indexing failed"}
        where id = ${docId} and org_id = ${data.orgId}
      `;
		throw err;
	}
	return {
		id: docId,
		status: "ready"
	};
});
var deleteDocument_createServerFn_handler = createServerRpc({
	id: "61d875481b43d3fd097c574899f2719001e80e24d1eca2c6b41dd5c2f62da552",
	name: "deleteDocument",
	filename: "src/lib/nexora/knowledge.functions.ts"
}, (opts) => deleteDocument.__executeServer(opts));
var deleteDocument = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(deleteDocument_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, [
		"owner",
		"admin",
		"member"
	]);
	await sql`delete from document_chunks where document_id = ${data.documentId} and org_id = ${data.orgId}`;
	await sql`delete from documents where id = ${data.documentId} and org_id = ${data.orgId}`;
	await logActivity(sql, data.orgId, context.userId, "document.deleted", data.documentId);
	return { ok: true };
});
//#endregion
export { createKnowledgeBase_createServerFn_handler, deleteDocument_createServerFn_handler, deleteKnowledgeBase_createServerFn_handler, getDocument_createServerFn_handler, getKnowledgeBase_createServerFn_handler, ingestDocument_createServerFn_handler, listDocuments_createServerFn_handler, listKnowledgeBases_createServerFn_handler };
