import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getChatArchive } from "@/lib/storage/chat-archive";

export type ConversationSummary = {
  id: string;
  bookId: string;
  title: string;
  updatedAt: string;
  messageCount: number;
};

export type ConversationMessage = {
  id: string;
  role: string;
  content: string;
  kind: string;
  quote: string | null;
  createdAt: string;
};

export const listMyConversations = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((input?: { bookId?: string }) => input ?? {})
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    const bookId = data.bookId?.trim();
    const rows = bookId
      ? await sql<{
          id: string;
          book_id: string;
          title: string;
          updated_at: string;
          c: number;
        }>`
          select c.id, c.book_id, c.title, c.updated_at::text,
                 (select count(*)::int from ai_messages m where m.conversation_id = c.id) as c
          from ai_conversations c
          where c.user_id = ${context.userId} and c.book_id = ${bookId}
          order by c.updated_at desc
          limit 30
        `
      : await sql<{
          id: string;
          book_id: string;
          title: string;
          updated_at: string;
          c: number;
        }>`
          select c.id, c.book_id, c.title, c.updated_at::text,
                 (select count(*)::int from ai_messages m where m.conversation_id = c.id) as c
          from ai_conversations c
          where c.user_id = ${context.userId}
          order by c.updated_at desc
          limit 50
        `;
    return rows.map(
      (r) =>
        ({
          id: r.id,
          bookId: r.book_id,
          title: r.title,
          updatedAt: r.updated_at,
          messageCount: r.c,
        }) satisfies ConversationSummary,
    );
  });

export const getMyConversation = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((id: string) => id.trim())
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    const convos = await sql<{
      id: string;
      book_id: string;
      title: string;
      storage_key: string | null;
      updated_at: string;
    }>`
      select id, book_id, title, storage_key, updated_at::text
      from ai_conversations
      where id = ${id} and user_id = ${context.userId}
    `;
    const c = convos[0];
    if (!c) return null;

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
      where conversation_id = ${id}
      order by created_at asc
    `;

    let archive = null as Awaited<ReturnType<typeof getChatArchive>>;
    if (c.storage_key) {
      archive = await getChatArchive(c.storage_key);
    }

    return {
      id: c.id,
      bookId: c.book_id,
      title: c.title,
      storageKey: c.storage_key,
      updatedAt: c.updated_at,
      messages: messages.map(
        (m) =>
          ({
            id: m.id,
            role: m.role,
            content: m.content,
            kind: m.kind,
            quote: m.quote,
            createdAt: m.created_at,
          }) satisfies ConversationMessage,
      ),
      archive,
    };
  });

export const deleteMyConversation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id.trim())
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from ai_conversations
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });
