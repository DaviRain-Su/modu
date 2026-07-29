import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import {
  BookOpen,
  Check,
  Clock,
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
import { formatBytes, formatCount } from "@/lib/utils";

export const Route = createFileRoute("/book/$bookId")({
  component: BookDetailPage,
});

function BookDetailPage() {
  const { bookId } = Route.useParams();
  const navigate = useNavigate();
  const ready = useLibraryStore((s) => s.ready);
  const getBook = useLibraryStore((s) => s.getBook);
  const isOnShelf = useLibraryStore((s) => s.isOnShelf);
  const addToShelf = useLibraryStore((s) => s.addToShelf);
  const removeFromShelf = useLibraryStore((s) => s.removeFromShelf);
  const getProgress = useLibraryStore((s) => s.getProgress);

  const book = getBook(bookId);
  const progress = getProgress(bookId);
  const onShelf = isOnShelf(bookId);

  if (ready && !book) {
    return (
      <div className="py-20 text-center">
        <h1 className="text-xl font-medium">未找到图书</h1>
        <p className="mt-2 text-fg-muted">它可能已从书架移除，或链接无效。</p>
        <Button asChild className="mt-6">
          <Link to="/library">返回书城</Link>
        </Button>
      </div>
    );
  }

  if (!book) {
    return <div className="h-64 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" />;
  }

  const pct = progress?.progress ?? book.progress ?? 0;

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
            {book.source === "upload" && <Badge>我的上传</Badge>}
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
            <span>{formatCount(book.readers)} 人在读</span>
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
              <Badge key={t} variant="default">
                {t}
              </Badge>
            ))}
          </div>

          <div className="mt-8 flex flex-wrap gap-3">
            <Button
              size="lg"
              onClick={() => {
                if (!onShelf) addToShelf(book.id);
                void navigate({
                  to: "/read/$bookId",
                  params: { bookId: book.id },
                });
              }}
            >
              <BookOpen className="h-4 w-4" />
              {pct > 0 ? "继续阅读" : "开始阅读"}
            </Button>
            {onShelf ? (
              <Button
                size="lg"
                variant="secondary"
                onClick={() => {
                  toast.success("已在书架");
                }}
              >
                <Check className="h-4 w-4" />
                已加书架
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
            {book.source === "upload" && (
              <Button
                size="lg"
                variant="danger"
                onClick={() => {
                  void removeFromShelf(book.id).then(() => {
                    toast.success("已删除上传图书");
                    void navigate({ to: "/shelf" });
                  });
                }}
              >
                <Trash2 className="h-4 w-4" />
                删除
              </Button>
            )}
          </div>
        </div>
      </div>

      {book.chapters && book.chapters.length > 0 && (
        <section>
          <h2 className="mb-4 text-lg font-medium tracking-tight">目录</h2>
          <div className="divide-y divide-border overflow-hidden rounded-[var(--radius-xl)] border border-border">
            {book.chapters.map((ch, i) => (
              <Link
                key={ch.id}
                to="/read/$bookId"
                params={{ bookId: book.id }}
                search={{ chapter: ch.id }}
                className="flex items-center justify-between gap-4 bg-bg-elevated px-4 py-3.5 transition-colors hover:bg-bg-subtle sm:px-5"
              >
                <span className="text-sm">
                  <span className="mr-3 text-fg-subtle">{i + 1}</span>
                  {ch.title}
                </span>
                <span className="text-xs text-fg-subtle">阅读</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
