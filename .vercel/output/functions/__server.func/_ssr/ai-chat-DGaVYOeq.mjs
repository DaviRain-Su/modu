import { i as uid } from "./utils-D0dWsYTS.mjs";
import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CHxE_ZiV.mjs";
import { t as AI_PROVIDERS } from "./ai-settings-sZgTU9Pi.mjs";
import { i as getSql } from "./db-BwYgqUFs.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as runAiAssist } from "./assist-BcMQDCG_.mjs";
import { a as cloudflareWorkerConfigured, t as cfWorkerAiChat } from "./worker-client-BJ3tkfEZ.mjs";
import { n as putChatArchive } from "./chat-archive-CBYrHCTw.mjs";
import { i as createProvider, n as contentText, r as createModels, t as openAICompletionsApi } from "../_libs/@earendil-works/pi-ai+[...].mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-chat-DGaVYOeq.js
/**
* Pi-powered LLM gateway (inspired by liber + @earendil-works/pi-ai).
*
* Priority for official channel:
*   1. Independent Cloudflare Worker (MODU_CF_API_URL) — Workers AI binding
*   2. Cloudflare REST / AI Gateway via Pi (CLOUDFLARE_ACCOUNT_ID + key)
*   3. User BYOK via Pi OpenAI-compat
*   4. Local rule-based assist
*/
var SYSTEM = `你是「墨读」AI 伴读助手，基于 Pi（@earendil-works/pi-ai）统一 LLM 层。
回答简洁、有文学感，优先中文（翻译任务除外）。
只依据读者提供的正文与对话上下文，不要编造原文不存在的情节。
可主动给出阅读提示、延伸问题与笔记建议。`;
var EMPTY_USAGE = {
	input: 0,
	output: 0,
	cacheRead: 0,
	cacheWrite: 0,
	totalTokens: 0,
	cost: {
		input: 0,
		output: 0,
		cacheRead: 0,
		cacheWrite: 0,
		total: 0
	}
};
function buildUserTurn(req) {
	const book = req.bookTitle ? `正在阅读《${req.bookTitle}》。` : "";
	const text = req.selectedText?.trim() ?? "";
	const q = req.question?.trim() ?? "";
	switch (req.action) {
		case "explain": return `${book}请解释下列选段（核心意思 + 阅读提示）：\n\n${text || q}`;
		case "summary": return `${book}请摘要下列选段（一句话 + 要点）：\n\n${text || q}`;
		case "translate": return `${book}请提供中英对照意译：\n\n${text || q}`;
		case "insight": return `${book}请给出 3 条阅读洞见与 1 个可迁移问题：\n\n${text || q}`;
		default: return `${book}${text ? `选中上下文：\n${text}\n\n` : ""}读者：${q}`;
	}
}
function historyToMessages(history) {
	const out = [];
	for (const h of history) if (h.role === "user") {
		const msg = {
			role: "user",
			content: h.content,
			timestamp: Date.now()
		};
		out.push(msg);
	} else {
		const msg = {
			role: "assistant",
			content: [{
				type: "text",
				text: h.content
			}],
			api: "openai-completions",
			provider: "history",
			model: "history",
			usage: EMPTY_USAGE,
			stopReason: "stop",
			timestamp: Date.now()
		};
		out.push(msg);
	}
	return out;
}
function makeCompatModel(opts) {
	return {
		id: opts.modelId,
		name: opts.modelId,
		api: "openai-completions",
		provider: opts.providerId,
		baseUrl: opts.baseUrl.replace(/\/$/, ""),
		reasoning: false,
		input: ["text"],
		cost: {
			input: 0,
			output: 0,
			cacheRead: 0,
			cacheWrite: 0
		},
		contextWindow: 128e3,
		maxTokens: 2048,
		compat: {
			supportsDeveloperRole: false,
			supportsReasoningEffort: false
		}
	};
}
function platformCloudflareConfig() {
	const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
	const apiKey = process.env.CLOUDFLARE_API_KEY?.trim() || process.env.CF_API_TOKEN?.trim();
	if (!accountId || !apiKey) return null;
	const gatewayId = process.env.AI_GATEWAY_ID?.trim();
	const model = process.env.AI_MODEL?.trim() || "@cf/qwen/qwen3-30b-a3b-fp8";
	return {
		baseUrl: gatewayId ? `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat` : `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`,
		apiKey,
		model
	};
}
async function completeViaPi(opts) {
	const providerId = opts.providerId;
	const apiKey = opts.apiKey;
	const model = makeCompatModel({
		providerId,
		modelId: opts.modelId,
		baseUrl: opts.baseUrl
	});
	const provider = createProvider({
		id: providerId,
		name: providerId,
		baseUrl: opts.baseUrl.replace(/\/$/, ""),
		auth: { apiKey: {
			name: `${providerId} key`,
			resolve: async () => ({
				auth: { apiKey },
				source: "explicit"
			})
		} },
		models: [model],
		api: openAICompletionsApi()
	});
	const models = createModels();
	models.setProvider(provider);
	const m = models.getModel(providerId, opts.modelId);
	if (!m) throw new Error("Pi model not registered");
	const userMsg = {
		role: "user",
		content: opts.userText,
		timestamp: Date.now()
	};
	const context = {
		systemPrompt: opts.systemPrompt,
		messages: [...historyToMessages(opts.history), userMsg]
	};
	const text = contentText((await models.completeSimple(m, context, {
		maxTokens: 900,
		temperature: .65,
		apiKey
	})).content).trim();
	if (!text) throw new Error("Pi 返回为空");
	return text;
}
async function piCompanionChat(req) {
	const userText = buildUserTurn(req);
	const history = (req.history ?? []).slice(-16);
	if (req.provider !== "official" && req.apiKey && req.baseUrl) {
		const modelId = req.model || "gpt-4o-mini";
		try {
			return {
				content: await completeViaPi({
					providerId: `user-${req.provider}`,
					baseUrl: req.baseUrl,
					apiKey: req.apiKey,
					modelId,
					systemPrompt: SYSTEM,
					history,
					userText
				}),
				via: "pi",
				provider: req.provider,
				model: modelId
			};
		} catch (e) {
			console.warn("[pi-gateway] user provider failed", e);
		}
	}
	if ((req.provider === "official" || req.provider === "cloudflare") && cloudflareWorkerConfigured()) try {
		const { text, model } = await cfWorkerAiChat({
			messages: [...history.map((h) => ({
				role: h.role,
				content: h.content
			})), {
				role: "user",
				content: userText
			}],
			system: SYSTEM,
			model: req.model
		});
		return {
			content: text,
			via: "cf-worker",
			provider: "cloudflare-worker",
			model
		};
	} catch (e) {
		console.warn("[pi-gateway] cf worker failed", e);
	}
	const cf = platformCloudflareConfig();
	if (cf && (req.provider === "official" || req.provider === "cloudflare")) try {
		return {
			content: await completeViaPi({
				providerId: "cloudflare-official",
				baseUrl: cf.baseUrl,
				apiKey: cf.apiKey,
				modelId: req.model || cf.model,
				systemPrompt: SYSTEM,
				history,
				userText
			}),
			via: "pi",
			provider: "cloudflare",
			model: req.model || cf.model
		};
	} catch (e) {
		console.warn("[pi-gateway] cloudflare rest failed", e);
	}
	return {
		content: (await runAiAssist({
			action: req.action,
			text: req.selectedText,
			question: req.question,
			bookTitle: req.bookTitle
		})).content,
		via: "local",
		provider: "official-local"
	};
}
var PLAN_LIMIT = {
	free: 40,
	plus: 400,
	pro: 4e3
};
async function ensureConversation(sql, opts) {
	if (opts.conversationId) {
		if ((await sql`
      select id from ai_conversations
      where id = ${opts.conversationId} and user_id = ${opts.userId}
    `)[0]) return opts.conversationId;
	}
	const id = uid("c");
	await sql`
    insert into ai_conversations (id, user_id, book_id, chapter_id, title)
    values (
      ${id},
      ${opts.userId},
      ${opts.bookId},
      ${opts.chapterId ?? null},
      ${opts.title ?? "伴读对话"}
    )
  `;
	return id;
}
async function loadHistory(sql, conversationId) {
	return (await sql`
    select role, content from ai_messages
    where conversation_id = ${conversationId}
      and role in ('user', 'assistant')
    order by created_at asc
    limit 24
  `).map((r) => ({
		role: r.role,
		content: r.content
	}));
}
async function archiveConversation(sql, opts) {
	const messages = await sql`
    select id, role, content, kind, quote, created_at::text
    from ai_messages
    where conversation_id = ${opts.conversationId}
    order by created_at asc
  `;
	const { key } = await putChatArchive({
		conversationId: opts.conversationId,
		userId: opts.userId,
		bookId: opts.bookId,
		title: opts.title,
		messages: messages.map((m) => ({
			id: m.id,
			role: m.role,
			content: m.content,
			kind: m.kind,
			quote: m.quote,
			createdAt: m.created_at
		})),
		updatedAt: (/* @__PURE__ */ new Date()).toISOString(),
		engine: opts.engine
	});
	await sql`
    update ai_conversations
    set storage_key = ${key}, updated_at = now()
    where id = ${opts.conversationId}
  `;
	return key;
}
var runUserAi_createServerFn_handler = createServerRpc({
	id: "160bd8627a55a9527982cd4b5f5451f9945927bd5eeb9aa59db899232fd99045",
	name: "runUserAi",
	filename: "src/lib/server/ai-chat.ts"
}, (opts) => runUserAi.__executeServer(opts));
var runUserAi = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => input).handler(runUserAi_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const settings = await sql`
      select provider, api_key, base_url, model from user_ai_settings
      where user_id = ${context.userId}
    `;
	const sub = await sql`
      select plan from user_subscriptions where user_id = ${context.userId}
    `;
	const provider = settings[0]?.provider ?? "official";
	const plan = sub[0]?.plan ?? "free";
	const day = (/* @__PURE__ */ new Date()).toISOString().slice(0, 10);
	await sql`
      insert into user_ai_settings (user_id, provider)
      values (${context.userId}, 'official')
      on conflict (user_id) do nothing
    `;
	await sql`
      insert into user_subscriptions (user_id, plan, status)
      values (${context.userId}, 'free', 'active')
      on conflict (user_id) do nothing
    `;
	if (provider === "official") {
		const used = (await sql`
        select count from ai_usage_daily
        where user_id = ${context.userId} and day = ${day}::date
      `)[0]?.count ?? 0;
		const limit = PLAN_LIMIT[plan] ?? PLAN_LIMIT.free;
		if (used >= limit) throw new Error(`今日官方 AI 次数已用尽（${plan} 档 ${limit} 次）。可升级订阅或配置自有 API。`);
		await sql`
        insert into ai_usage_daily (user_id, day, count)
        values (${context.userId}, ${day}::date, 1)
        on conflict (user_id, day)
        do update set count = ai_usage_daily.count + 1
      `;
	}
	const meta = AI_PROVIDERS.find((p) => p.id === provider);
	const apiKey = settings[0]?.api_key ?? "";
	const baseUrl = settings[0]?.base_url || meta?.defaultBase || "";
	const model = settings[0]?.model || meta?.defaultModel || "gpt-4o-mini";
	if (provider !== "official" && !apiKey) throw new Error("请先在「账户 · AI 设置」中填写 API Key");
	const titleSeed = (data.question || data.text || data.bookTitle || "伴读对话").slice(0, 36) || "伴读对话";
	const conversationId = await ensureConversation(sql, {
		userId: context.userId,
		conversationId: data.conversationId,
		bookId: data.bookId,
		chapterId: data.chapterId,
		title: titleSeed
	});
	const history = await loadHistory(sql, conversationId);
	const userDisplay = data.action === "chat" ? data.question?.trim() || "" : `【${data.action}】${(data.text || data.question || "").slice(0, 200)}`;
	const userMsgId = uid("m");
	await sql`
      insert into ai_messages (id, conversation_id, user_id, role, content, kind, quote)
      values (
        ${userMsgId},
        ${conversationId},
        ${context.userId},
        'user',
        ${userDisplay},
        ${data.action},
        ${data.text?.slice(0, 500) ?? null}
      )
    `;
	const result = await piCompanionChat({
		action: data.action,
		bookTitle: data.bookTitle,
		selectedText: data.text,
		question: data.question,
		history,
		provider,
		apiKey: apiKey || void 0,
		baseUrl: baseUrl || void 0,
		model: model || void 0
	});
	const assistantMsgId = uid("m");
	let content = result.content;
	if (result.via === "local" && provider === "official") content += "\n\n（官方通道：配置 Cloudflare Worker 或 CF AI 密钥后将使用云端模型；当前为本地伴读。）";
	else if (result.via === "cf-worker") content += `\n\n（Cloudflare Worker · ${result.model || "Workers AI"}）`;
	else if (result.via === "pi") content += `\n\n（Pi · ${result.provider}${result.model ? ` / ${result.model}` : ""}）`;
	await sql`
      insert into ai_messages (id, conversation_id, user_id, role, content, kind)
      values (
        ${assistantMsgId},
        ${conversationId},
        ${context.userId},
        'assistant',
        ${content},
        ${data.action}
      )
    `;
	await sql`
      update ai_conversations set updated_at = now()
      where id = ${conversationId}
    `;
	const storageKey = await archiveConversation(sql, {
		userId: context.userId,
		conversationId,
		bookId: data.bookId,
		title: titleSeed,
		engine: `${result.via}:${result.provider}`
	});
	const remaining = provider === "official" ? Math.max(0, (PLAN_LIMIT[plan] ?? PLAN_LIMIT.free) - ((await sql`
                  select count from ai_usage_daily
                  where user_id = ${context.userId} and day = ${day}::date
                `)[0]?.count ?? 0)) : null;
	return {
		content,
		provider: result.provider,
		via: result.via,
		model: result.model ?? null,
		conversationId,
		storageKey,
		remaining,
		userMessageId: userMsgId,
		assistantMessageId: assistantMsgId
	};
});
//#endregion
export { runUserAi_createServerFn_handler };
