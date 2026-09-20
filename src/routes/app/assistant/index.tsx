import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Copy, Send, Trash2 } from "lucide-react";
import { useEffect, useMemo, useRef, useState } from "react";
import { toast } from "sonner";
import { MarkdownView } from "@/components/markdown-view";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  askAssistant,
  createConversation,
  deleteConversation,
  getConversation,
  listConversations,
} from "@/lib/nexora/assistant.functions";
import { listKnowledgeBases } from "@/lib/nexora/knowledge.functions";
import type { ChatMessage } from "@/lib/nexora/types";
import { cn } from "@/lib/utils";
import { useOrg } from "@/lib/nexora/org-context";

type Search = { q?: string; c?: string };

export const Route = createFileRoute("/app/assistant/")({
  validateSearch: (s: Record<string, unknown>): Search => ({
    q: typeof s.q === "string" ? s.q : undefined,
    c: typeof s.c === "string" ? s.c : undefined,
  }),
  component: AssistantPage,
});

function AssistantPage() {
  const { current } = useOrg();
  const search = Route.useSearch();
  const qc = useQueryClient();
  const [draft, setDraft] = useState("");
  const [kbId, setKbId] = useState<string>("all");
  const [conversationId, setConversationId] = useState<string | null>(search.c ?? null);
  const [optimistic, setOptimistic] = useState<ChatMessage[]>([]);
  const scroller = useRef<HTMLDivElement>(null);
  const askedRef = useRef(false);

  const kbs = useQuery({
    queryKey: ["kbs", current.id],
    queryFn: () => listKnowledgeBases({ data: current.id }),
  });
  const convos = useQuery({
    queryKey: ["convos", current.id],
    queryFn: () => listConversations({ data: current.id }),
  });
  const thread = useQuery({
    queryKey: ["thread", current.id, conversationId],
    queryFn: () =>
      getConversation({ data: { orgId: current.id, conversationId: conversationId! } }),
    enabled: Boolean(conversationId),
  });

  const messages = useMemo(() => {
    const base = thread.data?.messages ?? [];
    const extras = optimistic.filter((m) => !base.some((b) => b.id === m.id));
    return [...base, ...extras];
  }, [thread.data, optimistic]);

  useEffect(() => {
    scroller.current?.scrollTo({ top: scroller.current.scrollHeight, behavior: "smooth" });
  }, [messages.length]);

  const ensureConversation = async () => {
    if (conversationId) return conversationId;
    const created = await createConversation({
      data: { orgId: current.id, kbId: kbId === "all" ? null : kbId },
    });
    setConversationId(created.id);
    await qc.invalidateQueries({ queryKey: ["convos", current.id] });
    return created.id;
  };

  const ask = useMutation({
    mutationFn: async (question: string) => {
      const id = await ensureConversation();
      return askAssistant({
        data: {
          orgId: current.id,
          conversationId: id,
          question,
          kbId: kbId === "all" ? null : kbId,
        },
      });
    },
    onSuccess: async (result) => {
      setOptimistic([result.userMessage, result.assistantMessage]);
      await qc.invalidateQueries({ queryKey: ["thread", current.id, conversationId] });
      await qc.invalidateQueries({ queryKey: ["convos", current.id] });
      await qc.invalidateQueries({ queryKey: ["dashboard", current.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  async function submit(question: string) {
    const q = question.trim();
    if (!q || ask.isPending) return;
    setDraft("");
    setOptimistic((prev) => [
      ...prev,
      {
        id: `tmp_${Date.now()}`,
        role: "user",
        content: q,
        sources: [],
        createdAt: new Date().toISOString(),
      },
    ]);
    await ask.mutateAsync(q);
  }

  useEffect(() => {
    if (search.q && !askedRef.current) {
      askedRef.current = true;
      void submit(search.q);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search.q]);

  return (
    <div className="mx-auto flex h-[calc(100dvh-7rem)] max-w-6xl gap-4">
      <aside className="hidden w-64 shrink-0 flex-col rounded-xl border border-border bg-card p-3 md:flex">
        <div className="flex items-center justify-between px-1">
          <p className="text-xs uppercase tracking-wide text-subtle">Conversations</p>
          <Button
            size="sm"
            variant="ghost"
            onClick={async () => {
              const created = await createConversation({
                data: { orgId: current.id, kbId: kbId === "all" ? null : kbId },
              });
              setConversationId(created.id);
              setOptimistic([]);
              await qc.invalidateQueries({ queryKey: ["convos", current.id] });
            }}
          >
            New
          </Button>
        </div>
        <ScrollArea className="mt-2 flex-1">
          <div className="space-y-0.5">
            {(convos.data ?? []).map((c) => (
              <div key={c.id} className="group flex items-center gap-1">
                <button
                  type="button"
                  onClick={() => {
                    setConversationId(c.id);
                    setOptimistic([]);
                  }}
                  className={cn(
                    "min-w-0 flex-1 truncate rounded-md px-2 py-2 text-left text-sm",
                    c.id === conversationId ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60",
                  )}
                >
                  {c.title}
                </button>
                <button
                  type="button"
                  className="hidden text-subtle hover:text-danger group-hover:block"
                  onClick={() =>
                    deleteConversation({ data: { orgId: current.id, conversationId: c.id } }).then(
                      () => {
                        if (conversationId === c.id) {
                          setConversationId(null);
                          setOptimistic([]);
                        }
                        void qc.invalidateQueries({ queryKey: ["convos", current.id] });
                      },
                    )
                  }
                >
                  <Trash2 className="size-3.5" />
                </button>
              </div>
            ))}
          </div>
        </ScrollArea>
      </aside>

      <section className="flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-card">
        <header className="flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3">
          <div>
            <p className="text-xs uppercase tracking-[0.18em] text-subtle">Assistant</p>
            <h1 className="font-display text-xl tracking-tight">Ask Nexora</h1>
          </div>
          <Select value={kbId} onValueChange={setKbId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="All knowledge" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All knowledge bases</SelectItem>
              {(kbs.data ?? []).map((kb) => (
                <SelectItem key={kb.id} value={kb.id}>
                  {kb.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </header>

        <div ref={scroller} className="flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-8">
          {messages.length === 0 ? (
            <EmptyState onPick={(q) => void submit(q)} />
          ) : (
            messages.map((m) => <Bubble key={m.id} message={m} />)
          )}
          {ask.isPending ? (
            <p className="text-sm text-muted">Retrieving sources and writing an answer…</p>
          ) : null}
        </div>

        <form
          className="border-t border-border p-3 sm:p-4"
          onSubmit={(e) => {
            e.preventDefault();
            void submit(draft);
          }}
        >
          <div className="flex items-end gap-2 rounded-lg border border-border bg-surface p-2">
            <textarea
              value={draft}
              onChange={(e) => setDraft(e.target.value)}
              placeholder="Ask Nexora…"
              rows={2}
              className="min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-fg placeholder:text-subtle focus:outline-none"
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  void submit(draft);
                }
              }}
            />
            <Button type="submit" size="icon" disabled={ask.isPending || !draft.trim()}>
              <Send className="size-4" />
              <span className="sr-only">Send</span>
            </Button>
          </div>
        </form>
      </section>
    </div>
  );
}

function EmptyState({ onPick }: { onPick: (q: string) => void }) {
  const qs = [
    "What's our refund process for enterprise customers?",
    "What should an engineer do when a production deployment fails?",
    "According to our onboarding SOP, what happens after a new employee joins?",
  ];
  return (
    <div className="mx-auto max-w-lg py-10 text-center">
      <h2 className="font-display text-2xl tracking-tight">How can I help?</h2>
      <p className="mt-2 text-sm text-muted">
        Answers are grounded in this workspace’s documents and include citations.
      </p>
      <div className="mt-6 space-y-2">
        {qs.map((q) => (
          <button
            key={q}
            type="button"
            onClick={() => onPick(q)}
            className="block w-full rounded-md border border-border px-3 py-2 text-left text-sm text-muted hover:bg-elevated hover:text-fg"
          >
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}

function Bubble({ message }: { message: ChatMessage }) {
  const mine = message.role === "user";
  return (
    <div className={cn("flex", mine ? "justify-end" : "justify-start")}>
      <div className={cn("max-w-[min(42rem,100%)] space-y-3", mine && "text-right")}>
        <div
          className={cn(
            "rounded-lg px-4 py-3 text-left",
            mine ? "bg-elevated text-fg" : "bg-transparent p-0",
          )}
        >
          {mine ? (
            <p className="text-sm leading-relaxed">{message.content}</p>
          ) : (
            <MarkdownView text={message.content} />
          )}
        </div>
        {!mine && message.sources.length > 0 ? (
          <div className="flex flex-wrap items-center gap-2">
            <span className="text-[11px] uppercase tracking-wide text-subtle">Sources</span>
            {message.sources.map((s) => (
              <Link
                key={s.documentId}
                to="/app/knowledge/$kbId"
                params={{ kbId: s.kbId }}
                className="rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted hover:text-fg"
                title={s.excerpt}
              >
                {s.document}
              </Link>
            ))}
            <Button
              size="icon-sm"
              variant="ghost"
              onClick={() => {
                void navigator.clipboard.writeText(message.content);
                toast.success("Copied");
              }}
            >
              <Copy className="size-3.5" />
            </Button>
          </div>
        ) : null}
        {!mine && message.sources.length === 0 && message.content ? (
          <Badge variant="muted">No sources</Badge>
        ) : null}
      </div>
    </div>
  );
}
