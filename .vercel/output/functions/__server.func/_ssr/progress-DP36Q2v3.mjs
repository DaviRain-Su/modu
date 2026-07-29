import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { n as ProgressIndicator, t as Progress$1 } from "../_libs/radix-ui__react-progress.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/progress-DP36Q2v3.js
var import_jsx_runtime = require_jsx_runtime();
function Progress({ className, value, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress$1, {
		className: cn("relative h-1.5 w-full overflow-hidden rounded-full bg-bg-subtle", className),
		...props,
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ProgressIndicator, {
			className: "h-full w-full flex-1 rounded-full bg-accent transition-transform duration-300",
			style: { transform: `translateX(-${100 - (value || 0)}%)` }
		})
	});
}
//#endregion
export { Progress as t };
