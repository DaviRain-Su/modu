import { useEffect, useState } from "react";
import { Loader2, Lock, Send, Users } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { cn } from "@/lib/utils"
import { useT } from "@/lib/i18n/locale";
import type { HighlightColor } from "./SelectionToolbar";
import { HIGHLIGHT_COLORS } from "./SelectionToolbar";

/**
 * 选区{t.annotate.title}框：引用选中句 + 填写想法 + 公开/私有
 * 对齐 empty {t.annotate.title}笔记 + liber note-pop
 */
export function AnnotationPopover({
  quote,
  color,
  defaultPublic,
  isPrivateBook,
  signedIn,
  busy,
  onSave,
  onClose,
}: {
  quote: string;
  color: HighlightColor;
  defaultPublic?: boolean;
  isPrivateBook?: boolean;
  signedIn: boolean;
  busy?: boolean;
  onSave: (input: {
    note: string;
    isPublic: boolean;
    color: HighlightColor;
  }) => void | Promise<void>;
  onClose: () => void;
}) {
  const t = useT();
  const colorLabel = {
    gold: t.annotate.gold,
    vermilion: t.annotate.red,
    celadon: t.annotate.blue,
  } as const;
  const [note, setNote] = useState("");
  const [isPublic, setIsPublic] = useState(
    defaultPublic !== false && !isPrivateBook,
  );
  const [localColor, setLocalColor] = useState(color);

  useEffect(() => {
    setLocalColor(color);
  }, [color]);

  // private books: public only allows note without quote (handled server-side)
  useEffect(() => {
    if (isPrivateBook) setIsPublic(false);
  }, [isPrivateBook]);

  return (
    <div className="fixed inset-0 z-[110] flex items-end justify-center sm:items-center sm:p-4">
      <button
        type="button"
        className="absolute inset-0 bg-black/40 backdrop-blur-[2px]"
        aria-label="关闭{t.annotate.title}"
        onClick={onClose}
      />
      <div
        className="relative z-10 w-full max-w-md animate-in slide-in-from-bottom-4 rounded-t-[var(--radius-xl)] border border-border bg-bg-elevated shadow-[var(--shadow-soft)] duration-200 sm:rounded-[var(--radius-xl)]"
        role="dialog"
        aria-labelledby="anno-title"
      >
        <div className="mx-auto mt-2 h-1 w-10 rounded-full bg-border sm:hidden" />
        <div className="flex items-center justify-between px-4 pb-2 pt-3">
          <h2 id="anno-title" className="text-base font-medium">
            写下{t.annotate.title}
          </h2>
          <button
            type="button"
            className="text-sm text-fg-subtle hover:text-fg"
            onClick={onClose}
          >
            {t.annotate.cancel}
          </button>
        </div>

        <blockquote className="mx-4 mb-3 line-clamp-4 rounded-[var(--radius-md)] border-l-2 border-accent/50 bg-bg-subtle/60 px-3 py-2 text-sm leading-relaxed text-fg-muted">
          「{quote}」
        </blockquote>

        <div className="mb-3 flex items-center gap-2 px-4">
          <span className="text-xs text-fg-subtle">划线颜色</span>
          {HIGHLIGHT_COLORS.map((c) => (
            <button
              key={c.id}
              type="button"
              title={colorLabel[c.id]}
              onClick={() => setLocalColor(c.id)}
              className={cn(
                "h-7 w-7 rounded-full border-2 transition-transform",
                c.swatch,
                localColor === c.id
                  ? "scale-110 border-fg"
                  : "border-transparent opacity-80",
              )}
            />
          ))}
        </div>

        <div className="px-4">
          <Textarea
            autoFocus
            value={note}
            onChange={(e) => setNote(e.target.value)}
            placeholder="这一句为什么打动你？写一句想法…"
            className="min-h-[100px] resize-none"
            maxLength={2000}
          />
          <p className="mt-1 text-right text-[11px] text-fg-subtle">
            {note.length}/2000
          </p>
        </div>

        <div className="mt-2 flex gap-2 px-4">
          <button
            type="button"
            disabled={isPrivateBook && !signedIn}
            onClick={() => setIsPublic(false)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border px-3 py-2.5 text-xs transition-colors",
              !isPublic
                ? "border-accent bg-accent/10 text-fg"
                : "border-border text-fg-muted",
            )}
          >
            <Lock className="h-3.5 w-3.5" />
            仅自己可见
          </button>
          <button
            type="button"
            disabled={isPrivateBook}
            onClick={() => setIsPublic(true)}
            className={cn(
              "flex flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] border px-3 py-2.5 text-xs transition-colors",
              isPublic
                ? "border-accent bg-accent/10 text-fg"
                : "border-border text-fg-muted",
              isPrivateBook && "cursor-not-allowed opacity-40",
            )}
          >
            <Users className="h-3.5 w-3.5" />
            {isPrivateBook ? "私有书仅本地" : "公开社区"}
          </button>
        </div>

        {isPrivateBook && (
          <p className="mt-2 px-4 text-[11px] leading-relaxed text-fg-subtle">
            私有图书的原文不会进入公开社区；若登录后公开，仅同步你的评论摘要。
          </p>
        )}
        {!signedIn && isPublic && (
          <p className="mt-2 px-4 text-[11px] text-fg-subtle">
            公开{t.annotate.title}需登录；未登录时将只保存在本机。
          </p>
        )}

        <div className="flex gap-2 p-4 safe-pb">
          <Button variant="secondary" className="flex-1" onClick={onClose}>
            关闭
          </Button>
          <Button
            className="flex-1"
            disabled={busy}
            onClick={() =>
              void onSave({
                note: note.trim(),
                isPublic: isPublic && !isPrivateBook,
                color: localColor,
              })
            }
          >
            {busy ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Send className="h-4 w-4" />
            )}
            保存划线
          </Button>
        </div>
      </div>
    </div>
  );
}
