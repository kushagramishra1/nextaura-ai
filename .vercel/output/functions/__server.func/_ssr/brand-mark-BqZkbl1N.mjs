import { s as require_jsx_runtime } from "../_libs/@radix-ui/react-collection+[...].mjs";
import { o as cn } from "./router-BwAUY0N6.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/brand-mark-BqZkbl1N.js
var import_jsx_runtime = require_jsx_runtime();
function BrandMark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		viewBox: "0 0 32 32",
		className: cn("size-7", className),
		"aria-hidden": "true",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
				width: "32",
				height: "32",
				rx: "8",
				fill: "currentColor",
				className: "text-brand"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M9 21.5V10.5h3.1l4.2 6.6V10.5H19.5V21.5h-3.1l-4.2-6.6v6.6H9z",
				fill: "#0b0d0c"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "23.2",
				cy: "11.2",
				r: "1.5",
				fill: "#0b0d0c"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("circle", {
				cx: "23.2",
				cy: "20.8",
				r: "1.5",
				fill: "#0b0d0c"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				d: "M23.2 12.7v6.4",
				stroke: "#0b0d0c",
				strokeWidth: "1.2"
			})
		]
	});
}
function BrandWordmark({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
		className: cn("flex items-center gap-2.5 text-fg", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BrandMark, {}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
			className: "font-display text-xl tracking-tight",
			children: "Nexora"
		})]
	});
}
//#endregion
export { BrandWordmark as n, BrandMark as t };
