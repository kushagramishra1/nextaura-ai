import { createFileRoute, Link } from "@tanstack/react-router";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { changePlan, renameOrganization } from "@/lib/nexora/org.functions";
import { PLANS, type PlanId } from "@/lib/nexora/plans";
import { cn } from "@/lib/utils";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/settings")({ component: SettingsPage });

function SettingsPage() {
  const { current, orgs, setOrgId } = useOrg();
  const qc = useQueryClient();
  const [name, setName] = useState(current.name);
  const owner = current.role === "owner";

  const rename = useMutation({
    mutationFn: () => renameOrganization({ data: { orgId: current.id, name } }),
    onSuccess: () => {
      toast.success("Workspace renamed");
      void qc.invalidateQueries({ queryKey: ["orgs"] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  const plan = useMutation({
    mutationFn: (next: PlanId) => changePlan({ data: { orgId: current.id, plan: next } }),
    onSuccess: () => {
      toast.success("Plan updated");
      void qc.invalidateQueries({ queryKey: ["orgs"] });
      void qc.invalidateQueries({ queryKey: ["dashboard", current.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">Workspace</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Settings</h1>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile of this workspace</CardTitle>
        </CardHeader>
        <CardContent>
          <form
            className="space-y-3"
            onSubmit={(e) => {
              e.preventDefault();
              rename.mutate();
            }}
          >
            <div className="space-y-1.5">
              <Label htmlFor="ws">Name</Label>
              <Input
                id="ws"
                value={name}
                onChange={(e) => setName(e.target.value)}
                disabled={!owner && current.role !== "admin"}
              />
            </div>
            <p className="font-mono text-xs text-subtle">{current.slug}</p>
            <Button type="submit" disabled={rename.isPending}>
              Save
            </Button>
          </form>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Plan</CardTitle>
        </CardHeader>
        <CardContent className="grid gap-3 sm:grid-cols-3">
          {(Object.keys(PLANS) as PlanId[]).map((id) => {
            const p = PLANS[id];
            const active = current.plan === id;
            return (
              <button
                key={id}
                type="button"
                disabled={!owner || plan.isPending}
                onClick={() => plan.mutate(id)}
                className={cn(
                  "rounded-lg border p-4 text-left",
                  active ? "border-brand bg-brand-dim" : "border-border hover:bg-elevated",
                )}
              >
                <p className="text-sm font-medium">{p.name}</p>
                <p className="mt-1 font-mono text-lg">{p.price}</p>
                <p className="mt-2 text-xs text-muted">{p.blurb}</p>
                <p className="mt-3 font-mono text-[11px] text-subtle">
                  {p.requests.toLocaleString()} requests · {p.documents} docs
                </p>
              </button>
            );
          })}
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Security</CardTitle>
        </CardHeader>
        <CardContent className="space-y-2 text-sm text-muted">
          <p>Sessions use Better Auth. API keys are hashed. Queries are scoped by membership.</p>
          <p>
            Developer documentation lives at{" "}
            <Link to="/docs/api" className="text-brand hover:underline">
              /docs/api
            </Link>
            .
          </p>
        </CardContent>
      </Card>

      {orgs.length > 1 ? (
        <p className="text-sm text-muted">
          Switch workspace from the sidebar. Current: {current.name}.
        </p>
      ) : (
        <button type="button" className="hidden" onClick={() => setOrgId(current.id)} />
      )}
    </div>
  );
}
