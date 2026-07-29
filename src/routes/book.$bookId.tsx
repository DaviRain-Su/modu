import { useEffect, useState } from "react";
import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Clock,
  Shield,
  Star,
  Trash2,
  Upload,
} from "lucide-react";
import { toast } from "sonner";
import { BookCover } from "@/components/books/BookCover";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLibraryStore } from "@/lib/store/library";
import type { Book } from "@/lib/books/types";
import {
  listBookAnnotations,
  type AnnotationRow,
} from "@/lib/server/social";
import { formatBytes, formatCount } from "@/lib/utils";

export const Route = createFileRoute("/book/$bookId")({
  component: BookDetailPage,
});

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const ready = useLibraryStore((s) => s.ready);
  const getBook = useLibraryStore((s) => s.getBook);
  const resolveBook = useLibraryStore((s) => s.resolveBook);
  const isOnShelf = useLibraryStore((s) => s.isOnShelf);
  const addToShelf = useLibraryStore((s) => s.addToShelf);
  const removeFromShelf = useLibraryStore((s) => s.removeFromShelf);
  const getProgress = useLibraryStore((s) => s.getProgress);

  const [book, setBook] = useState<Book | null | undefined>(undefined);
  const progress = getProgress(bookId);
  const onShelf = isOnShelf(bookId);
  const [annotations, setAnnotations] = useState<AnnotationRow[]>([]);

  useEffect(() => {
    if (!ready) return;
    const local = getBook(bookId);
    if (local) {
      setBook(local);
      return;
    }
    void resolveBook(bookId).then((b) => setBook(b ?? null));
  }, [bookId, ready, getBook, resolveBook]);

  useEffect(() => {
    if (!book || book.visibility === "private") {
      setAnnotations([]);
      return;
    }
    void listBookAnnotations({ data: bookId })
      .then(setAnnotations)
      .catch(() => setAnnotations([]));
  }, [bookId, book?.visibility]);

  if (ready && book === null) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-medium">未找到图书</h1>
        <p className="mt-2 text-fg-muted">
          可能是他人私有书，或链接无效。
        </p>
        <Button asChild className="mt-6">
          <Link to="/library">返回公版书城</Link>
        </Button>
      </div>
    );
  }

  if (!book) {
    return (
      <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" />
    );
  }

  const pct = progress?.progress ?? book.progress ?? 0;
  const isPrivate = book.visibility === "private" || book.source === "upload";
  const isCommunity = book.source === "community";

  return (
    <div className="space-y-10">
      <div className="flex flex-col gap-8 sm:flex-row sm:gap-10">
        <div className="mx-auto sm:mx-0">
          <BookCover book={book} size="xl" />
        </div>
        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap gap-2">
            <Badge variant="outline">{book.category}</Badge>
            <Badge variant="accent">{book.format.toUpperCase()}</Badge>
            {isPrivate && <Badge>私有 · 未上架</Badge>}
            {isCommunity && <Badge variant="accent">社区公版</Badge>}
            {book.source === "market" && (
              <Badge variant="outline">官方公版</Badge>
            )}
          </div>
          <h1 className="mt-3 font-serif text-3xl font-medium tracking-tight sm:text-4xl">
            {book.title}
          </h1>
          <p className="mt-2 text-fg-muted">{book.author}</p>
          <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-fg-subtle">
            <span className="inline-flex items-center gap-1">
              <Star className="h-4 w-4 fill-accent/80 text-accent" />
              {book.rating.toFixed(1)}
            </span>
            {!isPrivate && <span>{formatCount(book.readers)} 人在读</span>}
            {book.fileSize ? (
              <span className="inline-flex items-center gap-1">
                <Upload className="h-3.5 w-3.5" />
                {formatBytes(book.fileSize)}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1">
                <Clock className="h-3.5 w-3.5" />约{" "}
                {Math.max(1, Math.round(book.wordCount / 500))} 分钟
              </span>
            )}
          </div>

          <div className="mt-3 flex items-start gap-2 rounded-[var(--radius-md)] border border-border bg-bg-subtle/50 px-3 py-2 text-xs leading-relaxed text-fg-muted">
            <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
            <span>
              {book.license}
              {book.licenseNote ? ` · ${book.licenseNote}` : ""}
              {book.sourceUrl ? (
                <>
                  {" · "}
                  <a
                    href={book.sourceUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="underline-offset-2 hover:underline"
                  >
                    来源
                  </a>
                </>
              ) : null}
            </span>
          </div>

          {pct > 0 && (
            <div className="mt-5 max-w-md space-y-1.5">
              <div className="flex justify-between text-xs text-fg-subtle">
                <span>阅读进度</span>
                <span>{Math.round(pct)}%</span>
              </div>
              <Progress value={pct} />
            </div>
          )}

          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-fg-muted sm:text-base">
            {book.description}
          </p>

          <div className="mt-4 flex flex-wrap gap-2">
            {book.tags.map((t) => (
              <Badge key={t} variant="outline">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() =>
                void navigate({
                  to: "/read/$bookId",
                  params: { bookId: book.id },
                })
              }
            >
              <BookOpen className="h-4 w-4" />
              {pct > 0 ? "继续阅读" : "开始阅读"}
            </Button>
            {onShelf ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  if (isPrivate) {
                    if (!confirm("移除私有图书将删除本地文件，确定？")) return;
                  }
                  void removeFromShelf(book.id).then(() =>
                    toast.success(isPrivate ? "已删除" : "已移出书架"),
                  );
                }}
              >
                {isPrivate ? (
                  <>
                    <Trash2 className="h-4 w-4" />
                    删除私有书
                  </>
                ) : (
                  <>
                    <Check className="h-4 w-4" />
                    已在书架
                  </>
                )}
              </Button>
            ) : (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  addToShelf(book.id);
                  toast.success("已加入书架");
                }}
              >
                加入书架
              </Button>
            )}
          </div>
        </div>
      </div>

      {book.chapters && book.chapters.length > 0 && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">目录</h2>
          <div className="divide-y divide-border rounded-[var(--radius-xl)] border border-border bg-bg-elevated">
            {book.chapters.map((ch, i) => (
              <button
                key={ch.id}
                type="button"
                className="flex w-full items-center gap-3 px-4 py-3 text-left text-sm hover:bg-bg-subtle"
                onClick={() =>
                  void navigate({
                    to: "/read/$bookId",
                    params: { bookId: book.id },
                    search: { chapter: ch.id },
                  })
                }
              >
                <span className="w-6 text-fg-subtle">{i + 1}</span>
                <span className="flex-1">{ch.title}</span>
              </button>
            ))}
          </div>
        </section>
      )}

      {!isPrivate && (
        <section>
          <h2 className="mb-3 text-sm font-medium text-fg-muted">
            公开批注 · 社区
          </h2>
          {annotations.length === 0 ? (
            <p className="rounded-[var(--radius-xl)] border border-dashed border-border py-10 text-center text-sm text-fg-muted">
              暂无公开批注。
            </p>
          ) : (
            <div className="space-y-3">
              {annotations.map((a) => (
                <div
                  key={a.id}
                  className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4"
                >
                  <Link
                    to="/u/$userId"
                    params={{ userId: a.userId }}
                    className="text-xs text-fg-subtle hover:text-fg"
                  >
                    {a.displayName}
                  </Link>
                  {a.quote ? (
                    <blockquote className="mt-2 border-l-2 border-accent/40 pl-3 text-sm text-fg-muted">
                      {a.quote}
                    </blockquote>
                  ) : null}
                  {a.note ? (
                    <p className="mt-2 text-sm leading-relaxed">{a.note}</p>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>
      )}

      {isPrivate && (
        <p className="rounded-[var(--radius-xl)] border border-border bg-bg-subtle/40 px-4 py-4 text-sm text-fg-muted">
          私有图书：未作公版声明，不会出现在书城。若这是公版作品，可重新上传并选择「声明公版并上架」。
        </p>
      )}
      {isCommunity && (
        <p className="rounded-[var(--radius-xl)] border border-border bg-bg-subtle/40 px-4 py-4 text-sm text-fg-muted">
          本书由用户声明为公版后进入书城。系统无法自动鉴定版权；若你认为侵权，请联系处理下架。
        </p>
      )}
    </div>
  );
}
