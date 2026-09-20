import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { o as cn } from "./router-BwAUY0N6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/badge-DaNip6LT.js
var import_jsx_runtime = require_jsx_runtime();
var badgeVariants = cva("inline-flex items-center rounded-full border px-2 py-0.5 text-[11px] font-medium tracking-wide", {
	variants: { variant: {
		default: "border-transparent bg-brand-dim text-brand",
		outline: "border-border text-muted",
		success: "border-transparent bg-brand-dim text-ok",
		warn: "border-transparent bg-[#2a2418] text-warn",
		danger: "border-transparent bg-[#2a1818] text-danger",
		muted: "border-transparent bg-elevated text-muted"
	} },
	defaultVariants: { variant: "default" }
});
function Badge({ className, variant, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn(badgeVariants({ variant }), className),
		...props
	});
}
//#endregion
export { Badge as t };
