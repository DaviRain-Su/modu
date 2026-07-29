import { r as formatCount, t as cn } from "./utils-D0dWsYTS.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { o as Star } from "../_libs/lucide-react.mjs";
import { t as BookCover } from "./BookCover-BK7lziiY.mjs";
import { t as Progress } from "./progress-DP36Q2v3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/BookCard-BeYXM9-U.js
var import_jsx_runtime = require_jsx_runtime();
function BookCard({ book, showProgress, className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/book/$bookId",
		params: { bookId: book.id },
		className: cn("group flex flex-col gap-3 rounded-[var(--radius-xl)] p-2 transition-colors hover:bg-bg-subtle/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring", className),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex justify-center",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCover, {
				book,
				size: "md",
				className: "transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.02]"
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 px-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
					className: "line-clamp-2 text-sm font-medium leading-snug tracking-tight",
					children: book.title
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 truncate text-xs text-fg-muted",
					children: book.author
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex items-center gap-2 text-[11px] text-fg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "inline-flex items-center gap-0.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-accent/80 text-accent" }), book.rating.toFixed(1)]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatCount(book.readers), " 人在读"] })]
				}),
				showProgress && typeof book.progress === "number" && book.progress > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 space-y-1",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: book.progress }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "text-[11px] text-fg-subtle",
						children: [
							"已读 ",
							Math.round(book.progress),
							"%"
						]
					})]
				}),
				book.source === "upload" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
					className: "mt-2",
					variant: "accent",
					children: "我的上传"
				})
			]
		})]
	});
}
function BookRow({ book }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
		to: "/book/$bookId",
		params: { bookId: book.id },
		className: "flex gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-3 transition-colors hover:bg-bg-subtle sm:p-4",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCover, {
			book,
			size: "sm"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "min-w-0 flex-1",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
						className: "font-medium tracking-tight",
						children: book.title
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-0.5 text-sm text-fg-muted",
						children: book.author
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "outline",
						children: book.category
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 line-clamp-2 text-sm text-fg-subtle",
					children: book.description
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-subtle",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
							className: "inline-flex items-center gap-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-3 w-3 fill-accent/80 text-accent" }), book.rating.toFixed(1)]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatCount(book.readers), " 人在读"] }),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "uppercase",
							children: book.format
						})
					]
				})
			]
		})]
	});
}
//#endregion
export { BookRow as n, BookCard as t };
