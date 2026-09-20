import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookOpen,
  KeyRound,
  LayoutDashboard,
  Menu,
  MessageSquare,
  Settings,
  Users,
  Activity,
  ChevronDown,
  Plus,
} from "lucide-react";
import { useState } from "react";
import { BrandMark } from "@/components/brand-mark";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Sheet, SheetContent, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { UserButton } from "@/lib/auth/gates";
import { useCurrentUser } from "@/lib/auth/use-current-user";
import type { OrgSummary } from "@/lib/nexora/types";
import { cn } from "@/lib/utils";

const NAV: {
  to: "/app" | "/app/knowledge" | "/app/assistant" | "/app/members" | "/app/api-keys" | "/app/usage" | "/app/settings";
  label: string;
  icon: typeof LayoutDashboard;
  exact?: boolean;
}[] = [
  { to: "/app", label: "Overview", icon: LayoutDashboard, exact: true },
  { to: "/app/knowledge", label: "Knowledge", icon: BookOpen },
  { to: "/app/assistant", label: "Assistant", icon: MessageSquare },
  { to: "/app/members", label: "Members", icon: Users },
  { to: "/app/api-keys", label: "API keys", icon: KeyRound },
  { to: "/app/usage", label: "Usage", icon: Activity },
  { to: "/app/settings", label: "Settings", icon: Settings },
];

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  return (
    <nav className="flex flex-col gap-0.5">
      {NAV.map((item) => {
        const active = item.exact
          ? pathname === item.to
          : pathname === item.to || pathname.startsWith(`${item.to}/`);
        const Icon = item.icon;
        return (
          <Link
            key={item.to}
            to={item.to}
            onClick={onNavigate}
            className={cn(
              "flex h-10 items-center gap-2.5 rounded-md px-3 text-sm transition-colors",
              active
                ? "bg-elevated text-fg"
                : "text-muted hover:bg-elevated/70 hover:text-fg",
            )}
          >
            <Icon className="size-4" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}

export function AppShell({
  orgs,
  current,
  onSelectOrg,
  children,
}: {
  orgs: OrgSummary[];
  current: OrgSummary;
  onSelectOrg: (id: string) => void;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  const user = useCurrentUser();

  const orgMenu = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type="button"
          className="flex w-full items-center gap-2 rounded-lg border border-border bg-surface px-2.5 py-2 text-left hover:bg-elevated"
        >
          <BrandMark className="size-6" />
          <span className="min-w-0 flex-1">
            <span className="block truncate text-sm font-medium">{current.name}</span>
            <span className="block truncate text-[11px] uppercase tracking-wide text-muted">
              {current.plan} · {current.role}
            </span>
          </span>
          <ChevronDown className="size-4 text-muted" />
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="start" className="w-64">
        <DropdownMenuLabel>Workspaces</DropdownMenuLabel>
        {orgs.map((org) => (
          <DropdownMenuItem key={org.id} onSelect={() => onSelectOrg(org.id)}>
            <span className="min-w-0 flex-1 truncate">{org.name}</span>
            {org.id === current.id ? <span className="text-brand">·</span> : null}
          </DropdownMenuItem>
        ))}
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link to="/onboarding">
            <Plus className="size-4" />
            New workspace
          </Link>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  const sidebar = (
    <div className="flex h-full flex-col gap-5">
      {orgMenu}
      <NavLinks onNavigate={() => setOpen(false)} />
      <div className="mt-auto border-t border-border pt-4">
        <div className="px-1 text-xs text-subtle">
          {user?.displayName ?? "Signed in"}
        </div>
      </div>
    </div>
  );

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <div className="flex min-h-dvh">
        <aside className="sticky top-0 hidden h-dvh w-64 shrink-0 border-r border-border bg-surface p-4 lg:block">
          {sidebar}
        </aside>
        <div className="flex min-w-0 flex-1 flex-col">
          <header className="sticky top-0 z-30 flex h-14 items-center justify-between gap-3 border-b border-border bg-bg/90 px-4 backdrop-blur lg:px-8">
            <div className="flex items-center gap-2 lg:hidden">
              <Button variant="ghost" size="icon-sm" onClick={() => setOpen(true)}>
                <Menu className="size-4" />
                <span className="sr-only">Open navigation</span>
              </Button>
              <span className="font-display text-lg tracking-tight">Nexora</span>
            </div>
            <div className="hidden text-sm text-muted lg:block">
              {current.slug}
            </div>
            <UserButton />
          </header>
          <main className="flex-1 px-4 py-6 lg:px-8 lg:py-8">{children}</main>
        </div>
      </div>
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side="left">
          <SheetHeader>
            <SheetTitle className="sr-only">Navigation</SheetTitle>
          </SheetHeader>
          {sidebar}
        </SheetContent>
      </Sheet>
    </div>
  );
}
