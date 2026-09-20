import { r as PLANS } from "./access-C7hj-I_h.mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as useQuery } from "../_libs/tanstack__react-query.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-aNnacrIm.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { t as Skeleton } from "./skeleton-BrA-l3za.mjs";
import { n as getDashboard, t as Progress } from "./dashboard.functions-BLHHfUEs.mjs";
import { a as ResponsiveContainer, i as Bar, n as YAxis, o as Tooltip, r as XAxis, t as BarChart } from "../_libs/recharts+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/usage-C0fi0JnF.js
var import_jsx_runtime = require_jsx_runtime();
function UsagePage() {
	const { current } = useOrg();
	const plan = PLANS[current.plan];
	const stats = useQuery({
		queryKey: ["dashboard", current.id],
		queryFn: () => getDashboard({ data: current.id })
	});
	if (!stats.data) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-64" });
	const data = stats.data;
	const pct = Math.min(100, Math.round(data.requestsUsed / plan.requests * 100));
	const rows = [
		{
			label: "AI requests",
			used: data.requestsUsed,
			limit: plan.requests
		},
		{
			label: "Documents",
			used: data.documents,
			limit: plan.documents
		},
		{
			label: "Knowledge bases",
			used: data.knowledgeBases,
			limit: plan.knowledgeBases
		},
		{
			label: "Members",
			used: data.members,
			limit: plan.members
		}
	];
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-4xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-subtle",
					children: "Billing period"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Usage"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
					className: "mt-2 text-sm text-muted",
					children: [plan.name, " plan · limits reset on a rolling 30-day window for AI requests."]
				})
			] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2",
				children: rows.map((row) => {
					const value = Math.min(100, Math.round(row.used / Math.max(row.limit, 1) * 100));
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
						className: "p-5",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm text-muted",
								children: row.label
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-2 font-mono text-2xl tabular-nums",
								children: [row.used.toLocaleString(), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-sm text-subtle",
									children: [" / ", row.limit.toLocaleString()]
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
								className: "mt-4",
								value
							})
						]
					}, row.label);
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Requests · last 14 days" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "h-56",
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
								tick: {
									fill: "#8f978f",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(YAxis, {
								allowDecimals: false,
								tick: {
									fill: "#8f978f",
									fontSize: 11
								}
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tooltip, { contentStyle: {
								background: "#1a1e1c",
								border: "1px solid #2a302c",
								borderRadius: 8
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
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [pct, "% of monthly AI request allotment used."]
			})
		]
	});
}
//#endregion
export { UsagePage as component };
