import { o as __toESM } from "../_runtime.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/extract-C4_tIItX.js
function decodeText(bytes) {
	return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}
async function extractDocumentText(filename, mimeType, bytes) {
	const ext = filename.split(".").pop()?.toLowerCase() ?? "";
	if (ext === "txt" || ext === "md" || ext === "markdown" || mimeType.startsWith("text/") || mimeType === "application/json") return decodeText(bytes).trim();
	if (ext === "docx" || mimeType.includes("wordprocessingml")) return ((await (await import("../_libs/mammoth+[...].mjs").then((n) => /* @__PURE__ */ __toESM(n.t()))).extractRawText({ buffer: Buffer.from(bytes) })).value ?? "").trim();
	if (ext === "pdf" || mimeType === "application/pdf") {
		const unpdf = await import("../_libs/unpdf.mjs").then((n) => n.t);
		const pdf = await unpdf.getDocumentProxy(bytes);
		const text = (await unpdf.extractText(pdf, { mergePages: true })).text;
		return (Array.isArray(text) ? text.join("\n\n") : text ?? "").trim();
	}
	throw new Error("Unsupported file type. Upload PDF, DOCX, Markdown, or TXT.");
}
//#endregion
export { extractDocumentText };
