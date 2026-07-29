import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import type {
  Book,
  BookCategory,
  BookFormat,
  Bookmark,
  Highlight,
  ReadingProgress,
} from "@/lib/books/types";
import { getSql } from "@/lib/db";
import {
  cfWorkerDeleteObject,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";

const BOOK_FORMATS = new Set<BookFormat>(["pdf", "epub", "text"]);
const BOOK_CATEGORIES = new Set<Exclude<BookCategory, "全部">>([
  "文学",
  "社科",
  "科技",
  "历史",
  "商业",
  "生活",
  "幻想",
]);

export type SyncedLibrary = {
  books: Book[];
  shelfIds: string[];
  progress: ReadingProgress[];
};

type UploadedBookInput = {
  id: string;
  title: string;
  author: string;
  description: string;
  coverColor: string;
  coverText?: string;
  category: Exclude<BookCategory, "全部">;
  format: BookFormat;
  tags: string[];
  wordCount: number;
  storageKey: string;
  fileName?: string;
  fileSize?: number;
  pageCount?: number;
  previewText?: string;
  createdAt: number;
  chapters?: Book["chapters"];
  license?: string;
  licenseNote?: string;
};

function cleanText(value: unknown, max: number): string {
  return typeof value === "string" ? value.trim().slice(0, max) : "";
}

function cleanId(value: unknown, label: string): string {
  const id = cleanText(value, 160);
  if (!id || !/^[a-zA-Z0-9._:-]+$/.test(id)) {
    throw new Error(`${label} 无效`);
  }
  return id;
}

function sanitizeChapters(input: Book["chapters"]): Book["chapters"] | undefined {
  if (!Array.isArray(input) || !input.length) return undefined;
  return input.slice(0, 400).map((ch, index) => ({
    id: cleanText(ch?.id, 160) || `ch_${index + 1}`,
    title: cleanText(ch?.title, 200) || `章节 ${index + 1}`,
    content: cleanText(ch?.content, 2_000),
    href: cleanText(ch?.href, 500) || undefined,
  }));
}

function sanitizeUploadedBook(input: UploadedBookInput): UploadedBookInput {
  const format = BOOK_FORMATS.has(input.format) ? input.format : null;
  const category = BOOK_CATEGORIES.has(input.category) ? input.category : null;
  const storageKey = cleanText(input.storageKey, 700);
  if (!format || !category || !storageKey) throw new Error("图书元数据无效");
  const coverColor = /^#[0-9a-fA-F]{6}$/.test(input.coverColor)
    ? input.coverColor
    : "#2a2a28";
  return {
    id: cleanId(input.id, "图书 ID"),
    title: cleanText(input.title, 180) || "未命名图书",
    author: cleanText(input.author, 120) || "我的上传",
    description: cleanText(input.description, 800),
    coverColor,
    coverText: cleanText(input.coverText, 16) || format.toUpperCase(),
    category,
    format,
    tags: Array.isArray(input.tags)
      ? input.tags.slice(0, 12).map((t) => cleanText(t, 28)).filter(Boolean)
      : ["私有", "上传"],
    wordCount: Math.max(0, Math.min(100_000_000, Number(input.wordCount) || 0)),
    storageKey,
    fileName: cleanText(input.fileName, 240) || undefined,
    fileSize: Math.max(0, Math.min(100_000_000, Number(input.fileSize) || 0)),
    pageCount:
      input.pageCount == null
        ? undefined
        : Math.max(0, Math.min(100_000, Math.floor(Number(input.pageCount) || 0))),
    previewText: cleanText(input.previewText, 4_000) || undefined,
    chapters: sanitizeChapters(input.chapters),
    license: cleanText(input.license, 120) || "仅自己可见 · 未声明公版",
    licenseNote:
      cleanText(input.licenseNote, 500) ||
      "私有上传：未作公版声明前不会进入书城。",
    createdAt: Number.isFinite(input.createdAt) ? input.createdAt : Date.now(),
  };
}

function parseJson<T>(value: unknown, fallback: T): T {
  if (typeof value === "string") {
    try {
      return JSON.parse(value) as T;
    } catch {
      return fallback;
    }
  }
  return value && typeof value === "object" ? (value as T) : fallback;
}

export const listMyLibrary = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    try {
      const [bookRows, shelfRows, progressRows] = await Promise.all([
        sql<{
          id: string;
          metadata: unknown;
          storage_key: string;
          storage_backend: string;
        }>`
          select id, metadata, storage_key, storage_backend
          from user_books
          where user_id = ${context.userId}
          order by updated_at desc
        `,
        sql<{ book_id: string }>`
          select book_id from user_shelf
          where user_id = ${context.userId}
          order by added_at desc
        `,
        sql<{
          book_id: string;
          progress: number;
          chapter_id: string | null;
          page: number | null;
          cfi: string | null;
          updated_at_ms: number;
        }>`
          select book_id, progress, chapter_id, page, cfi,
                 (extract(epoch from updated_at) * 1000)::bigint as updated_at_ms
          from reading_progress_cloud
          where user_id = ${context.userId}
        `,
      ]);

      const books = bookRows.map((row) => {
        const metadata = parseJson<Partial<Book>>(row.metadata, {});
        return {
          ...metadata,
          id: row.id,
          source: "upload" as const,
          visibility: "private" as const,
          storageKey: row.storage_key,
          chapters: metadata.chapters,
        } as Book;
      });

      const progress = progressRows.map(
        (row): ReadingProgress => ({
          bookId: row.book_id,
          progress: Number(row.progress),
          lastChapterId: row.chapter_id ?? undefined,
          lastPage: row.page ?? undefined,
          lastCfi: row.cfi ?? undefined,
          bookmarks: [] as Bookmark[],
          highlights: [] as Highlight[],
          updatedAt: Number(row.updated_at_ms) || Date.now(),
        }),
      );

      return {
        books,
        shelfIds: shelfRows.map((r) => r.book_id),
        progress,
      } satisfies SyncedLibrary;
    } catch {
      // tables may not exist until migration applies
      return { books: [], shelfIds: [], progress: [] } satisfies SyncedLibrary;
    }
  });

