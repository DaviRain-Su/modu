import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSessionUser } from "@/lib/auth/verify.server";
import { uid } from "@/lib/utils";

export type AnnotationRow = {
  id: string;
  userId: string;
  displayName: string;
  bookId: string;
  chapterId: string | null;
  page: number | null;
  quote: string;
  note: string;
  kind: string;
  isPublic: boolean;
  createdAt: string;
};

export type HotBookRow = {
  bookId: string;
  readCount: number;
  annotationCount: number;
  score: number;
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

export const recordBookRead = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((bookId: string) => bookId.trim())
  .handler(async ({ context, data: bookId }) => {
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    await sql`
      insert into book_reads (user_id, book_id) values (${context.userId}, ${bookId})
    `;
    return { ok: true as const };
  });

export const createAnnotation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      bookId: string;
      quote: string;
      note?: string;
      chapterId?: string;
      page?: number;
      kind?: "highlight" | "note" | "underline";
      isPublic?: boolean;
    }) => ({
      bookId: input.bookId.trim(),
      quote: input.quote.trim().slice(0, 2000),
      note: (input.note ?? "").trim().slice(0, 2000),
      chapterId: input.chapterId?.trim() || null,
      page: input.page ?? null,
      kind: input.kind ?? "highlight",
      isPublic: input.isPublic !== false,
    }),
  )
  .handler(async ({ context, data }) => {
    if (!data.quote) throw new Error("请选择或输入画线内容");
    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const id = uid("ann");
    await sql`
      insert into annotations (
        id, user_id, book_id, chapter_id, page, quote, note, kind, is_public
      ) values (
        ${id},
        ${context.userId},
        ${data.bookId},
        ${data.chapterId},
        ${data.page},
        ${data.quote},
        ${data.note},
        ${data.kind},
        ${data.isPublic}
      )
    `;
    return { id };
  });

export const listBookAnnotations = createServerFn({ method: "GET" })
  .validator((bookId: string) => bookId.trim())
  .handler(async ({ data: bookId }) => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      user_id: string;
      display_name: string;
      book_id: string;
      chapter_id: string | null;
      page: number | null;
      quote: string;
      note: string;
      kind: string;
      is_public: boolean;
      created_at: string;
    }>`
      select a.id, a.user_id, coalesce(p.display_name, '读者') as display_name,
             a.book_id, a.chapter_id, a.page, a.quote, a.note, a.kind,
             a.is_public, a.created_at::text
      from annotations a
      left join user_profiles p on p.user_id = a.user_id
      where a.book_id = ${bookId} and a.is_public = true
      order by a.created_at desc
      limit 80
    `;
    return rows.map(
      (r) =>
        ({
          id: r.id,
          userId: r.user_id,
          displayName: r.display_name,
          bookId: r.book_id,
          chapterId: r.chapter_id,
          page: r.page,
          quote: r.quote,
          note: r.note,
          kind: r.kind,
          isPublic: r.is_public,
          createdAt: r.created_at,
        }) satisfies AnnotationRow,
    );
  });

export const deleteMyAnnotation = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((id: string) => id.trim())
  .handler(async ({ context, data: id }) => {
    const sql = await getSql();
    await sql`
      delete from annotations where id = ${id} and user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const getHotBooks = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    // Avoid FULL OUTER JOIN for wider PGLite compatibility
    const reads = await sql<{ book_id: string; c: number }>`
      select book_id, count(*)::int as c from book_reads group by book_id
    `;
    const anns = await sql<{ book_id: string; c: number }>`
      select book_id, count(*)::int as c from annotations
      where is_public = true group by book_id
    `;
    const map = new Map<string, HotBookRow>();
    for (const r of reads) {
      map.set(r.book_id, {
        bookId: r.book_id,
        readCount: r.c,
        annotationCount: 0,
        score: r.c * 2,
      });
    }
    for (const a of anns) {
      const cur = map.get(a.book_id);
      if (cur) {
        cur.annotationCount = a.c;
        cur.score = cur.readCount * 2 + a.c * 3;
      } else {
        map.set(a.book_id, {
          bookId: a.book_id,
          readCount: 0,
          annotationCount: a.c,
          score: a.c * 3,
        });
      }
    }
    return [...map.values()].sort((a, b) => b.score - a.score).slice(0, 20);
  },
);

export const getRecentPublicNotes = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    const rows = await sql<{
      id: string;
      user_id: string;
      display_name: string;
      book_id: string;
      quote: string;
      note: string;
      created_at: string;
    }>`
      select a.id, a.user_id, coalesce(p.display_name, '读者') as display_name,
             a.book_id, a.quote, a.note, a.created_at::text
      from annotations a
      left join user_profiles p on p.user_id = a.user_id
      where a.is_public = true and a.note <> ''
      order by a.created_at desc
      limit 30
    `;
    return rows.map((r) => ({
      id: r.id,
      userId: r.user_id,
      displayName: r.display_name,
      bookId: r.book_id,
      quote: r.quote,
      note: r.note,
      createdAt: r.created_at,
    }));
  },
);
