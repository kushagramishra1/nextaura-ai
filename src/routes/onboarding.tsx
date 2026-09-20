import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { createOrganization } from "@/lib/nexora/org.functions";
import { writeStoredOrgId } from "@/lib/nexora/org-store";

export const Route = createFileRoute("/onboarding")({ component: Onboarding });

function Onboarding() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    const form = new FormData(e.currentTarget);
    const workspaceName = String(form.get("name") ?? "").trim();
    if (workspaceName.length < 2) {
      toast.error("Workspace name is too short");
      return;
    }
    setBusy(true);
    try {
      const org = await createOrganization({ data: { name: workspaceName } });
      writeStoredOrgId(org.id);
      await navigate({ to: "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Could not create workspace");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4">
      <BrandWordmark />
      <h1 className="mt-10 font-display text-4xl tracking-tight">Name the workspace</h1>
      <p className="mt-3 text-muted">
        We’ll provision HR, engineering, and support knowledge bases with sample
        policies so you can ask real questions immediately.
      </p>
      <form onSubmit={onSubmit} className="mt-8 space-y-4">
        <div className="space-y-1.5">
          <Label htmlFor="org">Company or team</Label>
          <Input
            id="org"
            name="name"
            placeholder="Acme Corporation"
            value={name}
            onChange={(e) => setName(e.target.value)}
            required
            minLength={2}
          />
        </div>
        <Button type="submit" disabled={busy} className="w-full">
          {busy ? "Indexing sample knowledge…" : "Create workspace"}
        </Button>
      </form>
    </div>
  );
}
