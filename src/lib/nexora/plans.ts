export type PlanId = "free" | "pro" | "business";
export type Role = "owner" | "admin" | "member";

export const PLANS: Record<
  PlanId,
  {
    id: PlanId;
    name: string;
    requests: number;
    documents: number;
    knowledgeBases: number;
    members: number;
    price: string;
    blurb: string;
  }
> = {
  free: {
    id: "free",
    name: "Free",
    requests: 100,
    documents: 20,
    knowledgeBases: 3,
    members: 3,
    price: "$0",
    blurb: "For a single team evaluating Nexora.",
  },
  pro: {
    id: "pro",
    name: "Pro",
    requests: 2_000,
    documents: 200,
    knowledgeBases: 25,
    members: 25,
    price: "$49",
    blurb: "For growing operations and engineering teams.",
  },
  business: {
    id: "business",
    name: "Business",
    requests: 20_000,
    documents: 2_000,
    knowledgeBases: 200,
    members: 200,
    price: "$199",
    blurb: "For companies running knowledge as infrastructure.",
  },
};

export function isPlanId(value: string): value is PlanId {
  return value === "free" || value === "pro" || value === "business";
}

export const ROLE_RANK: Record<Role, number> = {
  member: 1,
  admin: 2,
  owner: 3,
};

export function canManageMembers(role: Role) {
  return role === "owner" || role === "admin";
}

export function canManageWorkspace(role: Role) {
  return role === "owner" || role === "admin";
}

export function canMutateKnowledge(role: Role) {
  return role === "owner" || role === "admin" || role === "member";
}
