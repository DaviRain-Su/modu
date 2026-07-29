import { useEffect, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  getPublicProfile,
  listPublicAnnotationsByUser,
  type PublicProfile,
} from "@/lib/server/profile";
import { MARKET_BOOKS } from "@/lib/books/catalog";
import { useLibraryStore } from "@/lib/store/library";

export const Route = createFileRoute("/u/$userId")({
  component: ProfilePage,
});

function ProfilePage() {
  const { userId } = Route.useParams();
  const getBook = useLibraryStore((s) => s.getBook);
  const [profile, setProfile] = useState<PublicProfile | null | undefined>(
    undefined,
  );
  const [notes, setNotes] = useState<
    {
      id: string;
      book_id: string;
      quote: string;
      note: string;
      kind: string;
      created_at: string;
    }[]
  >([]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      const [p, a] = await Promise.all([
        getPublicProfile({ data: { userId } }),
        listPublicAnnotationsByUser({ data: { userId } }),
      ]);
      if (cancelled) return;
      setProfile(p);
      setNotes(a);
    })().catch(() => {
      if (!cancelled) setProfile(null);
    });
    return () => {
      cancelled = true;
    };
  }, [userId]);

  if (profile === undefined) {
    return (
      <div className="h-48 animate-pulse rounded-[var(--radius-xl)] bg-bg-subtle" />
    );
  }

  if (!profile) {
    return (
      <div className="py-16 text-center">
        <h1 className="text-xl font-medium">未找到该读者</h1>
        <p className="mt-2 text-fg-muted">对方可能尚未完善资料。</p>
        <Button asChild className="mt-6">
          <Link to="/rankings">去热门榜</Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-2xl space-y-8">
      <div className="rounded-[var(--radius-2xl)] border border-border bg-bg-elevated p-6 sm:p-8">
        <div className="flex items-start gap-4">
          <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-full bg-bg-subtle text-lg font-medium">
            {profile.displayName.charAt(0)}
          </div>
          <div className="min-w-0">
            <div className="flex flex-wrap items-center gap-2">
              <h1 className="font-serif text-2xl font-medium tracking-tight">
                {profile.displayName}
              </h1>
              <Badge variant="accent">{profile.plan}</Badge>
            </div>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">
              {profile.bio || "这个人很安静，还没有写简介。"}
            </p>
            <div className="mt-4 flex gap-4 text-sm text-fg-subtle">
              <span>公开批注 {profile.annotationCount}</span>
              <span>阅读记录 {profile.readCount}</span>
            </div>
          </div>
        </div>
      </div>

      <section>
        <h2 className="mb-3 text-sm font-medium text-fg-muted">公开批注</h2>
        {notes.length === 0 ? (
          <p className="rounded-[var(--radius-xl)] border border-dashed border-border py-10 text-center text-sm text-fg-muted">
            暂无公开内容
          </p>
        ) : (
          <div className="space-y-3">
            {notes.map((n) => {
              const book =
                getBook(n.book_id) ??
                MARKET_BOOKS.find((b) => b.id === n.book_id);
              return (
                <div
                  key={n.id}
                  className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4"
                >
                  <Link
                    to="/book/$bookId"
                    params={{ bookId: n.book_id }}
                    className="text-xs text-fg-subtle hover:text-fg"
                  >
                    {book?.title ?? n.book_id}
                  </Link>
                  <blockquote className="mt-2 border-l-2 border-accent/40 pl-3 text-sm text-fg-muted">
                    {n.quote}
                  </blockquote>
                  {n.note && (
                    <p className="mt-2 text-sm leading-relaxed">{n.note}</p>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </section>
    </div>
  );
}
