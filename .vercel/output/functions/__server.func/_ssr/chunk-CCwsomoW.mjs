//#region node_modules/.nitro/vite/services/ssr/assets/chunk-CCwsomoW.js
function chunkText(text, size = 900, overlap = 140) {
	const cleaned = text.replace(/\r\n/g, "\n").replace(/\n{3,}/g, "\n\n").trim();
	if (!cleaned) return [];
	const chunks = [];
	let i = 0;
	let index = 0;
	let heading = null;
	while (i < cleaned.length) {
		let end = Math.min(i + size, cleaned.length);
		if (end < cleaned.length) {
			const slice = cleaned.slice(i, end);
			const lastPara = slice.lastIndexOf("\n\n");
			const lastSent = slice.lastIndexOf(". ");
			const breakAt = lastPara > size * .45 ? lastPara : lastSent > size * .45 ? lastSent + 1 : slice.length;
			end = i + breakAt;
		}
		const content = cleaned.slice(i, Math.max(end, i + 1)).trim();
		const headingMatch = content.match(/^#{1,3}\s+(.+)$/m);
		if (headingMatch?.[1]) heading = headingMatch[1].trim();
		if (content) chunks.push({
			index: index++,
			content,
			heading
		});
		if (end >= cleaned.length) break;
		i = Math.max(end - overlap, i + 1);
	}
	return chunks;
}
//#endregion
export { chunkText as t };
