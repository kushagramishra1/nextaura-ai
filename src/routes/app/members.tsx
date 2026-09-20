import { createFileRoute } from "@tanstack/react-router";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import {
  createInvite,
  listInvites,
  listMembers,
  removeMember,
  updateMemberRole,
} from "@/lib/nexora/org.functions";
import { canManageMembers, type Role } from "@/lib/nexora/plans";
import { formatDate } from "@/lib/utils";
import { useOrg } from "@/lib/nexora/org-context";

export const Route = createFileRoute("/app/members")({ component: MembersPage });

function MembersPage() {
  const { current } = useOrg();
  const qc = useQueryClient();
  const manage = canManageMembers(current.role);
  const [inviteUrl, setInviteUrl] = useState<string | null>(null);

  const members = useQuery({
    queryKey: ["members", current.id],
    queryFn: () => listMembers({ data: current.id }),
  });
  const invites = useQuery({
    queryKey: ["invites", current.id],
    queryFn: () => listInvites({ data: current.id }),
    enabled: manage,
  });

  const invite = useMutation({
    mutationFn: (role: "admin" | "member") =>
      createInvite({ data: { orgId: current.id, role } }),
    onSuccess: (data) => {
      const url = `${window.location.origin}/join/${data.token}`;
      setInviteUrl(url);
      void navigator.clipboard.writeText(url).catch(() => undefined);
      toast.success("Invite link copied");
      void qc.invalidateQueries({ queryKey: ["invites", current.id] });
    },
    onError: (e: Error) => toast.error(e.message),
  });

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs uppercase tracking-[0.18em] text-subtle">Organization</p>
          <h1 className="mt-1 font-display text-3xl tracking-tight">Members</h1>
        </div>
        {manage ? (
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => invite.mutate("member")}>
              Invite member
            </Button>
            <Button onClick={() => invite.mutate("admin")}>Invite admin</Button>
          </div>
        ) : null}
      </div>

      {inviteUrl ? (
        <Card className="p-4">
          <p className="text-xs uppercase tracking-wide text-subtle">Invite link</p>
          <p className="mt-1 break-all font-mono text-sm text-brand">{inviteUrl}</p>
        </Card>
      ) : null}

      <Card>
        <CardHeader>
          <CardTitle>People</CardTitle>
        </CardHeader>
        <CardContent className="divide-y divide-border">
          {members.isLoading ? (
            <Skeleton className="h-16" />
          ) : (
            (members.data ?? []).map((m) => (
              <div key={m.userId} className="flex flex-wrap items-center gap-3 py-3">
                <div className="min-w-0 flex-1">
                  <p className="truncate text-sm font-medium">{m.name}</p>
                  <p className="truncate text-xs text-muted">{m.email}</p>
                </div>
                {manage && current.role === "owner" ? (
                  <Select
                    value={m.role}
                    onValueChange={(role) => {
                      updateMemberRole({
                        data: { orgId: current.id, userId: m.userId, role: role as Role },
                      })
                        .then(() => qc.invalidateQueries({ queryKey: ["members", current.id] }))
                        .catch((e: Error) => toast.error(e.message));
                    }}
                  >
                    <SelectTrigger className="w-32">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="owner">Owner</SelectItem>
                      <SelectItem value="admin">Admin</SelectItem>
                      <SelectItem value="member">Member</SelectItem>
                    </SelectContent>
                  </Select>
                ) : (
                  <Badge variant="outline">{m.role}</Badge>
                )}
                {manage ? (
                  <Button
                    size="sm"
                    variant="ghost"
                    onClick={() =>
                      removeMember({ data: { orgId: current.id, userId: m.userId } })
                        .then(() => qc.invalidateQueries({ queryKey: ["members", current.id] }))
                        .catch((e: Error) => toast.error(e.message))
                    }
                  >
                    Remove
                  </Button>
                ) : (
                  <span className="text-xs text-subtle">{formatDate(m.createdAt)}</span>
                )}
              </div>
            ))
          )}
        </CardContent>
      </Card>

      {manage ? (
        <Card>
          <CardHeader>
            <CardTitle>Open invites</CardTitle>
          </CardHeader>
          <CardContent className="space-y-2">
            {(invites.data ?? []).filter((i) => !i.acceptedAt).length === 0 ? (
              <p className="text-sm text-muted">No pending invites.</p>
            ) : (
              (invites.data ?? [])
                .filter((i) => !i.acceptedAt)
                .map((i) => (
                  <div key={i.id} className="flex items-center justify-between gap-3 text-sm">
                    <span className="font-mono text-xs text-muted">{i.token}</span>
                    <Badge variant="outline">{i.role}</Badge>
                  </div>
                ))
            )}
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
}
