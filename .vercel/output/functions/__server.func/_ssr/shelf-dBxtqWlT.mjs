import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DffftdNv.mjs";
import { N as BookMarked, i as Upload } from "../_libs/lucide-react.mjs";
import { t as useLibraryStore } from "./library---StLbl3.mjs";
import { t as BookCard } from "./BookCard-BeYXM9-U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/shelf-dBxtqWlT.js
var import_jsx_runtime = require_jsx_runtime();
function ShelfPage() {
	const ready = useLibraryStore((s) => s.ready);
	const shelfBooks = useLibraryStore((s) => s.shelfBooks);
	const books = ready ? shelfBooks() : [];
	const reading = books.filter((b) => (b.progress ?? 0) > 0 && (b.progress ?? 0) < 100);
	const rest = books.filter((b) => !reading.includes(b));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-medium tracking-tight",
				children: "书架"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-fg-muted",
				children: ready ? `${books.length} 本藏书 · 进度保存在本机` : "加载中…"
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					variant: "secondary",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/library",
						children: "去书城"
					})
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					asChild: true,
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/upload",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "上传"]
					})
				})]
			})]
		}), !ready ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" }) : books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-border px-6 py-20 text-center",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-subtle",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookMarked, { className: "h-5 w-5 text-fg-muted" })
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "text-lg font-medium",
					children: "书架还是空的"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 max-w-sm text-sm text-fg-muted",
					children: "从书城添加精选读物，或上传你的 PDF / EPUB，开始第一段阅读。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mt-6 flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/library",
							children: "逛书城"
						})
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						variant: "outline",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/upload",
							children: "上传图书"
						})
					})]
				})
			]
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [reading.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-medium text-fg-muted",
			children: "继续阅读"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
			children: reading.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, {
				book: b,
				showProgress: true
			}, b.id))
		})] }), rest.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-medium text-fg-muted",
			children: reading.length > 0 ? "全部藏书" : "我的藏书"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4",
			children: rest.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, {
				book: b,
				showProgress: true
			}, b.id))
		})] })] })]
	});
}
//#endregion
export { ShelfPage as component };
