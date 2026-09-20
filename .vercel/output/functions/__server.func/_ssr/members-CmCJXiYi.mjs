import { o as __toESM } from "../_runtime.mjs";
import { i as canManageMembers } from "./access-C7hj-I_h.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as formatDate } from "./router-BwAUY0N6.mjs";
import { t as Badge } from "./badge-DaNip6LT.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-aNnacrIm.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { t as Skeleton } from "./skeleton-BrA-l3za.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BQGmROtV.mjs";
import { a as listInvites, c as removeMember, o as listMembers, r as createInvite, u as updateMemberRole } from "./org.functions-G2GHLnEi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/members-CmCJXiYi.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function MembersPage() {
	const { current } = useOrg();
	const qc = useQueryClient();
	const manage = canManageMembers(current.role);
	const [inviteUrl, setInviteUrl] = (0, import_react.useState)(null);
	const members = useQuery({
		queryKey: ["members", current.id],
		queryFn: () => listMembers({ data: current.id })
	});
	const invites = useQuery({
		queryKey: ["invites", current.id],
		queryFn: () => listInvites({ data: current.id }),
		enabled: manage
	});
	const invite = useMutation({
		mutationFn: (role) => createInvite({ data: {
			orgId: current.id,
			role
		} }),
		onSuccess: (data) => {
			const url = `${window.location.origin}/join/${data.token}`;
			setInviteUrl(url);
			navigator.clipboard.writeText(url).catch(() => void 0);
			toast.success("Invite link copied");
			qc.invalidateQueries({ queryKey: ["invites", current.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-subtle",
					children: "Organization"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Members"
				})] }), manage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => invite.mutate("member"),
						children: "Invite member"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => invite.mutate("admin"),
						children: "Invite admin"
					})]
				}) : null]
			}),
			inviteUrl ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-subtle",
					children: "Invite link"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 break-all font-mono text-sm text-brand",
					children: inviteUrl
				})]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "People" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "divide-y divide-border",
				children: members.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-16" }) : (members.data ?? []).map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: m.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-muted",
								children: m.email
							})]
						}),
						manage && current.role === "owner" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
							value: m.role,
							onValueChange: (role) => {
								updateMemberRole({ data: {
									orgId: current.id,
									userId: m.userId,
									role
								} }).then(() => qc.invalidateQueries({ queryKey: ["members", current.id] })).catch((e) => toast.error(e.message));
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
								className: "w-32",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, {})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "owner",
									children: "Owner"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "admin",
									children: "Admin"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
									value: "member",
									children: "Member"
								})
							] })]
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "outline",
							children: m.role
						}),
						manage ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "ghost",
							onClick: () => removeMember({ data: {
								orgId: current.id,
								userId: m.userId
							} }).then(() => qc.invalidateQueries({ queryKey: ["members", current.id] })).catch((e) => toast.error(e.message)),
							children: "Remove"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: formatDate(m.createdAt)
						})
					]
				}, m.userId))
			})] }),
			manage ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Open invites" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-2",
				children: (invites.data ?? []).filter((i) => !i.acceptedAt).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No pending invites."
				}) : (invites.data ?? []).filter((i) => !i.acceptedAt).map((i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center justify-between gap-3 text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "font-mono text-xs text-muted",
						children: i.token
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: i.role
					})]
				}, i.id))
			})] }) : null
		]
	});
}
//#endregion
export { MembersPage as component };
