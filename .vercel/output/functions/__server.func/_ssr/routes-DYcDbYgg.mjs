import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { C as ArrowRight, S as BookOpen, _ as FileText, d as MessageSquare, l as Search, n as Workflow, o as Shield, p as Lock } from "../_libs/lucide-react.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { n as BrandWordmark } from "./brand-mark-BqZkbl1N.mjs";
import { n as useCurrentUserState } from "./use-current-user-ClOiUQ-z.mjs";
import { n as SignedIn, r as SignedOut } from "./gates-B2yXkwo7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-DYcDbYgg.js
var import_jsx_runtime = require_jsx_runtime();
function AuthCta() {
	const { isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-10 w-36 animate-pulse rounded-md bg-elevated" });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SignedIn, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/app",
			children: ["Open workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
		})
	}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SignedOut, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/register",
			children: ["Start a workspace ", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "size-4" })]
		})
	}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		variant: "outline",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			children: "Sign in"
		})
	})] })] });
}
function Landing() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: "mx-auto flex w-full max-w-6xl items-center justify-between px-4 py-5 lg:px-6",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWordmark, {}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
						className: "hidden items-center gap-6 text-sm text-muted md:flex",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#product",
								className: "hover:text-fg",
								children: "Product"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
								to: "/docs/api",
								className: "hover:text-fg",
								children: "API"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
								href: "#security",
								className: "hover:text-fg",
								children: "Security"
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "flex items-center gap-2",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "mx-auto w-full max-w-6xl px-4 pb-16 pt-10 lg:px-6 lg:pb-24 lg:pt-16",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs font-medium uppercase tracking-[0.22em] text-brand",
						children: "Knowledge operations"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-4 max-w-3xl font-display text-4xl leading-[1.1] tracking-tight text-fg sm:text-5xl lg:text-6xl",
						children: "Company knowledge, finally answerable."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-5 max-w-xl text-base leading-relaxed text-muted sm:text-lg",
						children: "Nexora indexes handbooks, SOPs, and policies, then answers operational questions with citations back to the source page — not a generic chatbot."
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-8 flex flex-wrap items-center gap-3",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthCta, {})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						id: "product",
						className: "mt-14 overflow-hidden rounded-xl border border-border bg-surface",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "grid lg:grid-cols-[220px_1fr]",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "hidden border-r border-border p-4 lg:block",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "px-2 text-[11px] uppercase tracking-wide text-subtle",
									children: "Conversations"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "mt-3 space-y-1",
									children: [
										"Enterprise refunds",
										"Deployment failure",
										"Leave policy"
									].map((item, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: `rounded-md px-3 py-2 text-sm ${i === 0 ? "bg-elevated text-fg" : "text-muted"}`,
										children: item
									}, item))
								})]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "p-5 sm:p-8",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "text-xs uppercase tracking-wide text-subtle",
										children: "Ask Nexora"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "mt-3 rounded-lg bg-elevated px-4 py-3 text-sm text-fg",
										children: "What is our refund process for enterprise customers?"
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-5 space-y-3 text-[15px] leading-relaxed text-fg",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "Enterprise customers may request a refund within 30 days of the invoice date when uptime falls below 99.9%, provisioning was wrong, or the contract includes a money-back clause." }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "The owner files the request, Support verifies the invoice, Finance approves amounts under $25,000, and the refund is issued to the original payment method within 10 business days." })]
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-6 flex flex-wrap gap-2",
										children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted",
											children: "refund-policy.md"
										}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
											className: "rounded-full border border-border px-3 py-1 font-mono text-[11px] text-muted",
											children: "Customer Support"
										})]
									})
								]
							})]
						})
					})
				]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "border-y border-border bg-surface",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-6xl gap-8 px-4 py-12 sm:grid-cols-3 lg:px-6",
					children: [
						{
							k: "Indexed",
							v: "Handbooks, SOPs, runbooks"
						},
						{
							k: "Retrieved",
							v: "Scoped to the workspace"
						},
						{
							k: "Answered",
							v: "With source citations"
						}
					].map((item) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-subtle",
						children: item.k
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 font-display text-2xl tracking-tight",
						children: item.v
					})] }, item.k))
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "mx-auto grid w-full max-w-6xl gap-4 px-4 py-16 sm:grid-cols-2 lg:grid-cols-3 lg:px-6",
				children: [
					{
						icon: BookOpen,
						title: "Knowledge bases",
						body: "Keep HR, engineering, and support in separate collections with their own documents."
					},
					{
						icon: FileText,
						title: "Ingestion pipeline",
						body: "Upload PDF, DOCX, Markdown, or text. Nexora extracts, chunks, and indexes immediately."
					},
					{
						icon: Search,
						title: "Retrieval, not vibes",
						body: "Questions hit ranked passages from your corpus before the model writes a word."
					},
					{
						icon: MessageSquare,
						title: "Cited answers",
						body: "Every assistant reply carries the documents it used. Operators can open the source."
					},
					{
						icon: Workflow,
						title: "Public API",
						body: "Query knowledge from internal tools with hashed API keys and the same isolation rules."
					},
					{
						icon: Shield,
						title: "Multi-tenant by default",
						body: "Organizations, roles, and every query scoped to membership. Workspace A cannot read B."
					}
				].map((f) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-xl border border-border bg-surface p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(f.icon, { className: "size-5 text-brand" }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "mt-4 text-base font-medium",
							children: f.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-muted",
							children: f.body
						})
					]
				}, f.title))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				id: "security",
				className: "mx-auto w-full max-w-6xl px-4 pb-20 lg:px-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "rounded-xl border border-border bg-surface p-6 sm:p-10",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-start gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Lock, { className: "mt-1 size-5 text-brand" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
								className: "font-display text-3xl tracking-tight",
								children: "Built as a SaaS, not a demo chat."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-3 max-w-2xl text-muted",
								children: "JWT sessions, hashed API keys, role-based access, plan limits, and organization isolation are first-class. Raw keys are never stored. Retrieval never crosses a workspace boundary."
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-6",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
									asChild: true,
									variant: "outline",
									children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/docs/api",
										children: "Read the API"
									})
								})
							})
						] })]
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
				className: "border-t border-border",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex w-full max-w-6xl flex-col gap-3 px-4 py-8 text-sm text-muted sm:flex-row sm:items-center sm:justify-between lg:px-6",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWordmark, { className: "text-muted" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: "AI knowledge and operations platform." })]
				})
			})
		]
	});
}
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-8 w-20 animate-pulse rounded-md bg-elevated" });
	if (user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		size: "sm",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/app",
			children: "Open"
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
		asChild: true,
		size: "sm",
		variant: "outline",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
			to: "/login",
			children: "Sign in"
		})
	});
}
//#endregion
export { Landing as component };
