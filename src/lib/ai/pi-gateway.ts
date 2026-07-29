/**
 * Pi-powered LLM gateway (inspired by liber + @earendil-works/pi-ai).
 *
 * Priority for official channel:
 *   1. Independent Cloudflare Worker (MODU_CF_API_URL) — Workers AI binding
 *   2. Cloudflare REST / AI Gateway via Pi (CLOUDFLARE_ACCOUNT_ID + key)
 *   3. User BYOK via Pi OpenAI-compat
 *   4. Local rule-based assist
 */

import {
  contentText,
  createModels,
  createProvider,
  type AssistantMessage,
  type Context,
  type Message,
  type Model,
  type UserMessage,
} from "@earendil-works/pi-ai";
import { openAICompletionsApi } from "@earendil-works/pi-ai/api/openai-completions.lazy";
import { runAiAssist, type AiAction } from "@/lib/ai/assist";
import {
  cfWorkerAiChat,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";

export type PiChatMessage = {
  role: "user" | "assistant";
  content: string;
};

export type PiChatRequest = {
  action: AiAction;
  bookTitle?: string;
  selectedText?: string;
  question?: string;
  history?: PiChatMessage[];
  provider: string;
  apiKey?: string;
  baseUrl?: string;
  model?: string;
};

const SYSTEM = `你是「墨读」AI 伴读助手，基于 Pi（@earendil-works/pi-ai）统一 LLM 层。
回答简洁、有文学感，优先中文（翻译任务除外）。
只依据读者提供的正文与对话上下文，不要编造原文不存在的情节。
可主动给出阅读提示、延伸问题与笔记建议。`;

const EMPTY_USAGE = {
  input: 0,
  output: 0,
  cacheRead: 0,
  cacheWrite: 0,
  totalTokens: 0,
  cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0, total: 0 },
};

function buildUserTurn(req: PiChatRequest): string {
  const book = req.bookTitle ? `正在阅读《${req.bookTitle}》。` : "";
  const text = req.selectedText?.trim() ?? "";
  const q = req.question?.trim() ?? "";
  switch (req.action) {
    case "explain":
      return `${book}请解释下列选段（核心意思 + 阅读提示）：\n\n${text || q}`;
    case "summary":
      return `${book}请摘要下列选段（一句话 + 要点）：\n\n${text || q}`;
    case "translate":
      return `${book}请提供中英对照意译：\n\n${text || q}`;
    case "insight":
      return `${book}请给出 3 条阅读洞见与 1 个可迁移问题：\n\n${text || q}`;
    default:
      return `${book}${text ? `选中上下文：\n${text}\n\n` : ""}读者：${q}`;
  }
}

function historyToMessages(history: PiChatMessage[]): Message[] {
  const out: Message[] = [];
  for (const h of history) {
    if (h.role === "user") {
      const msg: UserMessage = {
        role: "user",
        content: h.content,
        timestamp: Date.now(),
      };
      out.push(msg);
    } else {
      const msg: AssistantMessage = {
        role: "assistant",
        content: [{ type: "text", text: h.content }],
        api: "openai-completions",
        provider: "history",
        model: "history",
        usage: EMPTY_USAGE,
        stopReason: "stop",
        timestamp: Date.now(),
      };
      out.push(msg);
    }
  }
  return out;
}

function makeCompatModel(opts: {
  providerId: string;
  modelId: string;
  baseUrl: string;
}): Model<"openai-completions"> {
  return {
    id: opts.modelId,
    name: opts.modelId,
    api: "openai-completions",
    provider: opts.providerId,
    baseUrl: opts.baseUrl.replace(/\/$/, ""),
    reasoning: false,
    input: ["text"],
    cost: { input: 0, output: 0, cacheRead: 0, cacheWrite: 0 },
    contextWindow: 128000,
    maxTokens: 2048,
    compat: {
      supportsDeveloperRole: false,
      supportsReasoningEffort: false,
    },
  };
}

