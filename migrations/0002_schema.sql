-- Nexora multi-tenant knowledge platform schema.
-- Isolation is always org_id + membership; never trust a client-supplied user id.

create table if not exists organizations (
  id text primary key,
  name text not null,
  slug text not null unique,
  plan text not null default 'pro',
  created_by text not null,
  created_at timestamptz not null default now()
);

create table if not exists organization_members (
  org_id text not null references organizations(id) on delete cascade,
  user_id text not null,
  role text not null check (role in ('owner', 'admin', 'member')),
  created_at timestamptz not null default now(),
  primary key (org_id, user_id)
);
create index if not exists org_members_user_idx on organization_members (user_id);

create table if not exists org_invites (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  token text not null unique,
  role text not null check (role in ('admin', 'member')),
  created_by text not null,
  created_at timestamptz not null default now(),
  expires_at timestamptz not null,
  accepted_by text,
  accepted_at timestamptz
);
create index if not exists invites_org_idx on org_invites (org_id);

create table if not exists knowledge_bases (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  name text not null,
  description text not null default '',
  created_by text not null,
  created_at timestamptz not null default now()
);
create index if not exists kb_org_idx on knowledge_bases (org_id);

create table if not exists documents (
  id text primary key,
  org_id text not null,
  kb_id text not null references knowledge_bases(id) on delete cascade,
  title text not null,
  filename text not null,
  mime_type text not null default 'text/plain',
  content text not null default '',
  status text not null default 'processing',
  error text,
  size_bytes integer not null default 0,
  chunk_count integer not null default 0,
  created_by text not null,
  created_at timestamptz not null default now(),
  indexed_at timestamptz
);
create index if not exists docs_kb_idx on documents (kb_id);
create index if not exists docs_org_idx on documents (org_id);

create table if not exists document_chunks (
  id text primary key,
  org_id text not null,
  kb_id text not null,
  document_id text not null references documents(id) on delete cascade,
  chunk_index integer not null,
  content text not null,
  heading text
);
create index if not exists chunks_doc_idx on document_chunks (document_id);
create index if not exists chunks_kb_idx on document_chunks (kb_id);
create index if not exists chunks_org_idx on document_chunks (org_id);

create table if not exists conversations (
  id text primary key,
  org_id text not null,
  user_id text not null,
  kb_id text,
  title text not null default 'New conversation',
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now()
);
create index if not exists conv_user_idx on conversations (org_id, user_id);

create table if not exists messages (
  id text primary key,
  conversation_id text not null references conversations(id) on delete cascade,
  org_id text not null,
  role text not null check (role in ('user', 'assistant')),
  content text not null,
  sources_json text not null default '[]',
  created_at timestamptz not null default now()
);
create index if not exists msg_conv_idx on messages (conversation_id);

create table if not exists api_keys (
  id text primary key,
  org_id text not null references organizations(id) on delete cascade,
  name text not null,
  key_prefix text not null,
  key_hash text not null unique,
  created_by text not null,
  last_used_at timestamptz,
  revoked_at timestamptz,
  created_at timestamptz not null default now()
);
create index if not exists keys_org_idx on api_keys (org_id);
create index if not exists keys_hash_idx on api_keys (key_hash);

create table if not exists usage_events (
  id text primary key,
  org_id text not null,
  user_id text,
  kind text not null,
  quantity integer not null default 1,
  created_at timestamptz not null default now()
);
create index if not exists usage_org_time_idx on usage_events (org_id, created_at);

create table if not exists activity_events (
  id text primary key,
  org_id text not null,
  user_id text,
  action text not null,
  detail text not null default '',
  created_at timestamptz not null default now()
);
create index if not exists activity_org_time_idx on activity_events (org_id, created_at);
