import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Flame,
  Scale,
  Smartphone,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { listMarketBooks } from "@/lib/books/catalog";
import { COPYRIGHT_POLICY_SUMMARY } from "@/lib/books/copyright";
import { describeStorage } from "@/lib/storage/r2";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const market = listMarketBooks();
  const featured = market.slice(0, 4);
  const storage = describeStorage();

  return (
    <div className="space-y-16 sm:space-y-24">
      <section className="relative overflow-hidden rounded-[var(--radius-2xl)] border border-border bg-bg-elevated px-6 py-12 sm:px-12 sm:py-16">
        <div
          className="pointer-events-none absolute inset-0 opacity-40"
          style={{
            background:
              "radial-gradient(ellipse 70% 50% at 80% 0%, color-mix(in oklab, var(--color-accent) 18%, transparent), transparent 70%)",
          }}
        />
        <div className="relative grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
          <div>
            <Badge variant="accent" className="mb-5">
              公版书城 · 私有上传 · AI 伴读
            </Badge>
            <h1 className="max-w-xl text-balance font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              把世界装进口袋，
              <br />
              也装进一段安静的光。
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              墨读：书城只上架公版图书；你可上传私有 PDF/EPUB 仅自己阅读；
              阅读时 AI 伴读，手机与电脑都适配。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/library">
                  浏览公版书城
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  私有上传
                </Link>
              </Button>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-fg-subtle">
              <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {COPYRIGHT_POLICY_SUMMARY.market}
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3">
            {featured.map((b) => (
              <BookCard key={b.id} book={b} />
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {[
          {
            icon: BookOpen,
            t: "公版书城",
            d: "只收录公共领域作品，可自由加入书架，避免版权风险。",
          },
          {
            icon: Upload,
            t: "私有上传",
            d: "PDF/EPUB 只进你的书架，系统禁止上架书城。",
          },
          {
            icon: Sparkles,
            t: "AI 伴读",
            d: "选段解释、摘要、翻译；可接自有 API 或官方额度。",
          },
          {
            icon: Users,
            t: "内部榜单",
            d: "公版热度公开；私有书仅可分享评论/摘要，不露原文。",
          },
        ].map(({ icon: Icon, t, d }) => (
          <div
            key={t}
            className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5"
          >
            <Icon className="mb-3 h-5 w-5 text-accent" />
            <h3 className="font-medium">{t}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="grid items-center gap-8 rounded-[var(--radius-2xl)] border border-border bg-bg-elevated p-6 sm:grid-cols-2 sm:p-10">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-fg-muted">
            <Cloud className="h-4 w-4 text-accent" />
            存储 · {storage.label}
          </div>
          <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
            边读边问，记录留在你的档案里
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
            {storage.detail}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link to="/read/$bookId" params={{ bookId: market[0]?.id || "pd_lunyu" }}>
                试读公版
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/rankings">
                <Flame className="h-4 w-4" />
                内部榜单
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-paper p-6 text-paper-fg shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-wider text-paper-muted">
            公版试读
          </p>
          <p className="mt-3 font-serif text-lg leading-relaxed">
            {market[0]?.chapters?.[0]?.content.slice(0, 160)}…
          </p>
          <p className="mt-4 text-sm text-paper-muted">
            — {market[0]?.title} · {market[0]?.license}
          </p>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 rounded-[var(--radius-2xl)] border border-border bg-bg-subtle/40 px-6 py-12 text-center">
        <Smartphone className="h-6 w-6 text-accent" />
        <h2 className="font-serif text-2xl font-medium">手机与电脑同一体验</h2>
        <p className="max-w-md text-sm text-fg-muted">
          响应式阅读界面，触控与键盘翻页都支持。先逛公版书城，或上传一本只属于你的书。
        </p>
        <Button asChild size="lg">
          <Link to="/library">
            进入书城
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
