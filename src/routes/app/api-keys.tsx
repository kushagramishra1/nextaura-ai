import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { createApiKey, listApiKeys, revokeApiKey } from "@/lib/nexora/keys.functions";
import { canManageWorkspace } from "@/lib/nexora/plans";
import { formatDate } from "@/lib/utils";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/api-keys")({ component: ApiKeysPage });

function ApiKeysPage() {
  const { current } = useOrg();
  const qc = useQueryClient();
  const manage = canManageWorkspace(current.role);
  const [name, setName] = useState("Production");
  const [revealed, setRevealed] = useState<string | null>(null);

  const keys = useQuery({
    queryKey: ["keys", current.id],
    queryFn: () => listApiKeys({ data: current.id }),
    enabled: manage,
  });

  const create = useMutation({
    mutationFn: () => createApiKey({ data: { orgId: current.id, name } }),
    onSuccess: (data) => {
      setRevealed(data.raw);
      void qc.invalidateQueries({ queryKey: ["keys", current.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  if (!manage) {
    return (
      <div className="mx-auto max-w-2xl">
        <h1 className="font-display text-3xl tracking-tight">API keys</h1>
        <p className="mt-3 text-muted">Only owners and admins can manage developer keys.</p>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">Developer</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">API keys</h1>
        <p className="mt-2 text-sm text-muted">
          Raw keys are shown once. Nexora stores only a SHA-256 hash.
        </p>
      </div>

      {revealed ? (
        <Card className="p-5">
          <p className="text-xs uppercase tracking-wide text-subtle">Copy this key now</p>
          <p className="mt-2 break-all font-mono text-sm text-brand">{revealed}</p>
          <Button
            className="mt-4"
            variant="outline"
            size="sm"
            onClick={() => {
              void navigator.clipboard.writeText(revealed);
              toast.success("Copied");
            }}
          >
            Copy
          </Button>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>Create key</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="flex flex-col gap-3 sm:flex-row sm:items-end"
            onSubmit={(e) => {
              e.preventDefault();
              create.mutate();
            }}
          >
            <div className="flex-1 space-y-1.5">
              <Label htmlFor="key-name">Label</Label>
              <Input id="key-name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <Button type="submit" disabled={create.isPending}>
              {create.isPending ? "Creating…" : "Create"}
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Keys</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {(keys.data ?? []).length === 0 ? (
            <p className="py-4 text-sm text-muted">No keys yet.</p>
          ) : (
            (keys.data ?? []).map((k) => (
              <div key={k.id} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="text-sm font-medium">{k.name}</p>
                  <p className="font-mono text-xs text-muted">{k.keyPrefix}</p>
                </div>
                <span className="text-xs text-subtle">{formatDate(k.createdAt)}</span>
                {k.revokedAt ? (
                  <Badge variant="danger">Revoked</Badge>
                ) : (
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      revokeApiKey({ data: { orgId: current.id, keyId: k.id } })
                        .then(() => qc.invalidateQueries({ queryKey: ["keys", current.id] }))
                        .catch((e: Error) => toast.error(e.message))
                    }
                  >
                    Revoke
                  </Button>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
