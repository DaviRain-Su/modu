import { useEffect, useImperativeHandle, useRef, useState, forwardRef } from "react";
import { getBookFile } from "@/lib/storage/r2";
import {
  readerFontFamily,
  type ReaderFont,
  type ReaderTheme,
} from "@/lib/reader/prefs";
import { cn } from "@/lib/utils";

function epubColors(theme: ReaderTheme) {
  switch (theme) {
    case "night":
      return { bg: "#141414", fg: "#e4dfd4" };
    case "sepia":
      return { bg: "#efe6d4", fg: "#3a3226" };
    case "sage":
      return { bg: "#e8efe6", fg: "#1e2a1c" };
    case "cream":
      return { bg: "#faf6ef", fg: "#2a241c" };
    default:
      return { bg: "#f7f2e8", fg: "#1c1915" };
  }
}

export type EpubTocItem = { id: string; label: string; href: string };

export type EpubReaderHandle = {
  goToHref: (href: string) => void;
  next: () => void;
  prev: () => void;
};

export const EpubReader = forwardRef<
  EpubReaderHandle,
  {
    storageKey: string;
    theme: ReaderTheme;
    fontSize: number;
    font?: ReaderFont;
    lineHeight?: number;
    initialCfi?: string | null;
    onProgress: (pct: number) => void;
    onLocation?: (info: { cfi?: string; pct: number }) => void;
    onSelectText: (text: string) => void;
    onToc?: (items: EpubTocItem[]) => void;
  }
>(function EpubReader(
  {
    storageKey,
    theme,
    fontSize,
    font = "serif",
    lineHeight = 1.85,
    initialCfi,
    onProgress,
    onLocation,
    onSelectText,
    onToc,
  },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [label, setLabel] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renditionRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

  useImperativeHandle(ref, () => ({
    goToHref: (href: string) => {
      try {
        void renditionRef.current?.display(href);
      } catch {
        /* ignore */
      }
    },
    next: () => renditionRef.current?.next(),
    prev: () => renditionRef.current?.prev(),
  }));

  useEffect(() => {
    let cancelled = false;

    (async () => {
      try {
        setLoading(true);
        setError(null);

        const stored = await getBookFile(storageKey);
        if (!stored?.blob) {
          throw new Error("找不到 EPUB 文件，请重新上传。");
        }

        const buffer = await stored.blob.arrayBuffer();
        const ePub = (await import("epubjs")).default;
        const book = ePub();
        bookRef.current = book;
        await book.open(buffer);

        if (cancelled || !hostRef.current) return;

        try {
          const nav = await book.loaded.navigation;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const toc = (nav?.toc || []) as any[];
          const flat: EpubTocItem[] = [];
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const walk = (nodes: any[]) => {
            for (const n of nodes) {
              if (n?.href) {
                flat.push({
                  id: n.id || `toc_${flat.length}`,
                  label: (n.label || n.href || "章节").trim(),
                  href: n.href,
                });
              }
              if (n?.subitems?.length) walk(n.subitems);
            }
          };
          walk(toc);
          if (flat.length) onToc?.(flat);
        } catch {
          /* optional */
        }

        const host = hostRef.current;
        if (host.clientHeight < 40) host.style.minHeight = "60vh";

        // scrolled-doc: continuous reading within chapter (mobile friendly)
        const rendition = book.renderTo(host, {
          width: "100%",
          height: "100%",
          flow: "scrolled-doc",
          allowScriptedContent: false,
        });
        renditionRef.current = rendition;

        const { bg, fg } = epubColors(theme);
        rendition.themes.default({
          body: {
            color: `${fg} !important`,
            background: `${bg} !important`,
            "font-size": `${fontSize}px !important`,
            "line-height": `${lineHeight} !important`,
            "font-family": `${readerFontFamily(font)} !important`,
            padding: "20px 18px 48px !important",
            "max-width": "42rem !important",
            margin: "0 auto !important",
          },
          p: {
            "text-align": "justify !important",
            "margin-bottom": "1em !important",
          },
          a: { color: "inherit !important" },
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rendition.on("selected", (_cfiRange: unknown, contents: any) => {
          const text = contents?.window?.getSelection?.()?.toString()?.trim();
          if (text && text.length > 1) onSelectText(text);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rendition.on("relocated", (location: any) => {
          try {
            let pct =
              location?.start?.percentage != null
                ? location.start.percentage * 100
                : NaN;
            if (Number.isNaN(pct) && location?.start?.cfi) {
              pct =
                (book.locations?.percentageFromCfi?.(location.start.cfi) ??
                  0) * 100;
            }
            if (typeof pct === "number" && !Number.isNaN(pct)) {
              const clamped = Math.min(99.9, Math.max(0, pct));
              onProgress(clamped);
              onLocation?.({
                cfi: location?.start?.cfi,
                pct: clamped,
              });
            }
            const href = location?.start?.href || "";
            if (href) setLabel(href.split("/").pop() || "");
          } catch {
            /* ignore */
          }
        });

        void book.locations.generate(1400).catch(() => undefined);

        if (initialCfi) {
          await rendition.display(initialCfi);
        } else {
          await rendition.display();
        }
        if (!cancelled) setLoading(false);
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "EPUB 加载失败");
          setLoading(false);
        }
      }
    })();

    return () => {
      cancelled = true;
      try {
        renditionRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      try {
        bookRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      renditionRef.current = null;
      bookRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey]);

  useEffect(() => {
    const r = renditionRef.current;
    if (!r) return;
    const { bg, fg } = epubColors(theme);
    try {
      r.themes.override("color", fg);
      r.themes.override("background", bg);
      r.themes.fontSize(`${fontSize}px`);
      r.themes.override("font-family", readerFontFamily(font));
      r.themes.override("line-height", String(lineHeight));
    } catch {
      /* ignore */
    }
  }, [theme, fontSize, font, lineHeight]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        renditionRef.current?.prev();
      } else if (
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        e.key === " "
      ) {
        e.preventDefault();
        renditionRef.current?.next();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const shell =
    theme === "night"
      ? "bg-[#141414]"
      : theme === "sage"
        ? "bg-[#e8efe6]"
        : theme === "sepia"
          ? "bg-[#efe6d4]"
          : theme === "cream"
            ? "bg-[#faf6ef]"
            : "bg-[#f7f2e8]";

  return (
    <div className={cn("relative flex h-full flex-col", shell)}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-inherit text-sm opacity-60">
          正在解析 EPUB…
        </div>
      )}
      {error && (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-danger">
          {error}
        </div>
      )}
      <div ref={hostRef} className={cn("min-h-0 flex-1", error && "hidden")} />
      {!loading && !error && (
        <div className="flex items-center justify-center gap-3 border-t border-black/10 bg-black/5 px-4 py-3 safe-pb">
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] bg-black/5 px-4 py-2 text-sm"
            onClick={() => renditionRef.current?.prev()}
          >
            上一章
          </button>
          <span className="max-w-[8rem] truncate text-center text-[11px] opacity-50">
            {label || "EPUB"}
          </span>
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] bg-black/5 px-4 py-2 text-sm"
            onClick={() => renditionRef.current?.next()}
          >
            下一章
          </button>
        </div>
      )}
    </div>
  );
});
