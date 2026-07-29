import { n as MARKET_BOOKS } from "./catalog-DJAw_Q2w.mjs";
import { n as describeStorage } from "./r2-Cy3jOD0T.mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-TVeO48pu.mjs";
import { t as Badge } from "./badge-CzGSUs9X.mjs";
import { E as BookOpen, O as ArrowRight, S as Cloud, a as Sparkles, n as Upload, o as Smartphone } from "../_libs/lucide-react.mjs";
import { t as BookCard } from "./BookCard-BNMs4J10.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-BidKI8wc.js
var import_jsx_runtime = require_jsx_runtime();
function LandingPage() {
	const featured = MARKET_BOOKS.slice(0, 4);
	const storage = describeStorage();
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "space-y-16 sm:space-y-24",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-bg-elevated px-6 py-12 sm:px-12 sm:py-16",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "pointer-events-none absolute inset-0 opacity-40",
					style: { background: "radial-gradient(ellipse 70% 50% at 80% 0%, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 70%)" }
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
							variant: "accent",
							className: "mb-5",
							children: "在线阅读 · PDF / EPUB · AI 伴读"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("h1", {
							className: "max-w-xl text-balance font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]",
							children: [
								"把世界装进口袋，",
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("br", {}),
								"也装进一段安静的光。"
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg",
							children: "墨读是面向手机与电脑的在线阅读器：书城发现好书，一键加入书架；支持上传 PDF / EPUB；阅读时随时唤起 AI 解释、摘要与笔记。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-8 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/library",
									children: ["进入书城", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "secondary",
								size: "lg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
									to: "/upload",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "上传图书"]
								})
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-6 text-xs text-fg-subtle",
							children: [
								"存储：",
								storage.label,
								" — ",
								storage.detail
							]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4",
						children: featured.map((book, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: cnLift(i),
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { book })
						}, book.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-medium tracking-tight sm:text-3xl",
					children: "为认真阅读而设计"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-fg-muted",
					children: "从发现到精读，完整链路都在一个产品里。"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-4",
				children: [
					{
						icon: BookOpen,
						title: "书城与书架",
						desc: "精选书目随时加入书架，进度自动同步到本机。"
					},
					{
						icon: Upload,
						title: "PDF / EPUB",
						desc: "上传个人藏书，浏览器内沉浸阅读，无需安装客户端。"
					},
					{
						icon: Sparkles,
						title: "AI 伴读",
						desc: "选中句子即可解释、摘要、翻译或生成读书洞见。"
					},
					{
						icon: Cloud,
						title: "Cloudflare 存储",
						desc: "对象存储抽象对接 R2，文件按 books/ 路径结构化存放。"
					}
				].map(({ icon: Icon, title, desc }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-bg-subtle",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-5 w-5 text-accent",
								strokeWidth: 1.6
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h3", {
							className: "font-medium tracking-tight",
							children: title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-fg-muted",
							children: desc
						})
					]
				}, title))
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("section", {
				className: "rounded-[var(--radius-2xl)] border border-border bg-bg-elevated p-6 sm:p-10",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid items-center gap-8 lg:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mb-3 inline-flex items-center gap-2 text-sm text-fg-muted",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Smartphone, { className: "h-4 w-4" }), "手机与 Web 自适应"]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-medium tracking-tight sm:text-3xl",
							children: "通勤路上，或深夜桌前"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-fg-muted leading-relaxed",
							children: "底部导航与大触控目标为拇指而设；宽屏下阅读区与 AI 侧栏并排。字号、行距、纸张/羊皮纸/夜间主题随时切换。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/shelf",
									children: "我的书架"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/book/$bookId",
									params: { bookId: featured[0].id },
									children: "试读精选"
								})
							})]
						})
					] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "rounded-[var(--radius-xl)] border border-border bg-bg p-4 sm:p-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "rounded-[var(--radius-lg)] bg-paper px-5 py-6 text-paper-fg shadow-[var(--shadow-soft)]",
							children: [
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
									className: "text-[11px] tracking-[0.14em] text-paper-muted uppercase",
									children: "试读片段"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
									className: "mt-3 font-serif text-[15px] leading-[1.85]",
									children: [MARKET_BOOKS[0].chapters?.[0]?.content.slice(0, 160), "…"]
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
									className: "mt-5 flex items-center justify-between border-t border-paper-line pt-4 text-xs text-paper-muted",
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "纸张主题" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "AI 可解释选中文字" })]
								})
							]
						})
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", {
				className: "pb-4 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "font-serif text-2xl font-medium tracking-tight",
						children: "现在就开始读"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mx-auto mt-2 max-w-md text-fg-muted",
						children: "无需安装。打开书城，或把你的 PDF / EPUB 丢进墨读。"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						asChild: true,
						size: "lg",
						className: "mt-6",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/library",
							children: ["浏览书城", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
						})
					})
				]
			})
		]
	});
}
function cnLift(i) {
	return i % 2 === 1 ? "mt-6 sm:mt-10" : "";
}
//#endregion
export { LandingPage as component };
