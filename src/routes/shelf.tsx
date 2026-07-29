import { createFileRoute, Link } from "@tanstack/react-router";
import { BookMarked, Upload } from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { useLibraryStore } from "@/lib/store/library";
import { useT } from "@/lib/i18n/locale";

export const Route = createFileRoute("/shelf")({
  component: ShelfPage,
});

function ShelfPage() {
  const t = useT();
  const ready = useLibraryStore((s) => s.ready);
  const syncing = useLibraryStore((s) => s.syncing);
  const cloudUserId = useLibraryStore((s) => s.cloudUserId);
  const shelfBooks = useLibraryStore((s) => s.shelfBooks);
  const { user } = useCurrentUserState();
  const books = ready ? shelfBooks() : [];

  const reading = books.filter((b) => (b.progress ?? 0) > 0 && (b.progress ?? 0) < 100);
  const rest = books.filter((b) => !reading.includes(b));

  const progressHint = !user
    ? t.shelf.progressLocal
    : syncing
      ? t.shelf.progressSyncing
      : cloudUserId
        ? t.shelf.progressSynced
        : t.shelf.progressLogin;

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">{t.shelf.title}</h1>
          <p className="mt-1 text-fg-muted">
            {ready ? `${books.length} ${t.shelf.booksCount} · ${progressHint}` : t.common.loading}
          </p>
        </div>
        <div className="flex gap-2">
          <Button asChild variant="secondary">
            <Link to="/library">{t.nav.library}</Link>
          </Button>
          <Button asChild>
            <Link to="/upload">
              <Upload className="h-4 w-4" />
              {t.nav.upload}
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
          <h2 className="text-lg font-medium">{t.shelf.empty}</h2>
          <p className="mt-2 max-w-sm text-sm text-fg-muted">
            {t.shelf.emptyHint}
          </p>
          <div className="mt-6 flex gap-2">
            <Button asChild>
              <Link to="/library">{t.nav.library}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/upload">{t.nav.upload}</Link>
            </Button>
          </div>
        </div>
      ) : (
        <>
          {reading.length > 0 && (
            <section>
              <h2 className="mb-3 text-sm font-medium text-fg-muted">{t.shelf.continue}</h2>
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
