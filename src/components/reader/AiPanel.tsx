import { useEffect, useRef, useState } from "react";
import {
  Highlighter,
  History,
  Lightbulb,
  Languages,
  ListTree,
  Loader2,
  MessageSquareText,
  Plus,
  Send,
  Sparkles,
} from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { runAiAssist, type AiAction } from "@/lib/ai/assist";
import type { AiMessage } from "@/lib/books/types";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { runUserAi } from "@/lib/server/ai-chat";
import {
  getMyConversation,
  listMyConversations,
  type ConversationSummary,
} from "@/lib/server/ai-conversations";
import { createAnnotation } from "@/lib/server/social";
import { cn, uid } from "@/lib/utils";

const quick: { action: AiAction; label: string; icon: typeof Sparkles }[] = [
  { action: "explain", label: "解释", icon: MessageSquareText },
  { action: "summary", label: "摘要", icon: ListTree },
  { action: "translate", label: "翻译", icon: Languages },
  { action: "insight", label: "洞见", icon: Lightbulb },
];

const welcome = (signedIn: boolean): AiMessage => ({
  id: "welcome",
  role: "assistant",
  content: signedIn
    ? "我是墨读 AI 伴读（Pi 统一模型层）。选中正文即可解释 / 摘要 / 翻译；直接提问会保留多轮上下文，并同步到你的账户存储（Cloudflare R2 布局）。"
    : "我是墨读 AI 伴读。游客可本地提问；登录后可多轮记忆、云端档案，并使用官方 / 自有 API（经 Pi）。",
  kind: "chat",
  createdAt: Date.now(),
});

