import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { toast } from "sonner";
import { BrandWordmark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { acceptInvite } from "@/lib/nexora/org.functions";
import { writeStoredOrgId } from "@/lib/nexora/org-store";

export const Route = createFileRoute("/join/$token")({ component: Join });

function Join() {
  const { token } = Route.useParams();
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);

  if (isPending) return <div className="min-h-dvh bg-bg" />;
  if (!user) return <RedirectToSignIn />;

  async function join() {
    setBusy(true);
    try {
      const result = await acceptInvite({ data: token });
      writeStoredOrgId(result.orgId);
      await navigate({ to: "/app" });
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "Invite failed");
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4">
      <BrandWordmark />
      <h1 className="mt-10 font-display text-4xl tracking-tight">Join workspace</h1>
      <p className="mt-3 text-muted">
        This invite adds you to an existing Nexora organization with the role
        the owner selected.
      </p>
      <Button className="mt-8" onClick={join} disabled={busy}>
        {busy ? "Joining…" : "Accept invite"}
      </Button>
      <Link to="/" className="mt-4 text-sm text-muted hover:text-fg">
        Cancel
      </Link>
    </div>
  );
}
