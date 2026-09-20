import { createFileRoute } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip as RechartsTooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Skeleton } from "@/components/ui/skeleton";
import { getDashboard } from "@/lib/nexora/dashboard.functions";
import { PLANS } from "@/lib/nexora/plans";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/usage")({ component: UsagePage });

function UsagePage() {
  const { current } = useOrg();
  const plan = PLANS[current.plan];
  const stats = useQuery({
    queryKey: ["dashboard", current.id],
    queryFn: () => getDashboard({ data: current.id }),
  });

  if (!stats.data) return <Skeleton className="h-64" />;
  const data = stats.data;
  const pct = Math.min(100, Math.round((data.requestsUsed / plan.requests) * 100));

  const rows = [
    { label: "AI requests", used: data.requestsUsed, limit: plan.requests },
    { label: "Documents", used: data.documents, limit: plan.documents },
    { label: "Knowledge bases", used: data.knowledgeBases, limit: plan.knowledgeBases },
    { label: "Members", used: data.members, limit: plan.members },
  ];

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div>
        <p className="text-xs uppercase tracking-[0.18em] text-subtle">Billing period</p>
        <h1 className="mt-1 font-display text-3xl tracking-tight">Usage</h1>
        <p className="mt-2 text-sm text-muted">
          {plan.name} plan · limits reset on a rolling 30-day window for AI requests.
        </p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        {rows.map((row) => {
          const value = Math.min(100, Math.round((row.used / Math.max(row.limit, 1)) * 100));
          return (
            <Card key={row.label} className="p-5">
              <p className="text-sm text-muted">{row.label}</p>
              <p className="mt-2 font-mono text-2xl tabular-nums">
                {row.used.toLocaleString()}
                <span className="text-sm text-subtle"> / {row.limit.toLocaleString()}</span>
              </p>
              <Progress className="mt-4" value={value} />
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Requests · last 14 days</CardTitle>
        </CardHeader>
        <CardContent className="h-56">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={data.daily.length ? data.daily : [{ day: "—", count: 0 }]}>
              <XAxis dataKey="day" tick={{ fill: "#8f978f", fontSize: 11 }} />
              <YAxis allowDecimals={false} tick={{ fill: "#8f978f", fontSize: 11 }} />
              <RechartsTooltip
                contentStyle={{
                  background: "#1a1e1c",
                  border: "1px solid #2a302c",
                  borderRadius: 8,
                }}
              />
              <Bar dataKey="count" fill="#8ec9b0" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      <p className="text-sm text-muted">{pct}% of monthly AI request allotment used.</p>
    </div>
  );
}
