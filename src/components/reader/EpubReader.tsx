import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useRef,
  useState,
} from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { getBookFile } from "@/lib/storage/r2";
import {
  readerFontFamily,
  type ReaderFont,
  type ReaderLayout,
  type ReaderTheme,
} from "@/lib/reader/prefs";
import { cn } from "@/lib/utils";

function epubColors(theme: ReaderTheme) {
  switch (theme) {
    case "night":
      return { bg: "#12100e", fg: "#e4dfd4", link: "#c4a35a" };
    case "sepia":
      return { bg: "#efe6d4", fg: "#3a3226", link: "#8b6914" };
    case "sage":
      return { bg: "#e8efe6", fg: "#1e2a1c", link: "#4a7a52" };
    case "cream":
      return { bg: "#faf6ef", fg: "#2a241c", link: "#a8863a" };
    default:
      return { bg: "#f4efe4", fg: "#1c1915", link: "#9a7b2f" };
  }
}

export type EpubTocItem = { id: string; label: string; href: string };

export type EpubReaderHandle = {
  goToHref: (href: string) => void;
  next: () => void;
  prev: () => void;
};

/**
 * Kindle 式 EPUB：
 * - epubjs paginated 流（按视口 reflow，不是「一章一张」硬切）
 * - spread auto / 单页 / 双页
 * - 左右键、左右热区、滑动翻页
 */
