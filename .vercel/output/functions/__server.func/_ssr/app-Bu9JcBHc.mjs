import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ArrowRight, S as BookOpen, _ as FileText, d as MessageSquare, r as Users } from "../_libs/lucide-react.mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { c as formatDateTime } from "./router-BwAUY0N6.mjs";
import { t as Badge } from "./badge-DaNip6LT.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-aNnacrIm.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { t as Skeleton } from "./skeleton-BrA-l3za.mjs";
import { n as getDashboard, t as Progress } from "./dashboard.functions-BLHHfUEs.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/app-Bu9JcBHc.js
var import_jsx_runtime = require_jsx_runtime();
var ACTION_LABEL = {
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
	"apikey.revoked": "API key revoked"
};
function Dashboard() {
	const { current } = useOrg();
	const stats = useQuery({
		queryKey: ["dashboard", current.id],
		queryFn: () => getDashboard({ data: current.id })
	});
	if (stats.isLoading || !stats.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-10 w-64" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "grid gap-4 sm:grid-cols-4",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-28" })
			]
		})]
	});
	const data = stats.data;
	const pct = Math.min(100, Math.round(data.requestsUsed / Math.max(data.requestsLimit, 1) * 100));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-subtle",
					children: "Overview"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: current.name
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/assistant",
						children: ["Ask Nexora ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
					})
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						label: "Documents",
						value: data.documents,
						icon: FileText
					},
					{
						label: "Knowledge bases",
						value: data.knowledgeBases,
						icon: BookOpen
					},
					{
						label: "Questions",
						value: data.questions,
						icon: MessageSquare
					},
					{
						label: "Members",
						value: data.members,
						icon: Users
					}
				].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(item.icon, { className: "size-4 text-brand" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-4 font-mono text-3xl tabular-nums",
							children: item.value
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-sm text-muted",
							children: item.label
						})
					]
				}, item.label))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "grid gap-4 lg:grid-cols-[1.2fr_0.8fr]",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "AI usage" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "text-sm text-muted",
					children: [
						data.requestsUsed.toLocaleString(),
						" / ",
						data.requestsLimit.toLocaleString(),
						" requests this month"
					]
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "mt-2 text-xs text-subtle",
						children: [
							pct,
							"% of the ",
							current.plan,
							" plan"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-6 h-40",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ResponsiveContainer, {
							width: "100%",
							height: "100%",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(BarChart, {
								data: data.daily.length ? data.daily : [{
									day: "—",
									count: 0
								}],
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(XAxis, {
										dataKey: "day",
										hide: true
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, { hide: true }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
										background: "#1a1e1c",
										border: "1px solid #2a302c",
										borderRadius: 8,
										fontSize: 12
									} }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bar, {
										dataKey: "count",
										fill: "#8ec9b0",
										radius: [
											4,
											4,
											0,
											0
										]
									})
								]
							})
						})
					})
				] })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Try a question" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
					className: "space-y-2",
					children: [
						"What's our refund process for enterprise customers?",
						"What should an engineer do when a production deployment fails?",
						"According to our onboarding SOP, what happens after a new employee joins?",
						"What is the company's annual leave policy?"
					].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/app/assistant",
						search: { q },
						className: "block rounded-md border border-border px-3 py-2 text-sm text-muted hover:bg-elevated hover:text-fg",
						children: q
					}, q))
				})] })]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Recent activity" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "divide-y divide-border",
				children: data.activity.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-6 text-sm text-muted",
					children: "Nothing yet."
				}) : data.activity.map((a) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm",
						children: ACTION_LABEL[a.action] ?? a.action
					}), a.detail ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-muted",
						children: a.detail
					}) : null] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "muted",
						children: formatDateTime(a.createdAt)
					})]
				}, a.id))
			})] })
		]
	});
}
//#endregion
export { Dashboard as component };
