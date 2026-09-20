import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSql } from "@/lib/db";
import { logActivity, requireMember, requireRole, ForbiddenError } from "./access";
import { nid, slugify, iso } from "./ids";
import { isPlanId, type PlanId, type Role } from "./plans";
import { PLANS } from "./plans";
import { SEED_KNOWLEDGE } from "./seed-content";
import { chunkText } from "./chunk";
import type { MemberRow, OrgSummary } from "./types";

function asOrg(row: {
  id: string;
  name: string;
  slug: string;
  plan: string;
  role: Role;
  created_at: unknown;
}): OrgSummary {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    plan: isPlanId(row.plan) ? row.plan : "free",
    role: row.role,
    createdAt: iso(row.created_at),
  };
}

async function seedWorkspace(orgId: string, userId: string) {
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
      for (const chunk of chunks) {
        await sql`
          insert into document_chunks (id, org_id, kb_id, document_id, chunk_index, content, heading)
          values (
            ${nid("chk")}, ${orgId}, ${kbId}, ${docId}, ${chunk.index},
            ${chunk.content}, ${chunk.heading}
          )
        `;
      }
    }
  }
  await logActivity(sql, orgId, userId, "workspace.seeded", "Sample knowledge bases indexed");
}

export const listOrganizations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      name: string;
      slug: string;
      plan: string;
      role: Role;
      created_at: unknown;
    }>`
      select o.id, o.name, o.slug, o.plan, m.role, o.created_at
      from organizations o
      join organization_members m on m.org_id = o.id
      where m.user_id = ${context.userId}
      order by o.created_at asc
    `;
    return rows.map(asOrg);
  });

export const createOrganization = createServerFn({ method: "POST" })
  .validator((input: { name: string }) => {
    const name = input.name.trim();
    if (name.length < 2) throw new Error("Workspace name is too short");
    if (name.length > 80) throw new Error("Workspace name is too long");
    return { name };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
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
    return { id: orgId, slug };
  });

export const renameOrganization = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; name: string }) => {
    const name = input.name.trim();
    if (name.length < 2) throw new Error("Name is too short");
    return { orgId: input.orgId, name };
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin"]);
    await sql`update organizations set name = ${data.name} where id = ${data.orgId}`;
    await logActivity(sql, data.orgId, context.userId, "workspace.renamed", data.name);
    return { ok: true as const };
  });

export const changePlan = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; plan: PlanId }) => {
    if (!isPlanId(input.plan)) throw new Error("Unknown plan");
    return input;
  })
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner"]);
    await sql`update organizations set plan = ${data.plan} where id = ${data.orgId}`;
    await logActivity(sql, data.orgId, context.userId, "plan.changed", PLANS[data.plan].name);
    return { ok: true as const };
  });

export const listMembers = createServerFn({ method: "GET" })
  .validator((orgId: string) => orgId)
  .middleware([authMiddleware])
  .handler(async ({ context, data: orgId }) => {
    const sql = await getSql();
    await requireMember(sql, context.userId, orgId);
    const rows = await sql<{
      user_id: string;
      role: Role;
      name: string | null;
      email: string | null;
      image: string | null;
      created_at: unknown;
    }>`
      select m.user_id, m.role, u."name" as name, u.email, u.image, m.created_at
      from organization_members m
      left join "user" u on u.id = m.user_id
      where m.org_id = ${orgId}
      order by
        case m.role when 'owner' then 0 when 'admin' then 1 else 2 end,
        m.created_at asc
    `;
    return rows.map(
      (r): MemberRow => ({
        userId: r.user_id,
        role: r.role,
        name: r.name || "Member",
        email: r.email,
        image: r.image,
        createdAt: iso(r.created_at),
      }),
    );
  });

