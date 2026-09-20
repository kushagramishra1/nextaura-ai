import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { logActivity, requireMember, requireRole } from "./access";
import { iso, nid } from "./ids";
import type { ApiKeyRow } from "./types";

export const listApiKeys = createServerFn({ method: "GET" })
  .validator((orgId: string) => orgId)
  .middleware([authMiddleware])
  .handler(async ({ context, data: orgId }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, orgId);
    requireRole(member, ["owner", "admin"]);
    const rows = await sql<{
      id: string;
      name: string;
      key_prefix: string;
      created_at: unknown;
      last_used_at: unknown;
      revoked_at: unknown;
    }>`
      select id, name, key_prefix, created_at, last_used_at, revoked_at
      from api_keys
      where org_id = ${orgId}
      order by created_at desc
    `;
    return rows.map(
      (r): ApiKeyRow => ({
        id: r.id,
        name: r.name,
        keyPrefix: r.key_prefix,
        createdAt: iso(r.created_at),
        lastUsedAt: iso(r.last_used_at),
        revokedAt: iso(r.revoked_at),
      }),
    );
  });

export const createApiKey = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; name: string }) => {
    const name = input.name.trim() || "Production";
    return { orgId: input.orgId, name };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const { mintApiKey } = await import("./crypto.server");
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin"]);
    const minted = mintApiKey();
    const id = nid("key");
    await sql`
      insert into api_keys (id, org_id, name, key_prefix, key_hash, created_by)
      values (${id}, ${data.orgId}, ${data.name}, ${minted.prefix}, ${minted.hash}, ${context.userId})
    `;
    await logActivity(sql, data.orgId, context.userId, "apikey.created", data.name);
    return { id, raw: minted.raw, prefix: minted.prefix };
  });

export const revokeApiKey = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; keyId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin"]);
    await sql`
      update api_keys set revoked_at = now()
      where id = ${data.keyId} and org_id = ${data.orgId} and revoked_at is null
    `;
    await logActivity(sql, data.orgId, context.userId, "apikey.revoked", data.keyId);
    return { ok: true as const };
  });
