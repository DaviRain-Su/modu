import { i as __toESM } from "../_runtime.mjs";
import { o as uid, r as cn } from "./catalog-DJAw_Q2w.mjs";
import { r as getBookBlobUrl } from "./r2-Cy3jOD0T.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as useLibraryStore } from "./library-CletUrRH.mjs";
import { _ as useNavigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as DialogPortal, i as DialogOverlay, n as DialogClose, o as DialogTitle, r as DialogContent, t as Dialog } from "../_libs/@radix-ui/react-dialog+[...].mjs";
import { t as Button } from "./button-TVeO48pu.mjs";
import { t as Progress } from "./progress-CzjhnBQG.mjs";
import { _ as Lightbulb, a as Sparkles, c as Send, d as PanelRight, f as Minus, g as ListTree, h as List, m as LoaderCircle, p as MessageSquareText, s as Settings2, t as X, u as Plus, w as ChevronLeft, y as Languages } from "../_libs/lucide-react.mjs";
import { t as Route } from "./read._bookId-CHWEk0Qt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/read._bookId-CJD_qBYE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function TextReader({ book, chapter, fontSize, lineHeight, theme, onProgress, onSelectText }) {
	const scrollerRef = (0, import_react.useRef)(null);
	const chapters = book.chapters ?? [];
	const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
	const globalBase = chapters.length > 0 ? Math.max(0, chapterIndex) / chapters.length * 100 : 0;
	const chapterShare = chapters.length > 0 ? 100 / chapters.length : 100;
	const paragraphs = (0, import_react.useMemo)(() => chapter.content.split(/\n\n+/).filter(Boolean), [chapter.content]);
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		el.scrollTop = 0;
		onProgress(globalBase + 2);
	}, [
		chapter.id,
		globalBase,
		onProgress
	]);
	(0, import_react.useEffect)(() => {
		const el = scrollerRef.current;
		if (!el) return;
		const onScroll = () => {
			const max = el.scrollHeight - el.clientHeight;
			const local = max <= 0 ? 1 : el.scrollTop / max;
			onProgress(Math.min(99.5, globalBase + local * chapterShare));
		};
		el.addEventListener("scroll", onScroll, { passive: true });
		return () => el.removeEventListener("scroll", onScroll);
	}, [
		chapterShare,
		globalBase,
		onProgress
	]);
	(0, import_react.useEffect)(() => {
		const onUp = () => {
			const sel = window.getSelection()?.toString().trim();
			if (sel && sel.length > 1) onSelectText(sel);
		};
		document.addEventListener("mouseup", onUp);
		document.addEventListener("touchend", onUp);
		return () => {
			document.removeEventListener("mouseup", onUp);
			document.removeEventListener("touchend", onUp);
		};
	}, [onSelectText]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		ref: scrollerRef,
		className: cn("h-full overflow-y-auto", theme === "night" ? "bg-[#121212] text-[#e8e4dc]" : theme === "sepia" ? "bg-[#efe6d4] text-[#3a3226]" : "bg-paper text-paper-fg"),
		style: {
			"--reader-font-size": `${fontSize}px`,
			"--reader-line-height": String(lineHeight)
		},
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("article", {
			className: "reader-prose mx-auto max-w-[42rem] px-5 py-10 sm:px-8 sm:py-14",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
					className: "mb-10 border-b border-current/10 pb-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-xs tracking-[0.16em] text-current/45 uppercase",
							children: book.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
							className: "mt-2 font-serif text-2xl font-medium tracking-tight sm:text-3xl",
							children: chapter.title
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm text-current/50",
							children: book.author
						})
					]
				}),
				paragraphs.map((p, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", { children: p }, i)),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("footer", {
					className: "mt-14 border-t border-current/10 pt-6 text-center text-sm text-current/40",
					children: "本章完 · 选中文字可使用 AI 伴读"
				})
			]
		})
	});
}
function PdfReader({ storageKey, theme, initialPage = 1, onProgress, onPageChange, onSelectText }) {
	const canvasRef = (0, import_react.useRef)(null);
	const [page, setPage] = (0, import_react.useState)(initialPage);
	const [total, setTotal] = (0, import_react.useState)(0);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const pdfRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let objectUrl = null;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const url = await getBookBlobUrl(storageKey);
				if (!url) throw new Error("找不到 PDF 文件，可能已被清除");
				objectUrl = url;
				const pdfjs = await import("../_libs/pdfjs-dist.mjs").then((n) => n.t);
				pdfjs.GlobalWorkerOptions.workerSrc = new URL("pdfjs-dist/build/pdf.worker.min.mjs", import.meta.url).toString();
				const doc = await pdfjs.getDocument({ url }).promise;
				if (cancelled) {
					try {
						doc.destroy?.();
					} catch {}
					return;
				}
				pdfRef.current = doc;
				setTotal(doc.numPages);
				setPage((p) => Math.min(Math.max(1, p), doc.numPages));
			} catch (e) {
				if (!cancelled) setError(e instanceof Error ? e.message : "PDF 加载失败");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
			try {
				pdfRef.current?.destroy?.();
			} catch {}
			pdfRef.current = null;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [storageKey]);
	(0, import_react.useEffect)(() => {
		const doc = pdfRef.current;
		const canvas = canvasRef.current;
		if (!doc || !canvas || total === 0) return;
		let cancelled = false;
		(async () => {
			const pdfPage = await doc.getPage(page);
			if (cancelled) return;
			const base = pdfPage.getViewport({ scale: 1 });
			const scale = Math.min(window.innerWidth - 24, 820) / base.width;
			const viewport = pdfPage.getViewport({ scale: Math.min(scale, 2) });
			const ctx = canvas.getContext("2d");
			if (!ctx) return;
			canvas.width = viewport.width;
			canvas.height = viewport.height;
			await pdfPage.render({
				canvasContext: ctx,
				viewport,
				canvas
			}).promise;
			onProgress(page / total * 100);
			onPageChange(page);
		})().catch(() => {
			if (!cancelled) setError("渲染页面失败");
		});
		return () => {
			cancelled = true;
		};
	}, [
		page,
		total,
		onPageChange,
		onProgress
	]);
	(0, import_react.useEffect)(() => {
		const onUp = () => {
			const sel = window.getSelection()?.toString().trim();
			if (sel && sel.length > 1) onSelectText(sel);
		};
		document.addEventListener("mouseup", onUp);
		return () => document.removeEventListener("mouseup", onUp);
	}, [onSelectText]);
	const bg = theme === "night" ? "bg-[#0e0e0e]" : theme === "sepia" ? "bg-[#efe6d4]" : "bg-paper";
	if (loading) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-full items-center justify-center", bg),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-sm text-fg-muted",
			children: "正在加载 PDF…"
		})
	});
	if (error) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex h-full items-center justify-center px-6", bg),
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "max-w-sm text-center text-sm text-danger",
			children: error
		})
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-full flex-col", bg),
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "flex-1 overflow-auto",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "mx-auto flex min-h-full justify-center px-2 py-4",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
					ref: canvasRef,
					className: "max-w-full shadow-[var(--shadow-soft)]"
				})
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center justify-center gap-3 border-t border-black/10 bg-black/5 px-4 py-3 safe-pb",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-sm text-fg disabled:opacity-40",
					disabled: page <= 1,
					onClick: () => setPage((p) => Math.max(1, p - 1)),
					children: "上一页"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
					className: "min-w-24 text-center text-sm text-fg-muted",
					children: [
						page,
						" / ",
						total
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-sm text-fg disabled:opacity-40",
					disabled: page >= total,
					onClick: () => setPage((p) => Math.min(total, p + 1)),
					children: "下一页"
				})
			]
		})]
	});
}
function EpubReader({ storageKey, theme, fontSize, onProgress, onSelectText }) {
	const hostRef = (0, import_react.useRef)(null);
	const [error, setError] = (0, import_react.useState)(null);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const renditionRef = (0, import_react.useRef)(null);
	const bookRef = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let objectUrl = null;
		(async () => {
			try {
				setLoading(true);
				setError(null);
				const url = await getBookBlobUrl(storageKey);
				if (!url) throw new Error("找不到 EPUB 文件");
				objectUrl = url;
				const ePub = (await import("../_libs/epubjs+[...].mjs").then((n) => n.t)).default;
				const book = ePub(url);
				bookRef.current = book;
				await book.ready;
				if (cancelled || !hostRef.current) return;
				const rendition = book.renderTo(hostRef.current, {
					width: "100%",
					height: "100%",
					flow: "paginated",
					manager: "default"
				});
				renditionRef.current = rendition;
				const bg = theme === "night" ? "#121212" : theme === "sepia" ? "#efe6d4" : "#f4efe6";
				const fg = theme === "night" ? "#e8e4dc" : theme === "sepia" ? "#3a3226" : "#1c1915";
				rendition.themes.override("color", fg);
				rendition.themes.override("background", bg);
				rendition.themes.fontSize(`${fontSize}px`);
				rendition.on("selected", (_cfiRange, contents) => {
					const text = contents?.window?.getSelection?.()?.toString()?.trim();
					if (text && text.length > 1) onSelectText(text);
				});
				rendition.on("relocated", (location) => {
					try {
						const pct = location?.start?.percentage != null ? location.start.percentage * 100 : book.locations?.percentageFromCfi?.(location?.start?.cfi ?? "") * 100;
						if (typeof pct === "number" && !Number.isNaN(pct)) onProgress(Math.min(99.9, Math.max(0, pct)));
					} catch {}
				});
				await book.locations.generate(1200);
				if (cancelled) return;
				await rendition.display();
			} catch (e) {
				if (!cancelled) setError(e instanceof Error ? e.message : "EPUB 加载失败");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
			try {
				renditionRef.current?.destroy?.();
			} catch {}
			try {
				bookRef.current?.destroy?.();
			} catch {}
			renditionRef.current = null;
			bookRef.current = null;
			if (objectUrl) URL.revokeObjectURL(objectUrl);
		};
	}, [storageKey]);
	(0, import_react.useEffect)(() => {
		const r = renditionRef.current;
		if (!r) return;
		const bg = theme === "night" ? "#121212" : theme === "sepia" ? "#efe6d4" : "#f4efe6";
		const fg = theme === "night" ? "#e8e4dc" : theme === "sepia" ? "#3a3226" : "#1c1915";
		r.themes.override("color", fg);
		r.themes.override("background", bg);
		r.themes.fontSize(`${fontSize}px`);
	}, [theme, fontSize]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-full flex-col", theme === "night" ? "bg-[#121212]" : theme === "sepia" ? "bg-[#efe6d4]" : "bg-paper"),
		children: [
			loading && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-center text-sm text-fg-muted",
				children: "正在加载 EPUB…"
			}),
			error && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "flex flex-1 items-center justify-center px-6 text-center text-sm text-danger",
				children: error
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				ref: hostRef,
				className: cn("min-h-0 flex-1", (loading || error) && "hidden")
			}),
			!loading && !error && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center justify-center gap-3 border-t border-black/10 bg-black/5 px-4 py-3 safe-pb",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-[var(--radius-sm)] bg-bg-elevated px-4 py-2 text-sm text-fg",
					onClick: () => renditionRef.current?.prev(),
					children: "上一页"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
					type: "button",
					className: "rounded-[var(--radius-sm)] bg-bg-elevated px-4 py-2 text-sm text-fg",
					onClick: () => renditionRef.current?.next(),
					children: "下一页"
				})]
			})
		]
	});
}
var Textarea = import_react.forwardRef(({ className, ...props }, ref) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("textarea", {
	className: cn("flex min-h-[88px] w-full rounded-[var(--radius-md)] border border-border bg-bg-elevated px-3 py-2 text-sm text-fg placeholder:text-fg-subtle outline-none transition-colors focus-visible:border-border-strong focus-visible:ring-2 focus-visible:ring-ring/40 disabled:cursor-not-allowed disabled:opacity-50", className),
	ref,
	...props
}));
Textarea.displayName = "Textarea";
function sleep(ms) {
	return new Promise((r) => setTimeout(r, ms));
}
function trimText(text, max = 800) {
	const t = text.replace(/\s+/g, " ").trim();
	if (t.length <= max) return t;
	return t.slice(0, max) + "…";
}
function countSentences(text) {
	return text.split(/[。！？.!?]+/).filter((s) => s.trim().length > 4);
}
function extractKeyPhrases(text) {
	const cleaned = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, " ");
	const cn = cleaned.match(/[\u4e00-\u9fa5]{2,6}/g) ?? [];
	const en = cleaned.match(/[A-Za-z]{4,}/g) ?? [];
	const freq = /* @__PURE__ */ new Map();
	for (const w of [...cn, ...en]) {
		const k = w.toLowerCase();
		if (k.length < 2) continue;
		freq.set(k, (freq.get(k) ?? 0) + 1);
	}
	return [...freq.entries()].sort((a, b) => b[1] - a[1]).slice(0, 6).map(([w]) => w);
}
function explainPassage(text, bookTitle) {
	const phrases = extractKeyPhrases(text);
	const sentences = countSentences(text);
	const scope = bookTitle ? `《${bookTitle}》` : "这段文字";
	const head = sentences[0]?.trim() ?? text.slice(0, 40);
	return [
		`关于${scope}中选中的段落，我这样理解：`,
		``,
		`**核心意思**`,
		sentences.length > 1 ? `作者先提出「${head.slice(0, 48)}${head.length > 48 ? "…" : ""}」，随后用 ${sentences.length} 个层次展开论证或叙事。整体语气偏${text.includes("？") || text.includes("?") ? "思辨" : "叙述"}。` : `这段话集中表达了一个观点：${trimText(text, 120)}`,
		``,
		phrases.length ? `**关键词**\n${phrases.map((p) => `· ${p}`).join("\n")}` : "",
		``,
		`**阅读提示**`,
		`可以把这段与上下文对照：留意作者如何铺垫、转折或收束。若有生词，可再选中单词让我精讲。`
	].filter(Boolean).join("\n");
}
function summarizePassage(text) {
	const sentences = countSentences(text);
	const phrases = extractKeyPhrases(text);
	if (sentences.length === 0) return `**摘要**\n${trimText(text, 160)}`;
	const pick = [
		sentences[0],
		sentences[Math.floor(sentences.length / 2)],
		sentences[sentences.length - 1]
	].filter(Boolean).map((s) => s.trim()).filter((s, i, arr) => arr.indexOf(s) === i).slice(0, 3);
	return [
		`**一句话摘要**`,
		trimText(pick[0] ?? text, 100),
		``,
		`**要点**`,
		...pick.map((s, i) => `${i + 1}. ${trimText(s, 90)}`),
		phrases.length ? `\n**主题词**：${phrases.slice(0, 4).join(" · ")}` : ""
	].join("\n");
}
function translatePassage(text) {
	if ((text.match(/[\u4e00-\u9fa5]/g)?.length ?? 0) > text.length * .3) return [
		`**中英对照（意译）**`,
		``,
		`原文：${trimText(text, 280)}`,
		``,
		`English (paraphrase): This passage discusses ${extractKeyPhrases(text).slice(0, 3).join(", ") || "its central theme"}, unfolding the idea through careful observation and reasoned narrative. The author invites the reader to slow down and notice the texture of everyday experience.`,
		``,
		`（说明：这是阅读辅助意译，非逐字机器翻译。正式引用请对照权威译本。）`
	].join("\n");
	return [
		`**英中对照（意译）**`,
		``,
		`Original: ${trimText(text, 280)}`,
		``,
		`中文意译：这段文字围绕「${extractKeyPhrases(text).slice(0, 3).join("、") || "核心主题"}」展开，作者以细腻观察与层层推进的方式，引导读者放慢节奏、体察细节。`,
		``,
		`（说明：辅助意译，便于理解，非专业出版译本。）`
	].join("\n");
}
function insightPassage(text, bookTitle) {
	const phrases = extractKeyPhrases(text);
	return [
		`**AI 洞见**${bookTitle ? ` · 《${bookTitle}》` : ""}`,
		``,
		`1. **视角**：作者不止在陈述事实，更在邀请你进入一种${text.length > 200 ? "沉浸式" : "凝练"}的思考姿态。`,
		`2. **结构**：留意句群之间的递进——从具体场景到抽象判断，是经典非虚构/文学的常用路径。`,
		`3. **可迁移问题**：若把这段放到今天的生活里，哪个词最刺痛你？${phrases[0] ? `或许是「${phrases[0]}」。` : ""}`,
		``,
		`你可以继续问我：「这段和下一章有什么关系？」或「帮我写一段读书笔记」。`
	].join("\n");
}
function chatReply(question, context, bookTitle) {
	const q = question.trim();
	const ctx = context ? trimText(context, 400) : "";
	const lower = q.toLowerCase();
	if (/笔记|读书笔记|读后感/.test(q)) return [
		`**读书笔记草稿**${bookTitle ? ` · 《${bookTitle}》` : ""}`,
		``,
		ctx ? `今日读到：${trimText(ctx, 120)}` : `围绕当前章节的主题，可以这样记：`,
		``,
		`· 事实 / 情节：用一句话复述发生了什么。`,
		`· 感受：哪一处触动了你？用自己的话写下。`,
		`· 联想：这与你的经历、其他书或社会现象如何呼应？`,
		`· 行动：读完后你想改变或尝试的一件小事。`,
		``,
		`需要我根据选中段落生成完整笔记，请先选中文字再点「摘要」或「洞见」。`
	].join("\n");
	if (/人物|角色|主角/.test(q)) return [
		`关于人物，建议从三层看：`,
		`1. **外在行动**——做了什么；`,
		`2. **内在动机**——为什么；`,
		`3. **关系网络**——与其他角色如何互相定义。`,
		ctx ? `\n结合你提供的段落：${trimText(ctx, 160)}` : "",
		`\n可以把具体人名或片段发给我，我帮你梳理人物弧光。`
	].filter(Boolean).join("\n");
	if (/总结|概括|讲了什么|讲什么/.test(q) || lower.includes("summary")) return ctx ? summarizePassage(ctx) : `请先在正文中选中一段，或告诉我章节标题，我再为你总结。`;
	if (/翻译|translate|英文|中文/.test(q)) return ctx ? translatePassage(ctx) : `选中要翻译的段落，或把原文粘贴到对话框，我可以给出中英意译对照。`;
	return [
		`我已收到你的问题：${trimText(q, 120)}`,
		``,
		ctx ? `结合当前语境（${trimText(ctx, 80)}），建议这样切入：` : `结合当前阅读，建议这样切入：`,
		``,
		`· 先用自己的话复述一遍问题相关的段落；`,
		`· 再问「作者为什么要这样写」而不是只问「写了什么」；`,
		`· 最后把结论落到你自己的经验上。`,
		``,
		bookTitle ? `在《${bookTitle}》里继续往下读时，可以随时选中句子，用「解释 / 摘要 / 翻译 / 洞见」快速启动。` : `选中正文中的句子，可以用顶部快捷操作更快得到回答。`,
		``,
		`（墨读 AI 伴读在本地完成辅助推理，适合边读边想；正式学术引用请核对原书。）`
	].join("\n");
}
async function runAiAssist(input) {
	await sleep(420 + Math.random() * 480);
	const text = input.text?.trim() ?? "";
	let content;
	switch (input.action) {
		case "explain":
			content = text ? explainPassage(text, input.bookTitle) : "请先选中一段正文，再使用「解释」。";
			break;
		case "summary":
			content = text ? summarizePassage(text) : "请先选中一段正文，再使用「摘要」。";
			break;
		case "translate":
			content = text ? translatePassage(text) : "请先选中一段正文，再使用「翻译」。";
			break;
		case "insight":
			content = text ? insightPassage(text, input.bookTitle) : "请先选中一段正文，再使用「洞见」。";
			break;
		default:
			content = chatReply(input.question ?? "", text || void 0, input.bookTitle);
			break;
	}
	return {
		id: uid("ai"),
		role: "assistant",
		content,
		kind: input.action,
		createdAt: Date.now()
	};
}
var quick = [
	{
		action: "explain",
		label: "解释",
		icon: MessageSquareText
	},
	{
		action: "summary",
		label: "摘要",
		icon: ListTree
	},
	{
		action: "translate",
		label: "翻译",
		icon: Languages
	},
	{
		action: "insight",
		label: "洞见",
		icon: Lightbulb
	}
];
function AiPanel({ bookTitle, selectedText, onClearSelection, className }) {
	const [messages, setMessages] = (0, import_react.useState)([{
		id: "welcome",
		role: "assistant",
		content: "我是墨读 AI 伴读。选中正文中的句子，可用「解释 / 摘要 / 翻译 / 洞见」；也可以直接提问，例如「帮我写一段读书笔记」。",
		kind: "chat",
		createdAt: Date.now()
	}]);
	const [input, setInput] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	async function run(action, question) {
		if (busy) return;
		setBusy(true);
		if (question?.trim()) setMessages((m) => [...m, {
			id: uid("u"),
			role: "user",
			content: question.trim(),
			createdAt: Date.now()
		}]);
		else if (selectedText) setMessages((m) => [...m, {
			id: uid("u"),
			role: "user",
			content: `【${quick.find((q) => q.action === action)?.label ?? "提问"}】${selectedText.slice(0, 160)}${selectedText.length > 160 ? "…" : ""}`,
			createdAt: Date.now()
		}]);
		try {
			const reply = await runAiAssist({
				action,
				text: selectedText,
				question,
				bookTitle
			});
			setMessages((m) => [...m, reply]);
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: cn("flex h-full min-h-0 flex-col bg-bg-elevated", className),
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-sm font-medium",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-accent" }), "AI 伴读"]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mt-1 text-xs text-fg-subtle",
					children: "结合当前选区与全书语境作答"
				})]
			}),
			selectedText ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "border-b border-border bg-bg-subtle/50 px-4 py-3",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-start justify-between gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
						className: "line-clamp-3 text-xs leading-relaxed text-fg-muted",
						children: ["已选：", selectedText]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
						type: "button",
						className: "shrink-0 text-xs text-fg-subtle hover:text-fg",
						onClick: onClearSelection,
						children: "清除"
					})]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mt-3 grid grid-cols-4 gap-1.5",
					children: quick.map(({ action, label, icon: Icon }) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
						type: "button",
						disabled: busy,
						onClick: () => run(action),
						className: "flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-border bg-bg px-1 py-2 text-[11px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg disabled:opacity-50",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, { className: "h-3.5 w-3.5" }), label]
					}, action))
				})]
			}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
				className: "border-b border-border px-4 py-3 text-xs text-fg-subtle",
				children: "在正文中选中文字后，这里会出现快捷 AI 操作。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4",
				children: [messages.map((m) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: cn("rounded-[var(--radius-lg)] px-3 py-2.5 text-sm leading-relaxed", m.role === "assistant" ? "bg-bg-subtle text-fg" : "ml-6 bg-primary/10 text-fg"),
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mb-1 text-[10px] uppercase tracking-wider text-fg-subtle",
						children: m.role === "assistant" ? "墨读 AI" : "你"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "whitespace-pre-wrap",
						children: formatMdLite(m.content)
					})]
				}, m.id)), busy && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex items-center gap-2 text-xs text-fg-subtle",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-3.5 w-3.5 animate-spin" }), "正在思考…"]
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("form", {
				className: "border-t border-border p-3 safe-pb",
				onSubmit: (e) => {
					e.preventDefault();
					const q = input.trim();
					if (!q) return;
					setInput("");
					run("chat", q);
				},
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex gap-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
						value: input,
						onChange: (e) => setInput(e.target.value),
						placeholder: "问 AI：这段在讲什么？帮我写笔记…",
						className: "min-h-[44px] resize-none",
						rows: 2
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						type: "submit",
						size: "icon",
						disabled: busy || !input.trim(),
						className: "shrink-0 self-end",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Send, { className: "h-4 w-4" })
					})]
				})
			})
		]
	});
}
function formatMdLite(text) {
	return text.split(/(\*\*[^*]+\*\*)/g).map((part, i) => {
		if (part.startsWith("**") && part.endsWith("**")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
			className: "font-semibold text-fg",
			children: part.slice(2, -2)
		}, i);
		return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: part }, i);
	});
}
var Sheet = Dialog;
function SheetContent({ className, children, side = "right", title = "面板", ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogPortal, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogOverlay, { className: "fixed inset-0 z-50 bg-black/55 data-[state=open]:animate-in data-[state=closed]:animate-out data-[state=closed]:fade-out-0 data-[state=open]:fade-in-0" }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogContent, {
		className: cn("fixed z-50 flex flex-col gap-4 border border-border bg-bg-elevated shadow-[var(--shadow-soft)] outline-none transition ease-out data-[state=open]:animate-in data-[state=closed]:animate-out", side === "right" && "inset-y-0 right-0 h-full w-full max-w-md border-l data-[state=closed]:slide-out-to-right data-[state=open]:slide-in-from-right", side === "left" && "inset-y-0 left-0 h-full w-full max-w-md border-r data-[state=closed]:slide-out-to-left data-[state=open]:slide-in-from-left", side === "bottom" && "inset-x-0 bottom-0 max-h-[85dvh] rounded-t-[var(--radius-xl)] border-t data-[state=closed]:slide-out-to-bottom data-[state=open]:slide-in-from-bottom", className),
		...props,
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(DialogTitle, {
				className: "sr-only",
				children: title
			}),
			children,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(DialogClose, {
				className: "absolute right-3 top-3 rounded-[var(--radius-sm)] p-2 text-fg-muted hover:bg-bg-subtle hover:text-fg",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
					className: "sr-only",
					children: "关闭"
				})]
			})
		]
	})] });
}
function SheetHeader({ className, ...props }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: cn("flex flex-col gap-1 border-b border-border px-5 py-4 pr-12", className),
		...props
	});
}
function useIsLg() {
	const [lg, setLg] = (0, import_react.useState)(false);
	(0, import_react.useEffect)(() => {
		const mq = window.matchMedia("(min-width: 1024px)");
		const apply = () => setLg(mq.matches);
		apply();
		mq.addEventListener("change", apply);
		return () => mq.removeEventListener("change", apply);
	}, []);
	return lg;
}
function ReaderPage() {
	const { bookId } = Route.useParams();
	const { chapter: chapterParam } = Route.useSearch();
	const navigate = useNavigate();
	const isLg = useIsLg();
	const ready = useLibraryStore((s) => s.ready);
	const getBook = useLibraryStore((s) => s.getBook);
	const getProgress = useLibraryStore((s) => s.getProgress);
	const saveProgress = useLibraryStore((s) => s.saveProgress);
	const addToShelf = useLibraryStore((s) => s.addToShelf);
	const book = getBook(bookId);
	const stored = getProgress(bookId);
	const chapters = book?.chapters ?? [];
	const [chapterId, setChapterId] = (0, import_react.useState)(chapterParam || stored?.lastChapterId || chapters[0]?.id || "");
	const [fontSize, setFontSize] = (0, import_react.useState)(18);
	const [lineHeight, setLineHeight] = (0, import_react.useState)(1.85);
	const [theme, setTheme] = (0, import_react.useState)("paper");
	const [chromeVisible, setChromeVisible] = (0, import_react.useState)(true);
	const [aiOpen, setAiOpen] = (0, import_react.useState)(false);
	const [tocOpen, setTocOpen] = (0, import_react.useState)(false);
	const [settingsOpen, setSettingsOpen] = (0, import_react.useState)(false);
	const [selectedText, setSelectedText] = (0, import_react.useState)("");
	const [progress, setProgress] = (0, import_react.useState)(stored?.progress ?? 0);
	const [page, setPage] = (0, import_react.useState)(stored?.lastPage ?? 1);
	(0, import_react.useEffect)(() => {
		if (book) addToShelf(book.id);
	}, [book, addToShelf]);
	(0, import_react.useEffect)(() => {
		if (chapterParam) setChapterId(chapterParam);
	}, [chapterParam]);
	(0, import_react.useEffect)(() => {
		if (isLg) setAiOpen(true);
	}, [isLg]);
	const chapter = (0, import_react.useMemo)(() => chapters.find((c) => c.id === chapterId) ?? chapters[0], [chapters, chapterId]);
	const persist = (0, import_react.useCallback)((pct, extra) => {
		if (!book) return;
		const next = {
			bookId: book.id,
			progress: pct,
			lastChapterId: chapterId || chapter?.id,
			lastPage: page,
			bookmarks: stored?.bookmarks ?? [],
			highlights: stored?.highlights ?? [],
			updatedAt: Date.now(),
			...extra
		};
		saveProgress(next);
	}, [
		book,
		chapter?.id,
		chapterId,
		page,
		saveProgress,
		stored?.bookmarks,
		stored?.highlights
	]);
	const onProgress = (0, import_react.useCallback)((pct) => {
		setProgress(pct);
		persist(pct);
	}, [persist]);
	const onSelectText = (0, import_react.useCallback)((text) => {
		setSelectedText(text);
		setAiOpen(true);
	}, []);
	if (ready && !book) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "text-lg font-medium",
			children: "找不到这本书"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
			asChild: true,
			className: "mt-4",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
				to: "/library",
				children: "返回书城"
			})
		})]
	});
	if (!book) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-dvh items-center justify-center bg-paper text-paper-muted",
		children: "加载中…"
	});
	const chapterIndex = chapters.findIndex((c) => c.id === chapter?.id);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "relative flex h-dvh flex-col bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("header", {
				className: cn("absolute inset-x-0 top-0 z-30 border-b border-border/80 bg-bg/92 backdrop-blur-md transition-transform duration-200 safe-pt", chromeVisible ? "translate-y-0" : "-translate-y-full"),
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "flex h-12 items-center gap-1 px-2 sm:h-14 sm:px-3",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => void navigate({
								to: "/book/$bookId",
								params: { bookId: book.id }
							}),
							"aria-label": "返回",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(ChevronLeft, { className: "h-5 w-5" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "min-w-0 flex-1 px-1",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-sm font-medium",
								children: book.title
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "truncate text-[11px] text-fg-subtle",
								children: chapter?.title || book.format.toUpperCase()
							})]
						}),
						chapters.length > 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setTocOpen(true),
							"aria-label": "目录",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(List, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							onClick: () => setSettingsOpen(true),
							"aria-label": "设置",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Settings2, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
							variant: "ghost",
							size: "icon-sm",
							className: "hidden lg:inline-flex",
							onClick: () => setAiOpen((v) => !v),
							"aria-label": "AI 伴读",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PanelRight, { className: "h-4 w-4" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
							variant: "soft",
							size: "sm",
							className: "lg:hidden",
							onClick: () => setAiOpen(true),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-3.5 w-3.5" }), "AI"]
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Progress, {
					value: progress,
					className: "h-0.5 rounded-none"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex min-h-0 flex-1 pt-12 sm:pt-14",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "relative min-w-0 flex-1",
					onClick: (e) => {
						if (e.target.closest("button, a, input, textarea, canvas")) return;
						setChromeVisible((v) => !v);
					},
					children: [
						book.format === "text" && chapter && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(TextReader, {
							book,
							chapter,
							fontSize,
							lineHeight,
							theme,
							onProgress,
							onSelectText
						}),
						book.format === "pdf" && book.storageKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(PdfReader, {
							storageKey: book.storageKey,
							theme,
							initialPage: page,
							onProgress,
							onPageChange: setPage,
							onSelectText
						}),
						book.format === "epub" && book.storageKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(EpubReader, {
							storageKey: book.storageKey,
							theme,
							fontSize,
							onProgress,
							onSelectText
						}),
						book.format !== "text" && !book.storageKey && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "flex h-full items-center justify-center bg-paper px-6 text-center text-sm text-paper-muted",
							children: "文件缺失，请重新上传。"
						})
					]
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("aside", {
					className: cn("hidden shrink-0 overflow-hidden border-l border-border transition-all duration-200 lg:block", aiOpen ? "w-[360px] opacity-100" : "w-0 border-0 opacity-0"),
					children: aiOpen && /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPanel, {
						bookTitle: book.title,
						selectedText,
						onClearSelection: () => setSelectedText(""),
						className: "h-full w-[360px]"
					})
				})]
			}),
			book.format === "text" && chapters.length > 1 && chromeVisible && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-between gap-3 px-3 pb-3 safe-pb",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					className: "pointer-events-auto shadow-[var(--shadow-soft)]",
					disabled: chapterIndex <= 0,
					onClick: () => {
						const prev = chapters[chapterIndex - 1];
						if (prev) {
							setChapterId(prev.id);
							navigate({
								to: "/read/$bookId",
								params: { bookId: book.id },
								search: { chapter: prev.id },
								replace: true
							});
						}
					},
					children: "上一章"
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					variant: "secondary",
					size: "sm",
					className: "pointer-events-auto shadow-[var(--shadow-soft)]",
					disabled: chapterIndex < 0 || chapterIndex >= chapters.length - 1,
					onClick: () => {
						const next = chapters[chapterIndex + 1];
						if (next) {
							setChapterId(next.id);
							navigate({
								to: "/read/$bookId",
								params: { bookId: book.id },
								search: { chapter: next.id },
								replace: true
							});
						}
					},
					children: "下一章"
				})]
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: aiOpen && !isLg,
				onOpenChange: setAiOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetContent, {
					side: "bottom",
					title: "AI 伴读",
					className: "h-[min(88dvh,720px)] p-0",
					children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(AiPanel, {
						bookTitle: book.title,
						selectedText,
						onClearSelection: () => setSelectedText(""),
						className: "h-full rounded-t-[var(--radius-xl)]"
					})
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: tocOpen,
				onOpenChange: setTocOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "left",
					title: "目录",
					className: "w-full max-w-sm p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium",
						children: "目录"
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-xs text-fg-subtle",
						children: book.title
					})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "overflow-y-auto p-2",
						children: [chapters.map((ch, i) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							className: cn("flex w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left text-sm transition-colors hover:bg-bg-subtle", ch.id === chapter?.id && "bg-bg-subtle"),
							onClick: () => {
								setChapterId(ch.id);
								setTocOpen(false);
								navigate({
									to: "/read/$bookId",
									params: { bookId: book.id },
									search: { chapter: ch.id },
									replace: true
								});
							},
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "w-6 shrink-0 text-fg-subtle",
								children: i + 1
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: ch.title })]
						}, ch.id)), chapters.length === 0 && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "px-3 py-6 text-sm text-fg-muted",
							children: "当前格式使用翻页浏览，无章节目录。"
						})]
					})]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sheet, {
				open: settingsOpen,
				onOpenChange: setSettingsOpen,
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(SheetContent, {
					side: "bottom",
					title: "阅读设置",
					className: "p-0",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(SheetHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
						className: "text-base font-medium",
						children: "阅读设置"
					}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-6 px-5 py-5 safe-pb",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
								className: "mb-2 text-xs text-fg-muted",
								children: "主题"
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "grid grid-cols-3 gap-2",
								children: [
									[
										"paper",
										"纸张",
										"bg-[#f4efe6] text-[#1c1915]"
									],
									[
										"sepia",
										"羊皮纸",
										"bg-[#efe6d4] text-[#3a3226]"
									],
									[
										"night",
										"夜间",
										"bg-[#121212] text-[#e8e4dc]"
									]
								].map(([key, label, cls]) => /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
									type: "button",
									onClick: () => setTheme(key),
									className: cn("rounded-[var(--radius-md)] border px-3 py-3 text-sm", cls, theme === key ? "border-accent ring-1 ring-accent" : "border-border"),
									children: label
								}, key))
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-2 text-xs text-fg-muted",
								children: [
									"字号 ",
									fontSize,
									"px"
								]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon-sm",
										onClick: () => setFontSize((s) => Math.max(14, s - 1)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 flex-1 rounded-full bg-bg-subtle",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-accent",
											style: { width: `${(fontSize - 14) / 10 * 100}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon-sm",
										onClick: () => setFontSize((s) => Math.min(24, s + 1)),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
								className: "mb-2 text-xs text-fg-muted",
								children: ["行距 ", lineHeight.toFixed(2)]
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "flex items-center gap-3",
								children: [
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon-sm",
										onClick: () => setLineHeight((s) => Math.max(1.4, +(s - .1).toFixed(2))),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Minus, { className: "h-4 w-4" })
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
										className: "h-1.5 flex-1 rounded-full bg-bg-subtle",
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
											className: "h-full rounded-full bg-accent",
											style: { width: `${(lineHeight - 1.4) / .8 * 100}%` }
										})
									}),
									/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
										variant: "secondary",
										size: "icon-sm",
										onClick: () => setLineHeight((s) => Math.min(2.2, +(s + .1).toFixed(2))),
										children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Plus, { className: "h-4 w-4" })
									})
								]
							})] }),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Button, {
								variant: "outline",
								className: "w-full",
								onClick: () => setSettingsOpen(false),
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(X, { className: "h-4 w-4" }), "完成"]
							})
						]
					})]
				})
			})
		]
	});
}
//#endregion
export { ReaderPage as component };
