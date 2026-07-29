import { Link } from "@tanstack/react-router";
import { Star } from "lucide-react";
import { BookCover } from "./BookCover";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import type { Book } from "@/lib/books/types";
import { cn, formatCount } from "@/lib/utils";

export function BookCard({
  book,
  showProgress,
  className,
}: {
  book: Book;
  showProgress?: boolean;
  className?: string;
}) {
  return (
    <Link
      to="/book/$bookId"
      params={{ bookId: book.id }}
      className={cn(
        "group flex flex-col gap-3 rounded-[var(--radius-xl)] p-2 transition-colors hover:bg-bg-subtle/70 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring",
        className,
      )}
    >
      <div className="flex justify-center">
        <BookCover
          book={book}
          size="md"
          className="transition-transform duration-200 group-hover:-translate-y-0.5 group-hover:scale-[1.02]"
        />
      </div>
      <div className="min-w-0 px-1">
        <h3 className="line-clamp-2 text-sm font-medium leading-snug tracking-tight">
          {book.title}
        </h3>
        <p className="mt-1 truncate text-xs text-fg-muted">{book.author}</p>
        <div className="mt-2 flex items-center gap-2 text-[11px] text-fg-subtle">
          <span className="inline-flex items-center gap-0.5">
            <Star className="h-3 w-3 fill-accent/80 text-accent" />
            {book.rating.toFixed(1)}
          </span>
          {book.visibility === "private" ? (
            <span>仅自己可见</span>
          ) : (
            <span>{formatCount(book.readers)} 人在读</span>
          )}
        </div>
        {showProgress &&
          typeof book.progress === "number" &&
          book.progress > 0 && (
            <div className="mt-2 space-y-1">
              <Progress value={book.progress} />
              <p className="text-[11px] text-fg-subtle">
                已读 {Math.round(book.progress)}%
              </p>
            </div>
          )}
        <div className="mt-2 flex flex-wrap gap-1">
          {book.source === "community" && (
            <Badge variant="accent">社区公版</Badge>
          )}
          {book.source === "market" && book.visibility === "public_domain" && (
            <Badge variant="outline">官方公版</Badge>
          )}
          {book.source === "upload" && (
            <Badge variant="accent">私有</Badge>
          )}
        </div>
      </div>
    </Link>
  );
}

export function BookRow({ book }: { book: Book }) {
  return (
    <Link
      to="/book/$bookId"
      params={{ bookId: book.id }}
      className="flex gap-4 rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-3 transition-colors hover:bg-bg-subtle sm:p-4"
    >
      <BookCover book={book} size="sm" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div>
            <h3 className="font-medium tracking-tight">{book.title}</h3>
            <p className="mt-0.5 text-sm text-fg-muted">{book.author}</p>
          </div>
          <div className="flex shrink-0 flex-col items-end gap-1">
            <Badge variant="outline">{book.category}</Badge>
            {book.source === "community" ? (
              <Badge variant="accent">社区公版</Badge>
            ) : book.visibility === "public_domain" ? (
              <Badge variant="outline">官方公版</Badge>
            ) : (
              <Badge>私有</Badge>
            )}
          </div>
        </div>
        <p className="mt-2 line-clamp-2 text-sm text-fg-subtle">
          {book.description}
        </p>
        <div className="mt-2 flex flex-wrap items-center gap-3 text-xs text-fg-subtle">
          <span className="inline-flex items-center gap-1">
            <Star className="h-3 w-3 fill-accent/80 text-accent" />
            {book.rating.toFixed(1)}
          </span>
          <span>{book.license}</span>
        </div>
      </div>
    </Link>
  );
}
