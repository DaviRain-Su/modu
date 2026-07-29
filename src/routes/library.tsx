import { useEffect, useMemo, useState } from "react";
import { createFileRoute, Link } from "@tanstack/react-router";
import { Scale, Search } from "lucide-react";
import { BookCard, BookRow } from "@/components/books/BookCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { CATEGORIES, listMarketBooks } from "@/lib/books/catalog";
import { COPYRIGHT_POLICY_SUMMARY } from "@/lib/books/copyright";
import type { Book, BookCategory } from "@/lib/books/types";
import { useLibraryStore } from "@/lib/store/library";
import { cn } from "@/lib/utils";

export const Route = createFileRoute("/library")({
  component: LibraryPage,
});

function LibraryPage() {
  const [q, setQ] = useState("");
  const [cat, setCat] = useState<BookCategory>("全部");
  const [view, setView] = useState<"grid" | "list">("grid");
  const [tab, setTab] = useState<"all" | "official" | "community">("all");
  const community = useLibraryStore((s) => s.community);
  const refreshCommunity = useLibraryStore((s) => s.refreshCommunity);
  const ready = useLibraryStore((s) => s.ready);

  useEffect(() => {
    if (ready) void refreshCommunity();
  }, [ready, refreshCommunity]);

  const official = useMemo(() => listMarketBooks(), []);
  const catalog: Book[] = useMemo(() => {
    if (tab === "official") return official;
    if (tab === "community") return community;
    return [...community, ...official];
  }, [tab, official, community]);

  const books = useMemo(() => {
    const query = q.trim().toLowerCase();
    return catalog.filter((b) => {
      if (cat !== "全部" && b.category !== cat) return false;
      if (!query) return true;
      return (
        b.title.toLowerCase().includes(query) ||
        b.author.toLowerCase().includes(query) ||
        b.tags.some((t) => t.toLowerCase().includes(query)) ||
        b.description.toLowerCase().includes(query)
      );
    });
  }, [q, cat, catalog]);

  const hot = catalog
    .slice()
    .sort((a, b) => b.readers - a.readers)
    .slice(0, 3);

  return (
    <div className="space-y-8">
      <div className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <h1 className="font-serif text-3xl font-medium tracking-tight">
            公版书城
          </h1>
          <p className="mt-1 text-fg-muted">
            官方精选 + 用户声明的社区公版 · 有版权的书请勿上架
          </p>
        </div>
        <div className="relative w-full sm:max-w-xs">
          <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-fg-subtle" />
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="搜索书名、作者、标签…"
            className="pl-9"
          />
        </div>
      </div>

      <div className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated px-4 py-3 text-sm text-fg-muted">
        <div className="flex items-start gap-2">
          <Scale className="mt-0.5 h-4 w-4 shrink-0 text-accent" />
          <div className="space-y-1 leading-relaxed">
            <p className="font-medium text-fg">版权与共建</p>
            <p>{COPYRIGHT_POLICY_SUMMARY.market}</p>
            <p>{COPYRIGHT_POLICY_SUMMARY.verify}</p>
            <p>
              有公版书想分享？{" "}
              <Link
                to="/upload"
                className="text-fg underline-offset-2 hover:underline"
              >
                上传并声明公版
              </Link>
              ；不确定版权请选「仅私有」。
            </p>
          </div>
        </div>
      </div>

      <div className="flex gap-2">
        {(
          [
            ["all", `全部 ${official.length + community.length}`],
            ["official", `官方 ${official.length}`],
            ["community", `社区 ${community.length}`],
          ] as const
        ).map(([k, label]) => (
          <button
            key={k}
            type="button"
            onClick={() => setTab(k)}
            className={cn(
              "rounded-full border px-3.5 py-1.5 text-sm transition-colors",
              tab === k
                ? "border-primary bg-primary text-primary-fg"
                : "border-border bg-bg-elevated text-fg-muted hover:text-fg",
            )}
          >
            {label}
          </button>
        ))}
      </div>

      <section className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-4 sm:p-5">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-sm font-medium text-fg-muted">热门</h2>
          <Badge variant="outline">{catalog.length} 本</Badge>
        </div>
        <div className="grid gap-3 sm:grid-cols-3">
          {hot.map((b, i) => (
            <div
              key={b.id}
              className="flex items-center gap-3 rounded-[var(--radius-lg)] bg-bg-subtle/60 p-2"
            >
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg text-sm font-medium text-fg-muted">
                {i + 1}
              </span>
              <div className="min-w-0">
                <p className="truncate text-sm font-medium">{b.title}</p>
                <p className="truncate text-xs text-fg-subtle">
                  {b.author} ·{" "}
                  {b.source === "community" ? "社区公版" : "官方公版"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-1">
          {CATEGORIES.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => setCat(c)}
              className={cn(
                "shrink-0 rounded-full border px-3.5 py-1.5 text-sm transition-colors",
                cat === c
                  ? "border-primary bg-primary text-primary-fg"
                  : "border-border bg-bg-elevated text-fg-muted hover:text-fg",
              )}
            >
              {c}
            </button>
          ))}
        </div>
        <div className="flex gap-1 self-end rounded-[var(--radius-md)] border border-border p-1">
          {(
            [
              ["grid", "封面"],
              ["list", "列表"],
            ] as const
          ).map(([k, label]) => (
            <button
              key={k}
              type="button"
              onClick={() => setView(k)}
              className={cn(
                "rounded-[var(--radius-sm)] px-3 py-1.5 text-xs transition-colors",
                view === k
                  ? "bg-bg-subtle text-fg"
                  : "text-fg-muted hover:text-fg",
              )}
            >
              {label}
            </button>
          ))}
        </div>
      </div>

      {books.length === 0 ? (
        <p className="py-16 text-center text-sm text-fg-muted">
          {tab === "community"
            ? "还没有社区公版。登录后上传并声明公版即可贡献。"
            : "没有匹配的书，试试其他关键词。"}
        </p>
      ) : view === "grid" ? (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5">
          {books.map((b) => (
            <BookCard key={b.id} book={b} />
          ))}
        </div>
      ) : (
        <div className="space-y-3">
          {books.map((b) => (
            <BookRow key={b.id} book={b} />
          ))}
        </div>
      )}
    </div>
  );
}
