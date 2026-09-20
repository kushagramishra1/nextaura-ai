import { createContext, useContext } from "react";
import type { OrgSummary } from "./types";

export const OrgCtx = createContext<{
  current: OrgSummary;
  orgs: OrgSummary[];
  setOrgId: (id: string) => void;
} | null>(null);

export function useOrg() {
  const ctx = useContext(OrgCtx);
  if (!ctx) throw new Error("useOrg must be used in /app");
  return ctx;
}