export const updateMemberRole = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; userId: string; role: Role }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner"]);
    if (data.userId === context.userId) throw new Error("You cannot change your own role");
    const owners = await sql<{ n: number }>`
      select count(*)::int as n from organization_members
      where org_id = ${data.orgId} and role = 'owner'
    `;
    const current = await sql<{ role: Role }>`
      select role from organization_members
      where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
    if (!current[0]) throw new ForbiddenError("Member not found");
    if (current[0].role === "owner" && Number(owners[0]?.n ?? 0) <= 1) {
      throw new Error("A workspace needs at least one owner");
    }
    await sql`
      update organization_members set role = ${data.role}
      where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
    await logActivity(sql, data.orgId, context.userId, "member.role", data.role);
    return { ok: true as const };
  });

export const removeMember = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; userId: string }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin"]);
    if (data.userId === context.userId) throw new Error("Leave the workspace from settings instead");
    const target = await sql<{ role: Role }>`
      select role from organization_members where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
    if (!target[0]) return { ok: true as const };
    if (target[0].role === "owner" && member.role !== "owner") {
      throw new ForbiddenError("Only an owner can remove another owner");
    }
    await sql`
      delete from organization_members where org_id = ${data.orgId} and user_id = ${data.userId}
    `;
    await logActivity(sql, data.orgId, context.userId, "member.removed", data.userId);
    return { ok: true as const };
  });

export const createInvite = createServerFn({ method: "POST" })
  .validator((input: { orgId: string; role: "admin" | "member" }) => input)
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, data.orgId);
    requireRole(member, ["owner", "admin"]);
    const token = nid("inv").replace("inv_", "");
    const inviteId = nid("inv");
    await sql`
      insert into org_invites (id, org_id, token, role, created_by, expires_at)
      values (${inviteId}, ${data.orgId}, ${token}, ${data.role}, ${context.userId}, now() + interval '14 days')
    `;
    await logActivity(sql, data.orgId, context.userId, "invite.created", data.role);
    return { token, role: data.role };
  });

export const listInvites = createServerFn({ method: "GET" })
  .validator((orgId: string) => orgId)
  .middleware([authMiddleware])
  .handler(async ({ context, data: orgId }) => {
    const sql = await getSql();
    const member = await requireMember(sql, context.userId, orgId);
    requireRole(member, ["owner", "admin"]);
    const rows = await sql<{
      id: string;
      token: string;
      role: string;
      created_at: unknown;
      expires_at: unknown;
      accepted_at: unknown;
    }>`
      select id, token, role, created_at, expires_at, accepted_at
      from org_invites
      where org_id = ${orgId}
      order by created_at desc
      limit 20
    `;
    return rows.map((r) => ({
      id: r.id,
      token: r.token,
      role: r.role,
      createdAt: iso(r.created_at),
      expiresAt: iso(r.expires_at),
      acceptedAt: iso(r.accepted_at),
    }));
  });

export const acceptInvite = createServerFn({ method: "POST" })
  .validator((token: string) => token.trim())
  .middleware([authMiddleware])
  .handler(async ({ context, data: token }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      org_id: string;
      role: Role;
      expires_at: unknown;
      accepted_at: unknown;
    }>`
      select id, org_id, role, expires_at, accepted_at
      from org_invites
      where token = ${token}
    `;
    const invite = rows[0];
    if (!invite) throw new Error("Invite not found");
    if (invite.accepted_at) throw new Error("This invite was already used");
    const expires = invite.expires_at ? new Date(String(invite.expires_at)) : null;
    if (expires && expires.getTime() < Date.now()) throw new Error("This invite has expired");

    const existing = await sql<{ user_id: string }>`
      select user_id from organization_members
      where org_id = ${invite.org_id} and user_id = ${context.userId}
    `;
    if (!existing[0]) {
      await sql`
        insert into organization_members (org_id, user_id, role)
        values (${invite.org_id}, ${context.userId}, ${invite.role})
      `;
    }
    await sql`
      update org_invites
      set accepted_by = ${context.userId}, accepted_at = now()
      where id = ${invite.id}
    `;
    await logActivity(sql, invite.org_id, context.userId, "member.joined", "Accepted invite");
    return { orgId: invite.org_id };
  });
