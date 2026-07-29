import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Upload } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLibraryStore } from "@/lib/store/library";

export const Route = createFileRoute("/shelf")({
  component: ShelfPage,
});

function ShelfPage() {
  const ready = useLibraryStore((s) => s.ready);
  const syncing = useLibraryStore((s) => s.syncing);
  const cloudUserId = useLibraryStore((s) => s.cloudUserId);
  const shelfBooks = useLibraryStore((s) => s.shelfBooks);
  const { user } = useCurrentUserState();
  const books = ready ? shelfBooks() : [];

  const reading = books.filter((b) => (b.progress ?? 0) > 0 && (b.progress ?? 0) < 100);
  const rest = books.filter((b) => !reading.includes(b));

  const progressHint = !user
    ? "进度保存在本机"
    : syncing
      ? "正在同步云端书架…"
      : cloudUserId
        ? "进度与书架已与账户同步"
        : "登录后可同步进度与书架";

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">书架</h1>
          <p className="mt-1 text-fg-muted">
            {ready ? `${books.length} 本藏书 · ${progressHint}` : "加载中…"}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link to="/library">去书城</Link>
          </Button>
          <Button asChild>
            <Link to="/upload">
              <Upload className="h-4 w-4" />
              上传
            </Link>
          </Button>
        </div>
      </div>

      {!ready ? (
        <div className="h-40 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" />
      ) : books.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[var(--radius-2xl)] border border-dashed border-border px-6 py-20 text-center">
          <div className="mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-bg-subtle">
            <BookMarked className="h-5 w-5 text-fg-muted" />
          </div>
          <h2 className="text-lg font-medium">书架还是空的</h2>
          <p className="mt-2 max-w-sm text-sm text-fg-muted">
            从书城添加精选读物，或上传你的 PDF / EPUB，开始第一段阅读。
          </p>
          <div className="mt-6 flex gap-2">
            <Button asChild>
              <Link to="/library">逛书城</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/upload">上传图书</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {reading.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-fg-muted">继续阅读</h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {reading.map((b) => (
                  <BookCard key={b.id} book={b} showProgress />
                ))}
              </div>
            </section>
          )}
          {rest.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-fg-muted">
                {reading.length > 0 ? "全部藏书" : "我的藏书"}
              </h2>
              <div className="grid grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-4">
                {rest.map((b) => (
                  <BookCard key={b.id} book={b} showProgress />
                ))}
              </div>
            </section>
          )}
        </>
      )}
    </div>
  );
}
