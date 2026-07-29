import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { g as Link, v as useNavigate } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { i as createServerFn } from "./ssr.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
import { a as signInWithEmail, i as signIn, r as getBearerToken, s as signUpWithEmail, t as authClient } from "./client-Cb5BphvN.mjs";
import { t as useCurrentUserState } from "./use-current-user-BQCksqXS.mjs";
import { t as Button } from "./button-DffftdNv.mjs";
import { t as Input } from "./input-C-9hCiFR.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-D3goAFTK.mjs";
import { t as ensureMyProfile } from "./profile-Cdbo4bpy.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { N as BookOpen, a as TriangleAlert, v as LoaderCircle } from "../_libs/lucide-react.mjs";
import { t as GROK_PROVIDERS } from "./server-L6uBiSHQ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/login-DFks8OrH.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/** Brand icons for login (no external assets). */
function GoogleIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 24 24",
		"aria-hidden": true,
		focusable: "false",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#4285F4",
				d: "M23.49 12.27c0-.79-.07-1.54-.2-2.27H12v4.3h6.44a5.5 5.5 0 0 1-2.39 3.61v3h3.86c2.26-2.08 3.58-5.15 3.58-8.64Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#34A853",
				d: "M12 24c3.24 0 5.96-1.07 7.95-2.9l-3.86-3c-1.07.72-2.45 1.15-4.09 1.15-3.14 0-5.8-2.12-6.75-4.97H1.27v3.1A12 12 0 0 0 12 24Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#FBBC05",
				d: "M5.25 14.28A7.2 7.2 0 0 1 4.87 12c0-.79.14-1.56.38-2.28V6.62H1.27A12 12 0 0 0 0 12c0 1.94.46 3.77 1.27 5.38l3.98-3.1Z"
			}),
			/* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", {
				fill: "#EA4335",
				d: "M12 4.75c1.76 0 3.34.61 4.58 1.8l3.43-3.43C17.95 1.19 15.24 0 12 0 7.31 0 3.26 2.69 1.27 6.62l3.98 3.1C6.2 6.87 8.86 4.75 12 4.75Z"
			})
		]
	});
}
function XIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("svg", {
		className,
		viewBox: "0 0 24 24",
		"aria-hidden": true,
		focusable: "false",
		fill: "currentColor",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.727-8.835L1.992 2.25H8.08l4.253 5.622L18.244 2.25Zm-1.161 17.52h1.833L7.084 4.126H5.117L17.083 19.77Z" })
	});
}
function MailIcon({ className }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("svg", {
		className,
		viewBox: "0 0 24 24",
		fill: "none",
		stroke: "currentColor",
		strokeWidth: "1.75",
		strokeLinecap: "round",
		strokeLinejoin: "round",
		"aria-hidden": true,
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("rect", {
			x: "3",
			y: "5",
			width: "18",
			height: "14",
			rx: "2"
		}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("path", { d: "m3 7 9 6 9-6" })]
	});
}
/**
* Public deployment diagnostics — no secrets.
*/
var getSystemStatus = createServerFn({ method: "GET" }).handler(createSsrRpc("2533deed9e21caa410ef0d87a71bb8f8c2c9ee0d218a49ce08c6625ef0b8bb18"));
function providerIcon(providerId) {
	if (providerId.includes("google")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(GoogleIcon, { className: "h-5 w-5 shrink-0" });
	if (providerId.includes("x") || providerId.includes("twitter")) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(XIcon, { className: "h-4 w-4 shrink-0" });
	return null;
}
function providerLabel(providerId, fallback) {
	if (providerId.includes("google")) return "使用 Google 继续";
	if (providerId.includes("x") || providerId.includes("twitter")) return "使用 X 继续";
	return `使用 ${fallback} 继续`;
}
function LoginPage() {
	const navigate = useNavigate();
	const { user, isPending } = useCurrentUserState();
	const [mode, setMode] = (0, import_react.useState)("signin");
	const [email, setEmail] = (0, import_react.useState)("");
	const [password, setPassword] = (0, import_react.useState)("");
	const [name, setName] = (0, import_react.useState)("");
	const [busy, setBusy] = (0, import_react.useState)(false);
	const [oauthBusy, setOauthBusy] = (0, import_react.useState)(null);
	const [status, setStatus] = (0, import_react.useState)(null);
	(0, import_react.useEffect)(() => {
		if (!isPending && user) navigate({ to: "/account" });
	}, [
		user,
		isPending,
		navigate
	]);
	(0, import_react.useEffect)(() => {
		getSystemStatus().then(setStatus).catch(() => setStatus(null));
	}, []);
	(0, import_react.useEffect)(() => {
		if (typeof window === "undefined") return;
		if (new URLSearchParams(window.location.search).get("error") === "oauth") toast.error("社交登录未完成，请重试或改用邮箱");
	}, []);
	async function afterAuth() {
		try {
			await authClient.getSession();
		} catch {}
		try {
			await ensureMyProfile();
		} catch {}
		if (typeof window !== "undefined") {
			window.location.assign("/account");
			return;
		}
		navigate({ to: "/account" });
	}
	async function onSocial(providerId) {
		if (oauthBusy || busy) return;
		setOauthBusy(providerId);
		try {
			await signIn(providerId, {
				callbackURL: "/account",
				errorCallbackURL: "/login?error=oauth"
			});
			if (getBearerToken()) await afterAuth();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "登录失败";
			if (/pop-up|popup|blocked/i.test(msg)) toast.error("浏览器拦截了登录弹窗，请允许弹窗后重试");
			else if (/cancel/i.test(msg)) toast.message("已取消登录");
			else toast.error(msg);
		} finally {
			setOauthBusy(null);
		}
	}
	async function onEmailSubmit(e) {
		e.preventDefault();
		if (busy || oauthBusy) return;
		setBusy(true);
		try {
			if (mode === "signup") {
				await signUpWithEmail({
					email: email.trim(),
					password,
					name: name.trim() || email.split("@")[0] || "读者"
				});
				toast.success("注册成功");
			} else {
				await signInWithEmail({
					email: email.trim(),
					password
				});
				toast.success("登录成功");
			}
			if (!getBearerToken()) {
				if (!(await authClient.getSession()).data?.user) throw new Error("登录响应成功，但会话未能保存。请改用 HTTPS 正式域名，或刷新后重试。");
			}
			await afterAuth();
		} catch (err) {
			const msg = err instanceof Error ? err.message : "操作失败";
			if (/invalid origin|forbidden/i.test(msg)) toast.error("登录被拒绝（Invalid origin）。正式站请设置 BETTER_AUTH_URL 为当前网站地址。");
			else if (/failed to fetch|network/i.test(msg)) toast.error("无法连接登录服务，请检查网络后重试");
			else if (/user already exists|already exists/i.test(msg)) {
				toast.error("该邮箱已注册，请直接登录");
				setMode("signin");
			} else if (/invalid.*password|invalid.*email|credentials/i.test(msg)) toast.error("邮箱或密码不正确。若刚换了环境，需重新注册（数据未持久化）。");
			else if (status && !status.persistentDatabase && /invalid|credential|password|user/i.test(msg)) toast.error(`${msg}（当前无持久数据库：重启/重新发布后旧账号会消失，请重新注册）`);
			else toast.error(msg);
		} finally {
			setBusy(false);
		}
	}
	const showDeployWarning = status && (!status.persistentDatabase || !status.grokAuthCustom || !status.cloudflareWorker.configured);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto flex min-h-[70vh] max-w-md flex-col justify-center py-8",
		children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-8 text-center",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "mx-auto mb-3 flex h-12 w-12 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-fg",
						children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(BookOpen, { className: "h-5 w-5" })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
						className: "font-serif text-2xl font-medium tracking-tight",
						children: "登录墨读"
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-sm text-fg-muted",
						children: "Google · X · 邮箱 —— 同步书架、批注与 AI 档案"
					})
				]
			}),
			showDeployWarning ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mb-4 rounded-[var(--radius-lg)] border border-border bg-bg-subtle/80 px-3 py-3 text-xs leading-relaxed text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "mb-1.5 flex items-center gap-1.5 font-medium text-fg",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(TriangleAlert, { className: "h-3.5 w-3.5 text-accent" }), "运行环境提示"]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
						className: "space-y-1",
						children: status.notes.slice(0, 3).map((n) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", n] }, n))
					}),
					!status.persistentDatabase ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "mt-2 text-fg",
						children: "当前账号只存在内存里：服务重启或重新发布后，请用同一邮箱重新注册。"
					}) : null
				]
			}) : null,
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, {
				className: "pb-3",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: mode === "signin" ? "欢迎回来" : "创建账户"
				})
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardContent, {
				className: "space-y-5",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2.5",
						children: GROK_PROVIDERS.map((p) => {
							const loading = oauthBusy === p.providerId;
							return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
								type: "button",
								disabled: Boolean(oauthBusy) || busy,
								onClick: () => void onSocial(p.providerId),
								className: cn("flex h-12 w-full items-center justify-center gap-3 rounded-[var(--radius-lg)] border border-border bg-bg px-4 text-sm font-medium transition-colors", "hover:bg-bg-subtle disabled:opacity-50"),
								children: [loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : providerIcon(p.providerId), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: providerLabel(p.providerId, p.label) })]
							}, p.providerId);
						})
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "relative py-1 text-center text-xs text-fg-subtle",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", {
							className: "relative z-10 bg-bg-elevated px-2",
							children: "或使用邮箱"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "absolute inset-x-0 top-1/2 h-px bg-border" })]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("form", {
						className: "space-y-3",
						onSubmit: (e) => void onEmailSubmit(e),
						children: [
							mode === "signup" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-fg-muted",
									children: "昵称"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: name,
									onChange: (e) => setName(e.target.value),
									placeholder: "怎么称呼你",
									autoComplete: "nickname"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-fg-muted",
									children: "邮箱"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "email",
									required: true,
									value: email,
									onChange: (e) => setEmail(e.target.value),
									placeholder: "you@example.com",
									autoComplete: "email"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-fg-muted",
									children: "密码"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									required: true,
									minLength: 8,
									value: password,
									onChange: (e) => setPassword(e.target.value),
									placeholder: "至少 8 位",
									autoComplete: mode === "signup" ? "new-password" : "current-password"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								type: "submit",
								className: "h-12 w-full",
								disabled: busy || Boolean(oauthBusy),
								children: busy ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-4 w-4 animate-spin" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(MailIcon, { className: "h-4 w-4" }), mode === "signin" ? "邮箱登录" : "邮箱注册"] })
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-sm text-fg-muted",
						children: mode === "signin" ? /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"还没有账户？",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-fg underline-offset-4 hover:underline",
								onClick: () => setMode("signup"),
								children: "注册"
							})
						] }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
							"已有账户？",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("button", {
								type: "button",
								className: "text-fg underline-offset-4 hover:underline",
								onClick: () => setMode("signin"),
								children: "登录"
							})
						] })
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
						className: "text-center text-[11px] leading-relaxed text-fg-subtle",
						children: "支持 Google、X 与邮箱。若提示密码错误，多半是环境重启后旧账号已清空——点注册即可。"
					})
				] })
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "mt-6 text-center text-xs text-fg-subtle",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
						to: "/",
						className: "hover:text-fg",
						children: "返回首页"
					}),
					" · ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "/api/health",
						className: "hover:text-fg",
						children: "系统状态"
					})
				]
			})
		]
	});
}
//#endregion
export { LoginPage as component };
