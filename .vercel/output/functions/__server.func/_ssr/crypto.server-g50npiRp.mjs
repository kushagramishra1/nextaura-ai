import { t as __exportAll } from "./rolldown-runtime-D7D4PA-g.mjs";
import { createHash, randomBytes } from "node:crypto";
//#region node_modules/.nitro/vite/services/ssr/assets/crypto.server-g50npiRp.js
var crypto_server_exports = /* @__PURE__ */ __exportAll({
	hashApiKey: () => hashApiKey,
	mintApiKey: () => mintApiKey
});
function hashApiKey(raw) {
	return createHash("sha256").update(raw).digest("hex");
}
function mintApiKey() {
	const raw = `nex_live_${randomBytes(24).toString("hex")}`;
	return {
		raw,
		prefix: `${raw.slice(0, 12)}••••`,
		hash: hashApiKey(raw)
	};
}
//#endregion
export { hashApiKey as n, crypto_server_exports as t };
