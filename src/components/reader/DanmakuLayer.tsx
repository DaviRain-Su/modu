import { useMemo, useState } from "react";
import { Link } from "@tanstack/react-router";
import { MessageCircle, Send, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import type { DanmakuRow } from "@/lib/server/danmaku";
import { postDanmaku } from "@/lib/server/danmaku";
import { cn } from "@/lib/utils";

/** 段落下弹幕条 */
export function ParaDanmaku({
  bookId,
  chapterId,
  paraIndex,
  quote,
  items,
  enabled,
  signedIn,
  onPosted,
}: {
  bookId: string;
  chapterId: string;
  paraIndex: number;
  quote: string;
  items: DanmakuRow[];
  enabled: boolean;
  signedIn: boolean;
  onPosted: (row: DanmakuRow) => void;
}) {
  const [open, setOpen] = useState(false);
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  if (!enabled) return null;

  const mine = items.slice(-6);

  async function send() {
    const body = text.trim();
    if (!body) return;
    if (!signedIn) {
      toast.error("登录后才能发弹幕");
      return;
    }
    setBusy(true);
    try {
      const { id } = await postDanmaku({
        data: {
          bookId,
          chapterId,
          paraIndex,
          quote: quote.slice(0, 80),
          body,
        },
      });
      onPosted({
        id,
        bookId,
        chapterId,
        paraIndex,
        quote: quote.slice(0, 80),
        body,
        userId: "me",
        displayName: "我",
        createdAt: new Date().toISOString(),
      });
      setText("");
      setOpen(false);
      toast.success("弹幕已发送");
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "发送失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className="not-prose mb-4 mt-1 select-none">
      {mine.length > 0 && (
        <div className="mb-1.5 flex flex-wrap gap-1.5">
          {mine.map((d) => (
            <span
              key={d.id}
              className="inline-flex max-w-full items-center gap-1 rounded-full border border-current/10 bg-current/[0.06] px-2 py-0.5 text-[11px] leading-snug text-current/70"
            >
              <span className="shrink-0 font-medium opacity-80">
                {d.displayName}
              </span>
              <span className="truncate">{d.body}</span>
            </span>
          ))}
          {items.length > 6 && (
            <span className="text-[10px] text-current/40">
              +{items.length - 6}
            </span>
          )}
        </div>
      )}
      {!open ? (
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="inline-flex items-center gap-1 rounded-full border border-current/15 px-2 py-0.5 text-[11px] text-current/45 transition-colors hover:border-current/30 hover:text-current/70"
        >
          <MessageCircle className="h-3 w-3" />
          {items.length > 0 ? `${items.length} 条弹幕` : "发弹幕"}
        </button>
      ) : (
        <div className="flex items-center gap-1.5 rounded-[var(--radius-md)] border border-current/15 bg-current/[0.04] p-1.5">
          <Input
            value={text}
            onChange={(e) => setText(e.target.value)}
            placeholder={signedIn ? "这一句想说…" : "登录后可发弹幕"}
            className="h-9 border-0 bg-transparent text-sm shadow-none focus-visible:ring-0"
            maxLength={500}
            onKeyDown={(e) => {
              if (e.key === "Enter") void send();
            }}
          />
          <Button
            size="icon-sm"
            variant="ghost"
            disabled={busy}
            onClick={() => void send()}
          >
            <Send className="h-3.5 w-3.5" />
          </Button>
          <Button
            size="icon-sm"
            variant="ghost"
            onClick={() => setOpen(false)}
          >
            <X className="h-3.5 w-3.5" />
          </Button>
        </div>
      )}
    </div>
  );
}

export function DanmakuChapterBar({
  total,
  enabled,
  onToggle,
  signedIn,
}: {
  total: number;
  enabled: boolean;
  onToggle: () => void;
  signedIn: boolean;
}) {
  return (
    <div className="flex items-center justify-between gap-2 border-b border-current/10 px-1 pb-3 text-xs text-current/50">
      <span>
        公版共读弹幕
        {total > 0 ? ` · ${total} 条` : ""}
        {!signedIn && (
          <>
            {" · "}
            <Link to="/login" className="underline-offset-2 hover:underline">
              登录后可发
            </Link>
          </>
        )}
      </span>
      <button
        type="button"
        onClick={onToggle}
        className={cn(
          "rounded-full border px-2.5 py-1 transition-colors",
          enabled
            ? "border-current/25 bg-current/10 text-current/80"
            : "border-current/15 text-current/40",
        )}
      >
        {enabled ? "弹幕开" : "弹幕关"}
      </button>
    </div>
  );
}

export function groupDanmakuByPara(rows: DanmakuRow[]) {
  const map = new Map<number, DanmakuRow[]>();
  for (const r of rows) {
    const list = map.get(r.paraIndex) || [];
    list.push(r);
    map.set(r.paraIndex, list);
  }
  return map;
}

export function useDanmakuMap(rows: DanmakuRow[]) {
  return useMemo(() => groupDanmakuByPara(rows), [rows]);
}
