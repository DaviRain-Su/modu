import { useCallback, useEffect, useMemo, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  AlignLeft,
  ChevronLeft,
  List,
  Minus,
  PanelRight,
  Plus,
  Settings2,
  Sparkles,
  Type,
  X,
} from "lucide-react";
import { z } from "zod";
import { TextReader } from "@/components/reader/TextReader";
import { PdfReader } from "@/components/reader/PdfReader";
import { EpubReader } from "@/components/reader/EpubReader";
import { AiPanel } from "@/components/reader/AiPanel";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetHeader } from "@/components/ui/sheet";
import { useLibraryStore } from "@/lib/store/library";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { recordBookRead } from "@/lib/server/social";
import type { Book, ReadingProgress } from "@/lib/books/types";
import {
  DEFAULT_READER_PREFS,
  loadReaderPrefs,
  READER_FONT_META,
  READER_THEME_META,
  saveReaderPrefs,
  type ReaderFont,
  type ReaderPrefs,
  type ReaderTheme,
} from "@/lib/reader/prefs";
import { cn } from "@/lib/utils";

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

  useEffect(() => {
    setPrefs(loadReaderPrefs());
    setPrefsReady(true);
  }, []);

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

  const persist = useCallback(
    (pct: number, extra?: Partial<ReadingProgress>) => {
      if (!book) return;
      const next: ReadingProgress = {
        bookId: book.id,
        progress: pct,
        lastChapterId: chapterId || chapter?.id,
        lastPage: page,
        bookmarks: stored?.bookmarks ?? [],
        highlights: stored?.highlights ?? [],
        updatedAt: Date.now(),
        ...extra,
      };
      void saveProgress(next);
    },
    [
      book,
      chapter?.id,
      chapterId,
      page,
      saveProgress,
      stored?.bookmarks,
      stored?.highlights,
    ],
  );

  const onProgress = useCallback(
    (pct: number) => {
      setProgress(pct);
      persist(pct);
    },
    [persist],
  );

  const onSelectText = useCallback((text: string) => {
    setSelectedText(text);
    setAiOpen(true);
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
  const showToc = chapters.length > 0 || book.format === "epub";
  const useText =
    book.format === "text" ||
    (book.source === "community" && Boolean(chapter?.content));

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
              <p className="truncate text-[11px] text-fg-subtle">
                {book.format === "pdf" && book.storageKey
                  ? `PDF · 第 ${page} 页`
                  : chapter?.title || book.format.toUpperCase()}
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
            if (
              (e.target as HTMLElement).closest(
                "button, a, input, textarea, canvas, iframe, [data-text-layer]",
              )
            )
              return;
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
              onProgress={onProgress}
              onSelectText={onSelectText}
            />
          )}
          {!useText && book.format === "pdf" && book.storageKey && (
            <PdfReader
              storageKey={book.storageKey}
              theme={prefs.theme}
              initialPage={page}
              onProgress={onProgress}
              onPageChange={setPage}
              onSelectText={onSelectText}
              onPageText={setPageContext}
            />
          )}
          {!useText && book.format === "epub" && book.storageKey && (
            <EpubReader
              storageKey={book.storageKey}
              theme={prefs.theme}
              fontSize={prefs.fontSize}
              font={prefs.font}
              lineHeight={prefs.lineHeight}
              onProgress={onProgress}
              onSelectText={onSelectText}
            />
          )}
          {!useText && !book.storageKey && (
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

      {useText && chapters.length > 1 && chromeVisible && (
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
            {chapters.length > 0 ? (
              chapters.map((ch, i) => (
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
            ) : (
              <p className="px-3 py-6 text-sm text-fg-muted">
                当前格式使用翻页浏览。
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
            <p className="text-xs text-fg-subtle">设置会自动记住</p>
          </SheetHeader>
          <div className="max-h-[calc(min(90dvh,680px)-5rem)] space-y-6 overflow-y-auto px-5 py-5 safe-pb">
            {/* Preview strip */}
            <div
              className={cn(
                "rounded-[var(--radius-lg)] px-4 py-4 text-sm transition-colors",
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
              子曰：学而时习之，不亦说乎？阅读的节奏，由你自己决定。
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
                      "rounded-[var(--radius-md)] border px-1 py-3 text-center text-[11px] sm:text-xs",
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
                      "rounded-[var(--radius-md)] border px-3 py-3 text-left transition-colors",
                      prefs.font === f.id
                        ? "border-accent bg-bg-subtle ring-1 ring-accent/40"
                        : "border-border bg-bg-elevated hover:bg-bg-subtle",
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
                updatePrefs({
                  fontSize: Math.max(14, prefs.fontSize - 1),
                })
              }
              onInc={() =>
                updatePrefs({
                  fontSize: Math.min(28, prefs.fontSize + 1),
                })
              }
              onChange={(v) => updatePrefs({ fontSize: v })}
            />

            <SliderRow
              label={`行距 ${prefs.lineHeight.toFixed(1)}`}
              value={Math.round(prefs.lineHeight * 10)}
              min={15}
              max={24}
              step={1}
              display={prefs.lineHeight.toFixed(1)}
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
              label={`版心宽度 ${prefs.maxWidth}ch 级`}
              value={prefs.maxWidth}
              min={32}
              max={52}
              step={2}
              onDec={() =>
                updatePrefs({
                  maxWidth: Math.max(32, prefs.maxWidth - 2),
                })
              }
              onInc={() =>
                updatePrefs({
                  maxWidth: Math.min(52, prefs.maxWidth + 2),
                })
              }
              onChange={(v) => updatePrefs({ maxWidth: v })}
            />

            <div className="flex gap-2">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setPrefs(DEFAULT_READER_PREFS);
                  saveReaderPrefs(DEFAULT_READER_PREFS);
                }}
              >
                恢复默认
              </Button>
              <Button className="flex-1" onClick={() => setSettingsOpen(false)}>
                <X className="h-4 w-4" />
                完成
              </Button>
            </div>
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
  display?: string;
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
