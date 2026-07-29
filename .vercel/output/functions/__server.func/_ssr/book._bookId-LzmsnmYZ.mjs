import { a as formatCount, i as formatBytes } from "./catalog-DJAw_Q2w.mjs";
import { t as useLibraryStore } from "./library-CletUrRH.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route } from "./book._bookId-DGK1AwIE.mjs";
import { t as BookCover } from "./BookCover-CmaXp_VR.mjs";
import { t as Button } from "./button-TVeO48pu.mjs";
import { t as Badge } from "./badge-CzGSUs9X.mjs";
import { t as Progress } from "./progress-CzjhnBQG.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { C as Clock, E as BookOpen, T as Check, i as Star, n as Upload, r as Trash2 } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/book._bookId-LzmsnmYZ.js
var import_jsx_runtime = require_jsx_runtime();
function BookDetailPage() {
	const { bookId } = Route.useParams();
	const navigate = useNavigate();
	const ready = useLibraryStore((s) => s.ready);
	const getBook = useLibraryStore((s) => s.getBook);
	const isOnShelf = useLibraryStore((s) => s.isOnShelf);
	const addToShelf = useLibraryStore((s) => s.addToShelf);
	const removeFromShelf = useLibraryStore((s) => s.removeFromShelf);
	const getProgress = useLibraryStore((s) => s.getProgress);
	const book = getBook(bookId);
	const progress = getProgress(bookId);
	const onShelf = isOnShelf(bookId);
	if (ready && !book) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-20 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-medium",
				children: "未找到图书"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-fg-muted",
				children: "它可能已从书架移除，或链接无效。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/library",
					children: "返回书城"
				})
			})
		]
	});
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-64 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" });
	const pct = progress?.progress ?? book.progress ?? 0;
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-10",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-col gap-8 sm:flex-row sm:gap-10",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto sm:mx-0",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCover, {
					book,
					size: "xl"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-w-0 flex-1",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "flex flex-wrap gap-2",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "outline",
								children: book.category
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "accent",
								children: book.format.toUpperCase()
							}),
							book.source === "upload" && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, { children: "我的上传" })
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl",
						children: book.title
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-fg-muted",
						children: book.author
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-4 flex flex-wrap items-center gap-4 text-sm text-fg-subtle",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Star, { className: "h-4 w-4 fill-accent/80 text-accent" }), book.rating.toFixed(1)]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [formatCount(book.readers), " 人在读"] }),
							book.fileSize ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-3.5 w-3.5" }), formatBytes(book.fileSize)]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
								className: "inline-flex items-center gap-1",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Clock, { className: "h-3.5 w-3.5" }),
									"约",
									" ",
									Math.max(1, Math.round(book.wordCount / 500)),
									" 分钟"
								]
							})
						]
					}),
					pct > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-5 max-w-md space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex justify-between text-xs text-fg-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "阅读进度" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: [Math.round(pct), "%"] })]
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, { value: pct })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-6 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base",
						children: book.description
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mt-4 flex flex-wrap gap-2",
						children: book.tags.map((t) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "default",
							children: t
						}, t))
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-8 flex flex-wrap gap-3",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								onClick: () => {
									if (!onShelf) addToShelf(book.id);
									navigate({
										to: "/read/$bookId",
										params: { bookId: book.id }
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-4 w-4" }), pct > 0 ? "继续阅读" : "开始阅读"]
							}),
							onShelf ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: "secondary",
								onClick: () => {
									toast.success("已在书架");
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Check, { className: "h-4 w-4" }), "已加书架"]
							}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								size: "lg",
								variant: "secondary",
								onClick: () => {
									addToShelf(book.id);
									toast.success("已加入书架");
								},
								children: "加入书架"
							}),
							book.source === "upload" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								size: "lg",
								variant: "danger",
								onClick: () => {
									removeFromShelf(book.id).then(() => {
										toast.success("已删除上传图书");
										navigate({ to: "/shelf" });
									});
								},
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Trash2, { className: "h-4 w-4" }), "删除"]
							})
						]
					})
				]
			})]
		}), book.chapters && book.chapters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-4 text-lg font-medium tracking-tight",
			children: "目录"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "divide-y divide-border overflow-hidden rounded-[var(--radius-xl)] border border-border",
			children: book.chapters.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
				to: "/read/$bookId",
				params: { bookId: book.id },
				search: { chapter: ch.id },
				className: "flex items-center justify-between gap-4 bg-bg-elevated px-4 py-3.5 transition-colors hover:bg-bg-subtle sm:px-5",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "text-sm",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
						className: "mr-3 text-fg-subtle",
						children: i + 1
					}), ch.title]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "text-xs text-fg-subtle",
					children: "阅读"
				})]
			}, ch.id))
		})] })]
	});
}
//#endregion
export { BookDetailPage as component };
