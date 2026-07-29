import { o as __toESM } from "../_runtime.mjs";
import { r as formatCount } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { E as Flame, g as MessageSquareQuote } from "../_libs/lucide-react.mjs";
import { n as MARKET_BOOKS } from "./catalog-BpzRlWR9.mjs";
import { t as useLibraryStore } from "./library---StLbl3.mjs";
import { t as BookCover } from "./BookCover-BK7lziiY.mjs";
import { n as getHotBooks, r as getRecentPublicNotes } from "./social-DQ0kXiCx.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/rankings-DtyQBJRY.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function RankingsPage() {
	const getBook = useLibraryStore((s) => s.getBook);
	const [hot, setHot] = (0, import_react.useState)([]);
	const [notes, setNotes] = (0, import_react.useState)([]);
	const [ready, setReady] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		Promise.all([getHotBooks(), getRecentPublicNotes()]).then(([h, n]) => {
			setHot(h);
			setNotes(n);
		}).catch(() => {
			setHot([]);
			setNotes([]);
		}).finally(() => setReady(true));
	}, []);
	const displayHot = hot.length > 0 ? hot : MARKET_BOOKS.slice().sort((a, b) => b.readers - a.readers).slice(0, 8).map((b, i) => ({
		bookId: b.id,
		readCount: Math.round(b.readers / 1e3),
		annotationCount: 0,
		score: b.readers,
		seed: true
	}));
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-medium tracking-tight",
				children: "热门榜"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-1 text-fg-muted",
				children: "根据真实阅读与公开批注聚合 · 留言板展示社区洞见"
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Flame, { className: "h-4 w-4 text-accent" }),
					"热门书单",
					!ready && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "text-xs",
						children: "加载中…"
					})
				]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-2",
				children: displayHot.map((row, i) => {
					const book = getBook(row.bookId) ?? MARKET_BOOKS.find((b) => b.id === row.bookId);
					if (!book) return null;
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/book/$bookId",
						params: { bookId: book.id },
						className: "flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-3 transition-colors hover:bg-bg-subtle sm:gap-4 sm:p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-sm font-medium text-fg-muted",
								children: i + 1
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCover, {
								book,
								size: "sm"
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "min-w-0 flex-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
										className: "truncate font-medium",
										children: book.title
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
										className: "truncate text-sm text-fg-muted",
										children: book.author
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
										className: "mt-1 flex flex-wrap gap-2 text-xs text-fg-subtle",
										children: [
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["阅读 ", formatCount(row.readCount)] }),
											/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["批注 ", row.annotationCount] }),
											"seed" in row && row.seed ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
												variant: "outline",
												children: "预热榜"
											}) : null
										]
									})
								]
							})
						]
					}, row.bookId);
				})
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MessageSquareQuote, { className: "h-4 w-4 text-accent" }), "留言板 · 公开批注"]
			}), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[var(--radius-xl)] border border-dashed border-border px-6 py-12 text-center text-sm text-fg-muted",
				children: "还没有公开批注。登录后在阅读器中选中文字，即可画线并留下注释。"
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: notes.map((n) => {
					const book = getBook(n.bookId) ?? MARKET_BOOKS.find((b) => b.id === n.bookId);
					return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex flex-wrap items-center gap-2 text-xs text-fg-subtle",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/u/$userId",
										params: { userId: n.userId },
										className: "font-medium text-fg hover:underline",
										children: n.displayName
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: "/book/$bookId",
										params: { bookId: n.bookId },
										className: "hover:underline",
										children: book?.title ?? n.bookId
									})
								]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
								className: "mt-2 border-l-2 border-accent/50 pl-3 text-sm text-fg-muted",
								children: n.quote
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mt-2 text-sm leading-relaxed",
								children: n.note
							})
						]
					}, n.id);
				})
			})] })
		]
	});
}
//#endregion
export { RankingsPage as component };
