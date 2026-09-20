import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/org-context--gmzFBQI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var OrgCtx = (0, import_react.createContext)(null);
function useOrg() {
	const ctx = (0, import_react.useContext)(OrgCtx);
	if (!ctx) throw new Error("useOrg must be used in /app");
	return ctx;
}
//#endregion
export { useOrg as n, OrgCtx as t };
