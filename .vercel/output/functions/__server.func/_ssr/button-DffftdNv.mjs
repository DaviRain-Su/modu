import { o as __toESM } from "../_runtime.mjs";
import { t as cva } from "../_libs/class-variance-authority+clsx.mjs";
import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { c as Slot } from "../_libs/@radix-ui/react-dialog+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/button-DffftdNv.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var buttonVariants = cva("inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-[var(--radius-md)] text-sm font-medium transition-[opacity,transform,background-color,color,border-color] duration-150 disabled:pointer-events-none disabled:opacity-45 outline-none focus-visible:ring-2 focus-visible:ring-ring active:scale-[0.98]", {
	variants: {
		variant: {
			default: "bg-primary text-primary-fg hover:opacity-90",
			secondary: "bg-bg-subtle text-fg border border-border hover:bg-bg-hover",
			outline: "border border-border-strong bg-transparent text-fg hover:bg-bg-subtle",
			ghost: "text-fg-muted hover:bg-bg-subtle hover:text-fg",
			soft: "bg-accent/15 text-accent hover:bg-accent/25",
			danger: "bg-danger/15 text-danger hover:bg-danger/25",
			paper: "bg-paper text-paper-fg hover:opacity-95"
		},
		size: {
			default: "h-11 px-4",
			sm: "h-9 rounded-[var(--radius-sm)] px-3 text-xs",
			lg: "h-12 rounded-[var(--radius-lg)] px-6 text-base",
			icon: "h-11 w-11",
			"icon-sm": "h-9 w-9 rounded-[var(--radius-sm)]"
		}
	},
	defaultVariants: {
		variant: "default",
		size: "default"
	}
});
var Button = import_react.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(asChild ? Slot : "button", {
		className: cn(buttonVariants({
			variant,
			size,
			className
		})),
		ref,
		...props
	});
});
Button.displayName = "Button";
//#endregion
export { Button as t };
