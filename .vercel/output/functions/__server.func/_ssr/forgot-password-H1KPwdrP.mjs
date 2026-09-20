import { v as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as Button } from "./button-D7-xVTai.mjs";
import { t as AuthFrame } from "./auth-frame-B0tM8_eW.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/forgot-password-H1KPwdrP.js
var import_jsx_runtime = require_jsx_runtime();
function ForgotPassword() {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthFrame, {
		title: "Reset password",
		subtitle: "Email recovery is not enabled in this workspace. Use Google or X, or sign in if you still have the password.",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "space-y-3",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "text-sm leading-relaxed text-muted",
					children: "Nexora signs in with Google, X, or an email and password stored in this app. There is no outbound mailer, so we cannot send a reset link."
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/login",
						children: "Back to sign in"
					})
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "outline",
					className: "w-full",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/register",
						children: "Create a new account"
					})
				})
			]
		})
	});
}
//#endregion
export { ForgotPassword as component };
