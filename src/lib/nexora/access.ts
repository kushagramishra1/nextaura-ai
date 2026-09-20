import type { Sql } from "@/lib/db";
import type { PlanId, Role } from "./plans";
import { isPlanId } from "./plans";

export class ForbiddenError extends Error {
  readonly status = 403;
  constructor(message = "Forbidden") {
    super(message);
    this.name = "ForbiddenError";
  }
}

export class LimitError extends Error {
  readonly status = 429;
  constructor(message = "Plan limit reached") {
    super(message);
    this.name = "LimitError";
  }
}

export type Membership = {
  orgId: string;
  userId: string;
  role: Role;
  name: string;
  slug: string;
  plan: PlanId;
};

export async function requireMember(
  sql: Sql,
  userId: string,
  orgId: string,
): Promise<Membership> {
  const rows = await sql<{
    org_id: string;
    user_id: string;
    role: Role;
    name: string;
    slug: string;
    plan: string;
  }>`
    select m.org_id, m.user_id, m.role, o.name, o.slug, o.plan
    from organization_members m
    join organizations o on o.id = m.org_id
    where m.org_id = ${orgId} and m.user_id = ${userId}
  `;
  const row = rows[0];
  if (!row) throw new ForbiddenError("You do not belong to this workspace");
  return {
    orgId: row.org_id,
    userId: row.user_id,
    role: row.role,
    name: row.name,
    slug: row.slug,
    plan: isPlanId(row.plan) ? row.plan : "free",
  };
}

export function requireRole(member: Membership, allowed: Role[]) {
  if (!allowed.includes(member.role)) {
    throw new ForbiddenError("You do not have permission for this action");
  }
}

export async function logActivity(
  sql: Sql,
  orgId: string,
  userId: string | null,
  action: string,
  detail: string,
) {
  const { nid } = await import("./ids");
  await sql`
    insert into activity_events (id, org_id, user_id, action, detail)
    values (${nid("act")}, ${orgId}, ${userId}, ${action}, ${detail})
  `;
}

export async function logUsage(
  sql: Sql,
  orgId: string,
  userId: string | null,
  kind: string,
  quantity = 1,
) {
  const { nid } = await import("./ids");
  await sql`
    insert into usage_events (id, org_id, user_id, kind, quantity)
    values (${nid("use")}, ${orgId}, ${userId}, ${kind}, ${quantity})
  `;
}

export async function countUsage(sql: Sql, orgId: string, kind: string) {
  const rows = await sql<{ n: number }>`
    select coalesce(sum(quantity), 0)::int as n
    from usage_events
    where org_id = ${orgId}
      and kind = ${kind}
      and created_at > now() - interval '30 days'
  `;
  return Number(rows[0]?.n ?? 0);
}
