import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSessionUser } from "@/lib/auth/verify.server";
import {
  isPrivateBookId,
  sanitizePublicAnnotation,
} from "@/lib/books/copyright";
import { normalizeQuote, quotesMatch } from "@/lib/reader/quote-key";
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
  parentId: string | null;
  createdAt: string;
};

/** 同一句上的想法聚合 */
export type QuoteThread = {
  quote: string;
  quoteKey: string;
  chapterId: string | null;
  count: number;
  items: AnnotationRow[];
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

function mapRow(r: {
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
  parent_id: string | null;
  created_at: string;
}): AnnotationRow {
  return {
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
    parentId: r.parent_id,
    createdAt: r.created_at,
  };
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
      parentId?: string | null;
    }) => ({
      bookId: input.bookId.trim(),
      quote: input.quote.trim().slice(0, 2000),
      note: (input.note ?? "").trim().slice(0, 2000),
      chapterId: input.chapterId?.trim() || null,
      page: input.page ?? null,
      kind: input.kind ?? "highlight",
      isPublic: input.isPublic !== false,
      parentId: input.parentId?.trim() || null,
    }),
  )
  .handler(async ({ context, data }) => {
    const clean = sanitizePublicAnnotation({
      bookId: data.bookId,
      quote: data.quote,
      note: data.note,
      isPublic: data.isPublic,
    });
    if (clean.blocked) throw new Error(clean.blocked);
    if (!clean.quote && !clean.note) {
      throw new Error("请选择原文或填写想法");
    }
    if (clean.isPublic && !clean.quote && !data.parentId) {
      throw new Error("公开想法需要挂在一句划线原文上");
    }

    const sql = await getSql();
    await ensureProfile(sql, context.userId);
    const id = uid("ann");

    // parent_id column may not exist before migration — try with, fallback without
    try {
      await sql`
        insert into annotations (
          id, user_id, book_id, chapter_id, page, quote, note, kind, is_public, parent_id
        ) values (
          ${id},
          ${context.userId},
          ${data.bookId},
          ${data.chapterId},
          ${data.page},
          ${clean.quote},
          ${clean.note},
          ${data.kind},
          ${clean.isPublic},
          ${data.parentId}
        )
      `;
    } catch {
      await sql`
        insert into annotations (
          id, user_id, book_id, chapter_id, page, quote, note, kind, is_public
        ) values (
          ${id},
          ${context.userId},
          ${data.bookId},
          ${data.chapterId},
          ${data.page},
          ${clean.quote},
          ${clean.note},
          ${data.kind},
          ${clean.isPublic}
        )
      `;
    }
    return {
      id,
      isPublic: clean.isPublic,
      quoteStripped: !clean.quote && data.isPublic,
    };
  });

export const listBookAnnotations = createServerFn({ method: "GET" })
  .validator((bookId: string) => bookId.trim())
  .handler(async ({ data: bookId }) => {
    const privateBook = isPrivateBookId(bookId);
    const sql = await getSql();
    try {
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
        parent_id: string | null;
        created_at: string;
      }>`
        select a.id, a.user_id, coalesce(p.display_name, '读者') as display_name,
               a.book_id, a.chapter_id, a.page, a.quote, a.note, a.kind,
               a.is_public, a.parent_id, a.created_at::text
        from annotations a
        left join user_profiles p on p.user_id = a.user_id
        where a.book_id = ${bookId} and a.is_public = true
        order by a.created_at asc
        limit 300
      `;
      return rows.map((r) => {
        const m = mapRow(r);
        if (privateBook) m.quote = "";
        return m;
      });
    } catch {
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
        order by a.created_at asc
        limit 300
      `;
      return rows.map((r) => ({
        ...mapRow({ ...r, parent_id: null }),
        quote: privateBook ? "" : r.quote,
      }));
    }
  });

/** 按 quote 聚合：一本书里所有「可点开的共读句」 */
export const listQuoteThreads = createServerFn({ method: "GET" })
  .validator((bookId: string) => bookId.trim())
  .handler(async ({ data: bookId }) => {
    if (isPrivateBookId(bookId)) return [] as QuoteThread[];
    // reuse list logic
    const all = await listBookAnnotations({ data: bookId });
    const buckets = new Map<string, QuoteThread>();
    for (const a of all) {
      if (!a.quote?.trim()) continue;
      const key = normalizeQuote(a.quote);
      if (!key) continue;
      // merge into existing bucket if fuzzy match
      let found: QuoteThread | undefined;
      for (const t of buckets.values()) {
        if (quotesMatch(t.quote, a.quote)) {
          found = t;
          break;
        }
      }
      if (!found) {
        found = {
          quote: a.quote,
          quoteKey: key,
          chapterId: a.chapterId,
          count: 0,
          items: [],
        };
        buckets.set(key, found);
      }
      found.items.push(a);
      found.count = found.items.length;
    }
    return [...buckets.values()].sort((a, b) => b.count - a.count);
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
    const reads = await sql<{ book_id: string; c: number }>`
      select book_id, count(*)::int as c from book_reads group by book_id
    `;
    const annos = await sql<{ book_id: string; c: number }>`
      select book_id, count(*)::int as c from annotations
      where is_public = true group by book_id
    `;
    const map = new Map<string, HotBookRow>();
    for (const r of reads) {
      map.set(r.book_id, {
        bookId: r.book_id,
        readCount: r.c,
        annotationCount: 0,
        score: r.c,
      });
    }
    for (const a of annos) {
      const cur = map.get(a.book_id);
      if (cur) {
        cur.annotationCount = a.c;
        cur.score = cur.readCount + a.c * 2;
      } else {
        map.set(a.book_id, {
          bookId: a.book_id,
          readCount: 0,
          annotationCount: a.c,
          score: a.c * 2,
        });
      }
    }
    return [...map.values()]
      .sort((a, b) => b.score - a.score)
      .slice(0, 30);
  },
);

export const getRecentPublicNotes = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    try {
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
        parent_id: string | null;
        created_at: string;
      }>`
        select a.id, a.user_id, coalesce(p.display_name, '读者') as display_name,
               a.book_id, a.chapter_id, a.page, a.quote, a.note, a.kind,
               a.is_public, a.parent_id, a.created_at::text
        from annotations a
        left join user_profiles p on p.user_id = a.user_id
        where a.is_public = true and a.note <> ''
        order by a.created_at desc
        limit 40
      `;
      return rows.map(mapRow);
    } catch {
      return [] as AnnotationRow[];
    }
  },
);
