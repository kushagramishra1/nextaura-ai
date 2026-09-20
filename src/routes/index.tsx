import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  FileText,
  Lock,
  MessageSquare,
  Search,
  Shield,
  Workflow,
} from "lucide-react";
import { BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { SignedIn, SignedOut } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";

export const Route = createFileRoute("/")({ component: Landing });

function AuthCta() {
  const { isPending } = useCurrentUserState();
  if (isPending) {
    return <div className="h-10 w-36 animate-pulse rounded-md bg-elevated" />;
  }
  return (
    <>
      <SignedIn>
        <Button asChild>
          <Link to="/app">
            Open workspace <ArrowRight className="size-4" />
          </Link>
        </Button>
      </SignedIn>
      <SignedOut>
        <Button asChild>
          <Link to="/register">
            Start a workspace <ArrowRight className="size-4" />
          </Link>
        </Button>
        <Button asChild variant="outline">
          <Link to="/login">Sign in</Link>
        </Button>
      </SignedOut>
    </>
  );
}

function Landing() {
  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 lg:px-6">
        <BrandWordmark />
        <nav className="hidden items-center gap-6 text-sm text-muted md:flex">
          <a href="#product" className="hover:text-fg">
            Product
          </a>
          <Link to="/docs/api" className="hover:text-fg">
            API
          </Link>
          <a href="#security" className="hover:text-fg">
            Security
          </a>
        </nav>
        <div className="flex items-center gap-2">
          <AuthSlot />
        </div>
      </header>

      <section className="mx-auto w-full max-w-6xl px-4 pb-16 pt-10 lg:px-6 lg:pb-24 lg:pt-16">
        <p className="text-xs font-medium uppercase tracking-[0.22em] text-brand">
          Knowledge operations
        </p>
        <h1 className="mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-6xl">
          Company knowledge, finally answerable.
        </h1>
        <p className="mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg">
          Nexora indexes handbooks, SOPs, and policies, then answers operational
          questions with citations back to the source page — not a generic chatbot.
        </p>
        <div className="mt-8 flex flex-wrap items-center gap-3">
          <AuthCta />
        </div>

        <div
          id="product"
          className="mt-14 overflow-hidden rounded-xl border border-border bg-surface"
        >
          <div className="grid lg:grid-cols-[220px_1fr]">
            <div className="hidden border-r border-border p-4 lg:block">
              <p className="px-2 text-[11px] uppercase tracking-wide text-subtle">
                Conversations
              </p>
              <div className="mt-3 space-y-1">
                {["Enterprise refunds", "Deployment failure", "Leave policy"].map(
                  (item, i) => (
                    <div
                      key={item}
                      className={`rounded-md px-3 py-2 text-sm ${i === 0 ? "bg-elevated text-fg" : "text-muted"}`}
                    >
                      {item}
                    </div>
                  ),
                )}
              </div>
            </div>
            <div className="p-5 sm:p-8">
              <p className="text-xs uppercase tracking-wide text-subtle">Ask Nexora</p>
              <p className="mt-3 rounded-lg bg-elevated px-4 py-3 text-sm text-fg">
                What is our refund process for enterprise customers?
              </p>
              <div className="mt-5 space-y-3 text-[15px] leading-relaxed text-fg">
                <p>
                  Enterprise customers may request a refund within 30 days of the
                  invoice date when uptime falls below 99.9%, provisioning was
                  wrong, or the contract includes a money-back clause.
                </p>
                <p>
                  The owner files the request, Support verifies the invoice, Finance
                  approves amounts under $25,000, and the refund is issued to the
                  original payment method within 10 business days.
                </p>
              </div>
              <div className="mt-6 flex flex-wrap gap-2">
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted">
                  refund-policy.md
                </span>
                <span className="rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted">
                  Customer Support
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="border-y border-border bg-surface">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 lg:px-6">
          {[
            { k: "Indexed", v: "Handbooks, SOPs, runbooks" },
            { k: "Retrieved", v: "Scoped to the workspace" },
            { k: "Answered", v: "With source citations" },
          ].map((item) => (
            <div key={item.k}>
              <p className="text-xs uppercase tracking-[0.18em] text-subtle">{item.k}</p>
              <p className="mt-2 font-display text-2xl tracking-tight">{item.v}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="mx-auto grid w-full max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-6">
        {[
          {
            icon: BookOpen,
            title: "Knowledge bases",
            body: "Keep HR, engineering, and support in separate collections with their own documents.",
          },
          {
            icon: FileText,
            title: "Ingestion pipeline",
            body: "Upload PDF, DOCX, Markdown, or text. Nexora extracts, chunks, and indexes immediately.",
          },
          {
            icon: Search,
            title: "Retrieval, not vibes",
            body: "Questions hit ranked passages from your corpus before the model writes a word.",
          },
          {
            icon: MessageSquare,
            title: "Cited answers",
            body: "Every assistant reply carries the documents it used. Operators can open the source.",
          },
          {
            icon: Workflow,
            title: "Public API",
            body: "Query knowledge from internal tools with hashed API keys and the same isolation rules.",
          },
          {
            icon: Shield,
            title: "Multi-tenant by default",
            body: "Organizations, roles, and every query scoped to membership. Workspace A cannot read B.",
          },
        ].map((f) => (
          <div key={f.title} className="rounded-xl border border-border bg-surface p-5">
            <f.icon className="size-5 text-brand" />
            <h2 className="mt-4 text-base font-medium">{f.title}</h2>
            <p className="mt-2 text-sm leading-relaxed text-muted">{f.body}</p>
          </div>
        ))}
      </section>

      <section id="security" className="mx-auto w-full max-w-6xl px-4 pb-20 lg:px-6">
        <div className="rounded-xl border border-border bg-surface p-6 sm:p-10">
          <div className="flex items-start gap-3">
            <Lock className="mt-1 size-5 text-brand" />
            <div>
              <h2 className="font-display text-3xl tracking-tight">Built as a SaaS, not a demo chat.</h2>
              <p className="mt-3 max-w-2xl text-muted">
                JWT sessions, hashed API keys, role-based access, plan limits, and
                organization isolation are first-class. Raw keys are never stored.
                Retrieval never crosses a workspace boundary.
              </p>
              <div className="mt-6">
                <Button asChild variant="outline">
                  <Link to="/docs/api">Read the API</Link>
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      <footer className="border-t border-border">
        <div className="mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-6">
          <BrandWordmark className="text-muted" />
          <p>AI knowledge and operations platform.</p>
        </div>
      </footer>
    </div>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  if (isPending) return <div className="h-8 w-20 animate-pulse rounded-md bg-elevated" />;
  if (user) {
    return (
      <Button asChild size="sm">
        <Link to="/app">Open</Link>
      </Button>
    );
  }
  return (
    <Button asChild size="sm" variant="outline">
      <Link to="/login">Sign in</Link>
    </Button>
  );
}
