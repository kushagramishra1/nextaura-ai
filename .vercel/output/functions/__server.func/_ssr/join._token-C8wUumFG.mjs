import { o as __toESM } from "../_runtime.mjs";
import { u as require_react } from "../_libs/@floating-ui/react-dom+[...].mjs";
import { b as useNavigate, v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { i as Route$6 } from "./router-BwAUY0N6.mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { n as BrandWordmark } from "./brand-mark-BqZkbl1N.mjs";
import { t as acceptInvite } from "./org.functions-G2GHLnEi.mjs";
import { n as useCurrentUserState } from "./use-current-user-ClOiUQ-z.mjs";
import { t as RedirectToSignIn } from "./gates-B2yXkwo7.mjs";
import { n as writeStoredOrgId } from "./org-store-QHioi4SZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/join._token-C8wUumFG.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function Join() {
	const { token } = Route$6.useParams();
	const { user, isPending } = useCurrentUserState();
	const navigate = useNavigate();
	const [busy, setBusy] = (0, import_react.useState)(false);
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "min-h-dvh bg-bg" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function join() {
		setBusy(true);
		try {
			const result = await acceptInvite({ data: token });
			writeStoredOrgId(result.orgId);
			await navigate({ to: "/app" });
		} catch (err) {
			toast.error(err instanceof Error ? err.message : "Invite failed");
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-dvh max-w-md flex-col justify-center px-4",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandWordmark, {}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "mt-10 font-display text-4xl tracking-tight",
				children: "Join workspace"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-3 text-muted",
				children: "This invite adds you to an existing Nexora organization with the role the owner selected."
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				className: "mt-8",
				onClick: join,
				disabled: busy,
				children: busy ? "Joining…" : "Accept invite"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/",
				className: "mt-4 text-sm text-muted hover:text-fg",
				children: "Cancel"
			})
		]
	});
}
//#endregion
export { Join as component };
