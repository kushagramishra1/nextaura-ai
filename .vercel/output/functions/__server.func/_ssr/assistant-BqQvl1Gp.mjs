import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { a as Trash2, c as Send, v as Copy } from "../_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "../_libs/tanstack__react-query.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { o as cn, r as Route$3 } from "./router-BwAUY0N6.mjs";
import { t as Badge } from "./badge-DaNip6LT.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { n as useOrg } from "./org-context--gmzFBQI.mjs";
import { r as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CQPgaBZX.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { c as listKnowledgeBases } from "./knowledge.functions-BI8TxcJS.mjs";
import { a as SelectValue, i as SelectTrigger, n as SelectContent, r as SelectItem, t as Select } from "./select-BQGmROtV.mjs";
import { a as Viewport, i as ScrollAreaThumb, n as Root, r as ScrollAreaScrollbar, t as Corner } from "../_libs/radix-ui__react-scroll-area.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/assistant-BqQvl1Gp.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function inline(text) {
	const nodes = [];
	const re = /(\*\*[^*]+\*\*|\*[^*]+\*|`[^`]+`|\[[0-9]+\]|\[[^\]]+\]\([^)]+\))/g;
	let last = 0;
	let match;
	let i = 0;
	while (match = re.exec(text)) {
		if (match.index > last) nodes.push(text.slice(last, match.index));
		const token = match[0];
		if (token.startsWith("**")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", { children: token.slice(2, -2) }, i++));
		else if (token.startsWith("*")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("em", { children: token.slice(1, -1) }, i++));
		else if (token.startsWith("`")) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
			className: "rounded-sm bg-elevated px-1 py-0.5 font-mono text-[0.85em] text-brand",
			children: token.slice(1, -1)
		}, i++));
		else if (/^\[[0-9]+\]$/.test(token)) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "mx-0.5 inline-flex size-4 translate-y-[-1px] items-center justify-center rounded-sm bg-brand-dim font-mono text-[10px] text-brand",
			children: token.slice(1, -1)
		}, i++));
		else {
			const m = token.match(/^\[([^\]]+)\]\(([^)]+)\)$/);
			if (m) nodes.push(/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
				href: m[2],
				className: "text-brand underline-offset-2 hover:underline",
				target: "_blank",
				rel: "noreferrer",
				children: m[1]
			}, i++));
			else nodes.push(token);
		}
		last = match.index + token.length;
	}
	if (last < text.length) nodes.push(text.slice(last));
	return nodes;
}
function MarkdownView({ text, className }) {
	const blocks = text.split(/\n{2,}/);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("space-y-3 text-[15px] leading-relaxed text-fg", className),
		children: blocks.map((block, bi) => {
			if (block.startsWith("```")) {
				const body = block.replace(/^```[a-z]*\n?/, "").replace(/```$/, "");
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
					className: "overflow-x-auto rounded-md bg-elevated p-3 font-mono text-xs text-fg",
					children: body
				}, bi);
			}
			const lines = block.split("\n");
			if (lines.every((l) => /^\s*[-*]\s+/.test(l))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
				className: "list-disc space-y-1 pl-5 text-fg",
				children: lines.map((l, li) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(l.replace(/^\s*[-*]\s+/, "")) }, li))
			}, bi);
			if (lines.every((l) => /^\s*\d+\.\s+/.test(l))) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("ol", {
				className: "list-decimal space-y-1 pl-5 text-fg",
				children: lines.map((l, li) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("li", { children: inline(l.replace(/^\s*\d+\.\s+/, "")) }, li))
			}, bi);
			const heading = block.match(/^(#{1,3})\s+(.*)$/);
			if (heading) {
				const Tag = heading[1].length === 1 ? "h3" : "h4";
				return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Tag, {
					className: "font-medium tracking-tight text-fg",
					children: inline(heading[2])
				}, bi);
			}
			return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "whitespace-pre-wrap",
				children: lines.map((line, li) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_react.Fragment, { children: [li > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}) : null, inline(line)] }, li))
			}, bi);
		})
	});
}
var ScrollArea = import_react.forwardRef(({ className, children, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Root, {
	ref,
	className: cn("relative overflow-hidden", className),
	...props,
	children: [
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Viewport, {
			className: "h-full w-full rounded-[inherit]",
			children
		}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollBar, {}),
		/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Corner, {})
	]
}));
ScrollArea.displayName = Root.displayName;
var ScrollBar = import_react.forwardRef(({ className, orientation = "vertical", ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaScrollbar, {
	ref,
	orientation,
	className: cn("flex touch-none select-none", orientation === "vertical" && "h-full w-2.5 border-l border-l-transparent p-px", orientation === "horizontal" && "h-2.5 flex-col border-t border-t-transparent p-px", className),
	...props,
	children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollAreaThumb, { className: "relative flex-1 rounded-full bg-border" })
}));
ScrollBar.displayName = ScrollAreaScrollbar.displayName;
var listConversations = createServerFn({ method: "GET" }).validator((orgId) => orgId).middleware([authMiddleware]).handler(createSsrRpc("3844233883584cbaeabe78ff26a43966cb0a497870447ee37427b401defa19ac"));
var getConversation = createServerFn({ method: "GET" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("4b381f2e8652dce49784deed56e792df295913ed47198cf36600e554739fdfaa"));
var createConversation = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("f3fea6d7088904610efc9749efcf3589af7d7ccf16c8f1bd40806671422670c9"));
var deleteConversation = createServerFn({ method: "POST" }).validator((input) => input).middleware([authMiddleware]).handler(createSsrRpc("bf0334773931e404a451ee40ab9efbef298a178d9421cb629862c70a736fde33"));
var askAssistant = createServerFn({ method: "POST" }).validator((input) => {
	const question = input.question.trim();
	if (question.length < 3) throw new Error("Ask a more complete question");
	if (question.length > 2e3) throw new Error("Question is too long");
	return {
		...input,
		question
	};
}).middleware([authMiddleware]).handler(createSsrRpc("d4e5f636d8c76c4d51757798cfab523e338e9bfd0fff2f03b9e2ab5018fc569d"));
function AssistantPage() {
	const { current } = useOrg();
	const search = Route$3.useSearch();
	const qc = useQueryClient();
	const [draft, setDraft] = (0, import_react.useState)("");
	const [kbId, setKbId] = (0, import_react.useState)("all");
	const [conversationId, setConversationId] = (0, import_react.useState)(search.c ?? null);
	const [optimistic, setOptimistic] = (0, import_react.useState)([]);
	const scroller = (0, import_react.useRef)(null);
	const askedRef = (0, import_react.useRef)(false);
	const kbs = useQuery({
		queryKey: ["kbs", current.id],
		queryFn: () => listKnowledgeBases({ data: current.id })
	});
	const convos = useQuery({
		queryKey: ["convos", current.id],
		queryFn: () => listConversations({ data: current.id })
	});
	const thread = useQuery({
		queryKey: [
			"thread",
			current.id,
			conversationId
		],
		queryFn: () => getConversation({ data: {
			orgId: current.id,
			conversationId
		} }),
		enabled: Boolean(conversationId)
	});
	const messages = (0, import_react.useMemo)(() => {
		const base = thread.data?.messages ?? [];
		const extras = optimistic.filter((m) => !base.some((b) => b.id === m.id));
		return [...base, ...extras];
	}, [thread.data, optimistic]);
	(0, import_react.useEffect)(() => {
		scroller.current?.scrollTo({
			top: scroller.current.scrollHeight,
			behavior: "smooth"
		});
	}, [messages.length]);
	const ensureConversation = async () => {
		if (conversationId) return conversationId;
		const created = await createConversation({ data: {
			orgId: current.id,
			kbId: kbId === "all" ? null : kbId
		} });
		setConversationId(created.id);
		await qc.invalidateQueries({ queryKey: ["convos", current.id] });
		return created.id;
	};
	const ask = useMutation({
		mutationFn: async (question) => {
			const id = await ensureConversation();
			return askAssistant({ data: {
				orgId: current.id,
				conversationId: id,
				question,
				kbId: kbId === "all" ? null : kbId
			} });
		},
		onSuccess: async (result) => {
			setOptimistic([result.userMessage, result.assistantMessage]);
			await qc.invalidateQueries({ queryKey: [
				"thread",
				current.id,
				conversationId
			] });
			await qc.invalidateQueries({ queryKey: ["convos", current.id] });
			await qc.invalidateQueries({ queryKey: ["dashboard", current.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	async function submit(question) {
		const q = question.trim();
		if (!q || ask.isPending) return;
		setDraft("");
		setOptimistic((prev) => [...prev, {
			id: `tmp_${Date.now()}`,
			role: "user",
			content: q,
			sources: [],
			createdAt: (/* @__PURE__ */ new Date()).toISOString()
		}]);
		await ask.mutateAsync(q);
	}
	(0, import_react.useEffect)(() => {
		if (search.q && !askedRef.current) {
			askedRef.current = true;
			submit(search.q);
		}
	}, [search.q]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex h-[calc(100dvh-7rem)] max-w-6xl gap-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("aside", {
			className: "hidden w-64 shrink-0 flex-col rounded-xl border border-border bg-card p-3 md:flex",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-between px-1",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-xs uppercase tracking-wide text-subtle",
					children: "Conversations"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					size: "sm",
					variant: "ghost",
					onClick: async () => {
						const created = await createConversation({ data: {
							orgId: current.id,
							kbId: kbId === "all" ? null : kbId
						} });
						setConversationId(created.id);
						setOptimistic([]);
						await qc.invalidateQueries({ queryKey: ["convos", current.id] });
					},
					children: "New"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ScrollArea, {
				className: "mt-2 flex-1",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "space-y-0.5",
					children: (convos.data ?? []).map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "group flex items-center gap-1",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							onClick: () => {
								setConversationId(c.id);
								setOptimistic([]);
							},
							className: cn("min-w-0 flex-1 truncate rounded-md px-2 py-2 text-left text-sm", c.id === conversationId ? "bg-elevated text-fg" : "text-muted hover:bg-elevated/60"),
							children: c.title
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "hidden text-subtle hover:text-danger group-hover:block",
							onClick: () => deleteConversation({ data: {
								orgId: current.id,
								conversationId: c.id
							} }).then(() => {
								if (conversationId === c.id) {
									setConversationId(null);
									setOptimistic([]);
								}
								qc.invalidateQueries({ queryKey: ["convos", current.id] });
							}),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-3.5" })
						})]
					}, c.id))
				})
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
			className: "flex min-w-0 flex-1 flex-col rounded-xl border border-border bg-card",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "flex flex-wrap items-center justify-between gap-3 border-b border-border px-4 py-3",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs uppercase tracking-[0.18em] text-subtle",
						children: "Assistant"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-display text-xl tracking-tight",
						children: "Ask Nexora"
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Select, {
						value: kbId,
						onValueChange: setKbId,
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectTrigger, {
							className: "w-[220px]",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectValue, { placeholder: "All knowledge" })
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SelectContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: "all",
							children: "All knowledge bases"
						}), (kbs.data ?? []).map((kb) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SelectItem, {
							value: kb.id,
							children: kb.name
						}, kb.id))] })]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					ref: scroller,
					className: "flex-1 space-y-6 overflow-y-auto px-4 py-6 sm:px-8",
					children: [messages.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EmptyState, { onPick: (q) => void submit(q) }) : messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Bubble, { message: m }, m.id)), ask.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Retrieving sources and writing an answer…"
					}) : null]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
					className: "border-t border-border p-3 sm:p-4",
					onSubmit: (e) => {
						e.preventDefault();
						submit(draft);
					},
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-end gap-2 rounded-lg border border-border bg-surface p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
							value: draft,
							onChange: (e) => setDraft(e.target.value),
							placeholder: "Ask Nexora…",
							rows: 2,
							className: "min-h-12 flex-1 resize-none bg-transparent px-2 py-2 text-sm text-fg placeholder:text-subtle focus:outline-none",
							onKeyDown: (e) => {
								if (e.key === "Enter" && !e.shiftKey) {
									e.preventDefault();
									submit(draft);
								}
							}
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							type: "submit",
							size: "icon",
							disabled: ask.isPending || !draft.trim(),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "size-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "sr-only",
								children: "Send"
							})]
						})]
					})
				})
			]
		})]
	});
}
function EmptyState({ onPick }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-lg py-10 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
				className: "font-display text-2xl tracking-tight",
				children: "How can I help?"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-sm text-muted",
				children: "Answers are grounded in this workspace’s documents and include citations."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-6 space-y-2",
				children: [
					"What's our refund process for enterprise customers?",
					"What should an engineer do when a production deployment fails?",
					"According to our onboarding SOP, what happens after a new employee joins?"
				].map((q) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					onClick: () => onPick(q),
					className: "block w-full rounded-md border border-border px-3 py-2 text-left text-sm text-muted hover:bg-elevated hover:text-fg",
					children: q
				}, q))
			})
		]
	});
}
function Bubble({ message }) {
	const mine = message.role === "user";
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex", mine ? "justify-end" : "justify-start"),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: cn("max-w-[min(42rem,100%)] space-y-3", mine && "text-right"),
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: cn("rounded-lg px-4 py-3 text-left", mine ? "bg-elevated text-fg" : "bg-transparent p-0"),
					children: mine ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm leading-relaxed",
						children: message.content
					}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(MarkdownView, { text: message.content })
				}),
				!mine && message.sources.length > 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex flex-wrap items-center gap-2",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "text-[11px] uppercase tracking-wide text-subtle",
							children: "Sources"
						}),
						message.sources.map((s) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/app/knowledge/$kbId",
							params: { kbId: s.kbId },
							className: "rounded-full border border-border px-2.5 py-1 font-mono text-[11px] text-muted hover:text-fg",
							title: s.excerpt,
							children: s.document
						}, s.documentId)),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							size: "icon-sm",
							variant: "ghost",
							onClick: () => {
								navigator.clipboard.writeText(message.content);
								toast.success("Copied");
							},
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Copy, { className: "size-3.5" })
						})
					]
				}) : null,
				!mine && message.sources.length === 0 && message.content ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					variant: "muted",
					children: "No sources"
				}) : null
			]
		})
	});
}
//#endregion
export { AssistantPage as component };
