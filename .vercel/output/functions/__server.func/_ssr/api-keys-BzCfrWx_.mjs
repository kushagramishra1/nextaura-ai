import { o as __toESM } from "../_runtime.mjs";
import { a as canManageWorkspace } from "./access-C7hj-I_h.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { s as formatDate } from "./router-BwAUY0N6.mjs";
import { t as Badge } from "./badge-DaNip6LT.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-aNnacrIm.mjs";
import { n as Label, t as Input } from "./label-SVGqMCUO.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/api-keys-BzCfrWx_.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var listApiKeys = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(createSsrRpc("7df59c12ddcb3403b7ac06729403850b52908c0078c81640b5ab0b38402ced2c"));
var createApiKey = createServerFn({ method: "POST" }).validator((input) => {
	const name = input.name.trim() || "Production";
	return {
		orgId: input.orgId,
		name
	};
}).middleware([authMiddleware]).handler(createSsrRpc("f728608c7d220caa2e896cdbf96a9e511da8f6531766e2b94d3ffe471e772862"));
var revokeApiKey = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("5be1f732592907cb662c3f3b1f19531a8ad9acbe925040d0429affcb1cfb80a5"));
function ApiKeysPage() {
	const { current } = useOrg();
	const qc = useQueryClient();
	const manage = canManageWorkspace(current.role);
	const [name, setName] = (0, import_react.useState)("Production");
	const [revealed, setRevealed] = (0, import_react.useState)(null);
	const keys = useQuery({
		queryKey: ["keys", current.id],
		queryFn: () => listApiKeys({ data: current.id }),
		enabled: manage
	});
	const create = useMutation({
		mutationFn: () => createApiKey({ data: {
			orgId: current.id,
			name
		} }),
		onSuccess: (data) => {
			setRevealed(data.raw);
			qc.invalidateQueries({ queryKey: ["keys", current.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	if (!manage) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-display text-3xl tracking-tight",
			children: "API keys"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-3 text-muted",
			children: "Only owners and admins can manage developer keys."
		})]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-subtle",
					children: "Developer"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "API keys"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-sm text-muted",
					children: "Raw keys are shown once. Nexora stores only a SHA-256 hash."
				})
			] }),
			revealed ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
				className: "p-5",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-wide text-subtle",
						children: "Copy this key now"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 break-all font-mono text-sm text-brand",
						children: revealed
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						className: "mt-4",
						variant: "outline",
						size: "sm",
						onClick: () => {
							navigator.clipboard.writeText(revealed);
							toast.success("Copied");
						},
						children: "Copy"
					})
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Create key" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				className: "flex flex-col gap-3 sm:flex-row sm:items-end",
				onSubmit: (e) => {
					e.preventDefault();
					create.mutate();
				},
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex-1 space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "key-name",
						children: "Label"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "key-name",
						value: name,
						onChange: (e) => setName(e.target.value)
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: create.isPending,
					children: create.isPending ? "Creating…" : "Create"
				})]
			}) })] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, { children: "Keys" }) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "divide-y divide-border",
				children: (keys.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "py-4 text-sm text-muted",
					children: "No keys yet."
				}) : (keys.data ?? []).map((k) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-3 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "text-sm font-medium",
								children: k.name
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "font-mono text-xs text-muted",
								children: k.keyPrefix
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-xs text-subtle",
							children: formatDate(k.createdAt)
						}),
						k.revokedAt ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "danger",
							children: "Revoked"
						}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "sm",
							variant: "outline",
							onClick: () => revokeApiKey({ data: {
								orgId: current.id,
								keyId: k.id
							} }).then(() => qc.invalidateQueries({ queryKey: ["keys", current.id] })).catch((e) => toast.error(e.message)),
							children: "Revoke"
						})
					]
				}, k.id))
			})] })
		]
	});
}
//#endregion
export { ApiKeysPage as component };
