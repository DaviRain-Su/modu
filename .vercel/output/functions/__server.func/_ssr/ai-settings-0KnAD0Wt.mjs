import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-UADDUZ8i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-settings-0KnAD0Wt.js
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
var getMyAiSettings = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("f6179490395e318110ce80cea2418663ed3b5de898fe9ce8498d292547a6c801"));
var saveMyAiSettings = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(createSsrRpc("a03b035bb944ffa09e19e2bd821bf548884761046c5973998fedc13e45924e0a"));
var getMySubscription = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(createSsrRpc("dfbbb9a9d9e00abe693a2c8c143984ccc686129d9dbe6e352997bd4112da9fc2"));
var activateSubscription = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((plan) => plan).handler(createSsrRpc("e4bb12dac935bcd6c93922c0c097f0b736501b5a7ab12868e0639d08d23ff1a7"));
//#endregion
export { saveMyAiSettings as a, getMySubscription as i, activateSubscription as n, getMyAiSettings as r, AI_PROVIDERS as t };
