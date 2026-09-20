import { createFileRoute, Link } from "@tanstack/react-router";
import { BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";

export const Route = createFileRoute("/docs/api")({ component: ApiDocs });

function Code({ children }: { children: string }) {
  return (
    <pre className="overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg">
      {children}
    </pre>
  );
}

function ApiDocs() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex max-w-3xl items-center justify-between px-4 py-6">
        <Link to="/">
          <BrandWordmark />
        </Link>
        <Button asChild variant="outline" size="sm">
          <Link to="/app/api-keys">Manage keys</Link>
        </Button>
      </header>
      <article className="mx-auto max-w-3xl space-y-8 px-4 pb-20">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-brand">Public API</p>
          <h1 className="mt-2 font-display text-4xl tracking-tight">Query Nexora from your tools</h1>
          <p className="mt-3 text-muted">
            Authenticate with a workspace API key. Keys are hashed at rest. Every request is
            isolated to the issuing organization.
          </p>
        </div>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Authentication</h2>
          <p className="text-sm text-muted">
            Send the raw key in the Authorization header. Never log it.
          </p>
          <Code>{`Authorization: Bearer nex_live_…`}</Code>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">List knowledge bases</h2>
          <Code>{`GET /api/v1/knowledge-bases`}</Code>
          <Code>{`{
  "knowledge_bases": [
    { "id": "kb_…", "name": "Customer Support", "description": "…" }
  ]
}`}</Code>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Ask a question</h2>
          <Code>{`POST /api/v1/assistant/query
Content-Type: application/json

{
  "knowledge_base_id": "kb_123",
  "question": "What is our refund policy?"
}`}</Code>
          <Code>{`{
  "answer": "Customers can request a refund within 30 days.",
  "sources": [
    {
      "document": "refund-policy.md",
      "knowledge_base": "Customer Support",
      "excerpt": "Enterprise customers may request a refund…"
    }
  ]
}`}</Code>
        </section>

        <section className="space-y-3">
          <h2 className="text-lg font-medium">Errors</h2>
          <ul className="list-disc space-y-1 pl-5 text-sm text-muted">
            <li>401 — missing, invalid, or revoked key</li>
            <li>400 — question too short</li>
            <li>429 — plan request limit</li>
            <li>503 — model unavailable</li>
          </ul>
        </section>
      </article>
    </div>
  );
}
