import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { BookOpen, Plus, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Skeleton } from "@/components/ui/skeleton";
import { Textarea } from "@/components/ui/textarea";
import {
  createKnowledgeBase,
  deleteKnowledgeBase,
  listKnowledgeBases,
} from "@/lib/nexora/knowledge.functions";
import { canManageWorkspace } from "@/lib/nexora/plans";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/knowledge/")({ component: KnowledgePage });

function KnowledgePage() {
  const { current } = useOrg();
  const qc = useQueryClient();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const list = useQuery({
    queryKey: ["kbs", current.id],
    queryFn: () => listKnowledgeBases({ data: current.id }),
  });

  const create = useMutation({
    mutationFn: () =>
      createKnowledgeBase({ data: { orgId: current.id, name, description } }),
    onSuccess: async () => {
      setOpen(false);
      setName("");
      setDescription("");
      await qc.invalidateQueries({ queryKey: ["kbs", current.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (kbId: string) =>
      deleteKnowledgeBase({ data: { orgId: current.id, kbId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["kbs", current.id] }),
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-5xl">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Knowledge</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Knowledge bases</h1>
        </div>
        <Button onClick={() => setOpen(true)}>
          <Plus className="size-4" />
          New collection
        </Button>
      </div>

      {list.isLoading ? (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          <Skeleton className="h-36" />
          <Skeleton className="h-36" />
        </div>
      ) : (
        <div className="mt-8 grid gap-4 sm:grid-cols-2">
          {(list.data ?? []).map((kb) => (
            <Card key={kb.id} className="relative p-5">
              <Link to="/app/knowledge/$kbId" params={{ kbId: kb.id }} className="block">
                <BookOpen className="size-5 text-brand" />
                <h2 className="mt-4 text-lg font-medium">{kb.name}</h2>
                <p className="mt-1 line-clamp-2 text-sm text-muted">
                  {kb.description || "No description"}
                </p>
                <p className="mt-4 font-mono text-xs text-subtle">
                  {kb.readyCount}/{kb.documentCount} ready
                </p>
              </Link>
              {canManageWorkspace(current.role) ? (
                <button
                  type="button"
                  className="absolute right-4 top-4 text-subtle hover:text-danger"
                  onClick={() => {
                    if (confirm(`Delete ${kb.name}?`)) remove.mutate(kb.id);
                  }}
                >
                  <Trash2 className="size-4" />
                  <span className="sr-only">Delete</span>
                </button>
              ) : null}
            </Card>
          ))}
        </div>
      )}

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>New knowledge base</DialogTitle>
            <DialogDescription>
              Group related policies or runbooks. Retrieval can be scoped to one collection.
            </DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="kb-name">Name</Label>
              <Input
                id="kb-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="kb-desc">Description</Label>
              <Textarea
                id="kb-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={create.isPending}>
                {create.isPending ? "Creating…" : "Create"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}