function platformCloudflareConfig(): {
  baseUrl: string;
  apiKey: string;
  model: string;
} | null {
  const accountId = process.env.CLOUDFLARE_ACCOUNT_ID?.trim();
  const apiKey =
    process.env.CLOUDFLARE_API_KEY?.trim() ||
    process.env.CF_API_TOKEN?.trim();
  if (!accountId || !apiKey) return null;

  const gatewayId = process.env.AI_GATEWAY_ID?.trim();
  const model =
    process.env.AI_MODEL?.trim() || "@cf/qwen/qwen3-30b-a3b-fp8";

  const baseUrl = gatewayId
    ? `https://gateway.ai.cloudflare.com/v1/${accountId}/${gatewayId}/compat`
    : `https://api.cloudflare.com/client/v4/accounts/${accountId}/ai/v1`;

  return { baseUrl, apiKey, model };
}

async function completeViaPi(opts: {
  providerId: string;
  baseUrl: string;
  apiKey: string;
  modelId: string;
  systemPrompt: string;
  history: PiChatMessage[];
  userText: string;
}): Promise<string> {
  const providerId = opts.providerId;
  const apiKey = opts.apiKey;
  const model = makeCompatModel({
    providerId,
    modelId: opts.modelId,
    baseUrl: opts.baseUrl,
  });

  const provider = createProvider({
    id: providerId,
    name: providerId,
    baseUrl: opts.baseUrl.replace(/\/$/, ""),
    auth: {
      apiKey: {
        name: `${providerId} key`,
        resolve: async () => ({
          auth: { apiKey },
          source: "explicit",
        }),
      },
    },
    models: [model],
    api: openAICompletionsApi(),
  });

  const models = createModels();
  models.setProvider(provider);
  const m = models.getModel(providerId, opts.modelId);
  if (!m) throw new Error("Pi model not registered");

  const userMsg: UserMessage = {
    role: "user",
    content: opts.userText,
    timestamp: Date.now(),
  };

  const context: Context = {
    systemPrompt: opts.systemPrompt,
    messages: [...historyToMessages(opts.history), userMsg],
  };

  const response = await models.completeSimple(m, context, {
    maxTokens: 900,
    temperature: 0.65,
    apiKey,
  });
  const text = contentText(response.content).trim();
  if (!text) throw new Error("Pi 返回为空");
  return text;
}

export async function piCompanionChat(req: PiChatRequest): Promise<{
  content: string;
  via: "pi" | "local" | "cf-worker";
  provider: string;
  model?: string;
}> {
  const userText = buildUserTurn(req);
  const history = (req.history ?? []).slice(-16);

  // User BYOK
  if (req.provider !== "official" && req.apiKey && req.baseUrl) {
    const modelId = req.model || "gpt-4o-mini";
    try {
      const content = await completeViaPi({
        providerId: `user-${req.provider}`,
        baseUrl: req.baseUrl,
        apiKey: req.apiKey,
        modelId,
        systemPrompt: SYSTEM,
        history,
        userText,
      });
      return {
        content,
        via: "pi",
        provider: req.provider,
        model: modelId,
      };
    } catch (e) {
      console.warn("[pi-gateway] user provider failed", e);
    }
  }

  // Official: dedicated CF Worker first (your local wrangler deploy)
  if (
    (req.provider === "official" || req.provider === "cloudflare") &&
    cloudflareWorkerConfigured()
  ) {
    try {
      const messages = [
        ...history.map((h) => ({ role: h.role, content: h.content })),
        { role: "user" as const, content: userText },
      ];
      const { text, model } = await cfWorkerAiChat({
        messages,
        system: SYSTEM,
        model: req.model,
      });
      return {
        content: text,
        via: "cf-worker",
        provider: "cloudflare-worker",
        model,
      };
    } catch (e) {
      console.warn("[pi-gateway] cf worker failed", e);
    }
  }

  // Official: Pi → CF REST / Gateway
  const cf = platformCloudflareConfig();
  if (cf && (req.provider === "official" || req.provider === "cloudflare")) {
    try {
      const content = await completeViaPi({
        providerId: "cloudflare-official",
        baseUrl: cf.baseUrl,
        apiKey: cf.apiKey,
        modelId: req.model || cf.model,
        systemPrompt: SYSTEM,
        history,
        userText,
      });
      return {
        content,
        via: "pi",
        provider: "cloudflare",
        model: req.model || cf.model,
      };
    } catch (e) {
      console.warn("[pi-gateway] cloudflare rest failed", e);
    }
  }

  const local = await runAiAssist({
    action: req.action,
    text: req.selectedText,
    question: req.question,
    bookTitle: req.bookTitle,
  });
  return {
    content: local.content,
    via: "local",
    provider: "official-local",
  };
}
