import { create } from "zustand";
import { MARKET_BOOKS } from "@/lib/books/catalog";
import type { Book, ReadingProgress } from "@/lib/books/types";
import { parseUploadedBook } from "@/lib/books/parse-upload";
import { canPublishUploadToMarket } from "@/lib/books/copyright";
import {
  idbDeleteBookMeta,
  idbGetProgress,
  idbListBookMeta,
  idbListProgress,
  idbSaveBookMeta,
  idbSaveProgress,
} from "@/lib/storage/idb";
import { deleteBookFile, putBookFile } from "@/lib/storage/r2";
import { uid } from "@/lib/utils";

const SHELF_KEY = "modu_shelf_ids";
const OWNER = "local-reader";

function loadShelfIds(): string[] {
  if (typeof localStorage === "undefined") return [];
  try {
    const raw = localStorage.getItem(SHELF_KEY);
    return raw ? (JSON.parse(raw) as string[]) : [];
  } catch {
    return [];
  }
}

function saveShelfIds(ids: string[]) {
  if (typeof localStorage === "undefined") return;
  localStorage.setItem(SHELF_KEY, JSON.stringify(ids));
}

/** Normalize legacy stored books (pre-copyright fields) */
function normalizeBook(raw: Book): Book {
  if (raw.source === "upload" || raw.id.startsWith("upload_")) {
    return {
      ...raw,
      source: "upload",
      visibility: "private",
      license: raw.license || "仅自己可见 · 禁止上架书城",
      licenseNote:
        raw.licenseNote ||
        "私有上传：仅供个人阅读，不可公开到书城，他人无法访问正文。",
    };
  }
  return {
    ...raw,
    visibility: raw.visibility || "public_domain",
    license: raw.license || "公版 · Public Domain",
  };
}

interface LibraryState {
  ready: boolean;
  shelfIds: string[];
  uploaded: Book[];
  progressMap: Record<string, ReadingProgress>;
  init: () => Promise<void>;
  addToShelf: (bookId: string) => void;
  removeFromShelf: (bookId: string) => Promise<void>;
  isOnShelf: (bookId: string) => boolean;
  uploadBook: (
    file: File,
    meta?: { title?: string; author?: string; personalUseAck: boolean },
    onPhase?: (phase: string) => void,
  ) => Promise<Book>;
  getBook: (id: string) => Book | undefined;
  /** 书城公开目录（永不含上传） */
  marketBooks: () => Book[];
  allBooks: () => Book[];
  shelfBooks: () => Book[];
  saveProgress: (progress: ReadingProgress) => Promise<void>;
  getProgress: (bookId: string) => ReadingProgress | undefined;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  ready: false,
  shelfIds: [],
  uploaded: [],
  progressMap: {},

  init: async () => {
    if (get().ready) return;
    try {
      const raw = await idbListBookMeta<Book>();
      const uploaded = raw.map(normalizeBook);
      const progresses = await idbListProgress<ReadingProgress>();
      const map: Record<string, ReadingProgress> = {};
      for (const p of progresses) map[p.bookId] = p;
      const shelfIds = loadShelfIds();
      const valid = new Set([
        ...MARKET_BOOKS.map((b) => b.id),
        ...uploaded.map((b) => b.id),
      ]);
      const cleaned = shelfIds.filter((id) => valid.has(id));
      if (cleaned.length !== shelfIds.length) saveShelfIds(cleaned);
      set({
        ready: true,
        uploaded,
        shelfIds: cleaned,
        progressMap: map,
      });
    } catch {
      set({ ready: true, shelfIds: loadShelfIds() });
    }
  },

  addToShelf: (bookId) => {
    const ids = get().shelfIds;
    if (ids.includes(bookId)) return;
    const next = [bookId, ...ids];
    saveShelfIds(next);
    set({ shelfIds: next });
  },

  removeFromShelf: async (bookId) => {
    const next = get().shelfIds.filter((id) => id !== bookId);
    saveShelfIds(next);
    const book = get().uploaded.find((b) => b.id === bookId);
    if (book) {
      if (book.storageKey) await deleteBookFile(book.storageKey);
      await idbDeleteBookMeta(bookId);
      set({
        shelfIds: next,
        uploaded: get().uploaded.filter((b) => b.id !== bookId),
      });
    } else {
      set({ shelfIds: next });
    }
  },

