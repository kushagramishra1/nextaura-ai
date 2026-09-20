import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { n as Label, t as Input } from "./label-SVGqMCUO.mjs";
import { n as BrandWordmark } from "./brand-mark-BqZkbl1N.mjs";
import { i as createOrganization } from "./org.functions-G2GHLnEi.mjs";
import { n as useCurrentUserState } from "./use-current-user-ClOiUQ-z.mjs";
import { t as RedirectToSignIn } from "./gates-B2yXkwo7.mjs";
import { n as writeStoredOrgId } from "./org-store-QHioi4SZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/onboarding-tyfdGjDN.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Onboarding() {
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function onSubmit(e) {
		e.preventDefault();
		const form = new FormData(e.currentTarget);
		const workspaceName = String(form.get("name") ?? "").trim();
		if (workspaceName.length < 2) {
			toast.error("Workspace name is too short");
			return;
		}
		setBusy(true);
		try {
			const org = await createOrganization({ data: { name: workspaceName } });
			writeStoredOrgId(org.id);
			await navigate({ to: "/app" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Could not create workspace");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-lg flex-col justify-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWordmark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-10 font-display text-4xl tracking-tight",
				children: "Name the workspace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "We’ll provision HR, engineering, and support knowledge bases with sample policies so you can ask real questions immediately."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
				onSubmit,
				className: "mt-8 space-y-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "space-y-1.5",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Label, {
						htmlFor: "org",
						children: "Company or team"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						id: "org",
						name: "name",
						placeholder: "Acme Corporation",
						value: name,
						onChange: (e) => setName(e.target.value),
						required: true,
						minLength: 2
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					type: "submit",
					disabled: busy,
					className: "w-full",
					children: busy ? "Indexing sample knowledge…" : "Create workspace"
				})]
			})
		]
	});
}
//#endregion
export { Onboarding as component };
