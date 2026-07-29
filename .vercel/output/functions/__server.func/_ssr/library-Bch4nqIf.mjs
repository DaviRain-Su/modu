import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Input } from "./input-C-9hCiFR.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { d as Search } from "../_libs/lucide-react.mjs";
import { n as MARKET_BOOKS, t as CATEGORIES } from "./catalog-BpzRlWR9.mjs";
import { n as BookRow, t as BookCard } from "./BookCard-BeYXM9-U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library-Bch4nqIf.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function LibraryPage() {
	const [q, setQ] = (0, import_react.useState)("");
	const [cat, setCat] = (0, import_react.useState)("全部");
	const [view, setView] = (0, import_react.useState)("grid");
	const books = (0, import_react.useMemo)(() => {
		const query = q.trim().toLowerCase();
		return MARKET_BOOKS.filter((b) => {
			if (cat !== "全部" && b.category !== cat) return false;
			if (!query) return true;
			return b.title.toLowerCase().includes(query) || b.author.toLowerCase().includes(query) || b.tags.some((t) => t.toLowerCase().includes(query)) || b.description.toLowerCase().includes(query);
		});
	}, [q, cat]);
	const hot = MARKET_BOOKS.slice().sort((a, b) => b.readers - a.readers).slice(0, 3);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
					className: "font-serif text-3xl font-medium tracking-tight",
					children: "书城"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-fg-muted",
					children: "发现好书，加入书架，随时开读"
				})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative w-full sm:max-w-xs",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Search, { className: "pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
						value: q,
						onChange: (e) => setQ(e.target.value),
						placeholder: "搜索书名、作者、标签…",
						className: "pl-9"
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mb-3 flex items-center justify-between",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-sm font-medium text-fg-muted",
						children: "热门在读"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Badge, {
						variant: "outline",
						children: [MARKET_BOOKS.length, " 本上架"]
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: hot.map((b, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex items-center gap-3 rounded-[var(--radius-lg)] bg-bg-subtle/60 p-2",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "flex h-8 w-8 items-center justify-center rounded-full bg-bg text-sm font-medium text-fg-muted",
							children: i + 1
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: b.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-xs text-fg-subtle",
								children: b.author
							})]
						})]
					}, b.id))
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-2 overflow-x-auto hide-scrollbar pb-1",
					children: CATEGORIES.map((c) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setCat(c),
						className: cn("shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors", cat === c ? "border-primary bg-primary text-primary-fg" : "border-border bg-bg-elevated text-fg-muted hover:text-fg"),
						children: c
					}, c))
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex gap-1 self-end rounded-[var(--radius-md)] border border-border p-1",
					children: [["grid", "封面"], ["list", "列表"]].map(([k, label]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						onClick: () => setView(k),
						className: cn("rounded-[var(--radius-sm)] px-3 py-1.5 text-xs", view === k ? "bg-bg-subtle text-fg" : "text-fg-muted"),
						children: label
					}, k))
				})]
			}),
			books.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "rounded-[var(--radius-xl)] border border-dashed border-border py-16 text-center text-fg-muted",
				children: "没有匹配的图书，试试其他关键词"
			}) : view === "grid" ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4",
				children: books.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { book: b }, b.id))
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "space-y-3",
				children: books.map((b) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookRow, { book: b }, b.id))
			})
		]
	});
}
//#endregion
export { LibraryPage as component };
