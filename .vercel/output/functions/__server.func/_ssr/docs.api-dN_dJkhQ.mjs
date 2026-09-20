import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { n as BrandWordmark } from "./brand-mark-BqZkbl1N.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/docs.api-dN_dJkhQ.js
var import_jsx_runtime = require_jsx_runtime();
function Code({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
		className: "overflow-x-auto rounded-lg border border-border bg-surface p-4 font-mono text-xs leading-relaxed text-fg",
		children
	});
}
function ApiDocs() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
			className: "mx-auto flex max-w-3xl items-center justify-between px-4 py-6",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWordmark, {})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "outline",
				size: "sm",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/app/api-keys",
					children: "Manage keys"
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "mx-auto max-w-3xl space-y-8 px-4 pb-20",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-brand",
						children: "Public API"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-2 font-display text-4xl tracking-tight",
						children: "Query Nexora from your tools"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-3 text-muted",
						children: "Authenticate with a workspace API key. Keys are hashed at rest. Every request is isolated to the issuing organization."
					})
				] }),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: "Authentication"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm text-muted",
							children: "Send the raw key in the Authorization header. Never log it."
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { children: `Authorization: Bearer nex_live_…` })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: "List knowledge bases"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { children: `GET /api/v1/knowledge-bases` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { children: `{
  "knowledge_bases": [
    { "id": "kb_…", "name": "Customer Support", "description": "…" }
  ]
}` })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "text-lg font-medium",
							children: "Ask a question"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { children: `POST /api/v1/assistant/query
Content-Type: application/json

{
  "knowledge_base_id": "kb_123",
  "question": "What is our refund policy?"
}` }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Code, { children: `{
  "answer": "Customers can request a refund within 30 days.",
  "sources": [
    {
      "document": "refund-policy.md",
      "knowledge_base": "Customer Support",
      "excerpt": "Enterprise customers may request a refund…"
    }
  ]
}` })
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
					className: "space-y-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-lg font-medium",
						children: "Errors"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("ul", {
						className: "list-disc space-y-1 pl-5 text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "401 — missing, invalid, or revoked key" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "400 — question too short" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "429 — plan request limit" }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: "503 — model unavailable" })
						]
					})]
				})
			]
		})]
	});
}
//#endregion
export { ApiDocs as component };
