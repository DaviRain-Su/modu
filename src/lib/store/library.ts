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
import {
  getCommunityBook,
  listCommunityPdBooks,
} from "@/lib/server/community-books";
import {
  deleteMyUploadedBook,
  listMyLibrary,
  saveUploadedBook,
  setShelfMembership,
} from "@/lib/server/library";
import { listMyCloudProgress } from "@/lib/server/progress";
import { uid } from "@/lib/utils";

const SHELF_KEY = "modu_shelf_ids";

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

function uniqueIds(ids: string[]): string[] {
  return [...new Set(ids.filter(Boolean))];
}

function normalizeBook(raw: Book): Book {
  if (raw.source === "upload" || raw.id.startsWith("upload_")) {
    return {
      ...raw,
      source: "upload",
      visibility: "private",
      license: raw.license || "仅自己可见 · 未声明公版",
      licenseNote:
        raw.licenseNote ||
        "私有上传：未作公版声明前不会进入书城。",
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
  syncing: boolean;
  cloudUserId: string | null;
  shelfIds: string[];
  uploaded: Book[];
  community: Book[];
  progressMap: Record<string, ReadingProgress>;
  init: () => Promise<void>;
  syncFromCloud: (userId: string | null | undefined) => Promise<void>;
  refreshCommunity: () => Promise<void>;
  addToShelf: (bookId: string) => void;
  removeFromShelf: (bookId: string) => Promise<void>;
  isOnShelf: (bookId: string) => boolean;
  uploadBook: (
    file: File,
    meta: {
      title?: string;
      author?: string;
      personalUseAck: boolean;
    },
    onPhase?: (phase: string) => void,
    ownerId?: string | null,
  ) => Promise<Book>;
  cacheCommunityBook: (book: Book) => void;
  getBook: (id: string) => Book | undefined;
  resolveBook: (id: string) => Promise<Book | undefined>;
  marketBooks: () => Book[];
  allBooks: () => Book[];
  shelfBooks: () => Book[];
  saveProgress: (progress: ReadingProgress) => Promise<void>;
  getProgress: (bookId: string) => ReadingProgress | undefined;
}

export const useLibraryStore = create<LibraryState>((set, get) => ({
  ready: false,
  syncing: false,
  cloudUserId: null,
  shelfIds: [],
  uploaded: [],
  community: [],
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
      let community: Book[] = [];
      try {
        community = await listCommunityPdBooks();
      } catch {
        community = [];
      }
      const valid = new Set([
        ...MARKET_BOOKS.map((b) => b.id),
        ...uploaded.map((b) => b.id),
        ...community.map((b) => b.id),
      ]);
      const cleaned = shelfIds.filter(
        (id) => valid.has(id) || id.startsWith("community_"),
      );
      if (cleaned.length !== shelfIds.length) saveShelfIds(cleaned);
      set({
        ready: true,
        uploaded,
        community,
        shelfIds: cleaned,
        progressMap: map,
      });
    } catch {
      set({ ready: true, shelfIds: loadShelfIds() });
    }
  },

  syncFromCloud: async (userId) => {
    if (!userId) {
      set({ cloudUserId: null });
      return;
    }
    if (get().syncing && get().cloudUserId === userId) return;
    set({ syncing: true, cloudUserId: userId });
    try {
      const [remote, cloudProgress] = await Promise.all([
        listMyLibrary().catch(() => null),
        listMyCloudProgress().catch(() => [] as Awaited<
          ReturnType<typeof listMyCloudProgress>
        >),
      ]);

      const localMap = new Map(get().uploaded.map((b) => [b.id, b]));
      if (remote) {
        for (const book of remote.books) {
          const merged = normalizeBook({
            ...book,
            chapters: localMap.get(book.id)?.chapters ?? book.chapters,
          });
          localMap.set(book.id, merged);
          await idbSaveBookMeta(book.id, merged);
        }
      }

      const progressMap = { ...get().progressMap };
      const mergeProgress = (p: ReadingProgress) => {
        const local = progressMap[p.bookId];
        if (!local || (local.updatedAt ?? 0) <= p.updatedAt) {
          progressMap[p.bookId] = {
            ...p,
            bookmarks: p.bookmarks?.length
              ? p.bookmarks
              : (local?.bookmarks ?? []),
            highlights: p.highlights?.length
              ? p.highlights
              : (local?.highlights ?? []),
          };
          void idbSaveProgress(p.bookId, progressMap[p.bookId]!);
        }
      };

      if (remote) {
        for (const p of remote.progress) mergeProgress(p);
      }
      for (const c of cloudProgress) {
        mergeProgress({
          bookId: c.bookId,
          progress: c.progress,
          lastChapterId: c.chapterId ?? undefined,
          lastPage: c.page ?? undefined,
          lastCfi: c.cfi ?? undefined,
          bookmarks: progressMap[c.bookId]?.bookmarks ?? [],
          highlights: progressMap[c.bookId]?.highlights ?? [],
          updatedAt: Date.parse(c.updatedAt) || Date.now(),
        });
      }

      const shelfIds = uniqueIds([
        ...(remote?.shelfIds ?? []),
        ...get().shelfIds,
      ]);
      saveShelfIds(shelfIds);
      set({
        uploaded: [...localMap.values()],
        shelfIds,
        progressMap,
        cloudUserId: userId,
      });
    } catch (error) {
      console.warn("[library] cloud sync failed", error);
    } finally {
      set({ syncing: false });
    }
  },

  refreshCommunity: async () => {
    try {
      const community = await listCommunityPdBooks();
      set({ community });
    } catch {
      /* ignore */
    }
  },

  addToShelf: (bookId) => {
    const ids = get().shelfIds;
    if (ids.includes(bookId)) return;
    const next = [bookId, ...ids];
    saveShelfIds(next);
    set({ shelfIds: next });
    if (get().cloudUserId) {
      void setShelfMembership({ data: { bookId, present: true } }).catch(
        (e) => console.warn("[library] shelf sync failed", e),
      );
    }
  },

  removeFromShelf: async (bookId) => {
    const next = get().shelfIds.filter((id) => id !== bookId);
    saveShelfIds(next);
    const book = get().uploaded.find((b) => b.id === bookId);
    if (book) {
      if (get().cloudUserId) {
        try {
          await deleteMyUploadedBook({ data: bookId });
        } catch (error) {
          console.warn("[library] cloud delete failed", error);
        }
      }
      if (book.storageKey) await deleteBookFile(book.storageKey);
      await idbDeleteBookMeta(bookId);
      set({
        shelfIds: next,
        uploaded: get().uploaded.filter((b) => b.id !== bookId),
      });
    } else {
      set({ shelfIds: next });
      if (get().cloudUserId) {
        void setShelfMembership({ data: { bookId, present: false } }).catch(
          (e) => console.warn("[library] shelf sync failed", e),
        );
      }
    }
  },

  isOnShelf: (bookId) => get().shelfIds.includes(bookId),

  uploadBook: async (file, meta, onPhase, ownerId) => {
    if (!meta?.personalUseAck) {
      throw new Error("请确认版权与个人使用声明");
    }

    onPhase?.("parsing");
    const parsed = await parseUploadedBook(file);

    const id = uid("upload");
    const owner = ownerId?.trim() || "local-reader";
    const baseTitle =
      meta?.title?.trim() ||
      parsed.title ||
      file.name.replace(/\.[^.]+$/, "");
    const author =
      meta?.author?.trim() || parsed.author || "我的上传";

    onPhase?.("storing");
    const { key, backend } = await putBookFile({
      owner,
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
              content: c.content || "",
            }))
          : undefined;

    const book: Book = {
      id,
      title: baseTitle,
      author,
      description: `私有上传 · ${file.name}`,
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
      license: "仅自己可见 · 未声明公版",
      licenseNote:
        "默认私有。若确认为公版，可在上传页选择「贡献到社区公版」。",
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

    if (ownerId) {
      try {
        await saveUploadedBook({
          data: {
            id: book.id,
            title: book.title,
            author: book.author,
            description: book.description,
            coverColor: book.coverColor,
            coverText: book.coverText,
            category: book.category,
            format: book.format,
            tags: book.tags,
            wordCount: book.wordCount,
            storageKey: book.storageKey!,
            fileName: book.fileName,
            fileSize: book.fileSize,
            pageCount: book.pageCount,
            previewText: book.previewText,
            createdAt: book.createdAt,
            chapters:
              book.format === "text"
                ? book.chapters
                : book.chapters?.map((c) => ({
                    ...c,
                    content: (c.content || "").slice(0, 500),
                  })),
            license: book.license,
            licenseNote: book.licenseNote,
          },
        });
      } catch (error) {
        console.warn("[library] cloud metadata save failed", error);
      }
    }

    const shelfIds = [id, ...get().shelfIds.filter((x) => x !== id)];
    saveShelfIds(shelfIds);
    set({
      uploaded: [book, ...get().uploaded],
      shelfIds,
      cloudUserId: ownerId || get().cloudUserId,
    });
    // backend is used for toast in upload page via book fields if needed
    void backend;
    return book;
  },

  cacheCommunityBook: (book) => {
    const rest = get().community.filter((b) => b.id !== book.id);
    set({ community: [book, ...rest] });
  },

  getBook: (id) => {
    return (
      get().uploaded.find((b) => b.id === id) ||
      get().community.find((b) => b.id === id) ||
      MARKET_BOOKS.find((b) => b.id === id)
    );
  },

  resolveBook: async (id) => {
    const local = get().getBook(id);
    if (local) return local;
    if (id.startsWith("community_")) {
      try {
        const b = await getCommunityBook({ data: id });
        if (b) {
          get().cacheCommunityBook(b);
          return b;
        }
      } catch {
        return undefined;
      }
    }
    return undefined;
  },

  marketBooks: () => {
    const official = MARKET_BOOKS.filter(
      (b) => b.visibility === "public_domain",
    );
    const community = get().community.filter(
      (b) => b.visibility === "public_domain_community",
    );
    return [...community, ...official];
  },

  allBooks: () => {
    return [...get().uploaded, ...get().community, ...MARKET_BOOKS];
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
