import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { FileUp, Trash2 } from "lucide-react";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
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
import { ACCEPTED_UPLOADS } from "@/lib/nexora/upload";
import {
  deleteDocument,
  getDocument,
  getKnowledgeBase,
  ingestDocument,
  listDocuments,
} from "@/lib/nexora/knowledge.functions";
import { bytesLabel, formatDateTime } from "@/lib/utils";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/knowledge/$kbId")({
  component: KnowledgeDetail,
});

const STATUS_VARIANT = {
  ready: "success",
  failed: "danger",
  processing: "warn",
  indexing: "warn",
  uploading: "muted",
} as const;

function KnowledgeDetail() {
  const { kbId } = Route.useParams();
  const { current } = useOrg();
  const qc = useQueryClient();
  const [uploadOpen, setUploadOpen] = useState(false);
  const [pasteOpen, setPasteOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [pasted, setPasted] = useState("");
  const [previewId, setPreviewId] = useState<string | null>(null);

  const kb = useQuery({
    queryKey: ["kb", current.id, kbId],
    queryFn: () => getKnowledgeBase({ data: { orgId: current.id, kbId } }),
  });
  const docs = useQuery({
    queryKey: ["docs", current.id, kbId],
    queryFn: () => listDocuments({ data: { orgId: current.id, kbId } }),
  });
  const preview = useQuery({
    queryKey: ["doc", current.id, previewId],
    queryFn: () => getDocument({ data: { orgId: current.id, documentId: previewId! } }),
    enabled: Boolean(previewId),
  });

  const ingest = useMutation({
    mutationFn: (input: Parameters<typeof ingestDocument>[0]["data"]) =>
      ingestDocument({ data: input }),
    onSuccess: async () => {
      toast.success("Document indexed");
      setUploadOpen(false);
      setPasteOpen(false);
      setTitle("");
      setPasted("");
      await qc.invalidateQueries({ queryKey: ["docs", current.id, kbId] });
      await qc.invalidateQueries({ queryKey: ["kbs", current.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const remove = useMutation({
    mutationFn: (documentId: string) =>
      deleteDocument({ data: { orgId: current.id, documentId } }),
    onSuccess: () => qc.invalidateQueries({ queryKey: ["docs", current.id, kbId] }),
    onError: (e: Error) => toast.error(e.message),
  });

  async function onFiles(files: FileList | null) {
    if (!files?.length) return;
    for (const file of Array.from(files)) {
      const buf = await file.arrayBuffer();
      const bytes = new Uint8Array(buf);
      let binary = "";
      for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
      ingest.mutate({
        orgId: current.id,
        kbId,
        filename: file.name,
        mimeType: file.type || "application/octet-stream",
        contentBase64: btoa(binary),
      });
    }
  }

  return (
    <div className="mx-auto max-w-5xl">
      <Link to="/app/knowledge" className="text-sm text-muted hover:text-fg">
        Knowledge
      </Link>
      <div className="mt-2 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-3xl tracking-tight">
            {kb.data?.name ?? "Knowledge base"}
          </h1>
          <p className="mt-1 text-sm text-muted">{kb.data?.description}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setPasteOpen(true)}>
            Paste text
          </Button>
          <Button onClick={() => setUploadOpen(true)}>
            <FileUp className="size-4" />
            Upload
          </Button>
        </div>
      </div>

      {docs.isLoading ? (
        <Skeleton className="mt-8 h-40" />
      ) : (docs.data ?? []).length === 0 ? (
        <Card className="mt-8 p-10 text-center">
          <p className="text-sm text-muted">No documents yet. Upload a policy or paste a SOP.</p>
        </Card>
      ) : (
        <div className="mt-8 divide-y divide-border rounded-xl border border-border bg-card">
          {(docs.data ?? []).map((doc) => (
            <div key={doc.id} className="flex items-center gap-4 px-4 py-3">
              <button
                type="button"
                className="min-w-0 flex-1 text-left"
                onClick={() => setPreviewId(doc.id)}
              >
                <p className="truncate text-sm font-medium">{doc.title}</p>
                <p className="truncate font-mono text-xs text-subtle">
                  {doc.filename} · {bytesLabel(doc.sizeBytes)} · {doc.chunkCount} chunks
                </p>
              </button>
              <Badge variant={STATUS_VARIANT[doc.status] ?? "muted"}>{doc.status}</Badge>
              <span className="hidden text-xs text-subtle sm:block">
                {formatDateTime(doc.createdAt)}
              </span>
              <button
                type="button"
                className="text-subtle hover:text-danger"
                onClick={() => remove.mutate(doc.id)}
              >
                <Trash2 className="size-4" />
              </button>
            </div>
          ))}
        </div>
      )}

      <Dialog open={uploadOpen} onOpenChange={setUploadOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Upload documents</DialogTitle>
            <DialogDescription>PDF, DOCX, Markdown, or TXT. Max 2 MB each.</DialogDescription>
          </DialogHeader>
          <label className="flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-elevated text-sm text-muted">
            <FileUp className="mb-2 size-6 text-brand" />
            Drop files or click to browse
            <input
              type="file"
              accept={ACCEPTED_UPLOADS}
              multiple
              className="hidden"
              onChange={(e) => void onFiles(e.target.files)}
            />
          </label>
          {ingest.isPending ? <p className="text-sm text-muted">Extracting and indexing…</p> : null}
        </DialogContent>
      </Dialog>

      <Dialog open={pasteOpen} onOpenChange={setPasteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Paste a document</DialogTitle>
            <DialogDescription>Useful for SOPs that live in Notion or Google Docs.</DialogDescription>
          </DialogHeader>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              ingest.mutate({
                orgId: current.id,
                kbId,
                filename: `${title || "note"}.md`,
                mimeType: "text/markdown",
                pastedText: pasted,
                title,
              });
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="title">Title</Label>
              <Input id="title" value={title} onChange={(e) => setTitle(e.target.value)} required />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="body">Content</Label>
              <Textarea
                id="body"
                className="min-h-40"
                value={pasted}
                onChange={(e) => setPasted(e.target.value)}
                required
              />
            </div>
            <DialogFooter>
              <Button type="submit" disabled={ingest.isPending}>
                {ingest.isPending ? "Indexing…" : "Index"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      <Dialog open={Boolean(previewId)} onOpenChange={(o) => !o && setPreviewId(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{preview.data?.title ?? "Document"}</DialogTitle>
            <DialogDescription>{preview.data?.filename}</DialogDescription>
          </DialogHeader>
          <pre className="max-h-[50vh] overflow-auto whitespace-pre-wrap rounded-md bg-elevated p-4 font-sans text-sm leading-relaxed">
            {preview.data?.content}
          </pre>
        </DialogContent>
      </Dialog>
    </div>
  );
}
