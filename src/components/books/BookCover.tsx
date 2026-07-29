import { cn } from "@/lib/utils";
import type { Book } from "@/lib/books/types";

export function BookCover({
  book,
  className,
  size = "md",
}: {
  book: Pick<Book, "title" | "author" | "coverColor" | "coverText" | "format">;
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = {
    sm: "w-16 aspect-[2/3] rounded-[var(--radius-sm)]",
    md: "w-28 aspect-[2/3] rounded-[var(--radius-md)]",
    lg: "w-36 aspect-[2/3] rounded-[var(--radius-lg)]",
    xl: "w-44 aspect-[2/3] rounded-[var(--radius-lg)]",
  };

  return (
    <div
      className={cn(
        "relative shrink-0 overflow-hidden shadow-[var(--shadow-card)] ring-1 ring-white/10",
        sizes[size],
        className,
      )}
      style={{
        background: `linear-gradient(155deg, ${book.coverColor} 0%, color-mix(in oklab, ${book.coverColor} 70%, #000) 100%)`,
      }}
      aria-hidden
    >
      <div className="absolute inset-y-0 left-0 w-1.5 bg-gradient-to-r from-black/35 to-transparent" />
      <div className="absolute inset-0 opacity-[0.07] bg-[repeating-linear-gradient(90deg,transparent,transparent_2px,white_2px,white_3px)]" />
      <div className="relative flex h-full flex-col justify-between p-3 sm:p-4">
        <div className="text-[10px] uppercase tracking-[0.18em] text-white/55">
          {book.format}
        </div>
        <div>
          <div className="font-serif text-lg font-medium leading-snug tracking-tight text-white/95 sm:text-xl">
            {book.coverText || book.title.slice(0, 2)}
          </div>
          <div className="mt-2 line-clamp-2 text-[11px] leading-snug text-white/65">
            {book.title}
          </div>
          <div className="mt-1 text-[10px] text-white/45">{book.author}</div>
        </div>
      </div>
    </div>
  );
}