  isOnShelf: (bookId) => get().shelfIds.includes(bookId),

  uploadBook: async (file, meta, onPhase) => {
    // 底线：未确认个人用途不可上传
    if (!meta?.personalUseAck) {
      throw new Error("请确认：本书仅供个人阅读，不会公开到书城");
    }
    // 双保险：上传永不可上架
    void canPublishUploadToMarket();

    onPhase?.("parsing");
    const parsed = await parseUploadedBook(file);

    const id = uid("upload");
    const baseTitle =
      meta?.title?.trim() ||
      parsed.title ||
      file.name.replace(/\.[^.]+$/, "");
    const author =
      meta?.author?.trim() || parsed.author || "我的上传";

    onPhase?.("storing");
    const { key } = await putBookFile({
      owner: OWNER,
      bookId: id,
      fileName: file.name,
      blob: file,
      contentType: parsed.contentType || file.type,
    });

    const chapters =
      parsed.format === "text"
        ? parsed.chapters
        : parsed.format === "epub" && parsed.chapters?.length
          ? parsed.chapters.map((c) => ({
              ...c,
              content: c.content?.slice(0, 500) || "",
            }))
          : undefined;

    const book: Book = {
      id,
      title: baseTitle,
      author,
      description: `私有上传 · ${file.name} · 仅自己可见`,
      coverColor:
        parsed.format === "pdf"
          ? "#3a2820"
          : parsed.format === "epub"
            ? "#1e2f38"
            : "#2a2a28",
      coverText: parsed.format.toUpperCase(),
      category: "生活",
      format: parsed.format,
      source: "upload",
      visibility: "private",
      license: "仅自己可见 · 禁止上架书城",
      licenseNote:
        "私有图书：内容不进入书城，其他用户无法打开正文。公开社区仅可分享你的评论/摘要，不可公开原文。",
      tags: ["私有", "上传", parsed.format.toUpperCase()],
      rating: 5,
      readers: 1,
      wordCount: parsed.wordCount ?? Math.round(file.size / 2),
      storageKey: key,
      fileName: file.name,
      fileSize: file.size,
      pageCount: parsed.pageCount,
      previewText: parsed.previewText,
      chapters,
      createdAt: Date.now(),
      progress: 0,
    };

    onPhase?.("indexing");
    await idbSaveBookMeta(id, book);
    const shelfIds = [id, ...get().shelfIds.filter((x) => x !== id)];
    saveShelfIds(shelfIds);
    set({
      uploaded: [book, ...get().uploaded],
      shelfIds,
    });
    return book;
  },

  getBook: (id) => {
    return (
      get().uploaded.find((b) => b.id === id) ||
      MARKET_BOOKS.find((b) => b.id === id)
    );
  },

  marketBooks: () =>
    MARKET_BOOKS.filter(
      (b) => b.source === "market" && b.visibility === "public_domain",
    ),

  allBooks: () => {
    // 注意：上传书仅用于「我的书架」，不应混入书城
    return [...get().uploaded, ...MARKET_BOOKS];
  },

  shelfBooks: () => {
    const { shelfIds, getBook, progressMap } = get();
    return shelfIds
      .map((id) => {
        const b = getBook(id);
        if (!b) return null;
        const p = progressMap[id];
        return {
          ...b,
          progress: p?.progress ?? b.progress ?? 0,
          lastReadAt: p?.updatedAt,
          lastChapterId: p?.lastChapterId,
          lastPage: p?.lastPage,
        } as Book;
      })
      .filter(Boolean) as Book[];
  },

  saveProgress: async (progress) => {
    await idbSaveProgress(progress.bookId, progress);
    set({
      progressMap: { ...get().progressMap, [progress.bookId]: progress },
    });
  },

  getProgress: (bookId) => get().progressMap[bookId],
}));

export async function hydrateProgress(bookId: string) {
  const p = await idbGetProgress<ReadingProgress>(bookId);
  if (p) {
    useLibraryStore.setState((s) => ({
      progressMap: { ...s.progressMap, [bookId]: p },
    }));
  }
  return p;
}
