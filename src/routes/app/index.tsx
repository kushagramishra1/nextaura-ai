import { createFileRoute, Link } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { ArrowRight, BookOpen, FileText, MessageSquare, Users } from "lucide-react";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboard } from "@/lib/nexora/dashboard.functions";
import { formatDateTime } from "@/lib/utils";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/")({ component: Dashboard });

const ACTION_LABEL: Record<string, string> = {
  "workspace.created": "Workspace created",
  "workspace.seeded": "Sample knowledge indexed",
  "workspace.renamed": "Workspace renamed",
  "plan.changed": "Plan updated",
  "kb.created": "Knowledge base created",
  "kb.deleted": "Knowledge base deleted",
  "document.indexed": "Document indexed",
  "document.deleted": "Document deleted",
  "assistant.asked": "Question asked",
  "member.joined": "Member joined",
  "member.removed": "Member removed",
  "member.role": "Role updated",
  "invite.created": "Invite created",
  "apikey.created": "API key created",
  "apikey.revoked": "API key revoked",
};

function Dashboard() {
  const { current } = useOrg();
  const stats = useQuery({
    queryKey: ["dashboard", current.id],
    queryFn: () => getDashboard({ data: current.id }),
  });

  if (stats.isLoading || !stats.data) {
    return (
      <div className="space-y-4">
        <Skeleton className="h-10 w-64" />
        <div className="grid gap-4 sm:grid-cols-4">
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
          <Skeleton className="h-28" />
        </div>
      </div>
    );
  }

  const data = stats.data;
  const pct = Math.min(100, Math.round((data.requestsUsed / Math.max(data.requestsLimit, 1)) * 100));
  const samples = [
    "What's our refund process for enterprise customers?",
    "What should an engineer do when a production deployment fails?",
    "According to our onboarding SOP, what happens after a new employee joins?",
    "What is the company's annual leave policy?",
  ];

  return (
    <div className="mx-auto max-w-5xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Overview</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">{current.name}</h1>
        </div>
        <Button asChild>
          <Link to="/app/assistant">
            Ask Nexora <ArrowRight className="size-4" />
          </Link>
        </Button>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          { label: "Documents", value: data.documents, icon: FileText },
          { label: "Knowledge bases", value: data.knowledgeBases, icon: BookOpen },
          { label: "Questions", value: data.questions, icon: MessageSquare },
          { label: "Members", value: data.members, icon: Users },
        ].map((item) => (
          <Card key={item.label} className="p-5">
            <item.icon className="size-4 text-brand" />
            <p className="mt-4 font-mono text-3xl tabular-nums">{item.value}</p>
            <p className="mt-1 text-sm text-muted">{item.label}</p>
          </Card>
        ))}
      </div>

      <div className="grid gap-4 lg:grid-cols-[1.2fr_0.8fr]">
        <Card>
          <CardHeader>
            <CardTitle>AI usage</CardTitle>
            <p className="text-sm text-muted">
              {data.requestsUsed.toLocaleString()} / {data.requestsLimit.toLocaleString()} requests
              this month
            </p>
          </CardHeader>
          <CardContent>
            <Progress value={pct} />
            <p className="mt-2 text-xs text-subtle">{pct}% of the {current.plan} plan</p>
            <div className="mt-6 h-40">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={data.daily.length ? data.daily : [{ day: "—", count: 0 }]}>
                  <XAxis dataKey="day" hide />
                  <YAxis hide />
                  <RechartsTooltip
                    contentStyle={{
                      background: "#1a1e1c",
                      border: "1px solid #2a302c",
                      borderRadius: 8,
                      fontSize: 12,
                    }}
                  />
                  <Bar dataKey="count" fill="#8ec9b0" radius={[4, 4, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Try a question</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {samples.map((q) => (
              <Link
                key={q}
                to="/app/assistant"
                search={{ q }}
                className="block rounded-md border border-border px-3 py-2 text-sm text-muted hover:bg-elevated hover:text-fg"
              >
                {q}
              </Link>
            ))}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent activity</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {data.activity.length === 0 ? (
            <p className="py-6 text-sm text-muted">Nothing yet.</p>
          ) : (
            data.activity.map((a) => (
              <div key={a.id} className="flex items-start justify-between gap-4 py-3">
                <div>
                  <p className="text-sm">{ACTION_LABEL[a.action] ?? a.action}</p>
                  {a.detail ? <p className="text-xs text-muted">{a.detail}</p> : null}
                </div>
                <Badge variant="muted">{formatDateTime(a.createdAt)}</Badge>
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
