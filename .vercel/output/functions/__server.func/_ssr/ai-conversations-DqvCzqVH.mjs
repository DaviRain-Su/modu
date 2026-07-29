import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CHxE_ZiV.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-conversations-DqvCzqVH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-[88px] w-full rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3 py-2 text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
var listMyConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(createSsrRpc("6fefea7c5a61163a3c2d6eb46986f0dc76c7cefb74fd62a2eff55ec3493054cd"));
var getMyConversation = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id.trim()).handler(createSsrRpc("b9146f1e5a21785371bed7f8711dab0c9c1ac66dcb28aaae11e93ee3ea999b47"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id.trim()).handler(createSsrRpc("bd6d4ac2829137909f63c0378644abcf6f45320608ee557ca1f322402f849f07"));
//#endregion
export { getMyConversation as n, listMyConversations as r, Textarea as t };
