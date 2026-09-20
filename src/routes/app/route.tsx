import { createFileRoute, Outlet, useNavigate } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import { AppShell } from "@/components/app-shell";
import { Skeleton } from "@/components/ui/skeleton";
import { RedirectToSignIn } from "@/lib/auth/gates";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { OrgCtx } from "@/lib/nexora/org-context";
import { listOrganizations } from "@/lib/nexora/org.functions";
import { readStoredOrgId, writeStoredOrgId } from "@/lib/nexora/org-store";

export const Route = createFileRoute("/app")({ component: AppLayout });

function AppLayout() {
  const { user, isPending } = useCurrentUserState();
  const navigate = useNavigate();
  const [orgId, setOrgId] = useState<string | null>(() => readStoredOrgId());

  const orgsQuery = useQuery({
    queryKey: ["orgs", user?.id],
    queryFn: () => listOrganizations(),
    enabled: Boolean(user),
  });

  const orgs = orgsQuery.data ?? [];
  const current = useMemo(() => {
    if (orgs.length === 0) return null;
    return orgs.find((o) => o.id === orgId) ?? orgs[0];
  }, [orgs, orgId]);

  if (isPending) return <AppSkeleton />;
  if (!user) return <RedirectToSignIn />;
  if (orgsQuery.isLoading) return <AppSkeleton />;
  if (orgs.length === 0) {
    void navigate({ to: "/onboarding" });
    return <AppSkeleton />;
  }
  if (!current) return <AppSkeleton />;

  return (
    <OrgCtx.Provider
      value={{
        current,
        orgs,
        setOrgId: (id) => {
          writeStoredOrgId(id);
          setOrgId(id);
        },
      }}
    >
      <AppShell
        orgs={orgs}
        current={current}
        onSelectOrg={(id) => {
          writeStoredOrgId(id);
          setOrgId(id);
        }}
      >
        <Outlet />
      </AppShell>
    </OrgCtx.Provider>
  );
}

function AppSkeleton() {
  return (
    <div className="min-h-dvh bg-bg p-6">
      <Skeleton className="h-10 w-48" />
      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
        <Skeleton className="h-28" />
      </div>
    </div>
  );
}
