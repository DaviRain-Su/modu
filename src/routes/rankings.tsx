import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Flame, MessageSquareQuote } from "lucide-react";
import { BookCover } from "@/components/books/BookCover";
import { Badge } from "@/components/ui/badge";
import { MARKET_BOOKS } from "@/lib/books/catalog";
import { useLibraryStore } from "@/lib/store/library";
import {
  getHotBooks,
  getRecentPublicNotes,
  type HotBookRow,
} from "@/lib/server/social";
import { formatCount } from "@/lib/utils";

export const Route = createFileRoute("/rankings")({
  component: RankingsPage,
});

function RankingsPage() {
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

  // Seed empty ranking with market popularity so the board isn't empty on first visit
  const displayHot =
    hot.length > 0
      ? hot
      : MARKET_BOOKS.slice()
          .sort((a, b) => b.readers - a.readers)
          .slice(0, 8)
          .map((b, i) => ({
            bookId: b.id,
            readCount: Math.round(b.readers / 1000),
            annotationCount: 0,
            score: b.readers,
            seed: true as const,
          }));

  return (
    <div className="space-y-10">
      <div>
        <h1 className="font-serif text-3xl font-medium tracking-tight">热门榜</h1>
        <p className="mt-1 text-fg-muted">
          根据真实阅读与公开批注聚合 · 留言板展示社区洞见
        </p>
      </div>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted">
          <Flame className="h-4 w-4 text-accent" />
          热门书单
          {!ready && <span className="text-xs">加载中…</span>}
        </div>
        <div className="space-y-2">
          {displayHot.map((row, i) => {
            const book = getBook(row.bookId) ?? MARKET_BOOKS.find((b) => b.id === row.bookId);
            if (!book) return null;
            return (
              <Link
                key={row.bookId}
                to="/book/$bookId"
                params={{ bookId: book.id }}
                className="flex items-center gap-3 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-3 transition-colors hover:bg-bg-subtle sm:gap-4 sm:p-4"
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-sm font-medium text-fg-muted">
                  {i + 1}
                </span>
                <BookCover book={book} size="sm" />
                <div className="min-w-0 flex-1">
                  <h3 className="truncate font-medium">{book.title}</h3>
                  <p className="truncate text-sm text-fg-muted">{book.author}</p>
                  <div className="mt-1 flex flex-wrap gap-2 text-xs text-fg-subtle">
                    <span>阅读 {formatCount(row.readCount)}</span>
                    <span>批注 {row.annotationCount}</span>
                    {"seed" in row && row.seed ? (
                      <Badge variant="outline">预热榜</Badge>
                    ) : null}
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </section>

      <section>
        <div className="mb-4 flex items-center gap-2 text-sm font-medium text-fg-muted">
          <MessageSquareQuote className="h-4 w-4 text-accent" />
          留言板 · 公开批注
        </div>
        {notes.length === 0 ? (
          <div className="rounded-[var(--radius-xl)] border border-dashed border-border px-6 py-12 text-center text-sm text-fg-muted">
            还没有公开批注。登录后在阅读器中选中文字，即可画线并留下注释。
          </div>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => {
              const book =
                getBook(n.bookId) ?? MARKET_BOOKS.find((b) => b.id === n.bookId);
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
                    <Link
                      to="/book/$bookId"
                      params={{ bookId: n.bookId }}
                      className="hover:underline"
                    >
                      {book?.title ?? n.bookId}
                    </Link>
                  </div>
                  <blockquote className="mt-2 border-l-2 border-accent/50 pl-3 text-sm text-fg-muted">
                    {n.quote}
                  </blockquote>
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
