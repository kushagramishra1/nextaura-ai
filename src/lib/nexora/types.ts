import type { PlanId, Role } from "./plans";

export type OrgSummary = {
  id: string;
  name: string;
  slug: string;
  plan: PlanId;
  role: Role;
  createdAt: string | null;
};

export type KnowledgeBase = {
  id: string;
  orgId: string;
  name: string;
  description: string;
  createdAt: string | null;
  documentCount: number;
  readyCount: number;
};

export type DocumentStatus =
  | "uploading"
  | "processing"
  | "indexing"
  | "ready"
  | "failed";

export type DocumentRow = {
  id: string;
  orgId: string;
  kbId: string;
  title: string;
  filename: string;
  mimeType: string;
  status: DocumentStatus;
  error: string | null;
  sizeBytes: number;
  chunkCount: number;
  createdAt: string | null;
  indexedAt: string | null;
};

export type Citation = {
  documentId: string;
  document: string;
  kbId: string;
  kbName: string;
  excerpt: string;
  chunkIndex: number;
};

export type ChatMessage = {
  id: string;
  role: "user" | "assistant";
  content: string;
  sources: Citation[];
  createdAt: string | null;
};

export type Conversation = {
  id: string;
  title: string;
  kbId: string | null;
  createdAt: string | null;
  updatedAt: string | null;
};

export type MemberRow = {
  userId: string;
  role: Role;
  name: string;
  email: string | null;
  image: string | null;
  createdAt: string | null;
};

export type ApiKeyRow = {
  id: string;
  name: string;
  keyPrefix: string;
  createdAt: string | null;
  lastUsedAt: string | null;
  revokedAt: string | null;
};

export type DashboardStats = {
  documents: number;
  knowledgeBases: number;
  questions: number;
  members: number;
  requestsUsed: number;
  requestsLimit: number;
  activity: { id: string; action: string; detail: string; createdAt: string | null }[];
  daily: { day: string; count: number }[];
};
