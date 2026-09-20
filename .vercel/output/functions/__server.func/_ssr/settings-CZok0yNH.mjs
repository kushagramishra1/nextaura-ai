import { o as __toESM } from "../_runtime.mjs";
import { r as PLANS } from "./access-C7hj-I_h.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as cn } from "./router-BwAUY0N6.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-aNnacrIm.mjs";
import { n as Label, t as Input } from "./label-SVGqMCUO.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { l as renameOrganization, n as changePlan } from "./org.functions-G2GHLnEi.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/settings-CZok0yNH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function SettingsPage() {
	const { current, orgs, setOrgId } = useOrg();
	const qc = useQueryClient();
	const [name, setName] = (0, import_react.useState)(current.name);
	const owner = current.role === "owner";
	const rename = useMutation({
		mutationFn: () => renameOrganization({ data: {
			orgId: current.id,
			name
		} }),
		onSuccess: () => {
			toast.success("Workspace renamed");
			qc.invalidateQueries({ queryKey: ["orgs"] });
		},
		onError: (e) => toast.error(e.message)
	});
	const plan = useMutation({
		mutationFn: (next) => changePlan({ data: {
			orgId: current.id,
			plan: next
		} }),
		onSuccess: () => {
			toast.success("Plan updated");
			qc.invalidateQueries({ queryKey: ["orgs"] });
			qc.invalidateQueries({ queryKey: ["dashboard", current.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "text-xs uppercase tracking-[0.18em] text-subtle",
				children: "Workspace"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-1 font-display text-3xl tracking-tight",
				children: "Settings"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Profile of this workspace" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "space-y-3",
				onSubmit: (e) => {
					e.preventDefault();
					rename.mutate();
				},
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
							htmlFor: "ws",
							children: "Name"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							id: "ws",
							value: name,
							onChange: (e) => setName(e.target.value),
							disabled: !owner && current.role !== "admin"
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "font-mono text-xs text-subtle",
						children: current.slug
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						disabled: rename.isPending,
						children: "Save"
					})
				]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Plan" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "grid gap-3 sm:grid-cols-3",
				children: Object.keys(PLANS).map((id) => {
					const p = PLANS[id];
					const active = current.plan === id;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: !owner || plan.isPending,
						onClick: () => plan.mutate(id),
						className: cn("rounded-lg border p-4 text-left", active ? "border-brand bg-brand-dim" : "border-border hover:bg-elevated"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 font-mono text-lg",
								children: p.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-xs text-muted",
								children: p.blurb
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-3 font-mono text-[11px] text-subtle",
								children: [
									p.requests.toLocaleString(),
									" requests · ",
									p.documents,
									" docs"
								]
							})
						]
					}, id);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Security" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-2 text-sm text-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Sessions use Better Auth. API keys are hashed. Queries are scoped by membership." }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", { children: [
					"Developer documentation lives at",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/docs/api",
						className: "text-brand hover:underline",
						children: "/docs/api"
					}),
					"."
				] })]
			})] }),
			orgs.length > 1 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-muted",
				children: [
					"Switch workspace from the sidebar. Current: ",
					current.name,
					"."
				]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
				type: "button",
				className: "hidden",
				onClick: () => setOrgId(current.id)
			})
		]
	});
}
//#endregion
export { SettingsPage as component };
