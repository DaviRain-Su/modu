import { r as cn } from "./catalog-DJAw_Q2w.mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BookCover-CmaXp_VR.js
var import_jsx_runtime = require_jsx_runtime();
function BookCover({ book, className, size = "md" }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("relative shrink-0 overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-white/10", {
			sm: "w-16 aspect-[2/3] rounded-[var(--radius-sm)]",
			md: "w-28 aspect-[2/3] rounded-[var(--radius-md)]",
			lg: "w-36 aspect-[2/3] rounded-[var(--radius-lg)]",
			xl: "w-44 aspect-[2/3] rounded-[var(--radius-lg)]"
		}[size], className),
		style: { background: `linear-gradient(155deg, ${book.coverColor} 0%, color-mix(in oklab, ${book.coverColor} 70%, #000) 100%)` },
		"aria-hidden": true,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/35 to-transparent" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,white_2px,white_3px)]" }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "relative flex h-full flex-col justify-between p-3 sm:p-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "text-[10px] uppercase tracking-[0.18em] text-white/55",
					children: book.format
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "font-serif text-lg font-medium leading-snug tracking-tight text-white/95 sm:text-xl",
						children: book.coverText || book.title.slice(0, 2)
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-2 line-clamp-2 text-[11px] leading-snug text-white/65",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-1 text-[10px] text-white/45",
						children: book.author
					})
				] })]
			})
		]
	});
}
//#endregion
export { BookCover as t };
