import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { c as HeadContent, d as createRouter, f as Outlet, g as Link, h as createRootRoute, l as useRouterState, m as createFileRoute, p as lazyRouteComponent, s as Scripts } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { o as signOut } from "./client-Cb5BphvN.mjs";
import { t as useCurrentUserState } from "./use-current-user-BQCksqXS.mjs";
import { t as Toaster } from "../_libs/sonner.mjs";
import { D as Flame, N as BookOpen, P as BookMarked, S as Library, r as UserRound, w as House } from "../_libs/lucide-react.mjs";
import { t as dbSource } from "./db-BwYgqUFs.mjs";
import { a as cloudflareWorkerConfigured, r as cfWorkerHealth } from "./worker-client-BJ3tkfEZ.mjs";
import { n as auth, r as authConfigured } from "./server-L6uBiSHQ.mjs";
import { t as useLibraryStore } from "./library---StLbl3.mjs";
import { t as Route$10 } from "./book._bookId-BxMcutHq.mjs";
import { t as Route$11 } from "./read._bookId-DxKvxh2C.mjs";
import { n as proxyAuthToCloudflare, t as cloudflareAuthBackendConfigured } from "./auth-proxy-BMhqBPLD.mjs";
import { t as Route$12 } from "./u._userId-CR30xn5Q.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/router-Btngtp8T.js
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
		to: "/rankings",
		label: "热榜",
		icon: Flame,
		match: (p) => p.startsWith("/rankings")
	},
	{
		to: "/shelf",
		label: "书架",
		icon: BookMarked,
		match: (p) => p.startsWith("/shelf")
	}
];
function AuthSlot() {
	const { user, isPending } = useCurrentUserState();
	if (isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-9 w-20 animate-pulse rounded-[var(--radius-md)] bg-bg-subtle" });
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
		to: "/login",
		className: "rounded-[var(--radius-md)] bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg",
		children: "登录"
	});
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "flex items-center gap-2",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
			to: "/account",
			className: "flex max-w-[9rem] items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm hover:bg-bg-subtle",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "flex h-8 w-8 items-center justify-center rounded-full bg-bg-subtle text-xs font-medium",
				children: (user.displayName ?? user.primaryEmail ?? "U").charAt(0)
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
				className: "hidden truncate sm:inline",
				children: user.displayName ?? "账户"
			})]
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
			type: "button",
			onClick: () => void signOut(),
			className: "hidden text-xs text-fg-subtle hover:text-fg md:inline",
			children: "退出"
		})]
	});
}
function AppShell({ children, hideNav }) {
	const pathname = useRouterState({ select: (s) => s.location.pathname });
	if (pathname.startsWith("/read") || hideNav) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "min-h-dvh bg-bg text-fg",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("header", {
				className: "sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md safe-pt",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6",
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
						/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("nav", {
							className: "hidden items-center gap-1 lg:flex",
							children: [
								nav.map((item) => {
									const active = item.match(pathname);
									return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
										to: item.to,
										className: cn("rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors", active ? "bg-bg-subtle text-fg" : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg"),
										children: item.label
									}, item.to);
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/upload",
									className: cn("rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors", pathname.startsWith("/upload") ? "bg-bg-subtle text-fg" : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg"),
									children: "上传"
								}),
								/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
									to: "/account",
									className: cn("rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors", pathname.startsWith("/account") ? "bg-bg-subtle text-fg" : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg"),
									children: "账户"
								})
							]
						}),
						/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AuthSlot, {})
					]
				})
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("main", {
				className: "mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 sm:pt-8",
				children
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("nav", {
				className: "fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md safe-pb lg:hidden",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
					className: "mx-auto grid max-w-lg grid-cols-5 px-1 pt-1",
					children: [nav.map((item) => {
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
					}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Link, {
						to: "/account",
						className: cn("flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]", pathname.startsWith("/account") || pathname.startsWith("/login") ? "text-fg" : "text-fg-subtle"),
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(UserRound, {
							className: "h-5 w-5",
							strokeWidth: pathname.startsWith("/account") ? 2.1 : 1.7
						}), "我的"]
					})]
				})
			})
		]
	});
}
/**
* App-wide client provider mounted once near the root (in `src/routes/__root.tsx`):
*
*   <AuthProvider><Outlet /></AuthProvider>
*
* Better Auth's React client (`@/lib/auth/client`) needs NO context provider —
* its `useSession()` works standalone — so this is a passthrough today. It's
* kept as the single, stable mount point for any future client-side providers
* (e.g. a toast or theme provider) without churning the root shell.
*/
function AuthProvider({ children }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(import_jsx_runtime.Fragment, { children });
}
var styles_default = "/assets/styles-Cb0_K38e.css";
var Route$9 = createRootRoute({
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
				content: "墨读 — 支持 PDF / EPUB 的在线阅读器，书城精选、本地上传、AI 伴读与公开批注，手机与电脑皆宜。"
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
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("head", { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(HeadContent, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("body", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(AuthProvider, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(AppShell, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Outlet, {}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Toaster, {
			theme: "dark",
			position: "top-center",
			toastOptions: { className: "border border-border bg-bg-elevated text-fg" }
		})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Scripts, {})] })]
	});
}
var $$splitComponentImporter$6 = () => import("./routes-CWY_89g7.mjs");
var Route$8 = createFileRoute("/")({ component: lazyRouteComponent($$splitComponentImporter$6, "component") });
var $$splitComponentImporter$5 = () => import("./account-BWkqvxOh.mjs");
var Route$7 = createFileRoute("/account")({ component: lazyRouteComponent($$splitComponentImporter$5, "component") });
var $$splitComponentImporter$4 = () => import("./library-Bch4nqIf.mjs");
var Route$6 = createFileRoute("/library")({ component: lazyRouteComponent($$splitComponentImporter$4, "component") });
var $$splitComponentImporter$3 = () => import("./login-DFks8OrH.mjs");
var Route$5 = createFileRoute("/login")({ component: lazyRouteComponent($$splitComponentImporter$3, "component") });
var $$splitComponentImporter$2 = () => import("./rankings-GbV4awvG.mjs");
var Route$4 = createFileRoute("/rankings")({ component: lazyRouteComponent($$splitComponentImporter$2, "component") });
var $$splitComponentImporter$1 = () => import("./shelf-dBxtqWlT.mjs");
var Route$3 = createFileRoute("/shelf")({ component: lazyRouteComponent($$splitComponentImporter$1, "component") });
var $$splitComponentImporter = () => import("./upload-CXymnZcu.mjs");
var Route$2 = createFileRoute("/upload")({ component: lazyRouteComponent($$splitComponentImporter, "component") });
var LOGIN_METHODS = [
	{
		id: "google",
		label: "Google",
		via: "Grok Auth Broker → Google"
	},
	{
		id: "x",
		label: "X (Twitter)",
		via: "Grok Auth Broker → X"
	},
	{
		id: "email",
		label: "邮箱密码",
		via: "Cloudflare D1 / Better Auth"
	}
];
var Route$1 = createFileRoute("/api/health")({ server: { handlers: { GET: async () => {
	const has = (k) => Boolean(process.env[k]?.trim());
	const cfAuth = cloudflareAuthBackendConfigured();
	const worker = cloudflareWorkerConfigured() || cfAuth ? await cfWorkerHealth() : {
		ok: false,
		detail: null
	};
	const body = {
		ok: true,
		service: "modu",
		time: (/* @__PURE__ */ new Date()).toISOString(),
		database: cfAuth ? "cloudflare-d1" : dbSource,
		persistentDatabase: cfAuth || dbSource === "neon",
		authBackend: cfAuth ? "cloudflare-worker" : dbSource === "neon" ? "neon" : "pglite",
		login: {
			methods: LOGIN_METHODS.map((m) => m.id),
			emailPassword: true,
			federated: authConfigured || cfAuth,
			betterAuthUrl: Boolean(process.env.BETTER_AUTH_URL?.trim()),
			grokClient: has("GROK_AUTH_CLIENT_ID"),
			cloudflareD1: cfAuth
		},
		cloudflare: {
			workerUrl: Boolean(process.env.MODU_CF_API_URL?.trim()),
			workerReachable: worker.ok,
			authOnWorker: cfAuth,
			r2: Boolean(process.env.VITE_R2_PUBLIC_URL?.trim() || process.env.R2_PUBLIC_URL?.trim()) || worker.ok,
			workersAi: worker.ok || has("CLOUDFLARE_ACCOUNT_ID") && (has("CLOUDFLARE_API_KEY") || has("CF_API_TOKEN")),
			aiGateway: has("AI_GATEWAY_ID"),
			detail: worker.detail
		}
	};
	return new Response(JSON.stringify(body, null, 2), {
		status: 200,
		headers: {
			"content-type": "application/json; charset=utf-8",
			"cache-control": "no-store"
		}
	});
} } } });
/**
* Better Auth HTTP surface.
*
* - Default: this app's Better Auth (PGLite / Neon)
* - When MODU_CF_API_URL is set: proxy to Cloudflare Worker (D1 持久登录)
*/
async function handle({ request }) {
	if (cloudflareAuthBackendConfigured()) return proxyAuthToCloudflare(request);
	return auth.handler(request);
}
var Route = createFileRoute("/api/auth/$")({ server: { handlers: {
	GET: handle,
	POST: handle
} } });
var rootRouteChildren = {
	IndexRoute: Route$8.update({
		id: "/",
		path: "/",
		getParentRoute: () => Route$9
	}),
	AccountRoute: Route$7.update({
		id: "/account",
		path: "/account",
		getParentRoute: () => Route$9
	}),
	LibraryRoute: Route$6.update({
		id: "/library",
		path: "/library",
		getParentRoute: () => Route$9
	}),
	LoginRoute: Route$5.update({
		id: "/login",
		path: "/login",
		getParentRoute: () => Route$9
	}),
	RankingsRoute: Route$4.update({
		id: "/rankings",
		path: "/rankings",
		getParentRoute: () => Route$9
	}),
	ShelfRoute: Route$3.update({
		id: "/shelf",
		path: "/shelf",
		getParentRoute: () => Route$9
	}),
	UploadRoute: Route$2.update({
		id: "/upload",
		path: "/upload",
		getParentRoute: () => Route$9
	}),
	ApiHealthRoute: Route$1.update({
		id: "/api/health",
		path: "/api/health",
		getParentRoute: () => Route$9
	}),
	BookBookIdRoute: Route$10.update({
		id: "/book/$bookId",
		path: "/book/$bookId",
		getParentRoute: () => Route$9
	}),
	ReadBookIdRoute: Route$11.update({
		id: "/read/$bookId",
		path: "/read/$bookId",
		getParentRoute: () => Route$9
	}),
	UUserIdRoute: Route$12.update({
		id: "/u/$userId",
		path: "/u/$userId",
		getParentRoute: () => Route$9
	}),
	ApiAuthSplatRoute: Route.update({
		id: "/api/auth/$",
		path: "/api/auth/$",
		getParentRoute: () => Route$9
	})
};
var routeTree = Route$9._addFileChildren(rootRouteChildren)._addFileTypes();
function getRouter() {
	return createRouter({
		routeTree,
		scrollRestoration: true
	});
}
//#endregion
export { getRouter };
