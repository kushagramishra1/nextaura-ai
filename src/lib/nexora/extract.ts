function decodeText(bytes: Uint8Array) {
  return new TextDecoder("utf-8", { fatal: false }).decode(bytes);
}

export async function extractDocumentText(
  filename: string,
  mimeType: string,
  bytes: Uint8Array,
): Promise<string> {
  const ext = filename.split(".").pop()?.toLowerCase() ?? "";
  const isText =
    ext === "txt" ||
    ext === "md" ||
    ext === "markdown" ||
    mimeType.startsWith("text/") ||
    mimeType === "application/json";

  if (isText) return decodeText(bytes).trim();

  if (ext === "docx" || mimeType.includes("wordprocessingml")) {
    const mammoth = await import("mammoth");
    const result = await mammoth.extractRawText({ buffer: Buffer.from(bytes) });
    return (result.value ?? "").trim();
  }

  if (ext === "pdf" || mimeType === "application/pdf") {
    const unpdf = await import("unpdf");
    const pdf = await unpdf.getDocumentProxy(bytes);
    const extracted = await unpdf.extractText(pdf, { mergePages: true });
    const text = extracted.text;
    const joined = Array.isArray(text) ? text.join("\n\n") : (text ?? "");
    return joined.trim();
  }

  throw new Error("Unsupported file type. Upload PDF, DOCX, Markdown, or TXT.");
}
