//#region node_modules/.nitro/vite/services/ssr/assets/org-store-QHioi4SZ.js
var KEY = "nexora.currentOrgId";
function readStoredOrgId() {
	if (typeof window === "undefined") return null;
	try {
		return window.localStorage.getItem(KEY);
	} catch {
		return null;
	}
}
function writeStoredOrgId(id) {
	if (typeof window === "undefined") return;
	try {
		window.localStorage.setItem(KEY, id);
	} catch {}
}
//#endregion
export { writeStoredOrgId as n, readStoredOrgId as t };
