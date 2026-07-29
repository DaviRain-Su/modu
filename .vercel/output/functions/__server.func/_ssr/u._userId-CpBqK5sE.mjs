import { o as __toESM } from "../_runtime.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Button } from "./button-DffftdNv.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { i as listPublicAnnotationsByUser, r as getPublicProfile } from "./profile-Cdbo4bpy.mjs";
import { n as MARKET_BOOKS } from "./catalog-BpzRlWR9.mjs";
import { t as useLibraryStore } from "./library---StLbl3.mjs";
import { t as Route } from "./u._userId-CR30xn5Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/u._userId-CpBqK5sE.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
function ProfilePage() {
	const { userId } = Route.useParams();
	const getBook = useLibraryStore((s) => s.getBook);
	const [profile, setProfile] = (0, import_react.useState)(void 0);
	const [notes, setNotes] = (0, import_react.useState)([]);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		(async () => {
			const [p, a] = await Promise.all([getPublicProfile({ data: { userId } }), listPublicAnnotationsByUser({ data: { userId } })]);
			if (cancelled) return;
			setProfile(p);
			setNotes(a);
		})().catch(() => {
			if (!cancelled) setProfile(null);
		});
		return () => {
			cancelled = true;
		};
	}, [userId]);
	if (profile === void 0) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-48 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" });
	if (!profile) return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "py-16 text-center",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "text-xl font-medium",
				children: "未找到该读者"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
				className: "mt-2 text-fg-muted",
				children: "对方可能尚未完善资料。"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				className: "mt-6",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/rankings",
					children: "去热门榜"
				})
			})
		]
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-2xl space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "rounded-[var(--radius-2xl)] border border-border bg-bg-elevated p-6 sm:p-8",
			children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-start gap-4",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-lg font-medium",
					children: profile.displayName.charAt(0)
				}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "min-w-0",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "flex flex-wrap items-center gap-2",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
								className: "font-serif text-2xl font-medium tracking-tight",
								children: profile.displayName
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
								variant: "accent",
								children: profile.plan
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed text-fg-muted",
							children: profile.bio || "这个人很安静，还没有写简介。"
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
							className: "mt-4 flex gap-4 text-sm text-fg-subtle",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["公开批注 ", profile.annotationCount] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", { children: ["阅读记录 ", profile.readCount] })]
						})
					]
				})]
			})
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
			className: "mb-3 text-sm font-medium text-fg-muted",
			children: "公开批注"
		}), notes.length === 0 ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
			className: "rounded-[var(--radius-xl)] border border-dashed border-border py-10 text-center text-sm text-fg-muted",
			children: "暂无公开内容"
		}) : /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
			className: "space-y-3",
			children: notes.map((n) => {
				const book = getBook(n.book_id) ?? MARKET_BOOKS.find((b) => b.id === n.book_id);
				return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/book/$bookId",
							params: { bookId: n.book_id },
							className: "text-xs text-fg-subtle hover:text-fg",
							children: book?.title ?? n.book_id
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("blockquote", {
							className: "mt-2 border-l-2 border-accent/40 pl-3 text-sm text-fg-muted",
							children: n.quote
						}),
						n.note && /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
							className: "mt-2 text-sm leading-relaxed",
							children: n.note
						})
					]
				}, n.id);
			})
		})] })]
	});
}
//#endregion
export { ProfilePage as component };
