import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import {
  ForbiddenError,
  LimitError,
  logActivity,
  requireMember,
  requireRole,
} from "./access";
import { chunkText } from "./chunk";
import { iso, nid } from "./ids";
import { PLANS } from "./plans";
import type { DocumentRow, DocumentStatus, KnowledgeBase } from "./types";

function asKb(row: {
  id: string;
  org_id: string;
  name: string;
  description: string;
  created_at: unknown;
  document_count: number;
  ready_count: number;
}): KnowledgeBase {
  return {
    id: row.id,
    orgId: row.org_id,
    name: row.name,
    description: row.description,
    createdAt: iso(row.created_at),
    documentCount: Number(row.document_count ?? 0),
    readyCount: Number(row.ready_count ?? 0),
  };
}

function asDoc(row: {
  id: string;
  org_id: string;
  kb_id: string;
  title: string;
  filename: string;
  mime_type: string;
  status: string;
  error: string | null;
  size_bytes: number;
  chunk_count: number;
  created_at: unknown;
  indexed_at: unknown;
}): DocumentRow {
  return {
    id: row.id,
    orgId: row.org_id,
    kbId: row.kb_id,
    title: row.title,
    filename: row.filename,
    mimeType: row.mime_type,
    status: row.status as DocumentStatus,
    error: row.error,
    sizeBytes: Number(row.size_bytes ?? 0),
    chunkCount: Number(row.chunk_count ?? 0),
    createdAt: iso(row.created_at),
    indexedAt: iso(row.indexed_at),
  };
}

export const listKnowledgeBases = createServerFn({ method: "GET" })
  .validator((orgId: string) => orgId)
  .middleware([authMiddleware])
  .handler(async ({ context, data: orgId }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, orgId);
    const rows = await sql<{
      id: string;
      org_id: string;
      name: string;
      description: string;
      created_at: unknown;
      document_count: number;
      ready_count: number;
    }>`
      select
        kb.id, kb.org_id, kb.name, kb.description, kb.created_at,
        (select count(*)::int from documents d where d.kb_id = kb.id) as document_count,
        (select count(*)::int from documents d where d.kb_id = kb.id and d.status = 'ready') as ready_count
      from knowledge_bases kb
      where kb.org_id = ${orgId}
      order by kb.created_at asc
    `;
    return rows.map(asKb);
  });

