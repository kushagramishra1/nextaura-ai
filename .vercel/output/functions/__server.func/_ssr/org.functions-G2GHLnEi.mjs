import { u as isPlanId } from "./access-C7hj-I_h.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/org.functions-G2GHLnEi.js
var listOrganizations = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f890cca7ba64dc925511db0be151755b88fe31616cbf604063b8a9528b2c53e7"));
var createOrganization = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2) throw new Error("Workspace name is too short");
	if (name.length > 80) throw new Error("Workspace name is too long");
	return { name };
}).middleware([authMiddleware]).handler(createSsrRpc("326e17161659a20e45cdbfd1cd1c07e4429c8c96c3a1fe90a35d495e24d12e1a"));
var renameOrganization = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim();
	if (name.length < 2) throw new Error("Name is too short");
	return {
		orgId: input.orgId,
		name
	};
}).middleware([authMiddleware]).handler(createSsrRpc("5b864281a3fa60f22e8698a940f6af01c5393691ad4dd883dc07e93c0d1f186d"));
var changePlan = createServerFn({ method: "POST" }).validator((input) => {
	if (!isPlanId(input.plan)) throw new Error("Unknown plan");
	return input;
}).middleware([authMiddleware]).handler(createSsrRpc("acaa360a3a7791d7a9d7c616a7d0fba12308d1ef00ab68f3740b32fa2e6709ca"));
var listMembers = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(createSsrRpc("557f7b5687446eb0b23e5115f989969ae39d6905b16d958ca3a17d775d2a507b"));
var updateMemberRole = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("4650d82bf491be96497628ac1e695cb4fc6485df9cd90524de9e969103278927"));
var removeMember = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("91a21fab007a4c0e73b33ee5009d58f48204173796bb8660543e541264d3f292"));
var createInvite = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("0fd0d0a052e9466ba8af1b8fdc84757773c710dcb4577fd5cc5b8a96cd61a8c7"));
var listInvites = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(createSsrRpc("fe78a50059d66218e3d9b58a99ec3bfd4bf88e8989241af52433bc6a5c93adc1"));
var acceptInvite = createServerFn({ method: "POST" }).validator((token) => token.trim()).middleware([authMiddleware]).handler(createSsrRpc("d8be1a382d12f68adf8cd6a8f49521d5ba065ed894f7bb3e6cbefada88b3c594"));
//#endregion
export { listInvites as a, removeMember as c, createOrganization as i, renameOrganization as l, changePlan as n, listMembers as o, createInvite as r, listOrganizations as s, acceptInvite as t, updateMemberRole as u };
