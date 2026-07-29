import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlignLeft,
  ChevronLeft,
  Cloud,
  List,
  Minus,
  PanelRight,
  Plus,
  Settings2,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { toast } from "sonner";
import { z } from "zod";
import { TextReader } from "@/components/reader/TextReader";
import { PdfReader } from "@/components/reader/PdfReader";
import {
  EpubReader,
  type EpubReaderHandle,
  type EpubTocItem,
} from "@/components/reader/EpubReader";
import { AiPanel } from "@/components/reader/AiPanel";
import {
  SelectionToolbar,
  type HighlightColor,
  type SelectionAnchor,
} from "@/components/reader/SelectionToolbar";
import { AnnotationPopover } from "@/components/reader/AnnotationPopover";
import { QuoteThreadSheet } from "@/components/reader/QuoteThreadSheet";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useLibraryStore } from "@/lib/store/library";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import {
  recordBookRead,
  createAnnotation,
  listQuoteThreads,
  type AnnotationRow,
  type QuoteThread,
} from "@/lib/server/social";
import {
  listChapterDanmaku,
  type DanmakuRow,
} from "@/lib/server/danmaku";
import {
  pullReadingProgress,
  pushReadingProgress,
} from "@/lib/server/progress";
import { quotesMatch } from "@/lib/reader/quote-key";
import type { Book, Highlight, ReadingProgress } from "@/lib/books/types";
import {
  DEFAULT_READER_PREFS,
  loadReaderPrefs,
  READER_FONT_META,
  READER_LAYOUT_META,
  READER_THEME_META,
  saveReaderPrefs,
  type ReaderFont,
  type ReaderLayout,
  type ReaderPrefs,
} from "@/lib/reader/prefs";
import { cn, uid } from "@/lib/utils";

const searchSchema = z.object({
  chapter: z.string().optional(),
});

export const Route = createFileRoute("/read/$bookId")({
  validateSearch: searchSchema,
  component: ReaderPage,
});

function useIsLg() {
  const [lg, setLg] = useState(false);
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px)");
    const apply = () => setLg(mq.matches);
    apply();
    mq.addEventListener("change", apply);
    return () => mq.removeEventListener("change", apply);
  }, []);
  return lg;
}

