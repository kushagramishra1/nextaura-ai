import { d as logActivity, l as getSql, m as requireRole, p as requireMember } from "./access-C7hj-I_h.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { iso, nid } from "./ids-BTLa109z.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/keys.functions-B3W8Z8FY.js
var listApiKeys_createServerFn_handler = createServerRpc({
	id: "7df59c12ddcb3403b7ac06729403850b52908c0078c81640b5ab0b38402ced2c",
	name: "listApiKeys",
	filename: "src/lib/nexora/keys.functions.ts"
}, (opts) => listApiKeys.__executeServer(opts));
var listApiKeys = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(listApiKeys_createServerFn_handler, async ({ context, data: orgId }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, orgId);
	requireRole(member, ["owner", "admin"]);
	return (await sql`
      select id, name, key_prefix, created_at, last_used_at, revoked_at
      from api_keys
      where org_id = ${orgId}
      order by created_at desc
    `).map((r) => ({
		id: r.id,
		name: r.name,
		keyPrefix: r.key_prefix,
		createdAt: iso(r.created_at),
		lastUsedAt: iso(r.last_used_at),
		revokedAt: iso(r.revoked_at)
	}));
});
var createApiKey_createServerFn_handler = createServerRpc({
	id: "f728608c7d220caa2e896cdbf96a9e511da8f6531766e2b94d3ffe471e772862",
	name: "createApiKey",
	filename: "src/lib/nexora/keys.functions.ts"
}, (opts) => createApiKey.__executeServer(opts));
var createApiKey = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim() || "Production";
	return {
		orgId: input.orgId,
		name
	};
}).middleware([authMiddleware]).handler(createApiKey_createServerFn_handler, async ({ context, data }) => {
	const { mintApiKey } = await import("./crypto.server-g50npiRp.mjs").then((n) => n.t);
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
	return {
		id,
		raw: minted.raw,
		prefix: minted.prefix
	};
});
var revokeApiKey_createServerFn_handler = createServerRpc({
	id: "5be1f732592907cb662c3f3b1f19531a8ad9acbe925040d0429affcb1cfb80a5",
	name: "revokeApiKey",
	filename: "src/lib/nexora/keys.functions.ts"
}, (opts) => revokeApiKey.__executeServer(opts));
var revokeApiKey = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(revokeApiKey_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const member = await requireMember(sql, context.userId, data.orgId);
	requireRole(member, ["owner", "admin"]);
	await sql`
      update api_keys set revoked_at = now()
      where id = ${data.keyId} and org_id = ${data.orgId} and revoked_at is null
    `;
	await logActivity(sql, data.orgId, context.userId, "apikey.revoked", data.keyId);
	return { ok: true };
});
//#endregion
export { createApiKey_createServerFn_handler, listApiKeys_createServerFn_handler, revokeApiKey_createServerFn_handler };
