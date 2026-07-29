import { useCallback, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Cloud,
  FileUp,
  Loader2,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/lib/store/library";
import { describeStorage } from "@/lib/storage/r2";
import { assertUploadable, detectFormat } from "@/lib/books/parse-upload";
import { COPYRIGHT_POLICY_SUMMARY } from "@/lib/books/copyright";
import { formatBytes } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

const PHASE_LABEL: Record<string, string> = {
  parsing: "正在解析图书结构…",
  storing: "正在写入私有存储…",
  indexing: "正在加入个人书架…",
};

function UploadPage() {
  const navigate = useNavigate();
  const uploadBook = useLibraryStore((s) => s.uploadBook);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const [phase, setPhase] = useState<string | null>(null);
  const [ack, setAck] = useState(false);
  const storage = describeStorage();

  const onFile = useCallback((f: File | null) => {
    if (!f) return;
    try {
      assertUploadable(f);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "文件不支持");
      return;
    }
    setFile(f);
    setTitle((t) => t || f.name.replace(/\.[^.]+$/, ""));
    const fmt = detectFormat(f);
    if (fmt === "pdf") toast.message("已选择 PDF（将作为私有图书）");
    if (fmt === "epub") toast.message("已选择 EPUB（将作为私有图书）");
  }, []);

  async function handleUpload() {
    if (!file || busy) return;
    if (!ack) {
      toast.error("请先确认个人使用与版权声明");
      return;
    }
    setBusy(true);
    setPhase("parsing");
    try {
      const book = await uploadBook(
        file,
        {
          title: title.trim() || undefined,
          author: author.trim() || undefined,
          personalUseAck: true,
        },
        (p) => setPhase(p),
      );
      toast.success("已加入个人书架（私有 · 未上架书城）");
      void navigate({ to: "/read/$bookId", params: { bookId: book.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setBusy(false);
      setPhase(null);
    }
  }

  const fmt = file ? detectFormat(file) : null;

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">
          上传私有图书
        </h1>
        <p className="mt-1 text-fg-muted">
          仅供你个人阅读。系统<strong className="text-fg">禁止</strong>
          将上传内容公开到书城。
        </p>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-accent/30 bg-accent/5 px-4 py-4 text-sm leading-relaxed text-fg-muted">
        <div className="mb-2 flex items-center gap-2 font-medium text-fg">
          <Shield className="h-4 w-4 text-accent" />
          版权底线
        </div>
        <ul className="list-disc space-y-1.5 pl-5">
          <li>{COPYRIGHT_POLICY_SUMMARY.market}</li>
          <li>{COPYRIGHT_POLICY_SUMMARY.upload}</li>
          <li>{COPYRIGHT_POLICY_SUMMARY.social}</li>
        </ul>
      </div>

      <div className="grid gap-3 sm:grid-cols-3">
        {[
          { t: "PDF", d: "私有分页阅读 · 抽文本 AI" },
          { t: "EPUB", d: "私有翻页 · 目录解析" },
          { t: "TXT/MD", d: "私有分章全文" },
        ].map((x) => (
          <div
            key={x.t}
            className="rounded-[var(--radius-lg)] border border-border bg-bg-elevated px-3 py-3"
          >
            <p className="text-sm font-medium">{x.t}</p>
            <p className="mt-1 text-xs text-fg-muted">{x.d}</p>
          </div>
        ))}
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-accent" />
            <CardTitle className="text-base">私有存储</CardTitle>
          </div>
          <div className="mt-2 flex flex-wrap items-start gap-2 text-sm text-fg-muted">
            <Badge variant="accent">visibility: private</Badge>
            <Badge variant="outline">{storage.label}</Badge>
            <span className="leading-relaxed">{storage.detail}</span>
          </div>
        </CardHeader>
        <CardContent className="space-y-5">
          <div
            className={`flex flex-col items-center justify-center rounded-[var(--radius-xl)] border border-dashed px-6 py-12 text-center transition-colors ${
              dragging
                ? "border-accent bg-accent/5"
                : "border-border bg-bg-subtle/40"
            }`}
            onDragOver={(e) => {
              e.preventDefault();
              setDragging(true);
            }}
            onDragLeave={() => setDragging(false)}
            onDrop={(e) => {
              e.preventDefault();
              setDragging(false);
              const f = e.dataTransfer.files?.[0];
              if (f) onFile(f);
            }}
          >
            <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-bg-elevated">
              <FileUp className="h-5 w-5 text-fg-muted" />
            </div>
            <p className="text-sm font-medium">拖拽文件到此处，或点击选择</p>
            <p className="mt-1 text-xs text-fg-subtle">
              PDF · EPUB · TXT · MD，最大 80MB · 不会进入书城
            </p>
            <label className="mt-4">
              <input
                type="file"
                accept=".pdf,.epub,.txt,.md,.markdown,application/pdf,application/epub+zip,text/plain,text/markdown"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <span className="inline-flex h-11 cursor-pointer items-center rounded-[var(--radius-md)] border border-border bg-bg-elevated px-4 text-sm hover:bg-bg-hover">
                选择文件
              </span>
            </label>
            {file && (
              <div className="mt-4 flex items-center gap-2 text-sm text-fg-muted">
                <CheckCircle2 className="h-4 w-4 text-accent" />
                <span>
                  {file.name}
                  <span className="text-fg-subtle">
                    {" "}
                    · {formatBytes(file.size)}
                    {fmt ? ` · ${fmt.toUpperCase()}` : ""} · 私有
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-fg-muted">书名（仅自己可见）</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="默认文件名"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-fg-muted">作者</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder="可选"
              />
            </div>
          </div>

          <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-subtle/40 px-3 py-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
            />
            <span className="text-fg-muted">
              我确认：本书仅用于<strong className="text-fg">个人阅读</strong>
              ；我有权使用该文件；
              <strong className="text-fg">不会</strong>
              也不要求系统将其公开到书城；若含受版权保护内容，责任由本人承担。
            </span>
          </label>

          <Button
            className="w-full"
            size="lg"
            disabled={!file || busy || !ack}
            onClick={() => void handleUpload()}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                {phase ? PHASE_LABEL[phase] || "处理中…" : "处理中…"}
              </>
            ) : (
              <>
                <BookOpen className="h-4 w-4" />
                解析并加入个人书架
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
