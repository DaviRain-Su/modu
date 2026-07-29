import { useEffect, useMemo, useRef } from "react";
import type { Book, Chapter, Highlight } from "@/lib/books/types";
import {
  readerFontFamily,
  readerThemeClass,
  type ReaderFont,
  type ReaderTheme,
} from "@/lib/reader/prefs";
import {
  applyHighlightMarks,
  markClass,
  type LocalHighlight,
} from "@/lib/reader/highlights";
import type { SelectionAnchor } from "./SelectionToolbar";
import { cn } from "@/lib/utils";

export function TextReader({
  book,
  chapter,
  fontSize,
  lineHeight,
  letterSpacing,
  maxWidth,
  font,
  theme,
  highlights = [],
  onProgress,
  onSelect,
}: {
  book: Book;
  chapter: Chapter;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  maxWidth: number;
  font: ReaderFont;
  theme: ReaderTheme;
  highlights?: Highlight[];
  onProgress: (pct: number) => void;
  onSelect: (anchor: SelectionAnchor | null) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chapters = book.chapters ?? [];
  const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
  const globalBase =
    chapters.length > 0
      ? (Math.max(0, chapterIndex) / chapters.length) * 100
      : 0;
  const chapterShare = chapters.length > 0 ? 100 / chapters.length : 100;

  const paragraphs = useMemo(
    () => chapter.content.split(/\n\n+/).filter(Boolean),
    [chapter.content],
  );

  const chapterHighlights = useMemo(
    () =>
      (highlights as LocalHighlight[]).filter(
        (h) => !h.chapterId || h.chapterId === chapter.id,
      ),
    [highlights, chapter.id],
  );

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    el.scrollTop = 0;
    onProgress(globalBase + 2);
  }, [chapter.id, globalBase, onProgress]);

  useEffect(() => {
    const el = scrollerRef.current;
    if (!el) return;
    const onScroll = () => {
      onSelect(null);
      const max = el.scrollHeight - el.clientHeight;
      const local = max <= 0 ? 1 : el.scrollTop / max;
      onProgress(Math.min(99.5, globalBase + local * chapterShare));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [chapterShare, globalBase, onProgress, onSelect]);

  useEffect(() => {
    const report = () => {
      const sel = window.getSelection();
      if (!sel || sel.isCollapsed || !sel.toString().trim()) {
        return;
      }
      // only within reader
      const root = scrollerRef.current;
      if (!root) return;
      const node = sel.anchorNode;
      if (!node || !root.contains(node)) return;

      const text = sel.toString().replace(/\s+/g, " ").trim();
      if (text.length < 2) return;
      try {
        const range = sel.getRangeAt(0);
        const r = range.getBoundingClientRect();
        if (r.width === 0 && r.height === 0) return;
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

    // mouse + touch end after selection
    const onUp = () => {
      // delay so mobile selection UI settles
      window.setTimeout(report, 10);
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    document.addEventListener("selectionchange", () => {
      // don't open on every change; only when non-empty after settle
    });
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    };
  }, [onSelect]);

  return (
    <div
      ref={scrollerRef}
      className={cn(
        "h-full overflow-y-auto transition-colors duration-200",
        readerThemeClass(theme),
      )}
      style={
        {
          "--reader-font-size": `${fontSize}px`,
          "--reader-line-height": String(lineHeight),
          "--reader-letter-spacing": `${letterSpacing}em`,
          "--reader-max-width": `${maxWidth}rem`,
          "--reader-font-family": readerFontFamily(font),
        } as React.CSSProperties
      }
    >
      <article
        className="reader-prose mx-auto px-5 pb-24 pt-8 sm:px-8 sm:pt-10"
        data-font={font}
      >
        <header className="mb-8 border-b border-current/10 pb-5">
          <p className="text-xs tracking-[0.16em] text-current/45">
            {book.title}
          </p>
          <h1
            className="mt-2 text-2xl font-medium leading-snug tracking-tight sm:text-3xl"
            style={{ fontFamily: readerFontFamily(font) }}
          >
            {chapter.title}
          </h1>
          <p className="mt-2 text-sm text-current/50">{book.author}</p>
        </header>
        {paragraphs.map((p, i) => {
          const segs = applyHighlightMarks(p, chapterHighlights);
          return (
            <p key={i}>
              {segs.map((s, j) =>
                s.kind === "mark" ? (
                  <mark
                    key={j}
                    className={cn(
                      "rounded-sm px-0.5 text-inherit",
                      markClass(s.color),
                    )}
                    title={
                      chapterHighlights.find((h) => h.text === s.text)?.note ||
                      "划线"
                    }
                  >
                    {s.text}
                  </mark>
                ) : (
                  <span key={j}>{s.text}</span>
                ),
              )}
            </p>
          );
        })}
        <footer className="mt-14 border-t border-current/10 pt-6 text-center text-sm text-current/40">
          本章完 · 划选文字可批注或问 AI
        </footer>
      </article>
    </div>
  );
}