export const getKnowledgeBase = createServerFn({ method: "GET" })
  .validator((input: { orgId: string; kbId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, data.orgId);
    const rows = await sql<{
      id: string;
      org_id: string;
      name: string;
      description: string;
      created_at: unknown;
      document_count: number;
      ready_count: number;
    }>`
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

export const createKnowledgeBase = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; name: string; description: string }) => {
    const name = input.name.trim();
    if (name.length < 2) throw new Error("Name is required");
    return { orgId: input.orgId, name, description: input.description.trim() };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin", "member"]);
    const plan = PLANS[member.plan];
    const count = await sql<{ n: number }>`
      select count(*)::int as n from knowledge_bases where org_id = ${data.orgId}
    `;
    if (Number(count[0]?.n ?? 0) >= plan.knowledgeBases) {
      throw new LimitError(`The ${plan.name} plan allows ${plan.knowledgeBases} knowledge bases`);
    }
    const id = nid("kb");
    await sql`
      insert into knowledge_bases (id, org_id, name, description, created_by)
      values (${id}, ${data.orgId}, ${data.name}, ${data.description}, ${context.userId})
    `;
    await logActivity(sql, data.orgId, context.userId, "kb.created", data.name);
    return { id };
  });

export const deleteKnowledgeBase = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; kbId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin"]);
    await sql`delete from document_chunks where kb_id = ${data.kbId} and org_id = ${data.orgId}`;
    await sql`delete from documents where kb_id = ${data.kbId} and org_id = ${data.orgId}`;
    await sql`delete from knowledge_bases where id = ${data.kbId} and org_id = ${data.orgId}`;
    await logActivity(sql, data.orgId, context.userId, "kb.deleted", data.kbId);
    return { ok: true as const };
  });

export const listDocuments = createServerFn({ method: "GET" })
  .validator((input: { orgId: string; kbId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, data.orgId);
    const rows = await sql<{
      id: string;
      org_id: string;
      kb_id: string;
      title: string;
      filename: string;
      mime_type: string;
      status: string;
      error: string | null;
      size_bytes: number;
      chunk_count: number;
      created_at: unknown;
      indexed_at: unknown;
    }>`
      select id, org_id, kb_id, title, filename, mime_type, status, error,
             size_bytes, chunk_count, created_at, indexed_at
      from documents
      where kb_id = ${data.kbId} and org_id = ${data.orgId}
      order by created_at desc
    `;
    return rows.map(asDoc);
  });

export const getDocument = createServerFn({ method: "GET" })
  .validator((input: { orgId: string; documentId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, data.orgId);
    const rows = await sql<{
      id: string;
      org_id: string;
      kb_id: string;
      title: string;
      filename: string;
      mime_type: string;
      status: string;
      error: string | null;
      size_bytes: number;
      chunk_count: number;
      created_at: unknown;
      indexed_at: unknown;
      content: string;
    }>`
      select id, org_id, kb_id, title, filename, mime_type, status, error,
             size_bytes, chunk_count, created_at, indexed_at, content
      from documents
      where id = ${data.documentId} and org_id = ${data.orgId}
    `;
    if (!rows[0]) throw new ForbiddenError("Document not found");
    return { ...asDoc(rows[0]), content: rows[0].content };
  });

export const ingestDocument = createServerFn({ method: "POST" })
  .validator(
    (input: {
      orgId: string;
      kbId: string;
      filename: string;
      mimeType: string;
      contentBase64?: string;
      pastedText?: string;
      title?: string;
    }) => input,
  )
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin", "member"]);

    const kb = await sql<{ id: string }>`
      select id from knowledge_bases where id = ${data.kbId} and org_id = ${data.orgId}
    `;
    if (!kb[0]) throw new ForbiddenError("Knowledge base not found");

    const plan = PLANS[member.plan];
    const docCount = await sql<{ n: number }>`
      select count(*)::int as n from documents where org_id = ${data.orgId}
    `;
    if (Number(docCount[0]?.n ?? 0) >= plan.documents) {
      throw new LimitError(`The ${plan.name} plan allows ${plan.documents} documents`);
    }

    let text = (data.pastedText ?? "").trim();
    const filename = data.filename.trim() || "note.md";
    if (!text) {
      if (!data.contentBase64) throw new Error("No file contents");
      const raw = Buffer.from(data.contentBase64, "base64");
      if (raw.byteLength > 2_000_000) throw new Error("Files are limited to 2 MB");
      const { extractDocumentText } = await import("./extract");
      text = await extractDocumentText(filename, data.mimeType, new Uint8Array(raw));
    }
    if (text.length < 20) throw new Error("That document does not contain enough text to index");

    const title =
      data.title?.trim() ||
      filename.replace(/\.[^.]+$/, "").replace(/[-_]+/g, " ");
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
      for (const chunk of chunks) {
        await sql`
          insert into document_chunks (id, org_id, kb_id, document_id, chunk_index, content, heading)
          values (
            ${nid("chk")}, ${data.orgId}, ${data.kbId}, ${docId}, ${chunk.index},
            ${chunk.content}, ${chunk.heading}
          )
        `;
      }
      await sql`
        update documents
        set status = ${"ready"}, chunk_count = ${chunks.length}, indexed_at = now(), error = null
        where id = ${docId} and org_id = ${data.orgId}
      `;
      await logActivity(sql, data.orgId, context.userId, "document.indexed", title);
    } catch (err) {
      const message = err instanceof Error ? err.message : "Indexing failed";
      await sql`
        update documents set status = ${"failed"}, error = ${message}
        where id = ${docId} and org_id = ${data.orgId}
      `;
      throw err;
    }

    return { id: docId, status: "ready" as const };
  });

export const deleteDocument = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; documentId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin", "member"]);
    await sql`delete from document_chunks where document_id = ${data.documentId} and org_id = ${data.orgId}`;
    await sql`delete from documents where id = ${data.documentId} and org_id = ${data.orgId}`;
    await logActivity(sql, data.orgId, context.userId, "document.deleted", data.documentId);
    return { ok: true as const };
  });
