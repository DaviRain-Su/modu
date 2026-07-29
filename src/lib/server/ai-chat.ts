import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { type AiAction } from "@/lib/ai/assist";
import { piCompanionChat } from "@/lib/ai/pi-gateway";
import { AI_PROVIDERS, type AiProviderId } from "./ai-settings";
import { putChatArchive } from "@/lib/storage/chat-archive";
import { uid } from "@/lib/utils";

const PLAN_LIMIT: Record<string, number> = {
  free: 40,
  plus: 400,
  pro: 4000,
};

async function ensureConversation(
  sql: Awaited<ReturnType<typeof getSql>>,
  opts: {
    userId: string;
    conversationId?: string | null;
    bookId: string;
    chapterId?: string | null;
    title?: string;
  },
) {
  if (opts.conversationId) {
    const rows = await sql<{ id: string }>`
      select id from ai_conversations
      where id = ${opts.conversationId} and user_id = ${opts.userId}
    `;
    if (rows[0]) return opts.conversationId;
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

async function loadHistory(
  sql: Awaited<ReturnType<typeof getSql>>,
  conversationId: string,
) {
  const rows = await sql<{ role: string; content: string }>`
    select role, content from ai_messages
    where conversation_id = ${conversationId}
      and role in ('user', 'assistant')
    order by created_at asc
    limit 24
  `;
  return rows.map((r) => ({
    role: r.role as "user" | "assistant",
    content: r.content,
  }));
}

async function archiveConversation(
  sql: Awaited<ReturnType<typeof getSql>>,
  opts: {
    userId: string;
    conversationId: string;
    bookId: string;
    title: string;
    engine: string;
  },
) {
  const messages = await sql<{
    id: string;
    role: string;
    content: string;
    kind: string;
    quote: string | null;
    created_at: string;
  }>`
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
      createdAt: m.created_at,
    })),
    updatedAt: new Date().toISOString(),
    engine: opts.engine,
  });
  await sql`
    update ai_conversations
    set storage_key = ${key}, updated_at = now()
    where id = ${opts.conversationId}
  `;
  return key;
}

export const runUserAi = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      action: AiAction;
      text?: string;
      question?: string;
      bookTitle?: string;
      bookId: string;
      chapterId?: string;
      conversationId?: string | null;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const settings = await sql<{
      provider: string;
      api_key: string;
      base_url: string;
      model: string;
    }>`
      select provider, api_key, base_url, model from user_ai_settings
      where user_id = ${context.userId}
    `;
    const sub = await sql<{ plan: string }>`
      select plan from user_subscriptions where user_id = ${context.userId}
    `;
    const provider = (settings[0]?.provider ?? "official") as AiProviderId;
    const plan = sub[0]?.plan ?? "free";
    const day = new Date().toISOString().slice(0, 10);

    // Ensure profile-related rows exist for FK-ish integrity
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
      const usage = await sql<{ count: number }>`
        select count from ai_usage_daily
        where user_id = ${context.userId} and day = ${day}::date
      `;
      const used = usage[0]?.count ?? 0;
      const limit = PLAN_LIMIT[plan] ?? PLAN_LIMIT.free;
      if (used >= limit) {
        throw new Error(
          `今日官方 AI 次数已用尽（${plan} 档 ${limit} 次）。可升级订阅或配置自有 API。`,
        );
      }
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
    const model =
      settings[0]?.model || meta?.defaultModel || "gpt-4o-mini";

    if (provider !== "official" && !apiKey) {
      throw new Error("请先在「账户 · AI 设置」中填写 API Key");
    }

    const titleSeed =
      (data.question || data.text || data.bookTitle || "伴读对话").slice(0, 36) ||
      "伴读对话";

    const conversationId = await ensureConversation(sql, {
      userId: context.userId,
      conversationId: data.conversationId,
      bookId: data.bookId,
      chapterId: data.chapterId,
      title: titleSeed,
    });

    const history = await loadHistory(sql, conversationId);

    const userDisplay =
      data.action === "chat"
        ? data.question?.trim() || ""
        : `【${data.action}】${(data.text || data.question || "").slice(0, 200)}`;

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
      apiKey: apiKey || undefined,
      baseUrl: baseUrl || undefined,
      model: model || undefined,
    });

    const assistantMsgId = uid("m");
    let content = result.content;
    if (result.via === "local" && provider === "official") {
      content +=
        "\n\n（官方通道：当前环境未配置 Cloudflare Workers AI / AI Gateway 密钥时使用本地伴读；部署后可接 CF + Pi。）";
    } else if (result.via === "pi") {
      content += `\n\n（Pi · ${result.provider}${result.model ? ` / ${result.model}` : ""}）`;
    }

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
      engine: `pi:${result.via}:${result.provider}`,
    });

    const remaining =
      provider === "official"
        ? Math.max(
            0,
            (PLAN_LIMIT[plan] ?? PLAN_LIMIT.free) -
              ((
                await sql<{ count: number }>`
                  select count from ai_usage_daily
                  where user_id = ${context.userId} and day = ${day}::date
                `
              )[0]?.count ?? 0),
          )
        : null;

    return {
      content,
      provider: result.provider,
      via: result.via,
      model: result.model ?? null,
      conversationId,
      storageKey,
      remaining,
      userMessageId: userMsgId,
      assistantMessageId: assistantMsgId,
    };
  });
