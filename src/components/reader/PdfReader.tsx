import { useEffect, useRef, useState } from "react";
import { getBookBlobUrl } from "@/lib/storage/r2";
import { cn } from "@/lib/utils";

export function PdfReader({
  storageKey,
  theme,
  initialPage = 1,
  onProgress,
  onPageChange,
  onSelectText,
}: {
  storageKey: string;
  theme: "paper" | "sepia" | "night";
  initialPage?: number;
  onProgress: (pct: number) => void;
  onPageChange: (page: number) => void;
  onSelectText: (text: string) => void;
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [page, setPage] = useState(initialPage);
  const [total, setTotal] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const pdfRef = useRef<any>(null);

  useEffect(() => {
    let cancelled = false;
    let objectUrl: string | null = null;

    (async () => {
      try {
        setLoading(true);
        setError(null);
        const url = await getBookBlobUrl(storageKey);
        if (!url) throw new Error("找不到 PDF 文件，可能已被清除");
        objectUrl = url;

        const pdfjs = await import("pdfjs-dist");
        pdfjs.GlobalWorkerOptions.workerSrc = new URL(
          "pdfjs-dist/build/pdf.worker.min.mjs",
          import.meta.url,
        ).toString();

        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const doc: any = await pdfjs.getDocument({ url }).promise;
        if (cancelled) {
          try {
            doc.destroy?.();
          } catch {
            /* ignore */
          }
          return;
        }
        pdfRef.current = doc;
        setTotal(doc.numPages);
        setPage((p) => Math.min(Math.max(1, p), doc.numPages));
      } catch (e) {
        if (!cancelled) {
          setError(e instanceof Error ? e.message : "PDF 加载失败");
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();

    return () => {
      cancelled = true;
      try {
        pdfRef.current?.destroy?.();
      } catch {
        /* ignore */
      }
      pdfRef.current = null;
      if (objectUrl) URL.revokeObjectURL(objectUrl);
    };
  }, [storageKey]);

  useEffect(() => {
    const doc = pdfRef.current;
    const canvas = canvasRef.current;
    if (!doc || !canvas || total === 0) return;

    let cancelled = false;
    (async () => {
      const pdfPage = await doc.getPage(page);
      if (cancelled) return;
      const base = pdfPage.getViewport({ scale: 1 });
      const maxWidth = Math.min(window.innerWidth - 24, 820);
      const scale = maxWidth / base.width;
      const viewport = pdfPage.getViewport({ scale: Math.min(scale, 2) });
      const ctx = canvas.getContext("2d");
      if (!ctx) return;
      canvas.width = viewport.width;
      canvas.height = viewport.height;
      await pdfPage.render({ canvasContext: ctx, viewport, canvas }).promise;
      const pct = (page / total) * 100;
      onProgress(pct);
      onPageChange(page);
    })().catch(() => {
      if (!cancelled) setError("渲染页面失败");
    });

    return () => {
      cancelled = true;
    };
  }, [page, total, onPageChange, onProgress]);

  useEffect(() => {
    const onUp = () => {
      const sel = window.getSelection()?.toString().trim();
      if (sel && sel.length > 1) onSelectText(sel);
    };
    document.addEventListener("mouseup", onUp);
    return () => document.removeEventListener("mouseup", onUp);
  }, [onSelectText]);

  const bg =
    theme === "night"
      ? "bg-[#0e0e0e]"
      : theme === "sepia"
        ? "bg-[#efe6d4]"
        : "bg-paper";

  if (loading) {
    return (
      <div className={cn("flex h-full items-center justify-center", bg)}>
        <p className="text-sm text-fg-muted">正在加载 PDF…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className={cn("flex h-full items-center justify-center px-6", bg)}>
        <p className="max-w-sm text-center text-sm text-danger">{error}</p>
      </div>
    );
  }

  return (
    <div className={cn("flex h-full flex-col", bg)}>
      <div className="flex-1 overflow-auto">
        <div className="mx-auto flex min-h-full justify-center px-2 py-4">
          <canvas ref={canvasRef} className="max-w-full shadow-[var(--shadow-soft)]" />
        </div>
      </div>
      <div className="flex items-center justify-center gap-3 border-t border-black/10 bg-black/5 px-4 py-3 safe-pb">
        <button
          type="button"
          className="rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-sm text-fg disabled:opacity-40"
          disabled={page <= 1}
          onClick={() => setPage((p) => Math.max(1, p - 1))}
        >
          上一页
        </button>
        <span className="min-w-24 text-center text-sm text-fg-muted">
          {page} / {total}
        </span>
        <button
          type="button"
          className="rounded-[var(--radius-sm)] bg-bg-elevated px-3 py-2 text-sm text-fg disabled:opacity-40"
          disabled={page >= total}
          onClick={() => setPage((p) => Math.min(total, p + 1))}
        >
          下一页
        </button>
      </div>
    </div>
  );
}
