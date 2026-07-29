import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSessionUser } from "@/lib/auth/verify.server";

export type AiProviderId =
  | "official"
  | "openai"
  | "deepseek"
  | "kimi"
  | "custom";

export const AI_PROVIDERS: {
  id: AiProviderId;
  label: string;
  hint: string;
  defaultBase: string;
  defaultModel: string;
}[] = [
  {
    id: "official",
    label: "墨读官方（Pi + Cloudflare）",
    hint: "经 Pi 统一层调用；部署后走 Cloudflare Workers AI / AI Gateway。预览无密钥时本地降级。",
    defaultBase: "",
    defaultModel: "modu-pi",
  },
  {
    id: "openai",
    label: "OpenAI / ChatGPT API",
    hint: "Pi → OpenAI 兼容接口。使用开发者 API Key。",
    defaultBase: "https://api.openai.com/v1",
    defaultModel: "gpt-4o-mini",
  },
  {
    id: "kimi",
    label: "Kimi（月之暗面）",
    hint: "Pi → Moonshot OpenAI 兼容接口。",
    defaultBase: "https://api.moonshot.cn/v1",
    defaultModel: "moonshot-v1-8k",
  },
  {
    id: "deepseek",
    label: "DeepSeek",
    hint: "Pi → DeepSeek API（与 liber 默认外部供应商一致）。",
    defaultBase: "https://api.deepseek.com/v1",
    defaultModel: "deepseek-chat",
  },
  {
    id: "custom",
    label: "自定义 / AI Gateway",
    hint: "任意 OpenAI 兼容端点，可填 Cloudflare AI Gateway compat URL。",
    defaultBase: "",
    defaultModel: "gpt-4o-mini",
  },
];

function maskKey(key: string) {
  if (!key) return "";
  if (key.length <= 8) return "••••";
  return `${key.slice(0, 3)}••••${key.slice(-4)}`;
}

async function ensureRows(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
) {
  const session = await getSessionUser();
  const fallback = session?.email?.split("@")[0] || "读者";
  await sql`
    insert into user_profiles (user_id, display_name)
    values (${userId}, ${fallback})
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

export const getMyAiSettings = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureRows(sql, context.userId);
    const rows = await sql<{
      provider: string;
      api_key: string;
      base_url: string;
      model: string;
    }>`
      select provider, api_key, base_url, model
      from user_ai_settings where user_id = ${context.userId}
    `;
    const r = rows[0]!;
    const sub = await sql<{ plan: string }>`
      select plan from user_subscriptions where user_id = ${context.userId}
    `;
    return {
      provider: r.provider as AiProviderId,
      apiKeyMasked: maskKey(r.api_key),
      hasApiKey: Boolean(r.api_key),
      baseUrl: r.base_url,
      model: r.model,
      plan: (sub[0]?.plan ?? "free") as "free" | "plus" | "pro",
      engine: "pi (@earendil-works/pi-ai)",
    };
  });

export const saveMyAiSettings = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      provider: AiProviderId;
      apiKey?: string;
      baseUrl?: string;
      model?: string;
      clearKey?: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await ensureRows(sql, context.userId);
    const meta = AI_PROVIDERS.find((p) => p.id === data.provider);
    const baseUrl = data.baseUrl?.trim() || meta?.defaultBase || "";
    const model = data.model?.trim() || meta?.defaultModel || "";

    if (data.clearKey) {
      await sql`
        update user_ai_settings
        set provider = ${data.provider},
            api_key = '',
            base_url = ${baseUrl},
            model = ${model},
            updated_at = now()
        where user_id = ${context.userId}
      `;
    } else if (data.apiKey && data.apiKey.trim()) {
      await sql`
        update user_ai_settings
        set provider = ${data.provider},
            api_key = ${data.apiKey.trim()},
            base_url = ${baseUrl},
            model = ${model},
            updated_at = now()
        where user_id = ${context.userId}
      `;
    } else {
      await sql`
        update user_ai_settings
        set provider = ${data.provider},
            base_url = ${baseUrl},
            model = ${model},
            updated_at = now()
        where user_id = ${context.userId}
      `;
    }
    return { ok: true as const };
  });

export const getMySubscription = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    await ensureRows(sql, context.userId);
    const rows = await sql<{
      plan: string;
      status: string;
      renews_at: string | null;
    }>`
      select plan, status, renews_at::text from user_subscriptions
      where user_id = ${context.userId}
    `;
    const r = rows[0]!;
    return {
      plan: r.plan as "free" | "plus" | "pro",
      status: r.status,
      renewsAt: r.renews_at,
    };
  });

export const activateSubscription = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((plan: "free" | "plus" | "pro") => plan)
  .handler(async ({ context, data: plan }) => {
    const sql = await getSql();
    await ensureRows(sql, context.userId);
    const renews =
      plan === "free"
        ? null
        : new Date(Date.now() + 30 * 24 * 3600 * 1000).toISOString();
    await sql`
      update user_subscriptions
      set plan = ${plan},
          status = 'active',
          renews_at = ${renews},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ok: true as const, plan };
  });
