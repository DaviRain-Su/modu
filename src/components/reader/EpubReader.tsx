import { useEffect, useRef, useState } from "react";
import { getBookBlobUrl } from "@/lib/storage/r2";
import { cn } from "@/lib/utils";

export function EpubReader({
  storageKey,
  theme,
  fontSize,
  onProgress,
  onSelectText,
}: {
  storageKey: string;
  theme: "paper" | "sepia" | "night";
  fontSize: number;
  onProgress: (pct: number) => void;
  onSelectText: (text: string) => void;
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
    let objectUrl: string | null = null;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await getBookBlobUrl(storageKey);
        if (!url) throw new Error("找不到 EPUB 文件");
        objectUrl = url;

        const ePub = (await import("epubjs")).default;
        const book = ePub(url);
        bookRef.current = book;

        await book.ready;
        if (cancelled || !hostRef.current) return;

        const rendition = book.renderTo(hostRef.current, {
          width: "100%",
          height: "100%",
          flow: "paginated",
          manager: "default",
        });
        renditionRef.current = rendition;

        const bg =
          theme === "night" ? "#121212" : theme === "sepia" ? "#efe6d4" : "#f4efe6";
        const fg =
          theme === "night" ? "#e8e4dc" : theme === "sepia" ? "#3a3226" : "#1c1915";
        rendition.themes.override("color", fg);
        rendition.themes.override("background", bg);
        rendition.themes.fontSize(`${fontSize}px`);

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rendition.on("selected", (_cfiRange: unknown, contents: any) => {
          const text = contents?.window?.getSelection?.()?.toString()?.trim();
          if (text && text.length > 1) onSelectText(text);
        });

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        rendition.on("relocated", (location: any) => {
          try {
            const pct =
              location?.start?.percentage != null
                ? location.start.percentage * 100
                : book.locations?.percentageFromCfi?.(location?.start?.cfi ?? "") *
                  100;
            if (typeof pct === "number" && !Number.isNaN(pct)) {
              onProgress(Math.min(99.9, Math.max(0, pct)));
            }
          } catch {
            /* ignore */
          }
        });

        await book.locations.generate(1200);
        if (cancelled) return;
        await rendition.display();
      } catch (e) {
        if (!cancelled) setError(e instanceof Error ? e.message : "EPUB 加载失败");
      } finally {
        if (!cancelled) setLoading(false);
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
      if (objectUrl) URL.revokeObjectURL(objectUrl);
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
    r.themes.override("color", fg);
    r.themes.override("background", bg);
    r.themes.fontSize(`${fontSize}px`);
  }, [theme, fontSize]);

  const shell =
    theme === "night"
      ? "bg-[#121212]"
      : theme === "sepia"
        ? "bg-[#efe6d4]"
        : "bg-paper";

  return (
    <div className={cn("flex h-full flex-col", shell)}>
      {loading && (
        <div className="flex flex-1 items-center justify-center text-sm text-fg-muted">
          正在加载 EPUB…
        </div>
      )}
      {error && (
        <div className="flex flex-1 items-center justify-center px-6 text-center text-sm text-danger">
          {error}
        </div>
      )}
      <div
        ref={hostRef}
        className={cn("min-h-0 flex-1", (loading || error) && "hidden")}
      />
      {!loading && !error && (
        <div className="flex items-center justify-center gap-3 border-t border-black/10 bg-black/5 px-4 py-3 safe-pb">
          <button
            type="button"
            className="rounded-[var(--radius-sm)] bg-bg-elevated px-4 py-2 text-sm text-fg"
            onClick={() => renditionRef.current?.prev()}
          >
            上一页
          </button>
          <button
            type="button"
            className="rounded-[var(--radius-sm)] bg-bg-elevated px-4 py-2 text-sm text-fg"
            onClick={() => renditionRef.current?.next()}
          >
            下一页
          </button>
        </div>
      )}
    </div>
  );
}
