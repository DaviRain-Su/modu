import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";

export type CloudProgress = {
  bookId: string;
  progress: number;
  chapterId: string | null;
  page: number | null;
  cfi: string | null;
  updatedAt: string;
};

export const pushReadingProgress = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      bookId: string;
      progress: number;
      chapterId?: string | null;
      page?: number | null;
      cfi?: string | null;
    }) => ({
      bookId: input.bookId.trim(),
      progress: Math.min(100, Math.max(0, Number(input.progress) || 0)),
      chapterId: input.chapterId?.trim() || null,
      page: input.page ?? null,
      cfi: input.cfi?.trim() || null,
    }),
  )
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    // Last-write-wins at the statement level; empty CFI/page are allowed so
    // text-mode readers can sync percentage-only progress.
    await sql`
      insert into reading_progress_cloud (
        user_id, book_id, progress, chapter_id, page, cfi, updated_at
      ) values (
        ${context.userId},
        ${data.bookId},
        ${data.progress},
        ${data.chapterId},
        ${data.page},
        ${data.cfi},
        now()
      )
      on conflict (user_id, book_id) do update set
        progress = excluded.progress,
        chapter_id = excluded.chapter_id,
        page = excluded.page,
        cfi = excluded.cfi,
        updated_at = now()
      where reading_progress_cloud.updated_at <= excluded.updated_at
    `;
    return { ok: true as const };
  });

export const pullReadingProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .validator((bookId: string) => bookId.trim())
  .handler(async ({ context, data: bookId }) => {
    const sql = await getSql();
    try {
      const rows = await sql<{
        book_id: string;
        progress: number;
        chapter_id: string | null;
        page: number | null;
        cfi: string | null;
        updated_at: string;
      }>`
        select book_id, progress, chapter_id, page, cfi, updated_at::text
        from reading_progress_cloud
        where user_id = ${context.userId} and book_id = ${bookId}
        limit 1
      `;
      const r = rows[0];
      if (!r) return null;
      return {
        bookId: r.book_id,
        progress: r.progress,
        chapterId: r.chapter_id,
        page: r.page,
        cfi: r.cfi,
        updatedAt: r.updated_at,
      } satisfies CloudProgress;
    } catch {
      return null;
    }
  });

export const listMyCloudProgress = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    try {
      const rows = await sql<{
        book_id: string;
        progress: number;
        chapter_id: string | null;
        page: number | null;
        cfi: string | null;
        updated_at: string;
      }>`
        select book_id, progress, chapter_id, page, cfi, updated_at::text
        from reading_progress_cloud
        where user_id = ${context.userId}
        order by updated_at desc
        limit 100
      `;
      return rows.map(
        (r) =>
          ({
            bookId: r.book_id,
            progress: r.progress,
            chapterId: r.chapter_id,
            page: r.page,
            cfi: r.cfi,
            updatedAt: r.updated_at,
          }) satisfies CloudProgress,
      );
    } catch {
      return [] as CloudProgress[];
    }
  });