export const EpubReader = forwardRef<
  EpubReaderHandle,
  {
    storageKey: string;
    theme: ReaderTheme;
    fontSize: number;
    font?: ReaderFont;
    lineHeight?: number;
    layout?: ReaderLayout;
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
    lineHeight = 1.9,
    layout = "auto",
    initialCfi,
    onProgress,
    onLocation,
    onSelectText,
    onToc,
  },
  ref,
) {
  const hostRef = useRef<HTMLDivElement>(null);
  const shellRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [spreadLabel, setSpreadLabel] = useState("单页");
  const [pageHint, setPageHint] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renditionRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);
  const touchX = useRef<number | null>(null);
  const initialCfiRef = useRef(initialCfi);
  initialCfiRef.current = initialCfi;

  useImperativeHandle(ref, () => ({
    goToHref: (href: string) => {
      try {
        void renditionRef.current?.display(href);
      } catch {
        /* ignore */
      }
    },
    next: () => void renditionRef.current?.next(),
    prev: () => void renditionRef.current?.prev(),
  }));

  function resolveSpread(width: number): "always" | "none" {
    if (layout === "single" || layout === "scroll") return "none";
    if (layout === "double") return "always";
    return width >= 720 ? "always" : "none";
  }

  function applyTheme() {
    const r = renditionRef.current;
    if (!r) return;
    const { bg, fg, link } = epubColors(theme);
    const family = readerFontFamily(font);
    try {
      r.themes.register("modu", {
        body: {
          color: `${fg} !important`,
          background: `${bg} !important`,
          "font-family": `${family} !important`,
          "font-size": `${fontSize}px !important`,
          "line-height": `${lineHeight} !important`,
          "padding-top": "0.5em !important",
          "padding-bottom": "0.5em !important",
          "padding-left": "0 !important",
          "padding-right": "0 !important",
          margin: "0 !important",
        },
        p: {
          "text-align": "justify !important",
          "line-height": `${lineHeight} !important`,
          "margin-top": "0 !important",
          "margin-bottom": "0.9em !important",
          "text-indent": "2em !important",
        },
        "p:first-of-type": {
          "text-indent": "0 !important",
        },
        h1: {
          "font-family": `${family} !important`,
          "font-size": "1.45em !important",
          "line-height": "1.35 !important",
          "margin": "0.6em 0 0.8em !important",
          "text-align": "center !important",
        },
        h2: {
          "font-family": `${family} !important`,
          "font-size": "1.25em !important",
          "margin": "0.8em 0 0.6em !important",
        },
        h3: {
          "font-family": `${family} !important`,
          "font-size": "1.1em !important",
          "margin": "0.7em 0 0.5em !important",
        },
        img: {
          "max-width": "100% !important",
          height: "auto !important",
        },
        a: { color: `${link} !important` },
        "div, section, article": {
          "max-width": "none !important",
        },
      });
      r.themes.select("modu");
      r.themes.fontSize(`${fontSize}px`);
    } catch {
      try {
        r.themes.override("color", fg);
        r.themes.override("background", bg);
        r.themes.fontSize(`${fontSize}px`);
      } catch {
        /* ignore */
      }
    }
  }

  function applySpread() {
    const r = renditionRef.current;
    const shell = shellRef.current;
    if (!r || !shell) return;
    const mode = resolveSpread(shell.clientWidth);
    try {
      r.spread(mode);
      setSpreadLabel(mode === "always" ? "双页" : "单页");
    } catch {
      /* ignore */
    }
  }

  // 加载书籍（仅 storageKey 变化时重建）
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
        // 清空旧内容
        host.innerHTML = "";

        // Kindle 核心：paginated + 视口高度 reflow
        // layout === scroll 时用 scrolled 连续读
        const useScroll = layout === "scroll";
        const rendition = book.renderTo(host, {
          width: "100%",
          height: "100%",
          flow: useScroll ? "scrolled-doc" : "paginated",
          manager: "default",
          spread: useScroll ? "none" : "auto",
          minSpreadWidth: 720,
          allowScriptedContent: false,
          // 边距像纸页
          stylesheet: undefined,
        });
        renditionRef.current = rendition;

        // 边距（paginated 用 gap）
        try {
          // epubjs v0.3: rendition.hooks / themes
          rendition.themes.default({
            "::selection": {
              background: "rgba(196, 163, 90, 0.35)",
            },
          });
        } catch {
          /* ignore */
        }

        applyTheme();
        applySpread();

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
            const atStart = location?.atStart;
            const atEnd = location?.atEnd;
            const href = location?.start?.href || "";
            const leaf = href.split("/").pop()?.split("#")[0] || "";
            setPageHint(
              [leaf, atStart ? "章首" : "", atEnd ? "章末" : ""]
                .filter(Boolean)
                .join(" · ") || "EPUB",
            );
          } catch {
            /* ignore */
          }
        });

        // 点击 iframe 内左右区域翻页（通过 contents）
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rendition.on("click", (e: MouseEvent, contents: any) => {
          try {
            const win = contents?.window;
            if (!win) return;
            // 有选区不翻页
            if (win.getSelection?.()?.toString()?.trim()) return;
            const w = win.innerWidth || 1;
            const x = e.clientX ?? 0;
            if (x < w * 0.28) {
              void rendition.prev();
            } else if (x > w * 0.72) {
              void rendition.next();
            }
          } catch {
            /* ignore */
          }
        });

        void book.locations.generate(1600).catch(() => undefined);

        if (initialCfiRef.current) {
          await rendition.display(initialCfiRef.current);
        } else {
          await rendition.display();
        }

        // resize 后 reflow
        try {
          const w = host.clientWidth;
          const h = host.clientHeight;
          if (w > 0 && h > 0) rendition.resize(w, h);
        } catch {
          /* ignore */
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
    // layout scroll vs paginated needs rebuild
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [storageKey, layout === "scroll"]);

  // 主题 / 字号 / 行距热更新
  useEffect(() => {
    applyTheme();
    try {
      const host = hostRef.current;
      const r = renditionRef.current;
      if (r && host && host.clientWidth > 0) {
        r.resize(host.clientWidth, host.clientHeight);
      }
    } catch {
      /* ignore */
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [theme, fontSize, font, lineHeight]);

  // 单双页 + 尺寸
  useEffect(() => {
    applySpread();
    const shell = shellRef.current;
    const host = hostRef.current;
    const ro = new ResizeObserver(() => {
      applySpread();
      try {
        const r = renditionRef.current;
        if (!r || !host) return;
        r.resize(host.clientWidth, host.clientHeight);
      } catch {
        /* ignore */
      }
    });
    if (shell) ro.observe(shell);
    if (host) ro.observe(host);
    return () => ro.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [layout]);

  // 键盘
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const tag = (e.target as HTMLElement)?.tagName;
      if (tag === "INPUT" || tag === "TEXTAREA") return;
      if (e.key === "ArrowLeft" || e.key === "PageUp") {
        e.preventDefault();
        e.stopPropagation();
        void renditionRef.current?.prev();
      } else if (
        e.key === "ArrowRight" ||
        e.key === "PageDown" ||
        (e.key === " " && !e.shiftKey)
      ) {
        e.preventDefault();
        e.stopPropagation();
        void renditionRef.current?.next();
      } else if (e.key === " " && e.shiftKey) {
        e.preventDefault();
        void renditionRef.current?.prev();
      }
    };
    window.addEventListener("keydown", onKey, true);
    return () => window.removeEventListener("keydown", onKey, true);
  }, []);

  const { bg, fg } = epubColors(theme);

  return (
    <div
      ref={shellRef}
      className="rd-epub-shell relative flex h-full min-h-0 flex-col"
      style={{ background: bg, color: fg }}
      data-reader="epub"
      data-spread={spreadLabel === "双页" ? "double" : "single"}
      onTouchStart={(e) => {
        touchX.current = e.changedTouches[0]?.clientX ?? null;
      }}
      onTouchEnd={(e) => {
        const start = touchX.current;
        touchX.current = null;
        if (start == null) return;
        const end = e.changedTouches[0]?.clientX ?? start;
        const dx = end - start;
        if (Math.abs(dx) < 48) return;
        if (dx < 0) void renditionRef.current?.next();
        else void renditionRef.current?.prev();
      }}
    >
      {loading && (
        <div
          className="absolute inset-0 z-20 flex items-center justify-center text-sm opacity-70"
          style={{ background: bg }}
        >
          正在打开 EPUB…
        </div>
      )}
      {error && (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-danger">
          {error}
        </div>
      )}

      {/* epubjs 渲染宿主：必须有明确高度 */}
      <div
        ref={hostRef}
        className={cn(
          "rd-epub-host relative min-h-0 w-full flex-1",
          error && "hidden",
        )}
        style={{ background: bg }}
      />

      {/* 左右热区（iframe 外兜底；iframe 内另有 click） */}
      {!loading && !error && layout !== "scroll" && (
        <>
          <button
            type="button"
            className="rd-tap left"
            aria-label="上一页"
            data-page-turn="prev"
            onClick={(e) => {
              e.stopPropagation();
              void renditionRef.current?.prev();
            }}
          />
          <button
            type="button"
            className="rd-tap right"
            aria-label="下一页"
            data-page-turn="next"
            onClick={(e) => {
              e.stopPropagation();
              void renditionRef.current?.next();
            }}
          />
          <button
            type="button"
            className="rd-pg-arrow left"
            aria-label="上一页"
            data-page-turn="prev"
            onClick={(e) => {
              e.stopPropagation();
              void renditionRef.current?.prev();
            }}
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            type="button"
            className="rd-pg-arrow right"
            aria-label="下一页"
            data-page-turn="next"
            onClick={(e) => {
              e.stopPropagation();
              void renditionRef.current?.next();
            }}
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </>
      )}

      {!loading && !error && (
        <div className="rd-epub-bar pointer-events-none absolute inset-x-0 bottom-0 z-10 flex items-center justify-center gap-3 px-3 pb-2.5 pt-8">
          <span className="rounded-full border border-black/10 bg-black/5 px-2.5 py-1 text-[10px] tracking-wide opacity-70 backdrop-blur-sm">
            {spreadLabel}
            {pageHint ? ` · ${pageHint}` : ""}
          </span>
        </div>
      )}
    </div>
  );
});
