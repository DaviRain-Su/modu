import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CHxE_ZiV.mjs";
import { i as getSql } from "./db-BwYgqUFs.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { getSessionUser } from "./verify.server-uzTvClrZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-settings-Q1Asb1lv.js
var AI_PROVIDERS = [
	{
		id: "official",
		label: "墨读官方（Pi + Cloudflare）",
		hint: "经 Pi 统一层调用；部署后走 Cloudflare Workers AI / AI Gateway。预览无密钥时本地降级。",
		defaultBase: "",
		defaultModel: "modu-pi"
	},
	{
		id: "openai",
		label: "OpenAI / ChatGPT API",
		hint: "Pi → OpenAI 兼容接口。使用开发者 API Key。",
		defaultBase: "https://api.openai.com/v1",
		defaultModel: "gpt-4o-mini"
	},
	{
		id: "kimi",
		label: "Kimi（月之暗面）",
		hint: "Pi → Moonshot OpenAI 兼容接口。",
		defaultBase: "https://api.moonshot.cn/v1",
		defaultModel: "moonshot-v1-8k"
	},
	{
		id: "deepseek",
		label: "DeepSeek",
		hint: "Pi → DeepSeek API（与 liber 默认外部供应商一致）。",
		defaultBase: "https://api.deepseek.com/v1",
		defaultModel: "deepseek-chat"
	},
	{
		id: "custom",
		label: "自定义 / AI Gateway",
		hint: "任意 OpenAI 兼容端点，可填 Cloudflare AI Gateway compat URL。",
		defaultBase: "",
		defaultModel: "gpt-4o-mini"
	}
];
function maskKey(key) {
	if (!key) return "";
	if (key.length <= 8) return "••••";
	return `${key.slice(0, 3)}••••${key.slice(-4)}`;
}
async function ensureRows(sql, userId) {
	await sql`
    insert into user_profiles (user_id, display_name)
    values (${userId}, ${(await getSessionUser())?.email?.split("@")[0] || "读者"})
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into user_ai_settings (user_id, provider)
    values (${userId}, 'official')
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into user_subscriptions (user_id, plan, status)
    values (${userId}, 'free', 'active')
    on conflict (user_id) do nothing
  `;
}
var getMyAiSettings_createServerFn_handler = createServerRpc({
	id: "f6179490395e318110ce80cea2418663ed3b5de898fe9ce8498d292547a6c801",
	name: "getMyAiSettings",
	filename: "src/lib/server/ai-settings.ts"
}, (opts) => getMyAiSettings.__executeServer(opts));
var getMyAiSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyAiSettings_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureRows(sql, context.userId);
	const r = (await sql`
      select provider, api_key, base_url, model
      from user_ai_settings where user_id = ${context.userId}
    `)[0];
	const sub = await sql`
      select plan from user_subscriptions where user_id = ${context.userId}
    `;
	return {
		provider: r.provider,
		apiKeyMasked: maskKey(r.api_key),
		hasApiKey: Boolean(r.api_key),
		baseUrl: r.base_url,
		model: r.model,
		plan: sub[0]?.plan ?? "free",
		engine: "pi (@earendil-works/pi-ai)"
	};
});
var saveMyAiSettings_createServerFn_handler = createServerRpc({
	id: "a03b035bb944ffa09e19e2bd821bf548884761046c5973998fedc13e45924e0a",
	name: "saveMyAiSettings",
	filename: "src/lib/server/ai-settings.ts"
}, (opts) => saveMyAiSettings.__executeServer(opts));
var saveMyAiSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(saveMyAiSettings_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureRows(sql, context.userId);
	const meta = AI_PROVIDERS.find((p) => p.id === data.provider);
	const baseUrl = data.baseUrl?.trim() || meta?.defaultBase || "";
	const model = data.model?.trim() || meta?.defaultModel || "";
	if (data.clearKey) await sql`
        update user_ai_settings
        set provider = ${data.provider},
            api_key = '',
            base_url = ${baseUrl},
            model = ${model},
            updated_at = now()
        where user_id = ${context.userId}
      `;
	else if (data.apiKey && data.apiKey.trim()) await sql`
        update user_ai_settings
        set provider = ${data.provider},
            api_key = ${data.apiKey.trim()},
            base_url = ${baseUrl},
            model = ${model},
            updated_at = now()
        where user_id = ${context.userId}
      `;
	else await sql`
        update user_ai_settings
        set provider = ${data.provider},
            base_url = ${baseUrl},
            model = ${model},
            updated_at = now()
        where user_id = ${context.userId}
      `;
	return { ok: true };
});
var getMySubscription_createServerFn_handler = createServerRpc({
	id: "dfbbb9a9d9e00abe693a2c8c143984ccc686129d9dbe6e352997bd4112da9fc2",
	name: "getMySubscription",
	filename: "src/lib/server/ai-settings.ts"
}, (opts) => getMySubscription.__executeServer(opts));
var getMySubscription = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMySubscription_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	await ensureRows(sql, context.userId);
	const r = (await sql`
      select plan, status, renews_at::text from user_subscriptions
      where user_id = ${context.userId}
    `)[0];
	return {
		plan: r.plan,
		status: r.status,
		renewsAt: r.renews_at
	};
});
var activateSubscription_createServerFn_handler = createServerRpc({
	id: "e4bb12dac935bcd6c93922c0c097f0b736501b5a7ab12868e0639d08d23ff1a7",
	name: "activateSubscription",
	filename: "src/lib/server/ai-settings.ts"
}, (opts) => activateSubscription.__executeServer(opts));
var activateSubscription = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((plan) => plan).handler(activateSubscription_createServerFn_handler, async ({ context, data: plan }) => {
	const sql = await getSql();
	await ensureRows(sql, context.userId);
	await sql`
      update user_subscriptions
      set plan = ${plan},
          status = 'active',
          renews_at = ${plan === "free" ? null : new Date(Date.now() + 720 * 3600 * 1e3).toISOString()},
          updated_at = now()
      where user_id = ${context.userId}
    `;
	return {
		ok: true,
		plan
	};
});
//#endregion
export { activateSubscription_createServerFn_handler, getMyAiSettings_createServerFn_handler, getMySubscription_createServerFn_handler, saveMyAiSettings_createServerFn_handler };
