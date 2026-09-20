import { o as __toESM } from "./_runtime.mjs";
import { u as require_react } from "./_libs/@floating-ui/react-dom+[...].mjs";
import { v as Link } from "./_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "./_libs/@radix-ui/react-collection+[...].mjs";
import { a as Trash2, g as FileUp } from "./_libs/lucide-react.mjs";
import { i as useQueryClient, n as useQuery, t as useMutation } from "./_libs/tanstack__react-query.mjs";
import { n as toast } from "./_libs/sonner.mjs";
import { a as bytesLabel, c as formatDateTime, n as Route$1 } from "./_ssr/router-BwAUY0N6.mjs";
import { t as Badge } from "./_ssr/badge-DaNip6LT.mjs";
import { t as Button } from "./_ssr/button-D7-xVTai.mjs";
import { t as Card } from "./_ssr/card-aNnacrIm.mjs";
import { n as Label, t as Input } from "./_ssr/label-SVGqMCUO.mjs";
import { n as useOrg } from "./_ssr/org-context--gmzFBQI.mjs";
import { a as getKnowledgeBase, i as getDocument, n as deleteDocument, o as ingestDocument, s as listDocuments } from "./_ssr/knowledge.functions-BI8TxcJS.mjs";
import { t as Skeleton } from "./_ssr/skeleton-BrA-l3za.mjs";
import { a as DialogHeader, i as DialogFooter, n as DialogContent, o as DialogTitle, r as DialogDescription, s as Textarea, t as Dialog } from "./_ssr/textarea-nO52PCx-.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/_kbId-C5iDHH7W.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var ACCEPTED_UPLOADS = ".pdf,.docx,.txt,.md,.markdown";
var STATUS_VARIANT = {
	ready: "success",
	failed: "danger",
	processing: "warn",
	indexing: "warn",
	uploading: "muted"
};
function KnowledgeDetail() {
	const { kbId } = Route$1.useParams();
	const { current } = useOrg();
	const qc = useQueryClient();
	const [uploadOpen, setUploadOpen] = (0, import_react.useState)(false);
	const [pasteOpen, setPasteOpen] = (0, import_react.useState)(false);
	const [title, setTitle] = (0, import_react.useState)("");
	const [pasted, setPasted] = (0, import_react.useState)("");
	const [previewId, setPreviewId] = (0, import_react.useState)(null);
	const kb = useQuery({
		queryKey: [
			"kb",
			current.id,
			kbId
		],
		queryFn: () => getKnowledgeBase({ data: {
			orgId: current.id,
			kbId
		} })
	});
	const docs = useQuery({
		queryKey: [
			"docs",
			current.id,
			kbId
		],
		queryFn: () => listDocuments({ data: {
			orgId: current.id,
			kbId
		} })
	});
	const preview = useQuery({
		queryKey: [
			"doc",
			current.id,
			previewId
		],
		queryFn: () => getDocument({ data: {
			orgId: current.id,
			documentId: previewId
		} }),
		enabled: Boolean(previewId)
	});
	const ingest = useMutation({
		mutationFn: (input) => ingestDocument({ data: input }),
		onSuccess: async () => {
			toast.success("Document indexed");
			setUploadOpen(false);
			setPasteOpen(false);
			setTitle("");
			setPasted("");
			await qc.invalidateQueries({ queryKey: [
				"docs",
				current.id,
				kbId
			] });
			await qc.invalidateQueries({ queryKey: ["kbs", current.id] });
		},
		onError: (e) => toast.error(e.message)
	});
	const remove = useMutation({
		mutationFn: (documentId) => deleteDocument({ data: {
			orgId: current.id,
			documentId
		} }),
		onSuccess: () => qc.invalidateQueries({ queryKey: [
			"docs",
			current.id,
			kbId
		] }),
		onError: (e) => toast.error(e.message)
	});
	async function onFiles(files) {
		if (!files?.length) return;
		for (const file of Array.from(files)) {
			const buf = await file.arrayBuffer();
			const bytes = new Uint8Array(buf);
			let binary = "";
			for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]);
			ingest.mutate({
				orgId: current.id,
				kbId,
				filename: file.name,
				mimeType: file.type || "application/octet-stream",
				contentBase64: btoa(binary)
			});
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-5xl",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/app/knowledge",
				className: "text-sm text-muted hover:text-fg",
				children: "Knowledge"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-2 flex flex-wrap items-end justify-between gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-display text-3xl tracking-tight",
					children: kb.data?.name ?? "Knowledge base"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-sm text-muted",
					children: kb.data?.description
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						variant: "outline",
						onClick: () => setPasteOpen(true),
						children: "Paste text"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
						onClick: () => setUploadOpen(true),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "size-4" }), "Upload"]
					})]
				})]
			}),
			docs.isLoading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Skeleton, { className: "mt-8 h-40" }) : (docs.data ?? []).length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Card, {
				className: "mt-8 p-10 text-center",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm text-muted",
					children: "No documents yet. Upload a policy or paste a SOP."
				})
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mt-8 divide-y divide-border rounded-xl border border-border bg-card",
				children: (docs.data ?? []).map((doc) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-4 px-4 py-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: "min-w-0 flex-1 text-left",
							onClick: () => setPreviewId(doc.id),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: doc.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "truncate font-mono text-xs text-subtle",
								children: [
									doc.filename,
									" · ",
									bytesLabel(doc.sizeBytes),
									" · ",
									doc.chunkCount,
									" chunks"
								]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: STATUS_VARIANT[doc.status] ?? "muted",
							children: doc.status
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "hidden text-xs text-subtle sm:block",
							children: formatDateTime(doc.createdAt)
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
							type: "button",
							className: "text-subtle hover:text-danger",
							onClick: () => remove.mutate(doc.id),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "size-4" })
						})
					]
				}, doc.id))
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: uploadOpen,
				onOpenChange: setUploadOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Upload documents" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "PDF, DOCX, Markdown, or TXT. Max 2 MB each." })] }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
						className: "flex min-h-40 cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-elevated text-sm text-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "mb-2 size-6 text-brand" }),
							"Drop files or click to browse",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ACCEPTED_UPLOADS,
								multiple: true,
								className: "hidden",
								onChange: (e) => void onFiles(e.target.files)
							})
						]
					}),
					ingest.isPending ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-sm text-muted",
						children: "Extracting and indexing…"
					}) : null
				] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: pasteOpen,
				onOpenChange: setPasteOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: "Paste a document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: "Useful for SOPs that live in Notion or Google Docs." })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
					className: "space-y-3",
					onSubmit: (e) => {
						e.preventDefault();
						ingest.mutate({
							orgId: current.id,
							kbId,
							filename: `${title || "note"}.md`,
							mimeType: "text/markdown",
							pastedText: pasted,
							title
						});
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "title",
								children: "Title"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
								id: "title",
								value: title,
								onChange: (e) => setTitle(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "space-y-1.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
								htmlFor: "body",
								children: "Content"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
								id: "body",
								className: "min-h-40",
								value: pasted,
								onChange: (e) => setPasted(e.target.value),
								required: true
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogFooter, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							type: "submit",
							disabled: ingest.isPending,
							children: ingest.isPending ? "Indexing…" : "Index"
						}) })
					]
				})] })
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Dialog, {
				open: Boolean(previewId),
				onOpenChange: (o) => !o && setPreviewId(null),
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
					className: "max-w-2xl",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, { children: preview.data?.title ?? "Document" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogDescription, { children: preview.data?.filename })] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("pre", {
						className: "max-h-[50vh] overflow-auto whitespace-pre-wrap rounded-md bg-elevated p-4 font-sans text-sm leading-relaxed",
						children: preview.data?.content
					})]
				})
			})
		]
	});
}
//#endregion
export { KnowledgeDetail as component };
