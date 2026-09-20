const STOP = new Set([
  "the", "and", "for", "are", "but", "not", "you", "all", "can", "had", "her",
  "was", "one", "our", "out", "has", "have", "this", "that", "with", "from",
  "they", "what", "when", "your", "how", "who", "why", "does", "did", "its",
  "into", "than", "then", "them", "being", "been", "about", "after", "before",
  "should", "would", "could", "their", "there", "which", "will", "just",
]);

export function tokenize(input: string): string[] {
  return (input.toLowerCase().match(/[a-z0-9]{3,}/g) ?? []).filter((t) => !STOP.has(t));
}

export type RankedChunk = {
  id: string;
  documentId: string;
  kbId: string;
  content: string;
  heading: string | null;
  documentTitle: string;
  filename: string;
  kbName: string;
  score: number;
};

export function rankChunks(
  query: string,
  chunks: Omit<RankedChunk, "score">[],
  k = 8,
): RankedChunk[] {
  const q = tokenize(query);
  if (q.length === 0) return [];
  const qset = new Set(q);
  const phrase = query.toLowerCase().trim().slice(0, 48);

  const scored = chunks.map((chunk) => {
    const tokens = tokenize(`${chunk.documentTitle} ${chunk.heading ?? ""} ${chunk.content}`);
    const tf = new Map<string, number>();
    for (const t of tokens) tf.set(t, (tf.get(t) ?? 0) + 1);

    let score = 0;
    for (const t of q) {
      const f = tf.get(t) ?? 0;
      if (f > 0) score += (f * 2.2) / (f + 1.2);
    }
    const cover = tokens.filter((t) => qset.has(t)).length;
    score += cover * 0.12;
    if (phrase.length > 8 && chunk.content.toLowerCase().includes(phrase)) score += 2.4;
    if (chunk.documentTitle.toLowerCase().split(/\s+/).some((w) => qset.has(w.toLowerCase()))) {
      score += 1.1;
    }
    return { ...chunk, score };
  });

  return scored
    .filter((c) => c.score > 0.4)
    .sort((a, b) => b.score - a.score)
    .slice(0, k);
}
