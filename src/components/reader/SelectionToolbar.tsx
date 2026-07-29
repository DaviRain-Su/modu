import { useEffect, useRef } from "react";
import {
  Copy,
  Highlighter,
  MessageSquarePlus,
  Sparkles,
  Users,
  X,
} from "lucide-react";
import { cn } from "@/lib/utils";

export type HighlightColor = "gold" | "vermilion" | "celadon";

export const HIGHLIGHT_COLORS: {
  id: HighlightColor;
  label: string;
  swatch: string;
  mark: string;
}[] = [
  {
    id: "gold",
    label: "金",
    swatch: "bg-[#e5c55e]",
    mark: "bg-[#e5c55e]/35 underline decoration-[#e5c55e] decoration-2",
  },
  {
    id: "vermilion",
    label: "朱",
    swatch: "bg-[#c0532f]",
    mark: "bg-[#c0532f]/25 underline decoration-[#c0532f] decoration-2",
  },
  {
    id: "celadon",
    label: "青",
    swatch: "bg-[#5e8c7b]",
    mark: "bg-[#5e8c7b]/30 underline decoration-[#5e8c7b] decoration-2",
  },
];

export type SelectionAnchor = {
  text: string;
  x: number;
  y: number;
  bottom: number;
};

/**
 * 选区浮层：高亮 · 写想法（同一句共读）· 问 AI · 复制
 */
export function SelectionToolbar({
  anchor,
  communityCount = 0,
  showCommunity = true,
  onHighlight,
  onThoughts,
  onAskAi,
  onCopy,
  onClose,
}: {
  anchor: SelectionAnchor;
  /** 这句上已有多少条公开想法 */
  communityCount?: number;
  showCommunity?: boolean;
  onHighlight: (color: HighlightColor) => void;
  onThoughts: () => void;
  onAskAi: () => void;
  onCopy: () => void;
  onClose: () => void;
}) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const w = el.offsetWidth;
    const h = el.offsetHeight;
    let left = anchor.x - w / 2;
    let top = anchor.y - h - 12;
    left = Math.max(8, Math.min(left, window.innerWidth - w - 8));
    if (top < 8) top = anchor.bottom + 10;
    el.style.left = `${left}px`;
    el.style.top = `${top}px`;
  }, [anchor]);

  return (
    <div
      ref={ref}
      className="fixed z-[100] flex max-w-[min(100vw-16px,22rem)] flex-col overflow-hidden rounded-[var(--radius-lg)] border border-border bg-bg-elevated shadow-[var(--shadow-soft)]"
      style={{ left: anchor.x, top: anchor.y }}
      onMouseDown={(e) => e.preventDefault()}
      onTouchStart={(e) => e.stopPropagation()}
    >
      <div className="flex items-center gap-0.5 border-b border-border px-1.5 py-1.5">
        <span className="px-1.5 text-[10px] text-fg-subtle">
          <Highlighter className="inline h-3 w-3" />
        </span>
        {HIGHLIGHT_COLORS.map((c) => (
          <button
            key={c.id}
            type="button"
            title={c.label}
            className={cn(
              "h-7 w-7 rounded-full border border-border/60 shadow-sm transition-transform active:scale-95",
              c.swatch,
            )}
            onClick={() => onHighlight(c.id)}
          />
        ))}
        <button
          type="button"
          className="ml-auto rounded-[var(--radius-sm)] p-1.5 text-fg-subtle hover:bg-bg-subtle hover:text-fg"
          onClick={onClose}
          aria-label="关闭"
        >
          <X className="h-3.5 w-3.5" />
        </button>
      </div>
      <div className="flex flex-wrap items-center gap-0.5 p-1">
        {showCommunity && (
          <ToolbarBtn
            icon={communityCount > 0 ? Users : MessageSquarePlus}
            label={
              communityCount > 0 ? `想法 ${communityCount}` : "写想法"
            }
            onClick={onThoughts}
            primary
          />
        )}
        <ToolbarBtn icon={Sparkles} label="问 AI" onClick={onAskAi} />
        <ToolbarBtn icon={Copy} label="复制" onClick={onCopy} />
      </div>
      <p className="line-clamp-2 border-t border-border px-3 py-2 text-[11px] leading-snug text-fg-muted">
        「{anchor.text.slice(0, 80)}
        {anchor.text.length > 80 ? "…" : ""}」
      </p>
    </div>
  );
}

function ToolbarBtn({
  icon: Icon,
  label,
  onClick,
  primary,
}: {
  icon: typeof Copy;
  label: string;
  onClick: () => void;
  primary?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "inline-flex min-h-10 flex-1 items-center justify-center gap-1.5 rounded-[var(--radius-md)] px-3 text-xs font-medium transition-colors",
        primary
          ? "bg-accent/15 text-fg hover:bg-accent/25"
          : "text-fg hover:bg-bg-subtle",
      )}
    >
      <Icon className="h-3.5 w-3.5 text-accent" />
      {label}
    </button>
  );
}
