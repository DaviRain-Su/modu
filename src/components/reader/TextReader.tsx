import { useT } from "@/lib/i18n/locale";
import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import type { Book, Chapter, Highlight } from "@/lib/books/types";
import {
  readerFontFamily,
  readerThemeClass,
  type ReaderFont,
  type ReaderLayout,
  type ReaderTheme,
} from "@/lib/reader/prefs";
import {
  applyHighlightMarks,
  markClass,
  type LocalHighlight,
} from "@/lib/reader/highlights";
import type { QuoteThread } from "@/lib/server/social";
import type { DanmakuRow } from "@/lib/server/danmaku";
import { quotesMatch } from "@/lib/reader/quote-key";
import type { SelectionAnchor } from "./SelectionToolbar";
import { QuoteHeatBadge } from "./QuoteThreadSheet";
import {
  DanmakuChapterBar,
  ParaDanmaku,
  useDanmakuMap,
} from "./DanmakuLayer";
import { cn } from "@/lib/utils";

function splitSentences(paragraph: string): string[] {
  const parts = paragraph
    .split(/(?<=[。！？…；;!?])/)
    .map((s) => s.trim())
    .filter(Boolean);
  return parts.length ? parts : [paragraph];
}

function isMostlyCjk(text: string) {
  const cjk = (text.match(/[\u4e00-\u9fff]/g) || []).length;
  return cjk > text.length * 0.3;
}

type SpreadMode = "single" | "double";

/**
 * Kindle 风格分页引擎
 * - multi-column 按视口高度 reflow（改字号/窗口自动重排）
 * - auto / single / double / scroll
 * - ←→、左右热区、滑动翻页；章末/章首跨章
 */
