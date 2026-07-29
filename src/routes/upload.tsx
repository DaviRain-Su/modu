import { useCallback, useState } from "react";
import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { Cloud, FileUp, Loader2 } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/lib/store/library";
import { describeStorage } from "@/lib/storage/r2";
import { formatBytes } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

function UploadPage() {
  const navigate = useNavigate();
  const uploadBook = useLibraryStore((s) => s.uploadBook);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [dragging, setDragging] = useState(false);
  const [busy, setBusy] = useState(false);
  const storage = describeStorage();

  const onFile = useCallback((f: File | null) => {
    if (!f) return;
    const ext = f.name.split(".").pop()?.toLowerCase();
    if (!ext || !["pdf", "epub", "txt", "md"].includes(ext)) {
      toast.error("请上传 PDF、EPUB 或 TXT/MD 文件");
      return;
    }
    setFile(f);
    setTitle((t) => t || f.name.replace(/\.[^.]+$/, ""));
  }, []);

  async function handleUpload() {
    if (!file || busy) return;
    setBusy(true);
    try {
      const book = await uploadBook(file, {
        title: title.trim() || undefined,
        author: author.trim() || undefined,
      });
      toast.success("已上传并加入书架");
      void navigate({ to: "/book/$bookId", params: { bookId: book.id } });
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "上传失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">上传图书</h1>
        <p className="mt-1 text-fg-muted">
          支持 PDF、EPUB，以及纯文本。文件写入对象存储层。
        </p>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-accent" />
            <CardTitle className="text-base">存储后端</CardTitle>
          </div>
          <div className="mt-2 flex flex-wrap items-start gap-2 text-sm text-fg-muted">
            <Badge variant="accent">{storage.label}</Badge>
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
              PDF · EPUB · TXT · MD，建议 50MB 以内
            </p>
            <label className="mt-4">
              <input
                type="file"
                accept=".pdf,.epub,.txt,.md,application/pdf,application/epub+zip,text/plain,text/markdown"
                className="sr-only"
                onChange={(e) => onFile(e.target.files?.[0] ?? null)}
              />
              <span className="inline-flex h-11 cursor-pointer items-center rounded-[var(--radius-md)] border border-border bg-bg-elevated px-4 text-sm hover:bg-bg-hover">
                选择文件
              </span>
            </label>
            {file && (
              <p className="mt-4 text-sm text-fg-muted">
                已选：{file.name}
                <span className="text-fg-subtle"> · {formatBytes(file.size)}</span>
              </p>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-fg-muted">书名</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="可选，默认使用文件名"
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

          <Button
            className="w-full"
            size="lg"
            disabled={!file || busy}
            onClick={() => void handleUpload()}
          >
            {busy ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                上传中…
              </>
            ) : (
              "上传并加入书架"
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