function ReaderPage() {
  const { bookId } = Route.useParams();
  const { chapter: chapterParam } = Route.useSearch();
  const navigate = useNavigate();
  const isLg = useIsLg();
  const ready = useLibraryStore((s) => s.ready);
  const getBook = useLibraryStore((s) => s.getBook);
  const resolveBook = useLibraryStore((s) => s.resolveBook);
  const getProgress = useLibraryStore((s) => s.getProgress);
  const saveProgress = useLibraryStore((s) => s.saveProgress);
  const addToShelf = useLibraryStore((s) => s.addToShelf);
  const { user } = useCurrentUserState();

  const [book, setBook] = useState<Book | null | undefined>(undefined);
  const stored = getProgress(bookId);

  const [prefs, setPrefs] = useState<ReaderPrefs>(DEFAULT_READER_PREFS);
  const [prefsReady, setPrefsReady] = useState(false);

  const [sel, setSel] = useState<SelectionAnchor | null>(null);
  const [noteDraft, setNoteDraft] = useState<{
    quote: string;
    color: HighlightColor;
  } | null>(null);
  const [annoBusy, setAnnoBusy] = useState(false);
  const [localHighlights, setLocalHighlights] = useState<Highlight[]>(
    stored?.highlights ?? [],
  );

  const [cloudSynced, setCloudSynced] = useState(false);
  const [threads, setThreads] = useState<QuoteThread[]>([]);
  const [threadQuote, setThreadQuote] = useState<string | null>(null);
  const [danmaku, setDanmaku] = useState<DanmakuRow[]>([]);
  const [danmakuEnabled, setDanmakuEnabled] = useState(true);
  const [epubToc, setEpubToc] = useState<EpubTocItem[]>([]);
  const [epubCfi, setEpubCfi] = useState<string | null>(
    stored?.lastCfi ?? null,
  );
  const epubRef = useRef<EpubReaderHandle>(null);
  const pushTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setPrefs(loadReaderPrefs());
    setPrefsReady(true);
  }, []);

  useEffect(() => {
    setLocalHighlights(stored?.highlights ?? []);
  }, [bookId, stored?.highlights]);

  const updatePrefs = useCallback((patch: Partial<ReaderPrefs>) => {
    setPrefs((prev) => {
      const next = { ...prev, ...patch };
      saveReaderPrefs(next);
      return next;
    });
  }, []);

  useEffect(() => {
    if (!ready) return;
    const local = getBook(bookId);
    if (local) {
      setBook(local);
      return;
    }
    void resolveBook(bookId).then((b) => setBook(b ?? null));
  }, [bookId, ready, getBook, resolveBook]);

  const chapters = book?.chapters ?? [];
  const [chapterId, setChapterId] = useState(
    chapterParam || stored?.lastChapterId || "",
  );
  const [chromeVisible, setChromeVisible] = useState(true);
  const [aiOpen, setAiOpen] = useState(false);
  const [tocOpen, setTocOpen] = useState(false);
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [selectedText, setSelectedText] = useState("");
  const [pageContext, setPageContext] = useState("");
  const [progress, setProgress] = useState(stored?.progress ?? 0);
  const [page, setPage] = useState(stored?.lastPage ?? 1);

  useEffect(() => {
    if (!user || !bookId) return;
    let cancelled = false;
    void pullReadingProgress({ data: bookId })
      .then((cloud) => {
        if (cancelled || !cloud) return;
        const localUpdated = stored?.updatedAt ?? 0;
        const cloudTs = Date.parse(cloud.updatedAt) || 0;
        if (cloudTs >= localUpdated) {
          setProgress(cloud.progress);
          if (cloud.chapterId) setChapterId(cloud.chapterId);
          if (cloud.page != null) setPage(cloud.page);
          if (cloud.cfi) setEpubCfi(cloud.cfi);
          setCloudSynced(true);
          void saveProgress({
            bookId,
            progress: cloud.progress,
            lastChapterId: cloud.chapterId || undefined,
            lastPage: cloud.page ?? undefined,
            lastCfi: cloud.cfi || undefined,
            bookmarks: stored?.bookmarks ?? [],
            highlights: stored?.highlights ?? localHighlights,
            updatedAt: cloudTs || Date.now(),
          });
        }
      })
      .catch(() => {});
    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, bookId]);

  useEffect(() => {
    if (book) addToShelf(book.id);
  }, [book, addToShelf]);

  useEffect(() => {
    if (book && user) {
      void recordBookRead({ data: book.id }).catch(() => {});
    }
  }, [book?.id, user?.id]);

  useEffect(() => {
    if (chapterParam) setChapterId(chapterParam);
    else if (book?.chapters?.[0] && !chapterId) {
      setChapterId(book.chapters[0].id);
    }
  }, [chapterParam, book, chapterId]);

  useEffect(() => {
    if (isLg) setAiOpen(true);
  }, [isLg]);

  const chapter = useMemo(
    () => chapters.find((c) => c.id === chapterId) ?? chapters[0],
    [chapters, chapterId],
  );

  const supportsCommunity =
    book?.visibility === "public_domain" ||
    book?.visibility === "public_domain_community";

  useEffect(() => {
    if (!supportsCommunity || !book) {
      setThreads([]);
      return;
    }
    void listQuoteThreads({ data: book.id })
      .then(setThreads)
      .catch(() => setThreads([]));
  }, [supportsCommunity, book?.id]);

  useEffect(() => {
    if (!supportsCommunity || !book || !chapter?.id) {
      setDanmaku([]);
      return;
    }
    let cancelled = false;
    void listChapterDanmaku({
      data: { bookId: book.id, chapterId: chapter.id },
    })
      .then((rows) => {
        if (!cancelled) setDanmaku(rows);
      })
      .catch(() => {
        if (!cancelled) setDanmaku([]);
      });
    return () => {
      cancelled = true;
    };
  }, [supportsCommunity, book?.id, chapter?.id]);

  const scheduleCloudPush = useCallback(
    (pct: number, extra?: { chapterId?: string; page?: number; cfi?: string }) => {
      if (!user || !book) return;
      if (pushTimer.current) clearTimeout(pushTimer.current);
      pushTimer.current = setTimeout(() => {
        void pushReadingProgress({
          data: {
            bookId: book.id,
            progress: pct,
            chapterId: extra?.chapterId ?? chapterId ?? chapter?.id,
            page: extra?.page ?? page,
            cfi: extra?.cfi ?? epubCfi,
          },
        })
          .then(() => setCloudSynced(true))
          .catch(() => {});
      }, 1200);
    },
    [user, book, chapterId, chapter?.id, page, epubCfi],
  );

  const persist = useCallback(
    (pct: number, extra?: Partial<ReadingProgress>) => {
      if (!book) return;
      const next: ReadingProgress = {
        bookId: book.id,
        progress: pct,
        lastChapterId: chapterId || chapter?.id,
        lastPage: page,
        lastCfi: epubCfi || undefined,
        bookmarks: stored?.bookmarks ?? [],
        highlights: extra?.highlights ?? localHighlights,
        updatedAt: Date.now(),
        ...extra,
      };
      void saveProgress(next);
      scheduleCloudPush(pct, {
        chapterId: next.lastChapterId,
        page: next.lastPage,
        cfi: next.lastCfi,
      });
    },
    [
      book,
      chapter?.id,
      chapterId,
      page,
      epubCfi,
      saveProgress,
      stored?.bookmarks,
      localHighlights,
      scheduleCloudPush,
    ],
  );

  const onProgress = useCallback(
    (pct: number) => {
      setProgress(pct);
      persist(pct);
    },
    [persist],
  );

  const clearBrowserSelection = () => {
    try {
      window.getSelection()?.removeAllRanges();
    } catch {
      /* ignore */
    }
  };

  const saveHighlight = useCallback(
    async (input: {
      text: string;
      note?: string;
      color: HighlightColor;
      isPublic?: boolean;
    }) => {
      if (!book) return;
      const hl: Highlight = {
        id: uid("hl"),
        text: input.text,
        note: input.note,
        chapterId: chapter?.id,
        color: input.color,
        isPublic: input.isPublic,
        createdAt: Date.now(),
      };
      const next = [hl, ...localHighlights];
      setLocalHighlights(next);
      persist(progress, { highlights: next });

      if (input.isPublic && user && supportsCommunity) {
        try {
          await createAnnotation({
            data: {
              bookId: book.id,
              quote: input.text,
              note: input.note || "",
              chapterId: chapter?.id,
              kind: input.note ? "note" : "highlight",
              isPublic: true,
            },
          });
        } catch (e) {
          toast.error(
            e instanceof Error ? e.message : "公开同步失败，已保存在本机",
          );
        }
      }
    },
    [
      book,
      chapter?.id,
      localHighlights,
      persist,
      progress,
      user,
      supportsCommunity,
    ],
  );

  const handleHighlight = (color: HighlightColor) => {
    if (!sel) return;
    void saveHighlight({ text: sel.text, color });
    toast.success("已划线");
    clearBrowserSelection();
    setSel(null);
  };

  const communityCountFor = (text: string) =>
    threads.find((x) => quotesMatch(x.quote, text))?.count ?? 0;

  const handleThoughts = () => {
    if (!sel) return;
    if (supportsCommunity) {
      setThreadQuote(sel.text);
      setSel(null);
      clearBrowserSelection();
      return;
    }
    setNoteDraft({ quote: sel.text, color: "gold" });
    setSel(null);
    clearBrowserSelection();
  };

  const handleAskAi = () => {
    if (!sel) return;
    setSelectedText(sel.text);
    setAiOpen(true);
    clearBrowserSelection();
    setSel(null);
  };

  const handleCopy = async () => {
    if (!sel) return;
    try {
      await navigator.clipboard.writeText(sel.text);
      toast.success("已复制");
    } catch {
      toast.error("复制失败");
    }
    clearBrowserSelection();
    setSel(null);
  };

  const onSelectTextFallback = useCallback((text: string) => {
    const t = text.replace(/\s+/g, " ").trim();
    if (t.length < 2) return;
    setSel({
      text: t,
      x: window.innerWidth / 2,
      y: window.innerHeight * 0.35,
      bottom: window.innerHeight * 0.35 + 24,
    });
  }, []);

  const aiContextText =
    selectedText ||
    pageContext ||
    chapter?.content?.slice(0, 1500) ||
    book?.previewText ||
    "";

  if (ready && book === null) {
    return (
      <div className="flex min-h-dvh flex-col items-center justify-center bg-bg px-6 text-center">
        <p className="text-lg font-medium">找不到这本书</p>
        <Button asChild className="mt-4">
          <Link to="/library">返回书城</Link>
        </Button>
      </div>
    );
  }

  if (!book || !prefsReady) {
    return (
      <div className="flex min-h-dvh items-center justify-center bg-paper text-paper-muted">
        加载中…
      </div>
    );
  }

  const chapterIndex = chapters.findIndex((c) => c.id === chapter?.id);
  const showToc =
    chapters.length > 0 || book.format === "epub" || epubToc.length > 0;
  // EPUB 有原文件 → 始终用 epubjs 真分页；不要把提取正文硬套 TextReader
  const useEpub = book.format === "epub" && Boolean(book.storageKey);
  const usePdf = book.format === "pdf" && Boolean(book.storageKey);
  const useText =
    !useEpub &&
    !usePdf &&
    Boolean(chapter?.content);
  const isPrivateBook =
    book.visibility === "private" || book.source === "upload";

  return (
    <div className="relative flex h-dvh flex-col bg-bg text-fg">
      {chromeVisible && (
        <header className="z-30 shrink-0 border-b border-border bg-bg/95 backdrop-blur-sm safe-pt">
          <div className="flex h-12 items-center gap-1 px-2 sm:h-14 sm:px-3">
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() =>
                void navigate({
                  to: "/book/$bookId",
                  params: { bookId: book.id },
                })
              }
              aria-label="返回"
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <div className="min-w-0 flex-1 px-1">
              <p className="truncate text-sm font-medium">{book.title}</p>
              <p className="flex items-center gap-1 truncate text-[11px] text-fg-subtle">
                {useEpub
                  ? "EPUB · 左右翻页"
                  : book.format === "pdf" && book.storageKey
                    ? `PDF · 第 ${page} 页`
                    : chapter?.title || book.format.toUpperCase()}
                {threads.length > 0
                  ? ` · ${threads.length} 句有想法`
                  : localHighlights.length > 0
                    ? ` · ${localHighlights.length} 划线`
                    : ""}
                {user && cloudSynced && (
                  <span className="inline-flex items-center gap-0.5 text-accent">
                    <Cloud className="h-3 w-3" />
                    已同步
                  </span>
                )}
              </p>
            </div>
            {showToc && (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setTocOpen(true)}
                aria-label="目录"
              >
                <List className="h-4 w-4" />
              </Button>
            )}
            <Button
              variant="ghost"
              size="icon-sm"
              onClick={() => setSettingsOpen(true)}
              aria-label="阅读设置"
            >
              <Settings2 className="h-4 w-4" />
            </Button>
            {isLg ? (
              <Button
                variant="ghost"
                size="icon-sm"
                onClick={() => setAiOpen((v) => !v)}
                aria-label="AI 伴读"
              >
                <PanelRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button variant="soft" size="sm" onClick={() => setAiOpen(true)}>
                <Sparkles className="h-3.5 w-3.5" />
                AI
              </Button>
            )}
          </div>
          <div className="h-0.5 w-full bg-bg-subtle">
            <div
              className="h-full bg-accent transition-[width] duration-300"
              style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
            />
          </div>
        </header>
      )}

      {!chromeVisible && (
        <div className="h-0.5 w-full shrink-0 bg-bg-subtle">
          <div
            className="h-full bg-accent transition-[width] duration-300"
            style={{ width: `${Math.min(100, Math.max(0, progress))}%` }}
          />
        </div>
      )}

      <div className="flex min-h-0 flex-1">
        <div
          className="relative min-w-0 flex-1"
          onClick={(e) => {
            const el = e.target as HTMLElement;
            if (
              el.closest(
                "button, a, input, textarea, canvas, iframe, [data-text-layer], mark, [data-page-turn], [data-reader]",
              )
            ) {
              // 点在阅读器热区 / 控件上：不切换顶栏（避免和翻页抢点击）
              // 中间正文区域仍可点一下显隐顶栏
              if (el.closest("[data-page-turn]")) return;
            }
            if (window.getSelection()?.toString().trim()) return;
            // 点在左右热区已由 button 处理
            if (el.closest("[data-page-turn]")) return;
            setSel(null);
            // 仅点在中央 40% 区域时切换 chrome
            const shell = el.closest("[data-reader]");
            if (shell) {
              const r = shell.getBoundingClientRect();
              const x = e.clientX - r.left;
              const ratio = x / r.width;
              if (ratio < 0.28 || ratio > 0.72) return;
            }
            setChromeVisible((v) => !v);
          }}
        >
          {useText && chapter && (
            <TextReader
              book={book}
              chapter={chapter}
              fontSize={prefs.fontSize}
              lineHeight={prefs.lineHeight}
              letterSpacing={prefs.letterSpacing}
              maxWidth={prefs.maxWidth}
              font={prefs.font}
              theme={prefs.theme}
              layout={prefs.layout}
              highlights={localHighlights}
              publicThreads={supportsCommunity ? threads : []}
              danmaku={supportsCommunity ? danmaku : []}
              danmakuEnabled={danmakuEnabled}
              signedIn={Boolean(user)}
              onOpenThread={(q) => setThreadQuote(q)}
              onDanmakuPosted={(row) =>
                setDanmaku((prev) => [...prev, row])
              }
              onToggleDanmaku={() => setDanmakuEnabled((v) => !v)}
              onProgress={onProgress}
              onSelect={setSel}
              onChapterNav={(dir) => {
                if (dir === "next" && chapterIndex >= 0 && chapterIndex < chapters.length - 1) {
                  const next = chapters[chapterIndex + 1];
                  setChapterId(next.id);
                  void navigate({
                    to: "/read/$bookId",
                    params: { bookId: book.id },
                    search: { chapter: next.id },
                    replace: true,
                  });
                } else if (dir === "prev" && chapterIndex > 0) {
                  const prev = chapters[chapterIndex - 1];
                  setChapterId(prev.id);
                  void navigate({
                    to: "/read/$bookId",
                    params: { bookId: book.id },
                    search: { chapter: prev.id },
                    replace: true,
                  });
                }
              }}
            />
          )}
          {useEpub && (
            <EpubReader
              ref={epubRef}
              storageKey={book.storageKey!}
              theme={prefs.theme}
              fontSize={prefs.fontSize}
              font={prefs.font}
              lineHeight={prefs.lineHeight}
              layout={prefs.layout}
              initialCfi={epubCfi}
              onProgress={onProgress}
              onLocation={({ cfi, pct }) => {
                if (cfi) setEpubCfi(cfi);
                setProgress(pct);
                persist(pct, { lastCfi: cfi });
              }}
              onSelectText={onSelectTextFallback}
              onToc={setEpubToc}
            />
          )}
          {usePdf && (
            <div className="flex h-full min-h-0 flex-col">
              <p className="shrink-0 border-b border-border bg-bg-subtle/80 px-3 py-2 text-center text-[11px] text-fg-muted">
                PDF 体验有限 · 推荐使用 EPUB
              </p>
              <div className="min-h-0 flex-1">
                <PdfReader
                  storageKey={book.storageKey!}
                  theme={prefs.theme}
                  initialPage={page}
                  onProgress={onProgress}
                  onPageChange={setPage}
                  onSelectText={onSelectTextFallback}
                  onPageText={setPageContext}
                />
              </div>
            </div>
          )}
          {!useText && !useEpub && !usePdf && (
            <div className="flex h-full items-center justify-center bg-paper px-6 text-center text-sm text-paper-muted">
              文件缺失，请重新上传。
            </div>
          )}
        </div>

        {isLg && aiOpen && (
          <aside className="w-[360px] shrink-0 border-l border-border">
            <AiPanel
              bookId={book.id}
              bookTitle={book.title}
              chapterId={chapter?.id}
              selectedText={aiContextText}
              onClearSelection={() => setSelectedText("")}
              className="h-full"
            />
          </aside>
        )}
      </div>

      {sel && !noteDraft && !threadQuote && (
        <SelectionToolbar
          anchor={sel}
          showCommunity
          communityCount={communityCountFor(sel.text)}
          onHighlight={handleHighlight}
          onThoughts={handleThoughts}
          onAskAi={handleAskAi}
          onCopy={() => void handleCopy()}
          onClose={() => {
            clearBrowserSelection();
            setSel(null);
          }}
        />
      )}

      {threadQuote && (
        <QuoteThreadSheet
          open
          quote={threadQuote}
          bookId={book.id}
          chapterId={chapter?.id}
          threads={threads}
          signedIn={Boolean(user)}
          isPublicDomain={Boolean(supportsCommunity)}
          onClose={() => setThreadQuote(null)}
          onPosted={(row: AnnotationRow) => {
            setThreads((prev) => {
              const hit = prev.find((t) => quotesMatch(t.quote, row.quote));
              if (hit) {
                return prev.map((t) =>
                  t === hit
                    ? {
                        ...t,
                        count: t.count + 1,
                        items: [...t.items, row],
                      }
                    : t,
                );
              }
              return [
                {
                  quote: row.quote,
                  quoteKey: row.quote,
                  chapterId: row.chapterId,
                  count: 1,
                  items: [row],
                },
                ...prev,
              ];
            });
            void saveHighlight({
              text: row.quote,
              note: row.note,
              color: "gold",
              isPublic: false, // already posted via createAnnotation
            });
          }}
        />
      )}

      {noteDraft && (
        <AnnotationPopover
          quote={noteDraft.quote}
          color={noteDraft.color}
          isPrivateBook={isPrivateBook}
          signedIn={Boolean(user)}
          busy={annoBusy}
          onClose={() => setNoteDraft(null)}
          onSave={async ({ note, isPublic, color }) => {
            setAnnoBusy(true);
            try {
              await saveHighlight({
                text: noteDraft.quote,
                note,
                color,
                isPublic: isPublic && Boolean(user) && supportsCommunity,
              });
              toast.success("已保存");
              setNoteDraft(null);
            } finally {
              setAnnoBusy(false);
            }
          }}
        />
      )}

      {useText && chapters.length > 1 && chromeVisible && !sel && !noteDraft && !threadQuote && (
        <div className="pointer-events-none absolute inset-x-0 bottom-0 z-20 flex justify-between gap-3 px-3 pb-3 safe-pb">
          <Button
            variant="secondary"
            size="sm"
            className="pointer-events-auto shadow-[var(--shadow-soft)]"
            disabled={chapterIndex <= 0}
            onClick={() => {
              const prev = chapters[chapterIndex - 1];
              if (prev) {
                setChapterId(prev.id);
                void navigate({
                  to: "/read/$bookId",
                  params: { bookId: book.id },
                  search: { chapter: prev.id },
                  replace: true,
                });
              }
            }}
          >
            上一章
          </Button>
          <Button
            variant="secondary"
            size="sm"
            className="pointer-events-auto shadow-[var(--shadow-soft)]"
            disabled={chapterIndex < 0 || chapterIndex >= chapters.length - 1}
            onClick={() => {
              const next = chapters[chapterIndex + 1];
              if (next) {
                setChapterId(next.id);
                void navigate({
                  to: "/read/$bookId",
                  params: { bookId: book.id },
                  search: { chapter: next.id },
                  replace: true,
                });
              }
            }}
          >
            下一章
          </Button>
        </div>
      )}

      {!isLg && (
        <Sheet open={aiOpen} onOpenChange={setAiOpen}>
          <SheetContent
            side="bottom"
            title="AI 伴读"
            className="h-[min(88dvh,720px)] p-0"
          >
            <AiPanel
              bookId={book.id}
              bookTitle={book.title}
              chapterId={chapter?.id}
              selectedText={aiContextText}
              onClearSelection={() => setSelectedText("")}
              className="h-full rounded-t-[var(--radius-xl)]"
            />
          </SheetContent>
        </Sheet>
      )}

      <Sheet open={tocOpen} onOpenChange={setTocOpen}>
        <SheetContent side="left" title="目录" className="w-full max-w-sm p-0">
          <SheetHeader>
            <h2 className="text-base font-medium">目录</h2>
            <p className="text-xs text-fg-subtle">{book.title}</p>
          </SheetHeader>
          <div className="overflow-y-auto p-2">
            {chapters.length > 0
              ? chapters.map((ch, i) => (
                  <button
                    key={ch.id}
                    type="button"
                    className={cn(
                      "flex w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left text-sm transition-colors hover:bg-bg-subtle",
                      ch.id === chapter?.id && "bg-bg-subtle",
                    )}
                    onClick={() => {
                      setChapterId(ch.id);
                      setTocOpen(false);
                      if (useText) {
                        void navigate({
                          to: "/read/$bookId",
                          params: { bookId: book.id },
                          search: { chapter: ch.id },
                          replace: true,
                        });
                      }
                    }}
                  >
                    <span className="w-6 shrink-0 text-fg-subtle">{i + 1}</span>
                    <span>{ch.title}</span>
                  </button>
                ))
              : epubToc.length > 0
                ? epubToc.map((item, i) => (
                    <button
                      key={item.id}
                      type="button"
                      className="flex w-full items-start gap-3 rounded-[var(--radius-md)] px-3 py-3 text-left text-sm hover:bg-bg-subtle"
                      onClick={() => {
                        epubRef.current?.goToHref(item.href);
                        setTocOpen(false);
                      }}
                    >
                      <span className="w-6 shrink-0 text-fg-subtle">
                        {i + 1}
                      </span>
                      <span>{item.label}</span>
                    </button>
                  ))
                : (
                    <p className="px-3 py-6 text-sm text-fg-muted">
                      暂无目录。
                    </p>
                  )}
          </div>
        </SheetContent>
      </Sheet>

      <Sheet open={settingsOpen} onOpenChange={setSettingsOpen}>
        <SheetContent
          side="bottom"
          title="阅读设置"
          className="max-h-[min(90dvh,680px)] p-0"
        >
          <SheetHeader>
            <h2 className="text-base font-medium">阅读设置</h2>
            <p className="text-xs text-fg-subtle">
              设置会自动记住
              {user ? " · 进度登录后云同步" : ""}
            </p>
          </SheetHeader>
          <div className="max-h-[calc(min(90dvh,680px)-5rem)] space-y-6 overflow-y-auto px-5 py-5 safe-pb">
            {supportsCommunity && (
              <div className="rounded-[var(--radius-lg)] border border-border bg-bg-subtle/40 px-3 py-3 text-xs text-fg-muted">
                <p className="text-sm font-medium text-fg">共读想法</p>
                <p className="mt-1">
                  划选一句 →「写想法」。多人可在同一句原文上留下解读；点彩色高亮查看。
                </p>
              </div>
            )}

            <div>
              <p className="mb-2 text-xs text-fg-muted">阅读方式（Kindle 式）</p>
              <div className="grid grid-cols-2 gap-2">
                {READER_LAYOUT_META.map((m) => (
                  <button
                    key={m.id}
                    type="button"
                    onClick={() => updatePrefs({ layout: m.id })}
                    className={cn(
                      "rounded-[var(--radius-md)] border px-3 py-3 text-left",
                      prefs.layout === m.id
                        ? "border-accent bg-bg-subtle ring-1 ring-accent/40"
                        : "border-border bg-bg-elevated",
                    )}
                  >
                    <span className="block text-sm font-medium">{m.label}</span>
                    <span className="mt-0.5 block text-[11px] text-fg-subtle">
                      {m.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <div
              className={cn(
                "rounded-[var(--radius-lg)] px-4 py-4 text-sm",
                READER_THEME_META.find((t) => t.id === prefs.theme)
                  ?.sampleClass,
              )}
              style={{
                fontFamily: READER_FONT_META.find((f) => f.id === prefs.font)
                  ?.family,
                fontSize: prefs.fontSize,
                lineHeight: prefs.lineHeight,
                letterSpacing: `${prefs.letterSpacing}em`,
              }}
            >
              子曰：学而时习之，不亦说乎？
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs text-fg-muted">
                <Type className="h-3.5 w-3.5" />
                阅读背景
              </p>
              <div className="grid grid-cols-5 gap-2">
                {READER_THEME_META.map((t) => (
                  <button
                    key={t.id}
                    type="button"
                    onClick={() => updatePrefs({ theme: t.id })}
                    className={cn(
                      "rounded-[var(--radius-md)] border px-1 py-3 text-center text-[11px]",
                      t.sampleClass,
                      prefs.theme === t.id
                        ? "border-accent ring-2 ring-accent/50"
                        : "border-border",
                    )}
                  >
                    {t.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <p className="mb-2 flex items-center gap-1.5 text-xs text-fg-muted">
                <AlignLeft className="h-3.5 w-3.5" />
                字体
              </p>
              <div className="grid grid-cols-2 gap-2">
                {READER_FONT_META.map((f) => (
                  <button
                    key={f.id}
                    type="button"
                    onClick={() => updatePrefs({ font: f.id as ReaderFont })}
                    className={cn(
                      "rounded-[var(--radius-md)] border px-3 py-3 text-left",
                      prefs.font === f.id
                        ? "border-accent bg-bg-subtle ring-1 ring-accent/40"
                        : "border-border bg-bg-elevated",
                    )}
                  >
                    <span
                      className="block text-sm font-medium"
                      style={{ fontFamily: f.family }}
                    >
                      {f.label}
                    </span>
                    <span className="mt-0.5 block text-[11px] text-fg-subtle">
                      {f.hint}
                    </span>
                  </button>
                ))}
              </div>
            </div>

            <SliderRow
              label={`字号 ${prefs.fontSize}px`}
              value={prefs.fontSize}
              min={14}
              max={28}
              step={1}
              onDec={() =>
                updatePrefs({ fontSize: Math.max(14, prefs.fontSize - 1) })
              }
              onInc={() =>
                updatePrefs({ fontSize: Math.min(28, prefs.fontSize + 1) })
              }
              onChange={(v) => updatePrefs({ fontSize: v })}
            />
            <SliderRow
              label={`行距 ${prefs.lineHeight.toFixed(1)}`}
              value={Math.round(prefs.lineHeight * 10)}
              min={15}
              max={24}
              step={1}
              onDec={() =>
                updatePrefs({
                  lineHeight: Math.max(
                    1.5,
                    Math.round((prefs.lineHeight - 0.1) * 10) / 10,
                  ),
                })
              }
              onInc={() =>
                updatePrefs({
                  lineHeight: Math.min(
                    2.4,
                    Math.round((prefs.lineHeight + 0.1) * 10) / 10,
                  ),
                })
              }
              onChange={(v) => updatePrefs({ lineHeight: v / 10 })}
            />
            <SliderRow
              label={`字距 ${(prefs.letterSpacing * 100).toFixed(0)}%`}
              value={Math.round(prefs.letterSpacing * 100)}
              min={0}
              max={12}
              step={1}
              onDec={() =>
                updatePrefs({
                  letterSpacing: Math.max(
                    0,
                    Math.round((prefs.letterSpacing - 0.01) * 100) / 100,
                  ),
                })
              }
              onInc={() =>
                updatePrefs({
                  letterSpacing: Math.min(
                    0.12,
                    Math.round((prefs.letterSpacing + 0.01) * 100) / 100,
                  ),
                })
              }
              onChange={(v) => updatePrefs({ letterSpacing: v / 100 })}
            />
            <SliderRow
              label={`版心 ${prefs.maxWidth}`}
              value={prefs.maxWidth}
              min={32}
              max={52}
              step={2}
              onDec={() =>
                updatePrefs({ maxWidth: Math.max(32, prefs.maxWidth - 2) })
              }
              onInc={() =>
                updatePrefs({ maxWidth: Math.min(52, prefs.maxWidth + 2) })
              }
              onChange={(v) => updatePrefs({ maxWidth: v })}
            />

            <Button className="w-full" onClick={() => setSettingsOpen(false)}>
              <X className="h-4 w-4" />
              完成
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
}

function SliderRow({
  label,
  value,
  min,
  max,
  step,
  onDec,
  onInc,
  onChange,
}: {
  label: string;
  value: number;
  min: number;
  max: number;
  step: number;
  onDec: () => void;
  onInc: () => void;
  onChange: (v: number) => void;
}) {
  const pct = ((value - min) / (max - min)) * 100;
  return (
    <div>
      <p className="mb-2 text-xs text-fg-muted">{label}</p>
      <div className="flex items-center gap-3">
        <Button variant="secondary" size="icon-sm" onClick={onDec}>
          <Minus className="h-4 w-4" />
        </Button>
        <input
          type="range"
          min={min}
          max={max}
          step={step}
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="h-1.5 flex-1 cursor-pointer appearance-none rounded-full bg-bg-subtle accent-[var(--color-accent)]"
          style={{
            background: `linear-gradient(to right, var(--color-accent) ${pct}%, var(--color-bg-subtle) ${pct}%)`,
          }}
        />
        <Button variant="secondary" size="icon-sm" onClick={onInc}>
          <Plus className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
