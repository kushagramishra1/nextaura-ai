//#region node_modules/.nitro/vite/services/ssr/assets/ids-BTLa109z.js
function nid(prefix) {
	const bytes = /* @__PURE__ */ new Uint8Array(10);
	crypto.getRandomValues(bytes);
	return `${prefix}_${Array.from(bytes, (b) => b.toString(16).padStart(2, "0")).join("")}`;
}
function slugify(input) {
	const base = input.toLowerCase().trim().replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "").slice(0, 40);
	const suffix = nid("x").slice(2, 8);
	return `${base || "workspace"}-${suffix}`;
}
function iso(value) {
	if (!value) return null;
	if (value instanceof Date) return value.toISOString();
	if (typeof value === "string") return value;
	return String(value);
}
//#endregion
export { iso, nid, slugify };
