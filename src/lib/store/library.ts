import { create } from "zustand";
import { MARKET_BOOKS } from "@/lib/books/catalog";
import type { Book, ReadingProgress } from "@/lib/books/types";
import { parseUploadedBook } from "@/lib/books/parse-upload";
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
    meta?: { title?: string; author?: string },
    onPhase?: (phase: string) => void,
  ) => Promise<Book>;
  getBook: (id: string) => Book | undefined;
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
      const uploaded = await idbListBookMeta<Book>();
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

    // Text format always uses parsed chapters; PDF/EPUB keep binary + optional TOC
    const chapters =
      parsed.format === "text"
        ? parsed.chapters
        : parsed.format === "epub" && parsed.chapters?.length
          ? // EPUB: keep titles for TOC; content optional (EpubReader uses binary)
            parsed.chapters.map((c) => ({
              ...c,
              content: c.content?.slice(0, 500) || "",
            }))
          : parsed.format === "pdf" && parsed.pageCount
            ? undefined // PdfReader uses page numbers
            : parsed.chapters;

    const descBits = [
      `本地上传 · ${file.name}`,
      parsed.pageCount
        ? parsed.format === "pdf"
          ? `${parsed.pageCount} 页`
          : `${parsed.pageCount} 章`
        : null,
      parsed.previewText
        ? parsed.previewText.replace(/\s+/g, " ").slice(0, 120) + "…"
        : null,
    ].filter(Boolean);

    const book: Book = {
      id,
      title: baseTitle,
      author,
      description: descBits.join(" · "),
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
      tags: ["上传", parsed.format.toUpperCase()],
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

  allBooks: () => {
    const uploads = get().uploaded;
    return [...uploads, ...MARKET_BOOKS];
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
