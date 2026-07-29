import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DffftdNv.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { E as Flame, M as BookOpen, O as Cloud, P as ArrowRight, c as Smartphone, i as Upload, n as Users, s as Sparkles } from "../_libs/lucide-react.mjs";
import { n as MARKET_BOOKS } from "./catalog-BpzRlWR9.mjs";
import { n as describeStorage } from "./r2-kRm6suj4.mjs";
import { t as BookCard } from "./BookCard-BeYXM9-U.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/routes-CWY_89g7.js
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
							children: "账户 · 热榜 · AI 自带密钥 / 官方订阅"
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
							children: "墨读是面向手机与电脑的在线阅读器：书城、上传 PDF/EPUB、AI 伴读； 登录后可公开画线、参与热门榜，并用官方订阅或自有 ChatGPT / Kimi / DeepSeek API。"
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
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/login",
									children: "登录 / 注册"
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
							className: i % 2 === 1 ? "mt-6 sm:mt-10" : "",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookCard, { book })
						}, book.id))
					})]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 max-w-xl",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "font-serif text-2xl font-medium tracking-tight sm:text-3xl",
					children: "为认真阅读与社区而设计"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-2 text-fg-muted",
					children: "从发现到精读，再到公开批注与热榜。"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "grid gap-4 sm:grid-cols-2 lg:grid-cols-3",
				children: [
					{
						icon: BookOpen,
						title: "书城与书架",
						desc: "精选书目随时加入书架，进度本机保存。"
					},
					{
						icon: Sparkles,
						title: "AI 伴读",
						desc: "官方订阅额度，或自带 OpenAI / Kimi / DeepSeek / 自定义接口。"
					},
					{
						icon: Users,
						title: "公开画线",
						desc: "选中文字即可高亮与批注，对社区可见。"
					},
					{
						icon: Flame,
						title: "热门书单榜",
						desc: "聚合真实阅读与批注热度，留言板同步洞见。"
					},
					{
						icon: Cloud,
						title: "Cloudflare 存储",
						desc: "对象存储抽象对接 R2，上传图书结构化存放。"
					},
					{
						icon: Smartphone,
						title: "手机与 Web",
						desc: "自适应布局，阅读设置与 AI 侧栏随时可用。"
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
							className: "font-serif text-2xl font-medium tracking-tight sm:text-3xl",
							children: "官方订阅或自带额度"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-3 text-fg-muted leading-relaxed",
							children: "免费 / Plus / Pro 三档官方 AI 次数；也可在账户中配置 ChatGPT API、Kimi、DeepSeek 或任意 OpenAI 兼容端点，使用你自己的额度。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-6 flex flex-wrap gap-3",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/account",
									children: "管理账户与 AI"
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								asChild: true,
								variant: "outline",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/rankings",
									children: "查看热榜"
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
									children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "纸张主题" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "选中即可 AI / 画线" })]
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
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mt-6 flex flex-wrap justify-center gap-3",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/library",
								children: ["浏览书城", /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ArrowRight, { className: "h-4 w-4" })]
							})
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							asChild: true,
							size: "lg",
							variant: "secondary",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
								to: "/upload",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Upload, { className: "h-4 w-4" }), "上传图书"]
							})
						})]
					})
				]
			})
		]
	});
}
//#endregion
export { LandingPage as component };
