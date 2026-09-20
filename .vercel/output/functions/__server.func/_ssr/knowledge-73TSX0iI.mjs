import { o as __toESM } from "../_runtime.mjs";
import { a as canManageWorkspace } from "./access-C7hj-I_h.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { S as BookOpen, a as Trash2, u as Plus } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { t as Card } from "./card-aNnacrIm.mjs";
import { n as Label, t as Input } from "./label-SVGqMCUO.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { c as listKnowledgeBases, r as deleteKnowledgeBase, t as createKnowledgeBase } from "./knowledge.functions-BI8TxcJS.mjs";
import { t as Skeleton } from "./skeleton-BrA-l3za.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./textarea-nO52PCx-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/knowledge-73TSX0iI.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function KnowledgePage() {
	const { current } = useOrg();
	const qc = useQueryClient();
	const [open, setOpen] = (0, import_react.useState)(false);
	const [name, setName] = (0, import_react.useState)("");
	const [description, setDescription] = (0, import_react.useState)("");
	const list = useQuery({
		queryKey: ["kbs", current.id],
		queryFn: () => listKnowledgeBases({ data: current.id })
	});
	const create = useMutation({
		mutationFn: () => createKnowledgeBase({ data: {
			orgId: current.id,
			name,
			description
		} }),
		onSuccess: async () => {
			setOpen(false);
			setName("");
			setDescription("");
			await qc.invalidateQueries({ queryKey: ["kbs", current.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: (kbId) => deleteKnowledgeBase({ data: {
			orgId: current.id,
			kbId
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: ["kbs", current.id] }),
		onError: (e) => toast.error(e.message)
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-[0.18em] text-subtle",
					children: "Knowledge"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "mt-1 font-display text-3xl tracking-tight",
					children: "Knowledge bases"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
					onClick: () => setOpen(true),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "size-4" }), "New collection"]
				})]
			}),
			list.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "h-36" })]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 grid gap-4 sm:grid-cols-2",
				children: (list.data ?? []).map((kb) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, {
					className: "relative p-5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/app/knowledge/$kbId",
						params: { kbId: kb.id },
						className: "block",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "size-5 text-brand" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "mt-4 text-lg font-medium",
								children: kb.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-1 line-clamp-2 text-sm text-muted",
								children: kb.description || "No description"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mt-4 font-mono text-xs text-subtle",
								children: [
									kb.readyCount,
									"/",
									kb.documentCount,
									" ready"
								]
							})
						]
					}), canManageWorkspace(current.role) ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						className: "absolute right-4 top-4 text-subtle hover:text-danger",
						onClick: () => {
							if (confirm(`Delete ${kb.name}?`)) remove.mutate(kb.id);
						},
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "sr-only",
							children: "Delete"
						})]
					}) : null]
				}, kb.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open,
				onOpenChange: setOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "New knowledge base" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Group related policies or runbooks. Retrieval can be scoped to one collection." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						create.mutate();
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "kb-name",
								children: "Name"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "kb-name",
								value: name,
								onChange: (e) => setName(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "kb-desc",
								children: "Description"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "kb-desc",
								value: description,
								onChange: (e) => setDescription(e.target.value)
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: create.isPending,
							children: create.isPending ? "Creating…" : "Create"
						}) })
					]
				})] })
			})
		]
	});
}
//#endregion
export { KnowledgePage as component };
