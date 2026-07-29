import { useState } from "react";
import {
  Lightbulb,
  Languages,
  ListTree,
  Loader2,
  MessageSquareText,
  Send,
  Sparkles,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAiAssist, type AiAction } from "@/lib/ai/assist";
import type { AiMessage } from "@/lib/books/types";
import { cn, uid } from "@/lib/utils";

const quick: { action: AiAction; label: string; icon: typeof Sparkles }[] = [
  { action: "explain", label: "解释", icon: MessageSquareText },
  { action: "summary", label: "摘要", icon: ListTree },
  { action: "translate", label: "翻译", icon: Languages },
  { action: "insight", label: "洞见", icon: Lightbulb },
];

export function AiPanel({
  bookTitle,
  selectedText,
  onClearSelection,
  className,
}: {
  bookTitle: string;
  selectedText: string;
  onClearSelection: () => void;
  className?: string;
}) {
  const [messages, setMessages] = useState<AiMessage[]>([
    {
      id: "welcome",
      role: "assistant",
      content:
        "我是墨读 AI 伴读。选中正文中的句子，可用「解释 / 摘要 / 翻译 / 洞见」；也可以直接提问，例如「帮我写一段读书笔记」。",
      kind: "chat",
      createdAt: Date.now(),
    },
  ]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);

  async function run(action: AiAction, question?: string) {
    if (busy) return;
    setBusy(true);
    if (question?.trim()) {
      setMessages((m) => [
        ...m,
        {
          id: uid("u"),
          role: "user",
          content: question.trim(),
          createdAt: Date.now(),
        },
      ]);
    } else if (selectedText) {
      setMessages((m) => [
        ...m,
        {
          id: uid("u"),
          role: "user",
          content: `【${quick.find((q) => q.action === action)?.label ?? "提问"}】${selectedText.slice(0, 160)}${selectedText.length > 160 ? "…" : ""}`,
          createdAt: Date.now(),
        },
      ]);
    }
    try {
      const reply = await runAiAssist({
        action,
        text: selectedText,
        question,
        bookTitle,
      });
      setMessages((m) => [...m, reply]);
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-bg-elevated", className)}>
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center gap-2 text-sm font-medium">
          <Sparkles className="h-4 w-4 text-accent" />
          AI 伴读
        </div>
        <p className="mt-1 text-xs text-fg-subtle">结合当前选区与全书语境作答</p>
      </div>

      {selectedText ? (
        <div className="border-b border-border bg-bg-subtle/50 px-4 py-3">
          <div className="flex items-start justify-between gap-2">
            <p className="line-clamp-3 text-xs leading-relaxed text-fg-muted">
              已选：{selectedText}
            </p>
            <button
              type="button"
              className="shrink-0 text-xs text-fg-subtle hover:text-fg"
              onClick={onClearSelection}
            >
              清除
            </button>
          </div>
          <div className="mt-3 grid grid-cols-4 gap-1.5">
            {quick.map(({ action, label, icon: Icon }) => (
              <button
                key={action}
                type="button"
                disabled={busy}
                onClick={() => run(action)}
                className="flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-border bg-bg px-1 py-2 text-[11px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg disabled:opacity-50"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
        </div>
      ) : (
        <div className="border-b border-border px-4 py-3 text-xs text-fg-subtle">
          在正文中选中文字后，这里会出现快捷 AI 操作。
        </div>
      )}

      <div className="min-h-0 flex-1 space-y-3 overflow-y-auto px-4 py-4">
        {messages.map((m) => (
          <div
            key={m.id}
            className={cn(
              "rounded-[var(--radius-lg)] px-3 py-2.5 text-sm leading-relaxed",
              m.role === "assistant"
                ? "bg-bg-subtle text-fg"
                : "ml-6 bg-primary/10 text-fg",
            )}
          >
            <div className="mb-1 text-[10px] uppercase tracking-wider text-fg-subtle">
              {m.role === "assistant" ? "墨读 AI" : "你"}
            </div>
            <div className="whitespace-pre-wrap">{formatMdLite(m.content)}</div>
          </div>
        ))}
        {busy && (
          <div className="flex items-center gap-2 text-xs text-fg-subtle">
            <Loader2 className="h-3.5 w-3.5 animate-spin" />
            正在思考…
          </div>
        )}
      </div>

      <form
        className="border-t border-border p-3 safe-pb"
        onSubmit={(e) => {
          e.preventDefault();
          const q = input.trim();
          if (!q) return;
          setInput("");
          void run("chat", q);
        }}
      >
        <div className="flex gap-2">
          <Textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="问 AI：这段在讲什么？帮我写笔记…"
            className="min-h-[44px] resize-none"
            rows={2}
          />
          <Button
            type="submit"
            size="icon"
            disabled={busy || !input.trim()}
            className="shrink-0 self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </form>
    </div>
  );
}

function formatMdLite(text: string) {
  // very light markdown: **bold** lines
  const parts = text.split(/(\*\*[^*]+\*\*)/g);
  return parts.map((part, i) => {
    if (part.startsWith("**") && part.endsWith("**")) {
      return (
        <strong key={i} className="font-semibold text-fg">
          {part.slice(2, -2)}
        </strong>
      );
    }
    return <span key={i}>{part}</span>;
  });
}
