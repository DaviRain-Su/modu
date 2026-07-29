import { useEffect, useRef, useState } from "react";
import { getBookFile } from "@/lib/storage/r2";
import { cn } from "@/lib/utils";

export function EpubReader({
  storageKey,
  theme,
  fontSize,
  onProgress,
  onSelectText,
  onToc,
}: {
  storageKey: string;
  theme: "paper" | "sepia" | "night";
  fontSize: number;
  onProgress: (pct: number) => void;
  onSelectText: (text: string) => void;
  onToc?: (items: { id: string; label: string; href: string }[]) => void;
}) {
  const hostRef = useRef<HTMLDivElement>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const renditionRef = useRef<any>(null);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const bookRef = useRef<any>(null);

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

        // ArrayBuffer is more reliable than blob: URL for epubjs (no path 404s)
        const buffer = await stored.blob.arrayBuffer();
        const ePub = (await import("epubjs")).default;
        const book = ePub();
        bookRef.current = book;
        await book.open(buffer);

        if (cancelled || !hostRef.current) return;

        // TOC
        try {
          const nav = await book.loaded.navigation;
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          const toc = (nav?.toc || []) as any[];
          const flat: { id: string; label: string; href: string }[] = [];
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

        // Wait for host to have dimensions
        const host = hostRef.current;
        if (host.clientHeight < 40) {
          host.style.minHeight = "60vh";
        }

        const rendition = book.renderTo(host, {
          width: "100%",
          height: "100%",
          flow: "paginated",
          manager: "default",
          allowScriptedContent: false,
        });
        renditionRef.current = rendition;

        const bg =
          theme === "night" ? "#121212" : theme === "sepia" ? "#efe6d4" : "#f4efe6";
        const fg =
          theme === "night" ? "#e8e4dc" : theme === "sepia" ? "#3a3226" : "#1c1915";
        rendition.themes.default({
          body: {
            color: `${fg} !important`,
            background: `${bg} !important`,
            "font-size": `${fontSize}px !important`,
            "line-height": "1.75 !important",
            padding: "16px !important",
          },
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
                (book.locations?.percentageFromCfi?.(location.start.cfi) ?? 0) *
                100;
            }
            if (typeof pct === "number" && !Number.isNaN(pct)) {
              onProgress(Math.min(99.9, Math.max(0, pct)));
            }
          } catch {
            /* ignore */
          }
        });

        // Don't block display on locations (can hang on some epubs)
        void book.locations
          .generate(1600)
          .catch(() => undefined);

        await rendition.display();
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
    const bg =
      theme === "night" ? "#121212" : theme === "sepia" ? "#efe6d4" : "#f4efe6";
    const fg =
      theme === "night" ? "#e8e4dc" : theme === "sepia" ? "#3a3226" : "#1c1915";
    try {
      r.themes.override("color", fg);
      r.themes.override("background", bg);
      r.themes.fontSize(`${fontSize}px`);
    } catch {
      /* ignore */
    }
  }, [theme, fontSize]);

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
      ? "bg-[#121212]"
      : theme === "sepia"
        ? "bg-[#efe6d4]"
        : "bg-paper";

  return (
    <div className={cn("relative flex h-full flex-col", shell)}>
      {loading && (
        <div className="absolute inset-0 z-10 flex items-center justify-center bg-inherit text-sm text-fg-muted">
          正在解析 EPUB…
        </div>
      )}
      {error && (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-danger">
          {error}
        </div>
      )}
      <div
        ref={hostRef}
        className={cn("min-h-0 flex-1", error && "hidden")}
      />
      {!loading && !error && (
        <div className="flex items-center justify-center gap-3 border-t border-black/10 bg-black/5 px-4 py-3 safe-pb">
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] bg-bg-elevated px-4 py-2 text-sm text-fg"
            onClick={() => renditionRef.current?.prev()}
          >
            上一页
          </button>
          <button
            type="button"
            className="min-h-11 rounded-[var(--radius-sm)] bg-bg-elevated px-4 py-2 text-sm text-fg"
            onClick={() => renditionRef.current?.next()}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