export function AiPanel({
  bookId,
  bookTitle,
  chapterId,
  selectedText,
  onClearSelection,
  className,
  onAnnotationCreated,
}: {
  bookId?: string;
  bookTitle: string;
  chapterId?: string;
  selectedText: string;
  onClearSelection: () => void;
  className?: string;
  onAnnotationCreated?: () => void;
}) {
  const { user } = useCurrentUserState();
  const [messages, setMessages] = useState<AiMessage[]>([welcome(false)]);
  const [input, setInput] = useState("");
  const [note, setNote] = useState("");
  const [busy, setBusy] = useState(false);
  const [conversationId, setConversationId] = useState<string | null>(null);
  const [historyOpen, setHistoryOpen] = useState(false);
  const [convos, setConvos] = useState<ConversationSummary[]>([]);
  const [statusLine, setStatusLine] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMessages([welcome(Boolean(user))]);
    setConversationId(null);
    setStatusLine("");
  }, [bookId, user?.id]);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, busy]);

  async function refreshConvos() {
    if (!user || !bookId) return;
    try {
      const list = await listMyConversations({ data: { bookId } });
      setConvos(list);
    } catch {
      setConvos([]);
    }
  }

  async function loadConvo(id: string) {
    if (!user) return;
    setBusy(true);
    try {
      const full = await getMyConversation({ data: id });
      if (!full) {
        toast.error("对话不存在");
        return;
      }
      setConversationId(full.id);
      setMessages(
        full.messages.map((m) => ({
          id: m.id,
          role: m.role as "user" | "assistant",
          content: m.content,
          kind: (m.kind as AiAction) || "chat",
          createdAt: Date.parse(m.createdAt) || Date.now(),
        })),
      );
      setHistoryOpen(false);
      setStatusLine(
        full.storageKey
          ? `已从账户档案恢复 · ${full.storageKey}`
          : "已从账户恢复对话",
      );
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "加载失败");
    } finally {
      setBusy(false);
    }
  }

  function newChat() {
    setConversationId(null);
    setMessages([welcome(Boolean(user))]);
    setStatusLine("新对话");
    setHistoryOpen(false);
  }

  async function run(action: AiAction, question?: string) {
    if (busy) return;
    setBusy(true);

    const userContent = question?.trim()
      ? question.trim()
      : selectedText
        ? `【${quick.find((q) => q.action === action)?.label ?? "提问"}】${selectedText.slice(0, 160)}${selectedText.length > 160 ? "…" : ""}`
        : "";

    if (userContent) {
      setMessages((m) => [
        ...m,
        {
          id: uid("u"),
          role: "user",
          content: userContent,
          createdAt: Date.now(),
        },
      ]);
    }

    try {
      let content: string;
      if (user && bookId) {
        try {
          const res = await runUserAi({
            data: {
              action,
              text: selectedText,
              question,
              bookTitle,
              bookId,
              chapterId,
              conversationId,
            },
          });
          content = res.content;
          setConversationId(res.conversationId);
          setStatusLine(
            `已保存 · ${res.via === "pi" ? "Pi" : "本地"} · 档案 ${res.storageKey}`,
          );
          if (res.remaining != null) {
            content += `\n\n（今日官方剩余约 ${res.remaining} 次）`;
          }
        } catch (e) {
          const local = await runAiAssist({
            action,
            text: selectedText,
            question,
            bookTitle,
          });
          content =
            local.content +
            `\n\n（说明：${e instanceof Error ? e.message : "云端不可用"}，已使用本地伴读，本轮未写入账户。）`;
        }
      } else {
        const local = await runAiAssist({
          action,
          text: selectedText,
          question,
          bookTitle,
        });
        content =
          local.content +
          (user
            ? "\n\n（缺少 bookId，未写入账户档案。）"
            : "\n\n（未登录：仅本地伴读。登录后多轮记忆会同步到 Cloudflare 存储布局。）");
      }

      setMessages((m) => [
        ...m,
        {
          id: uid("ai"),
          role: "assistant",
          content,
          kind: action,
          createdAt: Date.now(),
        },
      ]);
    } finally {
      setBusy(false);
    }
  }

  async function publishAnnotation() {
    if (!selectedText.trim()) {
      toast.error("请先选中要画线的文字");
      return;
    }
    if (!user) {
      toast.error("登录后才能发布公开批注");
      return;
    }
    if (!bookId) {
      toast.error("缺少书籍信息");
      return;
    }
    setBusy(true);
    try {
      await createAnnotation({
        data: {
          bookId,
          quote: selectedText,
          note,
          chapterId,
          kind: note.trim() ? "note" : "highlight",
          isPublic: true,
        },
      });
      toast.success("已发布公开批注");
      setNote("");
      onAnnotationCreated?.();
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "发布失败");
    } finally {
      setBusy(false);
    }
  }

  return (
    <div className={cn("flex h-full min-h-0 flex-col bg-bg-elevated", className)}>
      <div className="border-b border-border px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 text-sm font-medium">
            <Sparkles className="h-4 w-4 text-accent" />
            AI 伴读
          </div>
          <div className="flex items-center gap-1">
            {user && bookId ? (
              <>
                <button
                  type="button"
                  className="rounded-[var(--radius-md)] p-1.5 text-fg-subtle hover:bg-bg-subtle hover:text-fg"
                  title="历史对话"
                  onClick={() => {
                    setHistoryOpen((v) => !v);
                    void refreshConvos();
                  }}
                >
                  <History className="h-4 w-4" />
                </button>
                <button
                  type="button"
                  className="rounded-[var(--radius-md)] p-1.5 text-fg-subtle hover:bg-bg-subtle hover:text-fg"
                  title="新对话"
                  onClick={newChat}
                >
                  <Plus className="h-4 w-4" />
                </button>
              </>
            ) : null}
          </div>
        </div>
        <p className="mt-1 text-xs text-fg-subtle">
          {user
            ? "Pi 内核 · 对话写入账户档案（R2 布局）"
            : "游客本地伴读 · 登录解锁记忆与云端"}
        </p>
        {statusLine ? (
          <p className="mt-1 truncate text-[10px] text-accent/90">{statusLine}</p>
        ) : null}
      </div>

      {historyOpen && user ? (
        <div className="max-h-40 overflow-y-auto border-b border-border bg-bg px-3 py-2">
          {convos.length === 0 ? (
            <p className="py-2 text-xs text-fg-subtle">本书暂无历史对话</p>
          ) : (
            <ul className="space-y-1">
              {convos.map((c) => (
                <li key={c.id}>
                  <button
                    type="button"
                    className={cn(
                      "w-full rounded-[var(--radius-md)] px-2 py-1.5 text-left text-xs hover:bg-bg-subtle",
                      conversationId === c.id && "bg-bg-subtle",
                    )}
                    onClick={() => void loadConvo(c.id)}
                  >
                    <div className="truncate font-medium">{c.title}</div>
                    <div className="text-[10px] text-fg-subtle">
                      {c.messageCount} 条 · {c.updatedAt.slice(0, 16)}
                    </div>
                  </button>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

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
                onClick={() => void run(action)}
                className="flex flex-col items-center gap-1 rounded-[var(--radius-md)] border border-border bg-bg px-1 py-2 text-[11px] text-fg-muted transition-colors hover:bg-bg-hover hover:text-fg disabled:opacity-50"
              >
                <Icon className="h-3.5 w-3.5" />
                {label}
              </button>
            ))}
          </div>
          <div className="mt-3 space-y-2">
            <Textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="写一句公开批注（可选）…"
              rows={2}
              className="min-h-[56px] resize-none text-xs"
            />
            <Button
              type="button"
              size="sm"
              variant="secondary"
              className="w-full"
              disabled={busy}
              onClick={() => void publishAnnotation()}
            >
              <Highlighter className="h-3.5 w-3.5" />
              公开画线 / 批注
            </Button>
          </div>
        </div>
      ) : (
        <div className="border-b border-border px-4 py-3 text-xs text-fg-subtle">
          选中正文 → AI 快捷操作；直接提问可连续多轮（登录后写入账户）。
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
        <div ref={bottomRef} />
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
            placeholder="边读边问：这段在讲什么？帮我写笔记…"
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
