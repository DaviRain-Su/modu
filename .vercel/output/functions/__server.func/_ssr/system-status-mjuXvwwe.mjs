import { i as createServerFn } from "./ssr.mjs";
import { t as dbSource } from "./db-BwYgqUFs.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { a as cloudflareWorkerConfigured, r as cfWorkerHealth } from "./worker-client-BJ3tkfEZ.mjs";
import { r as authConfigured } from "./server-L6uBiSHQ.mjs";
import { t as cloudflareAuthBackendConfigured } from "./auth-proxy-BMhqBPLD.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/system-status-mjuXvwwe.js
/**
* Public deployment diagnostics — no secrets.
*/
var getSystemStatus_createServerFn_handler = createServerRpc({
	id: "2533deed9e21caa410ef0d87a71bb8f8c2c9ee0d218a49ce08c6625ef0b8bb18",
	name: "getSystemStatus",
	filename: "src/lib/server/system-status.ts"
}, (opts) => getSystemStatus.__executeServer(opts));
var getSystemStatus = createServerFn({ method: "GET" }).handler(getSystemStatus_createServerFn_handler, async () => {
	const has = (k) => Boolean(process.env[k]?.trim());
	const betterAuthUrl = process.env.BETTER_AUTH_URL?.trim() || null;
	const vercelUrl = process.env.VERCEL_URL?.trim() || null;
	const r2Public = Boolean(process.env.VITE_R2_PUBLIC_URL?.trim() || process.env.R2_PUBLIC_URL?.trim());
	const cloudflareAiRest = has("CLOUDFLARE_ACCOUNT_ID") && (has("CLOUDFLARE_API_KEY") || has("CF_API_TOKEN"));
	const grokAuthCustom = has("GROK_AUTH_CLIENT_ID") && has("GROK_AUTH_CLIENT_SECRET");
	const cfAuth = cloudflareAuthBackendConfigured();
	const workerConfigured = cloudflareWorkerConfigured() || cfAuth;
	let workerReachable = false;
	let workerDetail = null;
	if (workerConfigured || cfAuth) {
		const h = await cfWorkerHealth();
		workerReachable = h.ok;
		workerDetail = h.detail;
	}
	const persistentDb = cfAuth || dbSource === "neon";
	return {
		ok: true,
		database: cfAuth ? "cloudflare-d1" : dbSource,
		persistentDatabase: persistentDb,
		authBackend: cfAuth ? "cloudflare-worker" : dbSource === "neon" ? "neon" : "pglite",
		emailPasswordEnabled: true,
		federatedAuthConfigured: authConfigured || cfAuth,
		loginMethods: [
			{
				id: "google",
				label: "Google"
			},
			{
				id: "x",
				label: "X"
			},
			{
				id: "email",
				label: "邮箱"
			}
		],
		grokAuthCustom,
		betterAuthUrlSet: Boolean(betterAuthUrl),
		vercelUrl,
		r2Configured: r2Public || workerConfigured,
		cloudflareAiConfigured: cloudflareAiRest || workerReachable,
		cloudflareWorker: {
			configured: Boolean(process.env.MODU_CF_API_URL?.trim()),
			reachable: workerReachable,
			authOnD1: cfAuth,
			detail: workerDetail
		},
		aiGatewayConfigured: has("AI_GATEWAY_ID"),
		loginReady: persistentDb || false,
		notes: [
			cfAuth ? workerReachable ? "登录已接到 Cloudflare Worker + D1（账号会持久保存）。" : "已配置 MODU_CF_API_URL，但 Worker 不可达 — 请确认 wrangler deploy 与密钥。" : "未配置 Cloudflare 后端：设置 MODU_CF_API_URL 后登录将写入 D1。",
			!persistentDb ? "当前无持久库：正式站请部署 Cloudflare Worker（推荐）或 DATABASE_URL。" : "持久存储已就绪。",
			!grokAuthCustom ? "Google / X：正式域需 GROK_AUTH_CLIENT_ID/SECRET（可写入 Worker secret）。" : "已配置 Google / X OAuth。",
			!cloudflareAiRest && !workerReachable ? "官方 AI 将本地降级，直到 Worker 或 CF 密钥就绪。" : "官方 AI 通道可用。"
		]
	};
});
//#endregion
export { getSystemStatus_createServerFn_handler };
