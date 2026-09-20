import { d as logActivity, l as getSql, m as requireRole, p as requireMember, r as PLANS, t as ForbiddenError, u as isPlanId } from "./access-C7hj-I_h.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { iso, nid, slugify } from "./ids-BTLa109z.mjs";
import { t as chunkText } from "./chunk-CCwsomoW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/org.functions-BpJw8c6k.js
var SEED_KNOWLEDGE = [
	{
		name: "HR Policies",
		description: "Leave, onboarding, and people operations.",
		documents: [{
			title: "Employee Handbook",
			filename: "employee-handbook.md",
			content: `# Employee Handbook

## Annual leave
Full-time employees are entitled to 24 days of paid annual leave per calendar year, accrued monthly. Unused leave may be carried over up to a maximum of 5 days into the following year. Leave requests must be submitted in the HR portal at least 10 business days in advance except in emergencies.

Part-time employees accrue leave pro-rata based on contracted hours.

## Sick leave
Employees receive 10 days of paid sick leave per year. Absences longer than 3 consecutive days require a medical note. Sick leave does not carry over.

## Parental leave
Primary caregivers receive 16 weeks of paid parental leave. Secondary caregivers receive 4 weeks. Leave may begin up to 2 weeks before the expected date of birth or adoption.

## Working hours
Standard hours are 09:00–17:30 in the employee's local timezone, Monday to Friday. Core collaboration hours are 10:00–16:00. Remote employees must be reachable on Slack during core hours.

## Code of conduct
Harassment, discrimination, and retaliation are prohibited. Report concerns to People Ops or ethics@company.example. Retaliation against reporters is a fireable offense.
`
		}, {
			title: "Onboarding SOP",
			filename: "onboarding-sop.md",
			content: `# Onboarding SOP

This procedure applies to every new employee, contractor converted to FTE, and intern longer than 8 weeks.

## Before day one (T-5 to T-1)
People Ops creates the identity in Okta, assigns a laptop, and adds the hire to the all-hands and team mailing lists. The hiring manager nominates an onboarding buddy.

IT images the laptop with the standard engineering or business image and ships it to arrive the day before start, or stages it at the office.

## Day one
1. Welcome session with People Ops (30 minutes) covering handbook, payroll, and benefits enrollment.
2. Account activation: Okta, email, Slack, 1Password, and GitHub or equivalent.
3. Security briefing: MFA is mandatory. Phishing reports go to security@company.example.
4. Workspace tour or remote setup call with the buddy.
5. Manager 1:1 to agree on the 30/60/90 plan.

## After a new employee joins (days 2–14)
- Day 2: Product overview and access to the relevant Nexora knowledge bases.
- Day 3: Shadow a teammate on a live ticket or standup.
- Day 5: First small task merged or delivered.
- Day 10: Benefits enrollment deadline.
- Day 14: Checkpoint with manager and People Ops. Confirm equipment, access, and any blockers.

## 30 / 60 / 90
At 30 days the manager confirms role clarity. At 60 days the employee should independently own a workstream. At 90 days People Ops runs a stay interview and the manager files a probation review.

## Offboarding note
Do not use this SOP for offboarding. See the People Offboarding runbook.
`
		}]
	},
	{
		name: "Engineering Handbook",
		description: "Incidents, deployments, and production operations.",
		documents: [{
			title: "Incident Response SOP",
			filename: "incident-response.md",
			content: `# Incident Response SOP

## Severity
- SEV-1: customer-facing outage or data loss. Page the on-call immediately.
- SEV-2: major degradation, workaround exists. Respond within 15 minutes.
- SEV-3: limited impact. Handle in business hours.

## When a production deployment fails
An engineer should follow this sequence without waiting for a meeting:

1. Stop the pipeline. Do not retry a failed production deploy until the cause is known.
2. Roll back to the last known-good release using the deploy CLI: \`ship rollback production --to previous\`.
3. Confirm health checks on the status dashboard (error rate, p95 latency, queue depth).
4. If rollback does not restore service, page the incident commander via PagerDuty and open a #inc-YYYYMMDD Slack channel.
5. Capture the failing commit SHA, CI job URL, and error logs in the incident doc.
6. Communicate status in #eng-incidents every 15 minutes until mitigated.

Do not hot-patch production unless the incident commander approves. Feature flags may be used to disable the failing path.

## Incident commander
The primary on-call is incident commander until they hand off. The commander owns comms, rollback/forward decisions, and the post-incident review.

## Post-incident
A written PIR is due within 3 business days for SEV-1 and SEV-2. Action items get owners and dates. Blameless language is required.
`
		}, {
			title: "Deployment Runbook",
			filename: "deployment-runbook.md",
			content: `# Deployment Runbook

## Environments
- Preview: ephemeral per pull request.
- Staging: production-shaped, anonymized data.
- Production: EU-west and US-east, blue/green.

## Change window
Production deploys are allowed 10:00–16:00 local for the region, Monday–Thursday. Fridays require staff-engineer approval. No deploys during an open SEV-1.

## Standard deploy
1. CI must be green, including migration checks.
2. Staging bake for at least 20 minutes.
3. \`ship deploy production --sha $GIT_SHA\`.
4. Watch error budget for 15 minutes.
5. Announce in #eng-deploys.

## Database migrations
Expand/contract only. Never rename a column in the same deploy that changes application code to the new name. Backfills run from the worker, not the web process.

## Feature flags
All risky changes ship behind a flag defaulted off. Flags older than 30 days after full rollout must be removed.
`
		}]
	},
	{
		name: "Customer Support",
		description: "Refunds, enterprise accounts, and support SLAs.",
		documents: [{
			title: "Refund Policy",
			filename: "refund-policy.md",
			content: `# Refund Policy

## Self-serve (Free and Pro)
Customers on monthly Pro may request a refund within 14 days of the latest charge if usage is under 10% of the plan's request allotment. Annual Pro may be refunded pro-rata within 30 days of the initial annual charge only.

## Enterprise customers
Enterprise (Business plan and custom contracts) may request a refund within 30 days of the invoice date when:

- The service was unavailable below the contracted 99.9% monthly uptime, or
- The workspace was provisioned incorrectly (wrong region, wrong SSO) and could not be used, or
- The contract includes a written money-back clause.

Refund process for enterprise customers:

1. The account owner files a request in the billing portal or emails billing@company.example with the invoice number.
2. Support verifies the contract, invoice, and uptime credits already issued.
3. Finance approves refunds under $25,000. Larger refunds need the VP of Customer Success.
4. Refunds are issued to the original payment method within 10 business days.
5. Uptime credits are applied before cash refunds; we do not double-compensate the same incident.

Partial refunds are allowed when only a region or seat block was unusable. We do not refund professional services already delivered.

## Chargebacks
Open a ticket with Finance immediately. Do not argue the chargeback in the payment processor without Legal.
`
		}, {
			title: "Support Playbook",
			filename: "support-playbook.md",
			content: `# Support Playbook

## SLAs
- Enterprise: first response in 1 hour, 24/7 for SEV-1.
- Pro: first response in 4 business hours.
- Free: best effort, 1 business day.

## Escalation
If a customer reports a production outage, create a SEV using the Engineering incident SOP and stay in the incident channel as customer liaison. Do not promise ETAs that engineering has not confirmed.

## Tone
Be precise. Cite the relevant policy document when answering refunds, security, or data retention questions. If Nexora's knowledge base conflicts with a contract, the signed contract wins — flag it to Legal.
`
		}]
	}
];
function asOrg(row) {
	return {
		id: row.id,
		name: row.name,
		slug: row.slug,
		plan: isPlanId(row.plan) ? row.plan : "free",
		role: row.role,
		createdAt: iso(row.created_at)
	};
}
async function seedWorkspace(orgId, userId) {
	const sql = await getSql();
	for (const kb of SEED_KNOWLEDGE) {
		const kbId = nid("kb");
		await sql`
      insert into knowledge_bases (id, org_id, name, description, created_by)
      values (${kbId}, ${orgId}, ${kb.name}, ${kb.description}, ${userId})
    `;
		for (const doc of kb.documents) {
			const docId = nid("doc");
			const chunks = chunkText(doc.content);
			await sql`
        insert into documents (
          id, org_id, kb_id, title, filename, mime_type, content, status,
          size_bytes, chunk_count, created_by, indexed_at
        )
        values (
          ${docId}, ${orgId}, ${kbId}, ${doc.title}, ${doc.filename},
          ${"text/markdown"}, ${doc.content}, ${"ready"},
          ${doc.content.length}, ${chunks.length}, ${userId}, now()
        )
      `;
			for (const chunk of chunks) await sql`
          insert into document_chunks (id, org_id, kb_id, document_id, chunk_index, content, heading)
          values (
            ${nid("chk")}, ${orgId}, ${kbId}, ${docId}, ${chunk.index},
            ${chunk.content}, ${chunk.heading}
          )
        `;
		}
	}
	await logActivity(sql, orgId, userId, "workspace.seeded", "Sample knowledge bases indexed");
}
var listOrganizations_createServerFn_handler = createServerRpc({
	id: "f890cca7ba64dc925511db0be151755b88fe31616cbf604063b8a9528b2c53e7",
	name: "listOrganizations",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => listOrganizations.__executeServer(opts));
var listOrganizations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(listOrganizations_createServerFn_handler, async ({ context }) => {
	return (await (await getSql())`
      select o.id, o.name, o.slug, o.plan, m.role, o.created_at
      from organizations o
      join organization_members m on m.org_id = o.id
      where m.user_id = ${context.userId}
      order by o.created_at asc
    `).map(asOrg);
});
var createOrganization_createServerFn_handler = createServerRpc({
	id: "326e17161659a20e45cdbfd1cd1c07e4429c8c96c3a1fe90a35d495e24d12e1a",
	name: "createOrganization",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => createOrganization.__executeServer(opts));
var createOrganization = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2) throw new Error("Workspace name is too short");
	if (name.length > 80) throw new Error("Workspace name is too long");
	return { name };
}).middleware([authMiddleware]).handler(createOrganization_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const orgId = nid("org");
	const slug = slugify(data.name);
	await sql`
      insert into organizations (id, name, slug, plan, created_by)
      values (${orgId}, ${data.name}, ${slug}, ${"pro"}, ${context.userId})
    `;
	await sql`
      insert into organization_members (org_id, user_id, role)
      values (${orgId}, ${context.userId}, ${"owner"})
    `;
	await logActivity(sql, orgId, context.userId, "workspace.created", data.name);
	await seedWorkspace(orgId, context.userId);
	return {
		id: orgId,
		slug
	};
});
var renameOrganization_createServerFn_handler = createServerRpc({
	id: "5b864281a3fa60f22e8698a940f6af01c5393691ad4dd883dc07e93c0d1f186d",
	name: "renameOrganization",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => renameOrganization.__executeServer(opts));
var renameOrganization = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2) throw new Error("Name is too short");
	return {
		orgId: input.orgId,
		name
	};
}).middleware([authMiddleware]).handler(renameOrganization_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner", "admin"]);
	await sql`update organizations set name = ${data.name} where id = ${data.orgId}`;
	await logActivity(sql, data.orgId, context.userId, "workspace.renamed", data.name);
	return { ok: true };
});
var changePlan_createServerFn_handler = createServerRpc({
	id: "acaa360a3a7791d7a9d7c616a7d0fba12308d1ef00ab68f3740b32fa2e6709ca",
	name: "changePlan",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => changePlan.__executeServer(opts));
var changePlan = createServerFn({ method: "POST" }).validator((input) => {
	if (!isPlanId(input.plan)) throw new Error("Unknown plan");
	return input;
}).middleware([authMiddleware]).handler(changePlan_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner"]);
	await sql`update organizations set plan = ${data.plan} where id = ${data.orgId}`;
	await logActivity(sql, data.orgId, context.userId, "plan.changed", PLANS[data.plan].name);
	return { ok: true };
});
var listMembers_createServerFn_handler = createServerRpc({
	id: "557f7b5687446eb0b23e5115f989969ae39d6905b16d958ca3a17d775d2a507b",
	name: "listMembers",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => listMembers.__executeServer(opts));
var listMembers = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(listMembers_createServerFn_handler, async ({ context, data: orgId }) => {
	const sql = await getSql();
	await requireMember(sql, context.userId, orgId);
	return (await sql`
      select m.user_id, m.role, u."name" as name, u.email, u.image, m.created_at
      from organization_members m
      left join "user" u on u.id = m.user_id
      where m.org_id = ${orgId}
      order by
        case m.role when 'owner' then 0 when 'admin' then 1 else 2 end,
        m.created_at asc
    `).map((r) => ({
		userId: r.user_id,
		role: r.role,
		name: r.name || "Member",
		email: r.email,
		image: r.image,
		createdAt: iso(r.created_at)
	}));
});
var updateMemberRole_createServerFn_handler = createServerRpc({
	id: "4650d82bf491be96497628ac1e695cb4fc6485df9cd90524de9e969103278927",
	name: "updateMemberRole",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => updateMemberRole.__executeServer(opts));
var updateMemberRole = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(updateMemberRole_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner"]);
	if (data.userId === context.userId) throw new Error("You cannot change your own role");
	const owners = await sql`
      select count(*)::int as n from organization_members
      where org_id = ${data.orgId} and role = 'owner'
    `;
	const current = await sql`
      select role from organization_members
      where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
	if (!current[0]) throw new ForbiddenError("Member not found");
	if (current[0].role === "owner" && Number(owners[0]?.n ?? 0) <= 1) throw new Error("A workspace needs at least one owner");
	await sql`
      update organization_members set role = ${data.role}
      where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
	await logActivity(sql, data.orgId, context.userId, "member.role", data.role);
	return { ok: true };
});
var removeMember_createServerFn_handler = createServerRpc({
	id: "91a21fab007a4c0e73b33ee5009d58f48204173796bb8660543e541264d3f292",
	name: "removeMember",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => removeMember.__executeServer(opts));
var removeMember = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(removeMember_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner", "admin"]);
	if (data.userId === context.userId) throw new Error("Leave the workspace from settings instead");
	const target = await sql`
      select role from organization_members where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
	if (!target[0]) return { ok: true };
	if (target[0].role === "owner" && member.role !== "owner") throw new ForbiddenError("Only an owner can remove another owner");
	await sql`
      delete from organization_members where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
	await logActivity(sql, data.orgId, context.userId, "member.removed", data.userId);
	return { ok: true };
});
var createInvite_createServerFn_handler = createServerRpc({
	id: "0fd0d0a052e9466ba8af1b8fdc84757773c710dcb4577fd5cc5b8a96cd61a8c7",
	name: "createInvite",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => createInvite.__executeServer(opts));
var createInvite = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createInvite_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner", "admin"]);
	const token = nid("inv").replace("inv_", "");
	await sql`
      insert into org_invites (id, org_id, token, role, created_by, expires_at)
      values (${nid("inv")}, ${data.orgId}, ${token}, ${data.role}, ${context.userId}, now() + interval '14 days')
    `;
	await logActivity(sql, data.orgId, context.userId, "invite.created", data.role);
	return {
		token,
		role: data.role
	};
});
var listInvites_createServerFn_handler = createServerRpc({
	id: "fe78a50059d66218e3d9b58a99ec3bfd4bf88e8989241af52433bc6a5c93adc1",
	name: "listInvites",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => listInvites.__executeServer(opts));
var listInvites = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(listInvites_createServerFn_handler, async ({ context, data: orgId }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, orgId);
	requireRole(member, ["owner", "admin"]);
	return (await sql`
      select id, token, role, created_at, expires_at, accepted_at
      from org_invites
      where org_id = ${orgId}
      order by created_at desc
      limit 20
    `).map((r) => ({
		id: r.id,
		token: r.token,
		role: r.role,
		createdAt: iso(r.created_at),
		expiresAt: iso(r.expires_at),
		acceptedAt: iso(r.accepted_at)
	}));
});
var acceptInvite_createServerFn_handler = createServerRpc({
	id: "d8be1a382d12f68adf8cd6a8f49521d5ba065ed894f7bb3e6cbefada88b3c594",
	name: "acceptInvite",
	filename: "src/lib/nexora/org.functions.ts"
}, (opts) => acceptInvite.__executeServer(opts));
var acceptInvite = createServerFn({ method: "POST" }).validator((token) => token.trim()).middleware([authMiddleware]).handler(acceptInvite_createServerFn_handler, async ({ context, data: token }) => {
	const sql = await getSql();
	const invite = (await sql`
      select id, org_id, role, expires_at, accepted_at
      from org_invites
      where token = ${token}
    `)[0];
	if (!invite) throw new Error("Invite not found");
	if (invite.accepted_at) throw new Error("This invite was already used");
	const expires = invite.expires_at ? new Date(String(invite.expires_at)) : null;
	if (expires && expires.getTime() < Date.now()) throw new Error("This invite has expired");
	if (!(await sql`
      select user_id from organization_members
      where org_id = ${invite.org_id} and user_id = ${context.userId}
    `)[0]) await sql`
        insert into organization_members (org_id, user_id, role)
        values (${invite.org_id}, ${context.userId}, ${invite.role})
      `;
	await sql`
      update org_invites
      set accepted_by = ${context.userId}, accepted_at = now()
      where id = ${invite.id}
    `;
	await logActivity(sql, invite.org_id, context.userId, "member.joined", "Accepted invite");
	return { orgId: invite.org_id };
});
//#endregion
export { acceptInvite_createServerFn_handler, changePlan_createServerFn_handler, createInvite_createServerFn_handler, createOrganization_createServerFn_handler, listInvites_createServerFn_handler, listMembers_createServerFn_handler, listOrganizations_createServerFn_handler, removeMember_createServerFn_handler, renameOrganization_createServerFn_handler, updateMemberRole_createServerFn_handler };
