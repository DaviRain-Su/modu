import { useEffect, useMemo, useRef } from "react";
import type { Book, Chapter } from "@/lib/books/types";
import { cn } from "@/lib/utils";

export function TextReader({
  book,
  chapter,
  fontSize,
  lineHeight,
  theme,
  onProgress,
  onSelectText,
}: {
  book: Book;
  chapter: Chapter;
  fontSize: number;
  lineHeight: number;
  theme: "paper" | "sepia" | "night";
  onProgress: (pct: number) => void;
  onSelectText: (text: string) => void;
}) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const chapters = book.chapters ?? [];
  const chapterIndex = chapters.findIndex((c) => c.id === chapter.id);
  const globalBase =
    chapters.length > 0 ? (Math.max(0, chapterIndex) / chapters.length) * 100 : 0;
  const chapterShare = chapters.length > 0 ? 100 / chapters.length : 100;

  const paragraphs = useMemo(
    () => chapter.content.split(/\n\n+/).filter(Boolean),
    [chapter.content],
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
      const max = el.scrollHeight - el.clientHeight;
      const local = max <= 0 ? 1 : el.scrollTop / max;
      onProgress(Math.min(99.5, globalBase + local * chapterShare));
    };
    el.addEventListener("scroll", onScroll, { passive: true });
    return () => el.removeEventListener("scroll", onScroll);
  }, [chapterShare, globalBase, onProgress]);

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection()?.toString().trim();
      if (sel && sel.length > 1) onSelectText(sel);
    };
    document.addEventListener("mouseup", onUp);
    document.addEventListener("touchend", onUp);
    return () => {
      document.removeEventListener("mouseup", onUp);
      document.removeEventListener("touchend", onUp);
    };
  }, [onSelectText]);

  const themeClass =
    theme === "night"
      ? "bg-[#121212] text-[#e8e4dc]"
      : theme === "sepia"
        ? "bg-[#efe6d4] text-[#3a3226]"
        : "bg-paper text-paper-fg";

  return (
    <div
      ref={scrollerRef}
      className={cn("h-full overflow-y-auto", themeClass)}
      style={
        {
          "--reader-font-size": `${fontSize}px`,
          "--reader-line-height": String(lineHeight),
        } as React.CSSProperties
      }
    >
      <article className="reader-prose mx-auto max-w-[42rem] px-5 pb-16 pt-8 sm:px-8 sm:pt-10">
        <header className="mb-8 border-b border-current/10 pb-5">
          <p className="text-xs tracking-[0.16em] text-current/45">
            {book.title}
          </p>
          <h1 className="mt-2 font-serif text-2xl font-medium leading-snug tracking-tight sm:text-3xl">
            {chapter.title}
          </h1>
          <p className="mt-2 text-sm text-current/50">{book.author}</p>
        </header>
        {paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
        <footer className="mt-14 border-t border-current/10 pt-6 text-center text-sm text-current/40">
          本章完 · 选中文字可使用 AI 伴读
        </footer>
      </article>
    </div>
  );
}