export function TextReader({
  book,
  chapter,
  fontSize,
  lineHeight,
  letterSpacing,
  maxWidth,
  font,
  theme,
  layout = "auto",
  highlights = [],
  publicThreads = [],
  danmaku = [],
  danmakuEnabled = true,
  signedIn = false,
  onOpenThread,
  onDanmakuPosted,
  onToggleDanmaku,
  onProgress,
  onSelect,
  onChapterNav,
}: {
  book: Book;
  chapter: Chapter;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  maxWidth: number;
  font: ReaderFont;
  theme: ReaderTheme;
  layout?: ReaderLayout;
  highlights?: Highlight[];
  publicThreads?: QuoteThread[];
  danmaku?: DanmakuRow[];
  danmakuEnabled?: boolean;
  signedIn?: boolean;
  onOpenThread?: (quote: string) => void;
  onDanmakuPosted?: (row: DanmakuRow) => void;
  onToggleDanmaku?: () => void;
  onProgress: (pct: number) => void;
  onSelect: (anchor: SelectionAnchor | null) => void;
  onChapterNav?: (dir: "prev" | "next") => void;
}) {
  const t = useT();
  const chapters = book.chapters ?? [];
  const chapterIndex = Math.max(
    0,
    chapters.findIndex((c) => c.id === chapter.id),
  );
  const chapterShare = chapters.length > 0 ? 100 / chapters.length : 100;
  const globalBase = chapterIndex * chapterShare;

  const paragraphs = useMemo(
    () => chapter.content.split(/\n\n+/).filter(Boolean),
    [chapter.content],
  );
  const cjk = useMemo(
    () => isMostlyCjk(chapter.content.slice(0, 400)),
    [chapter.content],
  );

  const chapterHighlights = useMemo(
    () =>
      (highlights as LocalHighlight[]).filter(
        (h) => !h.chapterId || h.chapterId === chapter.id,
      ),
    [highlights, chapter.id],
  );

  const chapterThreads = useMemo(() => {
    return publicThreads.filter(
      (t) =>
        !t.chapterId ||
        t.chapterId === chapter.id ||
        paragraphs.some((p) => p.includes(t.quote.slice(0, 12))),
    );
  }, [publicThreads, chapter.id, paragraphs]);

  const supportsDanmaku =
    book.visibility === "public_domain" ||
    book.visibility === "public_domain_community";
  const danmakuByPara = useDanmakuMap(danmaku);

  const markSource = useMemo(() => {
    const fromPublic: LocalHighlight[] = chapterThreads.map((t) => ({
      id: `pub_${t.quoteKey}`,
      text: t.quote,
      color: "gold" as const,
      createdAt: 0,
      chapterId: chapter.id,
    }));
    return [...chapterHighlights, ...fromPublic];
  }, [chapterHighlights, chapterThreads, chapter.id]);

  function heatFor(text: string) {
    return chapterThreads.find((x) => quotesMatch(x.quote, text))?.count ?? 0;
  }

  const cssVars = {
    "--reader-font-size": `${fontSize}px`,
    "--reader-line-height": String(lineHeight),
    "--reader-letter-spacing": `${letterSpacing}em`,
    "--reader-max-width": `${maxWidth}rem`,
    "--reader-font-family": readerFontFamily(font),
  } as React.CSSProperties;

  const rootRef = useRef<HTMLDivElement>(null);
  const vpRef = useRef<HTMLDivElement>(null);
  const flowRef = useRef<HTMLDivElement>(null);
  const scrollRef = useRef<HTMLDivElement>(null);

  const [spread, setSpread] = useState<SpreadMode>("single");
  const [pageIndex, setPageIndex] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [metrics, setMetrics] = useState({
    pageW: 0,
    gap: 0,
    step: 0,
    viewCols: 1,
  });
  const [ready, setReady] = useState(false);
  const touchX = useRef<number | null>(null);

  const pageIndexRef = useRef(0);
  const totalPagesRef = useRef(1);
  const metricsRef = useRef(metrics);
  const ratioRef = useRef(0);

  useEffect(() => {
    pageIndexRef.current = pageIndex;
    const maxStart = Math.max(
      0,
      totalPagesRef.current - (metricsRef.current.viewCols || 1),
    );
    ratioRef.current = maxStart <= 0 ? 0 : pageIndex / maxStart;
  }, [pageIndex]);
  useEffect(() => {
    totalPagesRef.current = totalPages;
  }, [totalPages]);
  useEffect(() => {
    metricsRef.current = metrics;
  }, [metrics]);

  const isScroll = layout === "scroll";

  useEffect(() => {
    const report = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) return;
      const root = rootRef.current;
      if (!root || !sel.anchorNode || !root.contains(sel.anchorNode)) return;
      const text = sel.toString().replace(/\s+/g, " ").trim();
      if (text.length < 2) return;
      try {
        const r = sel.getRangeAt(0).getBoundingClientRect();
        if (!r.width && !r.height) return;
        onSelect({
          text,
          x: r.left + r.width / 2,
          y: r.top,
          bottom: r.bottom,
        });
      } catch {
        /* ignore */
      }
    };
    const onUp = () => window.setTimeout(report, 12);
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    };
  }, [onSelect]);

  /** 用阅读区总宽判断双页（扣掉 AI 侧栏后的 shell 宽） */
  const resolveSpread = useCallback(
    (shellWidth: number): SpreadMode => {
      if (layout === "single") return "single";
      if (layout === "double") return "double";
      // Kindle：平板/桌面宽度够就对开
      return shellWidth >= 720 ? "double" : "single";
    },
    [layout],
  );

  const measure = useCallback(() => {
    if (isScroll) return;
    const shell = rootRef.current;
    const vp = vpRef.current;
    const flow = flowRef.current;
    if (!vp || !flow) return;

    const shellW = shell?.clientWidth || vp.clientWidth;
    const vw = vp.clientWidth;
    const vh = vp.clientHeight;
    if (vw < 48 || vh < 48) return;

    const mode = resolveSpread(shellW);
    setSpread(mode);
    const viewCols = mode === "double" ? 2 : 1;
    const gap =
      mode === "double"
        ? Math.round(Math.min(52, Math.max(28, vw * 0.032)))
        : 0;
    const pageW =
      mode === "double" ? Math.floor((vw - gap) / 2) : Math.floor(vw);

    flow.style.height = `${vh}px`;
    flow.style.columnWidth = `${pageW}px`;
    flow.style.columnGap = `${gap}px`;
    flow.style.width = "max-content";
    void flow.offsetHeight;

    const scrollW = flow.scrollWidth;
    const colStep = pageW + gap;
    let pages = Math.max(1, Math.round(scrollW / Math.max(1, colStep)));
    // 至少要有一点余量判断
    if (scrollW > colStep * pages + 2) pages += 1;
    if (mode === "double" && pages % 2 === 1) pages += 1;

    const nextMetrics = { pageW, gap, step: colStep, viewCols };
    setMetrics(nextMetrics);
    metricsRef.current = nextMetrics;
    setTotalPages(pages);
    totalPagesRef.current = pages;

    const maxStart = Math.max(0, pages - viewCols);
    let next = Math.round(ratioRef.current * maxStart);
    if (mode === "double") next = next - (next % 2);
    next = Math.max(0, Math.min(maxStart, next));
    pageIndexRef.current = next;
    setPageIndex(next);
    setReady(true);
  }, [isScroll, resolveSpread]);

  useLayoutEffect(() => {
    setPageIndex(0);
    pageIndexRef.current = 0;
    ratioRef.current = 0;
    setReady(false);
  }, [chapter.id]);

  useLayoutEffect(() => {
    if (isScroll) return;
    const run = () => {
      requestAnimationFrame(() => requestAnimationFrame(() => measure()));
    };
    run();
    const shell = rootRef.current;
    const vp = vpRef.current;
    const ro = new ResizeObserver(() => run());
    if (shell) ro.observe(shell);
    if (vp) ro.observe(vp);
    let cancelled = false;
    if (document.fonts?.ready) {
      void document.fonts.ready.then(() => {
        if (!cancelled) run();
      });
    }
    const t1 = window.setTimeout(run, 60);
    const t2 = window.setTimeout(run, 280);
    return () => {
      cancelled = true;
      ro.disconnect();
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [
    measure,
    isScroll,
    chapter.id,
    fontSize,
    lineHeight,
    letterSpacing,
    font,
    theme,
    layout,
    paragraphs,
  ]);

  useEffect(() => {
    if (isScroll) return;
    const viewCols = metrics.viewCols || 1;
    const maxStart = Math.max(0, totalPages - viewCols);
    const local = maxStart <= 0 ? 1 : pageIndex / maxStart;
    onProgress(Math.min(99.5, globalBase + local * chapterShare * 0.98 + 1));
  }, [
    isScroll,
    pageIndex,
    totalPages,
    metrics.viewCols,
    globalBase,
    chapterShare,
    onProgress,
  ]);

  const goByPages = useCallback(
    (dir: 1 | -1) => {
      const m = metricsRef.current;
      const total = totalPagesRef.current;
      const cur = pageIndexRef.current;
      const viewCols = m.viewCols || 1;
      const stepPages = viewCols;

      if (dir > 0) {
        const next = cur + stepPages;
        if (next > total - viewCols) {
          if (cur < total - viewCols) {
            const last = Math.max(0, total - viewCols);
            pageIndexRef.current = last;
            setPageIndex(last);
            onSelect(null);
            return;
          }
          onChapterNav?.("next");
          return;
        }
        pageIndexRef.current = next;
        setPageIndex(next);
        onSelect(null);
      } else {
        const next = cur - stepPages;
        if (next < 0) {
          if (cur > 0) {
            pageIndexRef.current = 0;
            setPageIndex(0);
            onSelect(null);
            return;
          }
          onChapterNav?.("prev");
          return;
        }
        const aligned = viewCols === 2 ? next - (next % 2) : next;
        pageIndexRef.current = Math.max(0, aligned);
        setPageIndex(Math.max(0, aligned));
        onSelect(null);
      }
    },
    [onChapterNav, onSelect],
  );

  useEffect(() => {
    if (isScroll) return;
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (
        tag === "INPUT" ||
        tag === "TEXTAREA" ||
        (e.target as HTMLElement)?.isContentEditable
      ) {
        return;
      }
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        e.stopPropagation();
        goByPages(-1);
      } else if (
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        goByPages(1);
      } else if (e.key === " " && e.shiftKey) {
        e.preventDefault();
        goByPages(-1);
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, [isScroll, goByPages]);

  useEffect(() => {
    if (!isScroll) return;
    const el = scrollRef.current;
    if (!el) return;
    el.scrollTop = 0;
    onProgress(globalBase + 2);
    const onScroll = () => {
      onSelect(null);
      const max = el.scrollHeight - el.clientHeight;
      const local = max <= 0 ? 1 : el.scrollTop / max;
      onProgress(Math.min(99.5, globalBase + local * chapterShare));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [isScroll, chapter.id, globalBase, chapterShare, onProgress, onSelect]);

  const body = (
    <article className={cn("rd-article", cjk && "rd-cjk")} data-font={font}>
      <header className="rd-chap-head">
        <p className="rd-chap-meta">
          {book.title}
          {chapters.length > 1
            ? ` · ${chapterIndex + 1} / ${chapters.length}`
            : ""}
        </p>
        <h1 className="rd-chap-title">{chapter.title}</h1>
        <p className="rd-chap-author">{book.author}</p>
        <div className="rd-chap-rule" aria-hidden />
      </header>

      {supportsDanmaku && (
        <DanmakuChapterBar
          total={danmaku.length}
          enabled={danmakuEnabled}
          onToggle={() => onToggleDanmaku?.()}
          signedIn={signedIn}
        />
      )}

      <div className="rd-text">
        {paragraphs.map((para, pi) => {
          const sentences = splitSentences(para);
          const paraDanmaku = danmakuByPara.get(pi) || [];
          return (
            <div key={pi}>
              <p className={cn(pi === 0 && "rd-first")}>
                {sentences.map((sent, si) => {
                  const segs = applyHighlightMarks(sent, markSource);
                  const heat = heatFor(sent);
                  const hasCommunity = heat > 0;
                  return (
                    <span
                      key={si}
                      className={cn("rd-sentence", hasCommunity && "has-heat")}
                      data-sid={`${pi}-${si}`}
                      onClick={(e) => {
                        if (!hasCommunity) return;
                        if (window.getSelection()?.toString().trim()) return;
                        e.stopPropagation();
                        onOpenThread?.(sent);
                      }}
                    >
                      {segs.map((s, j) =>
                        s.kind === "mark" ? (
                          <mark
                            key={j}
                            className={cn("rd-mark", markClass(s.color))}
                            onClick={(e) => {
                              e.stopPropagation();
                              onOpenThread?.(s.text);
                            }}
                          >
                            {s.text}
                          </mark>
                        ) : (
                          <span key={j}>{s.text}</span>
                        ),
                      )}
                      {hasCommunity && (
                        <QuoteHeatBadge
                          count={heat}
                          onClick={() => onOpenThread?.(sent)}
                        />
                      )}
                    </span>
                  );
                })}
              </p>
              {supportsDanmaku && (
                <ParaDanmaku
                  bookId={book.id}
                  chapterId={chapter.id}
                  paraIndex={pi}
                  quote={para.slice(0, 80)}
                  items={paraDanmaku}
                  enabled={danmakuEnabled}
                  signedIn={signedIn}
                  onPosted={(row) => onDanmakuPosted?.(row)}
                />
              )}
            </div>
          );
        })}
      </div>

      <footer className="rd-chap-foot">
        <span className="rd-ornament">❧</span>
        <span>本章完</span>
        <span className="rd-ornament">❧</span>
      </footer>
    </article>
  );

  if (isScroll) {
    return (
      <div
        ref={(n) => {
          rootRef.current = n;
          scrollRef.current = n;
        }}
        className={cn("rd-shell rd-shell-scroll", readerThemeClass(theme))}
        style={cssVars}
        data-reader="scroll"
      >
        <div className="rd-scroll-inner">{body}</div>
      </div>
    );
  }

  const translateX = ready ? -pageIndex * metrics.step : 0;
  const displayPage =
    Math.floor(pageIndex / (metrics.viewCols || 1)) + 1;
  const displayTotal = Math.max(
    1,
    Math.ceil(totalPages / (metrics.viewCols || 1)),
  );

  return (
    <div
      ref={rootRef}
      className={cn(
        "rd-shell rd-shell-paged",
        readerThemeClass(theme),
        spread === "double" && "rd-spread-double",
      )}
      style={cssVars}
      data-reader="paged"
      data-spread={spread}
      tabIndex={0}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start == null) return;
        if (window.getSelection()?.toString().trim()) return;
        const end = e.changedTouches[0]?.clientX ?? start;
        const dx = end - start;
        if (Math.abs(dx) < 40) return;
        if (dx < 0) goByPages(1);
        else goByPages(-1);
      }}
    >
      <div className={cn("rd-stage", spread === "double" && "is-double")}>
        <div className="rd-paged-vp" ref={vpRef}>
          {spread === "double" && <div className="rd-spine" aria-hidden />}
          <div
            className="rd-paged-flow"
            ref={flowRef}
            style={{
              transform: `translate3d(${translateX}px, 0, 0)`,
              opacity: ready ? 1 : 0,
            }}
          >
            {body}
          </div>
        </div>
      </div>

      <button
        type="button"
        className="rd-tap left"
        aria-label={t.reader.prev}
        data-page-turn="prev"
        onClick={(e) => {
          e.stopPropagation();
          goByPages(-1);
        }}
      />
      <button
        type="button"
        className="rd-tap right"
        aria-label={t.reader.next}
        data-page-turn="next"
        onClick={(e) => {
          e.stopPropagation();
          goByPages(1);
        }}
      />

      <button
        type="button"
        className="rd-pg-arrow left"
        aria-label={t.reader.prev}
        data-page-turn="prev"
        onClick={(e) => {
          e.stopPropagation();
          goByPages(-1);
        }}
      >
        <ChevronLeft className="h-5 w-5" />
      </button>
      <button
        type="button"
        className="rd-pg-arrow right"
        aria-label={t.reader.next}
        data-page-turn="next"
        onClick={(e) => {
          e.stopPropagation();
          goByPages(1);
        }}
      >
        <ChevronRight className="h-5 w-5" />
      </button>

      <div className="rd-page-ind" aria-live="polite">
        {displayPage} / {displayTotal}
        <span className="rd-page-mode">
          {spread === "double" ? "双页" : "单页"}
        </span>
      </div>

      <div className="rd-page-edge" aria-hidden />
    </div>
  );
}
