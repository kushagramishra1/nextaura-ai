import { l as getSql, o as countUsage, p as requireMember, r as PLANS } from "./access-C7hj-I_h.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { iso } from "./ids-BTLa109z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/dashboard.functions-nIul2mcG.js
var getDashboard_createServerFn_handler = createServerRpc({
	id: "773799eebaf24ec0d4e5018eb2616d40ad6c773fcff8e430a17f3edbf3c2ac6e",
	name: "getDashboard",
	filename: "src/lib/nexora/dashboard.functions.ts"
}, (opts) => getDashboard.__executeServer(opts));
var getDashboard = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(getDashboard_createServerFn_handler, async ({ context, data: orgId }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, orgId);
	const plan = PLANS[member.plan];
	const [docs, kbs, members, questions] = await Promise.all([
		sql`select count(*)::int as n from documents where org_id = ${orgId}`,
		sql`select count(*)::int as n from knowledge_bases where org_id = ${orgId}`,
		sql`select count(*)::int as n from organization_members where org_id = ${orgId}`,
		sql`
        select count(*)::int as n from messages
        where org_id = ${orgId} and role = 'user'
      `
	]);
	const activity = await sql`
      select id, action, detail, created_at
      from activity_events
      where org_id = ${orgId}
      order by created_at desc
      limit 8
    `;
	const dailyRows = await sql`
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
			createdAt: iso(a.created_at)
		})),
		daily: dailyRows.map((d) => ({
			day: d.day,
			count: Number(d.count)
		}))
	};
});
//#endregion
export { getDashboard_createServerFn_handler };
