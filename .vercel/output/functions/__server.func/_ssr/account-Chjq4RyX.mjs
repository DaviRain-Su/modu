import { o as __toESM } from "../_runtime.mjs";
import { t as cn } from "./utils-D0dWsYTS.mjs";
import { n as require_react } from "../_libs/@radix-ui/react-compose-refs+[...].mjs";
import { _ as Navigate, g as Link } from "../_libs/@tanstack/react-router+[...].mjs";
import { n as require_jsx_runtime } from "../_libs/radix-ui__react-context+react.mjs";
import { a as saveMyAiSettings, i as getMySubscription, n as activateSubscription, r as getMyAiSettings, t as AI_PROVIDERS } from "./ai-settings-0KnAD0Wt.mjs";
import { t as useCurrentUserState } from "./use-current-user-P8rJMwUh.mjs";
import { t as Button } from "./button-DffftdNv.mjs";
import { t as Input } from "./input-C-9hCiFR.mjs";
import { r as listMyConversations, t as Textarea } from "./ai-conversations-Bw0JpuEA.mjs";
import { t as Badge } from "./badge-DAVRaZYe.mjs";
import { i as CardTitle, n as CardContent, r as CardHeader, t as Card } from "./card-D3goAFTK.mjs";
import { a as updateMyProfile, n as getMyProfile } from "./profile-DXCzgVDC.mjs";
import { n as toast } from "../_libs/sonner.mjs";
import { _ as LoaderCircle, s as Sparkles } from "../_libs/lucide-react.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/account-Chjq4RyX.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Auth state components — plain wrappers around `useCurrentUserState()`.
*
* Auth is ON by default (including the sandbox live preview, which does real
* sign-in). Visitors are signed out until they authenticate. The shared dev
* user only appears when auth is explicitly disabled (`VITE_AUTH_ENABLED=false`).
* While the session is still resolving, gates that care about signed-out state
* render nothing so there's no signed-out flash on hard reload.
*/
/** Where `RedirectToSignIn` sends signed-out visitors. Create this route. */
var SIGN_IN_PATH = "/login";
/**
* Client-side redirect to the sign-in route (TanStack `<Navigate>` — NOT a full
* `window.location` reload). A hard navigation re-bootstraps the SPA and re-runs
* session loading, which feels like a second "Loading…" on /login.
*
* Guard routes by waiting out `isPending` first (see `use-current-user`), then
* render this.
*/
function RedirectToSignIn({ to = SIGN_IN_PATH }) {
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Navigate, { to });
}
var PLANS = [
	{
		id: "free",
		name: "免费",
		price: "¥0",
		perks: [
			"书城与阅读器",
			"公开批注",
			"官方 AI 每日额度",
			"对话云端档案"
		]
	},
	{
		id: "plus",
		name: "Plus",
		price: "¥18/月",
		perks: [
			"更高官方 AI 额度",
			"优先模型",
			"个人主页徽章"
		]
	},
	{
		id: "pro",
		name: "Pro",
		price: "¥48/月",
		perks: [
			"更高额度",
			"后续增值功能优先",
			"适合重度阅读"
		]
	}
];
function AccountPage() {
	const { user, isPending } = useCurrentUserState();
	const [hydrated, setHydrated] = (0, import_react.useState)(false);
	const [loading, setLoading] = (0, import_react.useState)(true);
	const [displayName, setDisplayName] = (0, import_react.useState)("");
	const [bio, setBio] = (0, import_react.useState)("");
	const [provider, setProvider] = (0, import_react.useState)("official");
	const [apiKey, setApiKey] = (0, import_react.useState)("");
	const [baseUrl, setBaseUrl] = (0, import_react.useState)("");
	const [model, setModel] = (0, import_react.useState)("");
	const [keyMasked, setKeyMasked] = (0, import_react.useState)("");
	const [hasKey, setHasKey] = (0, import_react.useState)(false);
	const [plan, setPlan] = (0, import_react.useState)("free");
	const [saving, setSaving] = (0, import_react.useState)(false);
	const [convoCount, setConvoCount] = (0, import_react.useState)(0);
	(0, import_react.useEffect)(() => {
		setHydrated(true);
	}, []);
	(0, import_react.useEffect)(() => {
		if (!user) return;
		let cancelled = false;
		(async () => {
			try {
				const [profile, ai, sub, convos] = await Promise.all([
					getMyProfile(),
					getMyAiSettings(),
					getMySubscription(),
					listMyConversations({ data: {} })
				]);
				if (cancelled) return;
				setDisplayName(profile.displayName);
				setBio(profile.bio);
				setProvider(ai.provider);
				setBaseUrl(ai.baseUrl);
				setModel(ai.model);
				setKeyMasked(ai.apiKeyMasked);
				setHasKey(ai.hasApiKey);
				setPlan(sub.plan);
				setConvoCount(convos.length);
			} catch (e) {
				toast.error(e instanceof Error ? e.message : "加载账户失败");
			} finally {
				if (!cancelled) setLoading(false);
			}
		})();
		return () => {
			cancelled = true;
		};
	}, [user]);
	if (!hydrated || isPending) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
		className: "flex min-h-[40vh] items-center justify-center text-fg-muted",
		children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(LoaderCircle, { className: "h-5 w-5 animate-spin" })
	});
	if (!user) return /* @__PURE__ */ (0, import_jsx_runtime.jsx)(RedirectToSignIn, {});
	async function saveProfile() {
		setSaving(true);
		try {
			await updateMyProfile({ data: {
				displayName,
				bio
			} });
			toast.success("资料已保存");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "保存失败");
		} finally {
			setSaving(false);
		}
	}
	async function saveAi() {
		setSaving(true);
		try {
			await saveMyAiSettings({ data: {
				provider,
				apiKey: apiKey || void 0,
				baseUrl,
				model
			} });
			const ai = await getMyAiSettings();
			setKeyMasked(ai.apiKeyMasked);
			setHasKey(ai.hasApiKey);
			setApiKey("");
			toast.success("AI 设置已保存");
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "保存失败");
		} finally {
			setSaving(false);
		}
	}
	async function pickPlan(id) {
		setSaving(true);
		try {
			await activateSubscription({ data: id });
			setPlan(id);
			toast.success(id === "free" ? "已切换到免费档" : `已开通 ${id.toUpperCase()}（演示：本地记账，无真实扣款）`);
		} catch (e) {
			toast.error(e instanceof Error ? e.message : "订阅失败");
		} finally {
			setSaving(false);
		}
	}
	const meta = AI_PROVIDERS.find((p) => p.id === provider);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
		className: "mx-auto max-w-3xl space-y-8",
		children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
			className: "flex flex-wrap items-end justify-between gap-3",
			children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h1", {
				className: "font-serif text-3xl font-medium tracking-tight",
				children: "账户"
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "mt-1 flex flex-wrap items-center gap-2 text-fg-muted",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: user.primaryEmail ?? user.displayName }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "·" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("span", { children: "当前订阅" }),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Badge, {
						variant: "accent",
						children: plan
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("span", {
						className: "text-xs text-fg-subtle",
						children: [
							"· 伴读对话 ",
							convoCount,
							" 段"
						]
					})
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
				asChild: true,
				variant: "secondary",
				children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Link, {
					to: "/u/$userId",
					params: { userId: user.id },
					children: "我的主页"
				})
			})]
		}), loading ? /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", { className: "h-40 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" }) : /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(import_jsx_runtime.Fragment, { children: [
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardHeader, { children: /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
				className: "text-base",
				children: "个人资料"
			}) }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-3",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-fg-muted",
							children: "显示名"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
							value: displayName,
							onChange: (e) => setDisplayName(e.target.value)
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-1.5",
						children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
							className: "text-xs text-fg-muted",
							children: "简介"
						}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Textarea, {
							value: bio,
							onChange: (e) => setBio(e.target.value),
							placeholder: "一句话介绍你的阅读品味",
							rows: 3
						})]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void saveProfile(),
						disabled: saving,
						children: "保存资料"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(Card, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardHeader, { children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
				className: "flex items-center gap-2",
				children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Sparkles, { className: "h-4 w-4 text-accent" }), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(CardTitle, {
					className: "text-base",
					children: "AI · Pi 内核"
				})]
			}), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("p", {
				className: "text-sm text-fg-muted",
				children: [
					"阅读器内边读边问；多轮对话写入你的账户档案（Cloudflare R2 key 布局）。模型经",
					" ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("a", {
						href: "https://pi.dev",
						target: "_blank",
						rel: "noreferrer",
						className: "text-fg underline-offset-2 hover:underline",
						children: "pi.dev"
					}),
					" ",
					"的 ",
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
						className: "text-xs",
						children: "@earendil-works/pi-ai"
					}),
					" ",
					"统一调度。"
				]
			})] }), /* @__PURE__ */ (0, import_jsx_runtime.jsxs)(CardContent, {
				className: "space-y-4",
				children: [
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
						className: "grid gap-2 sm:grid-cols-2",
						children: AI_PROVIDERS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("button", {
							type: "button",
							onClick: () => {
								setProvider(p.id);
								if (!baseUrl || meta?.defaultBase === baseUrl) setBaseUrl(p.defaultBase);
								if (!model || meta?.defaultModel === model) setModel(p.defaultModel);
							},
							className: cn("rounded-[var(--radius-lg)] border p-3 text-left transition-colors", provider === p.id ? "border-accent bg-accent/10" : "border-border bg-bg-subtle/40 hover:bg-bg-subtle"),
							children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm font-medium",
								children: p.label
							}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-xs leading-relaxed text-fg-subtle",
								children: p.hint
							})]
						}, p.id))
					}),
					provider !== "official" && /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "space-y-3 rounded-[var(--radius-lg)] border border-border bg-bg p-4",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("label", {
									className: "text-xs text-fg-muted",
									children: ["API Key ", hasKey ? `（已保存 ${keyMasked}）` : ""]
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									type: "password",
									value: apiKey,
									onChange: (e) => setApiKey(e.target.value),
									placeholder: hasKey ? "留空则保持原密钥" : "sk-…",
									autoComplete: "off"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-fg-muted",
									children: "Base URL"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: baseUrl,
									onChange: (e) => setBaseUrl(e.target.value),
									placeholder: "https://api.example.com/v1 或 AI Gateway compat"
								})]
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
								className: "space-y-1.5",
								children: [/* @__PURE__ */ (0, import_jsx_runtime.jsx)("label", {
									className: "text-xs text-fg-muted",
									children: "模型"
								}), /* @__PURE__ */ (0, import_jsx_runtime.jsx)(Input, {
									value: model,
									onChange: (e) => setModel(e.target.value),
									placeholder: "model-id"
								})]
							})
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: "rounded-[var(--radius-md)] border border-border bg-bg-subtle/50 p-3 text-xs leading-relaxed text-fg-muted",
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("strong", {
								className: "text-fg",
								children: "架构（参考 liber）："
							}),
							"阅读器只关心「边读边问」；服务端用 Pi 选模型，对话落库并镜像到",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[10px]",
								children: "ai-chats/{userId}/{bookId}/….json"
							}),
							"。官方路径部署后配置",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[10px]",
								children: "CLOUDFLARE_ACCOUNT_ID"
							}),
							" +",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[10px]",
								children: "CLOUDFLARE_API_KEY"
							}),
							"（可选",
							" ",
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("code", {
								className: "text-[10px]",
								children: "AI_GATEWAY_ID"
							}),
							"）即可走 Workers AI / AI Gateway。"
						]
					}),
					/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
						onClick: () => void saveAi(),
						disabled: saving,
						children: "保存 AI 设置"
					})
				]
			})] }),
			/* @__PURE__ */ (0, import_jsx_runtime.jsxs)("section", { children: [
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("h2", {
					className: "mb-3 font-serif text-xl font-medium",
					children: "官方订阅"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("p", {
					className: "mb-4 text-sm text-fg-muted",
					children: "不使用自有 API 时，用官方额度。以下为演示开通（无真实支付）。"
				}),
				/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
					className: "grid gap-3 sm:grid-cols-3",
					children: PLANS.map((p) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("div", {
						className: cn("flex flex-col rounded-[var(--radius-xl)] border p-4", plan === p.id ? "border-accent bg-accent/10" : "border-border bg-bg-elevated"),
						children: [
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "text-sm text-fg-muted",
								children: p.name
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("div", {
								className: "mt-1 text-2xl font-medium tracking-tight",
								children: p.price
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)("ul", {
								className: "mt-3 flex-1 space-y-1.5 text-xs text-fg-muted",
								children: p.perks.map((x) => /* @__PURE__ */ (0, import_jsx_runtime.jsxs)("li", { children: ["· ", x] }, x))
							}),
							/* @__PURE__ */ (0, import_jsx_runtime.jsx)(Button, {
								className: "mt-4 w-full",
								variant: plan === p.id ? "secondary" : "default",
								size: "sm",
								disabled: saving || plan === p.id,
								onClick: () => void pickPlan(p.id),
								children: plan === p.id ? "当前方案" : "选择"
							})
						]
					}, p.id))
				})
			] })
		] })]
	});
}
//#endregion
export { AccountPage as component };
