import { createHash, randomBytes } from "node:crypto";

export function hashApiKey(raw: string) {
  return createHash("sha256").update(raw).digest("hex");
}

export function mintApiKey() {
  const secret = randomBytes(24).toString("hex");
  const raw = `nex_live_${secret}`;
  const prefix = `${raw.slice(0, 12)}••••`;
  return { raw, prefix, hash: hashApiKey(raw) };
}
