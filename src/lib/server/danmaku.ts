import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSessionUser } from "@/lib/auth/verify.server";
import { isListableMarketId, isPrivateBookId } from "@/lib/books/copyright";
import { uid } from "@/lib/utils";

export type DanmakuRow = {
  id: string;
  bookId: string;
  chapterId: string;
  paraIndex: number;
  quote: string;
  body: string;
  userId: string;
  displayName: string;
  createdAt: string;
};

async function ensureProfile(
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
}

/** 仅公版 / 社区公版书可发弹幕 */
function assertPublicDomainBook(bookId: string) {
  if (isPrivateBookId(bookId)) {
    throw new Error("私有图书不支持公开弹幕");
  }
  // Official market ids + community_* are listable; reject everything else.
  if (!isListableMarketId(bookId)) {
    throw new Error("仅公版书城图书支持弹幕共读");
  }
}

export const listChapterDanmaku = createServerFn({ method: "GET" })
  .validator(
    (input: { bookId: string; chapterId: string }) => ({
      bookId: input.bookId.trim(),
      chapterId: input.chapterId.trim(),
    }),
  )
  .handler(async ({ data }) => {
    const sql = await getSql();
    try {
      const rows = await sql<{
        id: string;
        book_id: string;
        chapter_id: string;
        para_index: number;
        quote: string;
        body: string;
        user_id: string;
        display_name: string;
        created_at: string;
      }>`
        select d.id, d.book_id, d.chapter_id, d.para_index, d.quote, d.body,
               d.user_id, coalesce(p.display_name, '读者') as display_name,
               d.created_at::text
        from reading_danmaku d
        left join user_profiles p on p.user_id = d.user_id
        where d.book_id = ${data.bookId} and d.chapter_id = ${data.chapterId}
        order by d.para_index asc, d.created_at asc
        limit 500
      `;
      return rows.map(
        (r) =>
          ({
            id: r.id,
            bookId: r.book_id,
            chapterId: r.chapter_id,
            paraIndex: r.para_index,
            quote: r.quote,
            body: r.body,
            userId: r.user_id,
            displayName: r.display_name,
            createdAt: r.created_at,
          }) satisfies DanmakuRow,
      );
    } catch {
      return [] as DanmakuRow[];
    }
  });

export const postDanmaku = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      bookId: string;
      chapterId: string;
      paraIndex: number;
      quote?: string;
      body: string;
    }) => ({
      bookId: input.bookId.trim(),
      chapterId: input.chapterId.trim(),
      paraIndex: Math.max(0, Math.floor(Number(input.paraIndex) || 0)),
      quote: (input.quote || "").trim().slice(0, 400),
      body: input.body.trim().slice(0, 500),
    }),
  )
  .handler(async ({ context, data }) => {
    if (!data.body) throw new Error("请填写弹幕内容");
    assertPublicDomainBook(data.bookId);
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const id = uid("dm");
    await sql`
      insert into reading_danmaku (
        id, book_id, chapter_id, para_index, quote, body, user_id
      ) values (
        ${id},
        ${data.bookId},
        ${data.chapterId},
        ${data.paraIndex},
        ${data.quote},
        ${data.body},
        ${context.userId}
      )
    `;
    return { id };
  });

export const deleteMyDanmaku = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id.trim())
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from reading_danmaku
      where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });
