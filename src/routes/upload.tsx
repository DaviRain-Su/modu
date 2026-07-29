import { useCallback, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  CheckCircle2,
  Cloud,
  FileUp,
  Loader2,
  Scale,
  Shield,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLibraryStore } from "@/lib/store/library";
import { describeStorage } from "@/lib/storage/r2";
import {
  assertUploadable,
  detectFormat,
  parseUploadedBook,
} from "@/lib/books/parse-upload";
import {
  COPYRIGHT_POLICY_SUMMARY,
  PD_BASIS_OPTIONS,
} from "@/lib/books/copyright";
import type { Chapter, PublicDomainBasis } from "@/lib/books/types";
import { submitCommunityPdBook } from "@/lib/server/community-books";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { formatBytes } from "@/lib/utils";

export const Route = createFileRoute("/upload")({
  component: UploadPage,
});

type Mode = "private" | "community_pd";

const PHASE_LABEL: Record<string, string> = {
  parsing: "正在解析…",
  storing: "正在保存…",
  contributing: "正在提交社区公版…",
  indexing: "正在加入书架…",
};

function UploadPage() {
  const navigate = useNavigate();
  const { user, isPending } = useCurrentUserState();
  const uploadBook = useLibraryStore((s) => s.uploadBook);
  const cacheCommunityBook = useLibraryStore((s) => s.cacheCommunityBook);
  const addToShelf = useLibraryStore((s) => s.addToShelf);
  const refreshCommunity = useLibraryStore((s) => s.refreshCommunity);

  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [mode, setMode] = useState<Mode>("private");
  const [pdBasis, setPdBasis] = useState<PublicDomainBasis | "">("");
  const [pdNote, setPdNote] = useState("");
  const [sourceUrl, setSourceUrl] = useState("");
  const [yearOrEra, setYearOrEra] = useState("");
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
  }, []);

  async function handleUpload() {
    if (!file || busy) return;
    if (!ack) {
      toast.error("请先确认版权声明");
      return;
    }

    if (mode === "community_pd") {
      if (!user) {
        toast.error("贡献公版需要先登录");
        return;
      }
      if (!pdBasis) {
        toast.error("请选择公版依据");
        return;
      }
      if (!title.trim() || !author.trim()) {
        toast.error("公版贡献请填写准确书名与作者");
        return;
      }
    }

    setBusy(true);
    setPhase("parsing");
    try {
      if (mode === "private") {
        const book = await uploadBook(
          file,
          {
            title: title.trim() || undefined,
            author: author.trim() || undefined,
            personalUseAck: true,
          },
          (p) => setPhase(p),
        );
        toast.success("已加入个人书架（私有）");
        void navigate({ to: "/read/$bookId", params: { bookId: book.id } });
        return;
      }

      setPhase("parsing");
      const parsed = await parseUploadedBook(file);
      let chapters: Chapter[] =
        parsed.chapters?.filter((c) => (c.content || "").trim()) || [];

      if (chapters.length === 0 && parsed.previewText) {
        chapters = [
          {
            id: "preview",
            title: "正文",
            content: parsed.previewText,
          },
        ];
      }

      setPhase("contributing");
      const { book } = await submitCommunityPdBook({
        data: {
          title: title.trim() || parsed.title || file.name,
          author: author.trim() || parsed.author || "未知作者",
          description: `社区公版贡献 · ${file.name}`,
          category: "文学",
          format: parsed.format,
          pdBasis: pdBasis as PublicDomainBasis,
          pdBasisNote: pdNote,
          sourceUrl,
          yearOrEra,
          chapters,
          wordCount: parsed.wordCount,
          personalUseAck: true,
          pdContribute: true,
        },
      });

      cacheCommunityBook(book);
      addToShelf(book.id);
      void refreshCommunity();
      toast.success("已发布到社区公版书城（用户声明）");
      void navigate({ to: "/book/$bookId", params: { bookId: book.id } });
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
          上传图书
        </h1>
        <p className="mt-1 text-fg-muted">
          默认私有；若确认为公版，可声明后贡献到书城（无需官方一本本上传）。
        </p>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-accent/30 bg-accent/5 px-4 py-4 text-sm leading-relaxed text-fg-muted">
        <div className="mb-2 flex items-center gap-2 font-medium text-fg">
          <Scale className="h-4 w-4 text-accent" />
          怎么保证是公版？
        </div>
        <p className="mb-2">{COPYRIGHT_POLICY_SUMMARY.verify}</p>
        <ul className="list-disc space-y-1 pl-5">
          <li>{COPYRIGHT_POLICY_SUMMARY.upload}</li>
          <li>
            公版贡献需填写依据（古籍 / 作者保护期 / Gutenberg
            等）与可选来源链接。
          </li>
          <li>
            社区全文上架需要可解析正文（TXT / MD / 文本型 EPUB）。扫描版 PDF
            建议先转文本，或仅私有阅读。
          </li>
        </ul>
      </div>

      <div className="grid gap-2 sm:grid-cols-2">
        {(
          [
            {
              id: "private" as const,
              t: "仅私有阅读",
              d: "不进书城，只有你能看正文",
            },
            {
              id: "community_pd" as const,
              t: "声明公版并上架",
              d: "进入「社区公版」，大家可读",
            },
          ] as const
        ).map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setMode(m.id)}
            className={`rounded-[var(--radius-xl)] border px-4 py-3 text-left transition-colors ${
              mode === m.id
                ? "border-accent bg-accent/10"
                : "border-border bg-bg-elevated hover:bg-bg-subtle"
            }`}
          >
            <p className="text-sm font-medium">{m.t}</p>
            <p className="mt-1 text-xs text-fg-muted">{m.d}</p>
          </button>
        ))}
      </div>

      {mode === "community_pd" && !isPending && !user && (
        <div className="rounded-[var(--radius-lg)] border border-border bg-bg-subtle/60 px-3 py-3 text-sm text-fg-muted">
          贡献公版需要登录，以便记录贡献者并接受举报处理。{" "}
          <Link
            to="/login"
            className="text-fg underline-offset-2 hover:underline"
          >
            去登录
          </Link>
        </div>
      )}

      <Card>
        <CardHeader>
          <div className="flex items-center gap-2">
            <Cloud className="h-4 w-4 text-accent" />
            <CardTitle className="text-base">
              {mode === "private" ? "私有存储" : "社区公版提交"}
            </CardTitle>
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-sm text-fg-muted">
            <Badge variant="accent">
              {mode === "private" ? "private" : "public_domain_community"}
            </Badge>
            <Badge variant="outline">{storage.label}</Badge>
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
            <p className="text-sm font-medium">拖拽或选择文件</p>
            <p className="mt-1 text-xs text-fg-subtle">
              PDF · EPUB · TXT · MD · 最大 80MB
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
                    {fmt ? ` · ${fmt.toUpperCase()}` : ""}
                  </span>
                </span>
              </div>
            )}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            <div className="space-y-1.5">
              <label className="text-xs text-fg-muted">书名</label>
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="建议与原作一致"
              />
            </div>
            <div className="space-y-1.5">
              <label className="text-xs text-fg-muted">作者</label>
              <Input
                value={author}
                onChange={(e) => setAuthor(e.target.value)}
                placeholder={mode === "community_pd" ? "必填" : "可选"}
              />
            </div>
          </div>

          {mode === "community_pd" && (
            <div className="space-y-3 rounded-[var(--radius-xl)] border border-border bg-bg-subtle/30 p-4">
              <div className="flex items-center gap-2 text-sm font-medium">
                <Shield className="h-4 w-4 text-accent" />
                公版声明（必填）
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-fg-muted">公版依据</label>
                <select
                  className="flex h-11 w-full rounded-[var(--radius-md)] border border-border bg-bg px-3 text-sm"
                  value={pdBasis}
                  onChange={(e) =>
                    setPdBasis(e.target.value as PublicDomainBasis | "")
                  }
                >
                  <option value="">请选择…</option>
                  {PD_BASIS_OPTIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
                {pdBasis && (
                  <p className="text-[11px] text-fg-subtle">
                    {PD_BASIS_OPTIONS.find((o) => o.id === pdBasis)?.hint}
                  </p>
                )}
              </div>
              <div className="grid gap-3 sm:grid-cols-2">
                <div className="space-y-1.5">
                  <label className="text-xs text-fg-muted">
                    年代 / 作者卒年（可选）
                  </label>
                  <Input
                    value={yearOrEra}
                    onChange={(e) => setYearOrEra(e.target.value)}
                    placeholder="如：唐代 / 1936"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-fg-muted">来源链接</label>
                  <Input
                    value={sourceUrl}
                    onChange={(e) => setSourceUrl(e.target.value)}
                    placeholder="Gutenberg / 档案库 URL"
                  />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-fg-muted">补充说明</label>
                <Input
                  value={pdNote}
                  onChange={(e) => setPdNote(e.target.value)}
                  placeholder="其他依据时请说明"
                />
              </div>
            </div>
          )}

          <label className="flex cursor-pointer items-start gap-3 rounded-[var(--radius-lg)] border border-border bg-bg-subtle/40 px-3 py-3 text-sm leading-relaxed">
            <input
              type="checkbox"
              className="mt-1 h-4 w-4 accent-[var(--color-accent)]"
              checked={ack}
              onChange={(e) => setAck(e.target.checked)}
            />
            <span className="text-fg-muted">
              {mode === "private" ? (
                <>
                  我确认有权使用该文件，仅用于
                  <strong className="text-fg">个人阅读</strong>
                  ，不要求系统将其公开到书城；侵权责任自负。
                </>
              ) : (
                <>
                  我确认该作品属于
                  <strong className="text-fg">公共领域</strong>
                  ，声明信息真实；同意以「社区公版」形式供他人阅读；若误报版权，同意下架并承担责任。我知悉系统
                  <strong className="text-fg">无法自动鉴定</strong>
                  版权，上架依赖本声明。
                </>
              )}
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
            ) : mode === "private" ? (
              <>
                <BookOpen className="h-4 w-4" />
                解析并加入个人书架
              </>
            ) : (
              <>
                <Scale className="h-4 w-4" />
                声明公版并发布到书城
              </>
            )}
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}
