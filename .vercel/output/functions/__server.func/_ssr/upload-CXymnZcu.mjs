import { o as __toESM } from "../_runtime.mjs";
import { n as formatBytes } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DffftdNv.mjs";
import { t as Input } from "./input-C-9hCiFR.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-D3goAFTK.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { D as FileUp, O as Cloud, _ as LoaderCircle } from "../_libs/lucide-react.mjs";
import { n as describeStorage } from "./r2-kRm6suj4.mjs";
import { t as useLibraryStore } from "./library---StLbl3.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/upload-CXymnZcu.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function UploadPage() {
	const navigate = useNavigate();
	const uploadBook = useLibraryStore((s) => s.uploadBook);
	const [file, setFile] = (0, import_react.useState)(null);
	const [title, setTitle] = (0, import_react.useState)("");
	const [author, setAuthor] = (0, import_react.useState)("");
	const [dragging, setDragging] = (0, import_react.useState)(false);
	const [busy, setBusy] = (0, import_react.useState)(false);
	const storage = describeStorage();
	const onFile = (0, import_react.useCallback)((f) => {
		if (!f) return;
		const ext = f.name.split(".").pop()?.toLowerCase();
		if (!ext || ![
			"pdf",
			"epub",
			"txt",
			"md"
		].includes(ext)) {
			toast.error("请上传 PDF、EPUB 或 TXT/MD 文件");
			return;
		}
		setFile(f);
		setTitle((t) => t || f.name.replace(/\.[^.]+$/, ""));
	}, []);
	async function handleUpload() {
		if (!file || busy) return;
		setBusy(true);
		try {
			const book = await uploadBook(file, {
				title: title.trim() || void 0,
				author: author.trim() || void 0
			});
			toast.success("已上传并加入书架");
			navigate({
				to: "/book/$bookId",
				params: { bookId: book.id }
			});
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "上传失败");
		} finally {
			setBusy(false);
		}
	}
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-6",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
			className: "font-serif text-3xl font-medium tracking-tight",
			children: "上传图书"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "mt-1 text-fg-muted",
			children: "支持 PDF、EPUB，以及纯文本。文件写入对象存储层。"
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex items-center gap-2",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Cloud, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "存储后端"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "mt-2 flex flex-wrap items-start gap-2 text-sm text-fg-muted",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
				variant: "accent",
				children: storage.label
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "leading-relaxed",
				children: storage.detail
			})]
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
			className: "space-y-5",
			children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: `flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed px-6 py-12 text-center transition-colors ${dragging ? "border-accent bg-accent/5" : "border-border bg-bg-subtle/40"}`,
					onDragOver: (e) => {
						e.preventDefault();
						setDragging(true);
					},
					onDragLeave: () => setDragging(false),
					onDrop: (e) => {
						e.preventDefault();
						setDragging(false);
						const f = e.dataTransfer.files?.[0];
						if (f) onFile(f);
					},
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
							className: "mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated",
							children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(FileUp, { className: "h-5 w-5 text-fg-muted" })
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "text-sm font-medium",
							children: "拖拽文件到此处，或点击选择"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-1 text-xs text-fg-subtle",
							children: "PDF · EPUB · TXT · MD，建议 50MB 以内"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
							className: "mt-4",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("input", {
								type: "file",
								accept: ".pdf,.epub,.txt,.md,application/pdf,application/epub+zip,text/plain,text/markdown",
								className: "sr-only",
								onChange: (e) => onFile(e.target.files?.[0] ?? null)
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "inline-flex h-11 cursor-pointer items-center rounded-[var(--radius-md)] border border-border bg-bg-elevated px-4 text-sm hover:bg-bg-hover",
								children: "选择文件"
							})]
						}),
						file && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
							className: "mt-4 text-sm text-fg-muted",
							children: [
								"已选：",
								file.name,
								/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
									className: "text-fg-subtle",
									children: [" · ", formatBytes(file.size)]
								})
							]
						})
					]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "grid gap-3 sm:grid-cols-2",
					children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-fg-muted",
							children: "书名"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: title,
							onChange: (e) => setTitle(e.target.value),
							placeholder: "可选，默认使用文件名"
						})]
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-fg-muted",
							children: "作者"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: author,
							onChange: (e) => setAuthor(e.target.value),
							placeholder: "可选"
						})]
					})]
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
					className: "w-full",
					size: "lg",
					disabled: !file || busy,
					onClick: () => void handleUpload(),
					children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }), "上传中…"] }) : "上传并加入书架"
				})
			]
		})] })]
	});
}
//#endregion
export { UploadPage as component };
