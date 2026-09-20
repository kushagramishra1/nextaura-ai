import { getSql } from "@/lib/db";
import { hashApiKey } from "./crypto.server";
import { isPlanId, type PlanId } from "./plans";

export type ApiPrincipal = {
  orgId: string;
  plan: PlanId;
  keyId: string;
};

export async function authenticateApiKey(header: string | null): Promise<ApiPrincipal | null> {
  if (!header) return null;
  const raw = header.startsWith("Bearer ") ? header.slice(7).trim() : header.trim();
  if (!raw.startsWith("nex_live_")) return null;
  const hash = hashApiKey(raw);
  const sql = await getSql();
  const rows = await sql<{
    id: string;
    org_id: string;
    plan: string;
    revoked_at: unknown;
  }>`
    select k.id, k.org_id, o.plan, k.revoked_at
    from api_keys k
    join organizations o on o.id = k.org_id
    where k.key_hash = ${hash}
  `;
  const row = rows[0];
  if (!row || row.revoked_at) return null;
  await sql`update api_keys set last_used_at = now() where id = ${row.id}`;
  return {
    orgId: row.org_id,
    keyId: row.id,
    plan: isPlanId(row.plan) ? row.plan : "free",
  };
}

export function corsHeaders() {
  return {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Headers": "Authorization, Content-Type",
    "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
  };
}