export const saveUploadedBook = createServerFn({ method: "POST" })
  .validator((input: UploadedBookInput) => sanitizeUploadedBook(input))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const owned = `books/${context.userId}/${data.id}/`;
    const local = `books/local-reader/${data.id}/`;
    if (!data.storageKey.startsWith(owned) && !data.storageKey.startsWith(local)) {
      throw new Error("对象存储路径无效");
    }
    const sql = await getSql();
    const backend = cloudflareWorkerConfigured() ? "r2" : "indexeddb";
    const metadata: Book = {
      id: data.id,
      title: data.title,
      author: data.author,
      description: data.description,
      coverColor: data.coverColor,
      coverText: data.coverText,
      category: data.category,
      format: data.format,
      source: "upload",
      visibility: "private",
      license: data.license || "仅自己可见 · 未声明公版",
      licenseNote: data.licenseNote,
      tags: data.tags,
      rating: 5,
      readers: 1,
      wordCount: data.wordCount,
      storageKey: data.storageKey,
      fileName: data.fileName,
      fileSize: data.fileSize,
      pageCount: data.pageCount,
      previewText: data.previewText,
      chapters: data.chapters,
      createdAt: data.createdAt,
    };
    await sql`
      insert into user_books (
        user_id, id, metadata, storage_key, storage_backend, created_at, updated_at
      ) values (
        ${context.userId},
        ${data.id},
        ${JSON.stringify(metadata)}::jsonb,
        ${data.storageKey},
        ${backend},
        to_timestamp(${data.createdAt} / 1000.0),
        now()
      )
      on conflict (user_id, id) do update
      set metadata = excluded.metadata,
          storage_key = excluded.storage_key,
          storage_backend = excluded.storage_backend,
          updated_at = now()
    `;
    await sql`
      insert into user_shelf (user_id, book_id)
      values (${context.userId}, ${data.id})
      on conflict (user_id, book_id) do update set added_at = now()
    `;
    return { ok: true as const, backend };
  });

export const setShelfMembership = createServerFn({ method: "POST" })
  .validator((input: { bookId: string; present: boolean }) => ({
    bookId: cleanId(input.bookId, "图书 ID"),
    present: Boolean(input.present),
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    if (data.present) {
      await sql`
        insert into user_shelf (user_id, book_id)
        values (${context.userId}, ${data.bookId})
        on conflict (user_id, book_id) do update set added_at = now()
      `;
    } else {
      await sql`
        delete from user_shelf
        where user_id = ${context.userId} and book_id = ${data.bookId}
      `;
    }
    return { ok: true as const };
  });

export const deleteMyUploadedBook = createServerFn({ method: "POST" })
  .validator((bookId: string) => cleanId(bookId, "图书 ID"))
  .middleware([authMiddleware])
  .handler(async ({ context, data: bookId }) => {
    const sql = await getSql();
    const rows = await sql<{ storage_key: string }>`
      select storage_key from user_books
      where user_id = ${context.userId} and id = ${bookId}
    `;
    const key = rows[0]?.storage_key ?? null;
    if (key && cloudflareWorkerConfigured()) {
      try {
        await cfWorkerDeleteObject(key);
      } catch (error) {
        console.warn("[library] R2 delete failed", error);
      }
    }
    await Promise.all([
      sql`delete from user_shelf where user_id = ${context.userId} and book_id = ${bookId}`,
      sql`delete from reading_progress_cloud where user_id = ${context.userId} and book_id = ${bookId}`,
      sql`delete from user_books where user_id = ${context.userId} and id = ${bookId}`,
    ]);
    return { ok: true as const, storageKey: key };
  });
