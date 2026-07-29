import { i as __toESM } from "../_runtime.mjs";
import { r as cn } from "./catalog-DJAw_Q2w.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { t as useLibraryStore } from "./library-CletUrRH.mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRoute, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { t as Route$5 } from "./book._bookId-DGK1AwIE.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { D as BookMarked, E as BookOpen, b as House, n as Upload, v as Library } from "../_libs/lucide-react.mjs";
import { t as Route$6 } from "./read._bookId-CHWEk0Qt.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Cu1L4TUk.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
var nav = [
	{
		to: "/",
		label: "首页",
		icon: House,
		match: (p) => p === "/"
	},
	{
		to: "/library",
		label: "书城",
		icon: Library,
		match: (p) => p.startsWith("/library") || p.startsWith("/book")
	},
	{
		to: "/shelf",
		label: "书架",
		icon: BookMarked,
		match: (p) => p.startsWith("/shelf")
	},
	{
		to: "/upload",
		label: "上传",
		icon: Upload,
		match: (p) => p.startsWith("/upload")
	}
];
function AppShell({ children, hideNav }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.startsWith("/read") || hideNav) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md safe-pt",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6",
					children: [
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: "/",
							className: "flex items-center gap-2.5",
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
								className: "flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-fg",
								children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, {
									className: "h-4 w-4",
									strokeWidth: 1.75
								})
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "leading-tight",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "text-sm font-semibold tracking-tight",
									children: "墨读"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
									className: "hidden text-[11px] text-fg-subtle sm:block",
									children: "沉浸阅读 · AI 伴读"
								})]
							})]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
							className: "hidden items-center gap-1 md:flex",
							children: nav.map((item) => {
								const active = item.match(pathname);
								return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: item.to,
									className: cn("rounded-[var(--radius-md)] px-3.5 py-2 text-sm transition-colors", active ? "bg-bg-subtle text-fg" : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg"),
									children: item.label
								}, item.to);
							})
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
							to: "/library",
							className: "hidden rounded-[var(--radius-md)] bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg sm:inline-flex",
							children: "开始阅读"
						})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 sm:pt-8",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md safe-pb md:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "mx-auto grid max-w-lg grid-cols-4 px-2 pt-1",
					children: nav.map((item) => {
						const Icon = item.icon;
						const active = item.match(pathname);
						return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
							to: item.to,
							className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]", active ? "text-fg" : "text-fg-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Icon, {
								className: "h-5 w-5",
								strokeWidth: active ? 2.1 : 1.7
							}), item.label]
						}, item.to);
					})
				})
			})
		]
	});
}
var styles_default = "/assets/styles-BZQMSwv7.css";
var Route$4 = createRootRoute({
	head: () => ({
		meta: [
			{ charSet: "utf-8" },
			{
				name: "viewport",
				content: "width=device-width, initial-scale=1, viewport-fit=cover"
			},
			{ title: "墨读 · 在线阅读器" },
			{
				name: "description",
				content: "墨读 — 支持 PDF / EPUB 的在线阅读器，书城精选、本地上传、AI 伴读，手机与电脑皆宜。"
			},
			{
				name: "theme-color",
				content: "#0b0b0c"
			}
		],
		links: [{
			rel: "stylesheet",
			href: styles_default
		}]
	}),
	component: RootComponent
});
function RootComponent() {
	const init = useLibraryStore((s) => s.init);
	(0, import_react.useEffect)(() => {
		init();
	}, [init]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("html", {
		lang: "zh-CN",
		suppressHydrationWarning: true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
				theme: "dark",
				position: "top-center",
				toastOptions: { className: "border border-border bg-bg-elevated text-fg" }
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})
		] })]
	});
}
var $$splitComponentImporter$3 = () => import("./routes-BidKI8wc.mjs");
var Route$3 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./library-xm16aUCf.mjs");
var Route$2 = createFileRoute("/library")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./shelf-2YN-pXvS.mjs");
var Route$1 = createFileRoute("/shelf")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./upload-RYMlpZY_.mjs");
var Route = createFileRoute("/upload")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var rootRouteChildren = {
	IndexRoute: Route$3.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$4
	}),
	LibraryRoute: Route$2.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$4
	}),
	ShelfRoute: Route$1.update({
		id: "/shelf",
		path: "/shelf",
		getParentRoute: () => Route$4
	}),
	UploadRoute: Route.update({
		id: "/upload",
		path: "/upload",
		getParentRoute: () => Route$4
	}),
	BookBookIdRoute: Route$5.update({
		id: "/book/$bookId",
		path: "/book/$bookId",
		getParentRoute: () => Route$4
	}),
	ReadBookIdRoute: Route$6.update({
		id: "/read/$bookId",
		path: "/read/$bookId",
		getParentRoute: () => Route$4
	})
};
var routeTree = Route$4._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
