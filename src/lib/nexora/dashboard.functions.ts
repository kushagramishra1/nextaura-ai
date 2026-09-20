import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { countUsage, requireMember } from "./access";
import { iso } from "./ids";
import { PLANS } from "./plans";
import type { DashboardStats } from "./types";

export const getDashboard = createServerFn({ method: "GET" })
  .validator((orgId: string) => orgId)
  .middleware([authMiddleware])
  .handler(async ({ context, data: orgId }): Promise<DashboardStats> => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, orgId);
    const plan = PLANS[member.plan];

    const [docs, kbs, members, questions] = await Promise.all([
      sql<{ n: number }>`select count(*)::int as n from documents where org_id = ${orgId}`,
      sql<{ n: number }>`select count(*)::int as n from knowledge_bases where org_id = ${orgId}`,
      sql<{ n: number }>`select count(*)::int as n from organization_members where org_id = ${orgId}`,
      sql<{ n: number }>`
        select count(*)::int as n from messages
        where org_id = ${orgId} and role = 'user'
      `,
    ]);

    const activity = await sql<{
      id: string;
      action: string;
      detail: string;
      created_at: unknown;
    }>`
      select id, action, detail, created_at
      from activity_events
      where org_id = ${orgId}
      order by created_at desc
      limit 8
    `;

    const dailyRows = await sql<{ day: string; count: number }>`
      select to_char(created_at, 'YYYY-MM-DD') as day, count(*)::int as count
      from usage_events
      where org_id = ${orgId} and kind = 'ai_request' and created_at > now() - interval '14 days'
      group by 1
      order by 1
    `;

    const used = await countUsage(sql, orgId, "ai_request");

    return {
      documents: Number(docs[0]?.n ?? 0),
      knowledgeBases: Number(kbs[0]?.n ?? 0),
      questions: Number(questions[0]?.n ?? 0),
      members: Number(members[0]?.n ?? 0),
      requestsUsed: used,
      requestsLimit: plan.requests,
      activity: activity.map((a) => ({
        id: a.id,
        action: a.action,
        detail: a.detail,
        createdAt: iso(a.created_at),
      })),
      daily: dailyRows.map((d) => ({ day: d.day, count: Number(d.count) })),
    };
  });
