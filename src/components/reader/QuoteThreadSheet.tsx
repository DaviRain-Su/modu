import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { Loader2, MessageCircle, Send, Users } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import type { AnnotationRow, QuoteThread } from "@/lib/server/social";
import { createAnnotation } from "@/lib/server/social";
import { quotesMatch } from "@/lib/reader/quote-key";
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/locale";

/**
 * 同一句划线上的多人想法：
 * 选中 / 点高亮 → 看大家写了什么 → 自己再留一句
 */
export function QuoteThreadSheet({
  open,
  quote,
  bookId,
  chapterId,
  threads,
  signedIn,
  isPublicDomain,
  onClose,
  onPosted,
}: {
  open: boolean;
  quote: string;
  bookId: string;
  chapterId?: string;
  threads: QuoteThread[];
  signedIn: boolean;
  isPublicDomain: boolean;
  onClose: () => void;
  onPosted: (row: AnnotationRow) => void;
}) {
  const t = useT();
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);

  const thread = useMemo(() => {
    if (!quote) return null;
    return (
      threads.find((t) => quotesMatch(t.quote, quote)) || {
        quote,
        quoteKey: quote,
        chapterId: chapterId || null,
        count: 0,
        items: [] as AnnotationRow[],
      }
    );
  }, [threads, quote, chapterId]);

  if (!open || !quote) return null;

  const items = thread?.items.filter((i) => i.note?.trim()) || [];
  const canPublic = isPublicDomain;

  async function submit() {
    const body = note.trim();
    if (!body) {
      toast.error("写一句你的想法");
      return;
    }
    if (!signedIn) {
      toast.error("登录后才能留下公开想法");
      return;
    }
    if (!canPublic) {
      toast.error("仅公版书支持多人{t.annotate.thread}");
      return;
    }
    setBusy(true);
    try {
      const res = await createAnnotation({
        data: {
          bookId,
          quote,
          note: body,
          chapterId,
          kind: "note",
          isPublic: true,
        },
      });
      onPosted({
        id: res.id,
        userId: "me",
        displayName: "我",
        bookId,
        chapterId: chapterId || null,
        page: null,
        quote,
        note: body,
        kind: "note",
        isPublic: true,
        parentId: null,
        createdAt: new Date().toISOString(),
      });
      setNote("");
      toast.success("已留在这句上");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "发布失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="关闭"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-labelledby="quote-thread-title"
        className="relative z-10 flex max-h-[min(88dvh,640px)] w-full max-w-md flex-col rounded-t-[var(--radius-xl)] border border-border bg-bg-elevated shadow-[var(--shadow-soft)] sm:rounded-[var(--radius-xl)]"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-start justify-between gap-3 px-4 pb-2 pt-3">
          <div>
            <h2
              id="quote-thread-title"
              className="flex items-center gap-1.5 text-base font-medium"
            >
              <Users className="h-4 w-4 text-accent" />
              这句上的想法
            </h2>
            <p className="mt-0.5 text-xs text-fg-subtle">
              任何人都可以在同一句划线上留下自己的解读
            </p>
          </div>
          <button
            type="button"
            className="text-sm text-fg-subtle hover:text-fg"
            onClick={onClose}
          >
            关闭
          </button>
        </div>

        <blockquote className="mx-4 mb-3 line-clamp-4 rounded-[var(--radius-md)] border-l-2 border-accent/50 bg-bg-subtle/50 px-3 py-2 text-sm leading-relaxed text-fg-muted">
          「{quote}」
        </blockquote>

        <div className="min-h-0 flex-1 overflow-y-auto px-4">
          {items.length === 0 ? (
            <p className="py-6 text-center text-sm text-fg-subtle">
              {t.annotate.noReplies}。
              <br />
              成为第一个？
            </p>
          ) : (
            <ul className="space-y-3 pb-2">
              {items.map((item) => (
                <li
                  key={item.id}
                  className="rounded-[var(--radius-md)] border border-border/60 bg-bg-subtle/30 px-3 py-2.5"
                >
                  <div className="mb-1 flex items-center gap-2 text-xs text-fg-subtle">
                    <span className="font-medium text-fg">
                      {item.displayName}
                    </span>
                    <span>
                      {item.createdAt
                        ? new Date(item.createdAt).toLocaleDateString()
                        : ""}
                    </span>
                  </div>
                  <p className="text-sm leading-relaxed text-fg">{item.note}</p>
                </li>
              ))}
            </ul>
          )}
        </div>

        <div className="border-t border-border p-4 safe-pb">
          {!canPublic ? (
            <p className="text-center text-xs text-fg-subtle">
              私有图书不公开{t.annotate.thread}
            </p>
          ) : !signedIn ? (
            <p className="text-center text-sm text-fg-muted">
              <Link to="/login" className="text-accent underline-offset-2 hover:underline">
                登录
              </Link>
              后即可在这句上留下想法
            </p>
          ) : (
            <>
              <Textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="你对这一句的想法…"
                className="min-h-[72px] resize-none"
                maxLength={2000}
              />
              <div className="mt-2 flex items-center justify-between gap-2">
                <span className="text-[11px] text-fg-subtle">
                  <MessageCircle className="mr-1 inline h-3 w-3" />
                  {items.length} 条想法 · 公开可见
                </span>
                <Button size="sm" disabled={busy} onClick={() => void submit()}>
                  {busy ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Send className="h-4 w-4" />
                  )}
                  留下
                </Button>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

/** 正文里某句已被多人划过时的小徽标 */
export function QuoteHeatBadge({
  count,
  onClick,
}: {
  count: number;
  onClick: () => void;
}) {
  if (count <= 0) return null;
  return (
    <button
      type="button"
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={cn(
        "ml-1 inline-flex translate-y-[-0.1em] items-center gap-0.5 rounded-full border border-accent/30 bg-accent/10 px-1.5 py-0.5 align-middle text-[10px] font-medium text-accent",
      )}
    >
      <Users className="h-2.5 w-2.5" />
      {count}
    </button>
  );
}
