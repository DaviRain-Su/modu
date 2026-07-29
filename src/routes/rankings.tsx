import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, MessageSquareQuote, Shield } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/badge";
import { listMarketBooks, MARKET_BOOKS } from "@/lib/books/catalog";
import { publicBookLabel } from "@/lib/books/copyright";
import { useLibraryStore } from "@/lib/store/library";
import {
  getHotBooks,
  getRecentPublicNotes,
  type HotBookRow,
} from "@/lib/server/social";
import { formatCount } from "@/lib/utils";
import { useT } from "@/lib/i18n/locale";

export const Route = createFileRoute("/rankings")({
  component: RankingsPage,
});

function RankingsPage() {
  const t = useT();
  const getBook = useLibraryStore((s) => s.getBook);
  const [hot, setHot] = useState<HotBookRow[]>([]);
  const [notes, setNotes] = useState<
    {
      id: string;
      userId: string;
      displayName: string;
      bookId: string;
      quote: string;
      note: string;
      isPrivateBook?: boolean;
    }[]
  >([]);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    Promise.all([getHotBooks(), getRecentPublicNotes()])
      .then(([h, n]) => {
        setHot(h);
        setNotes(n);
      })
      .catch(() => {
        setHot([]);
        setNotes([]);
      })
      .finally(() => setReady(true));
  }, []);

  const market = listMarketBooks();
  // 空榜时用公版热度种子 —— 永不混入私有上传
  const displayHot =
    hot.length > 0
      ? hot
      : market
          .slice()
          .sort((a, b) => b.readers - a.readers)
          .slice(0, 8)
          .map((b) => ({
            bookId: b.id,
            readCount: Math.round(b.readers / 1000),
            annotationCount: 0,
            score: b.readers,
          }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">
          {t.rankings.title}
        </h1>
        <p className="mt-1 text-fg-muted">
          {t.rankings.lead}
        </p>
      </div>

      <div className="flex items-start gap-2 rounded-[var(--radius-lg)] border border-border bg-bg-subtle/50 px-3 py-3 text-xs leading-relaxed text-fg-muted">
        <Shield className="mt-0.5 h-3.5 w-3.5 shrink-0 text-accent" />
        <p>{t.rankings.lead}</p>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted">
          <Flame className="h-4 w-4 text-accent" />
          {t.rankings.hot}
          {!ready && <span className="text-xs">{t.common.loading}</span>}
        </div>
        <div className="space-y-2">
          {displayHot.map((row, i) => {
            const book =
              getBook(row.bookId) ??
              MARKET_BOOKS.find((b) => b.id === row.bookId);
            if (!book || book.visibility !== "public_domain") return null;
            return (
              <Link
                key={row.bookId}
                to="/book/$bookId"
                params={{ bookId: row.bookId }}
                className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-3 transition-colors hover:bg-bg-subtle sm:gap-4 sm:p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-sm font-medium text-fg-muted">
                  {i + 1}
                </span>
                <BookCover book={book} size="sm" />
                <div className="min-w-0 flex-1">
                  <div className="flex flex-wrap items-center gap-2">
                    <p className="truncate font-medium">{book.title}</p>
                    <Badge variant="outline">{t.common.publicDomain}</Badge>
                  </div>
                  <p className="truncate text-sm text-fg-muted">{book.author}</p>
                </div>
                <div className="hidden text-right text-xs text-fg-subtle sm:block">
                  <p>{formatCount(row.readCount)} {t.rankings.reads}</p>
                  <p>{row.annotationCount} {t.annotate.replies}</p>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted">
          <MessageSquareQuote className="h-4 w-4 text-accent" />
          {t.rankings.notes}
        </div>
        {notes.length === 0 ? (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-border py-12 text-center text-sm text-fg-muted">
            {t.rankings.empty}
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => {
              const label = publicBookLabel(n.bookId, getBook(n.bookId));
              return (
                <div
                  key={n.id}
                  className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4"
                >
                  <div className="flex flex-wrap items-center gap-2 text-xs text-fg-subtle">
                    <Link
                      to="/u/$userId"
                      params={{ userId: n.userId }}
                      className="font-medium text-fg hover:underline"
                    >
                      {n.displayName}
                    </Link>
                    <span>·</span>
                    {label.linkable ? (
                      <Link
                        to="/book/$bookId"
                        params={{ bookId: n.bookId }}
                        className="hover:text-fg"
                      >
                        {label.title}
                      </Link>
                    ) : (
                      <span className="inline-flex items-center gap-1">
                        {label.title}
                        <Badge variant="outline">私密书</Badge>
                      </span>
                    )}
                  </div>
                  {n.quote ? (
                    <blockquote className="mt-2 border-l-2 border-accent/40 pl-3 text-sm text-fg-muted">
                      {n.quote}
                    </blockquote>
                  ) : null}
                  <p className="mt-2 text-sm leading-relaxed">{n.note}</p>
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
