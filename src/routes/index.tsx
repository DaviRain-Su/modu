import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Flame,
  Smartphone,
  Sparkles,
  Upload,
  Users,
} from "lucide-react";
import { BookCard } from "@/components/books/BookCard";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { MARKET_BOOKS } from "@/lib/books/catalog";
import { describeStorage } from "@/lib/storage/r2";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const featured = MARKET_BOOKS.slice(0, 4);
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
              账户 · 热榜 · AI 自带密钥 / 官方订阅
            </Badge>
            <h1 className="max-w-xl text-balance font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              把世界装进口袋，
              <br />
              也装进一段安静的光。
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              墨读是面向手机与电脑的在线阅读器：书城、上传 PDF/EPUB、AI 伴读；
              登录后可公开画线、参与热门榜，并用官方订阅或自有 ChatGPT / Kimi / DeepSeek API。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/library">
                  进入书城
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/login">登录 / 注册</Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-fg-subtle">
              存储：{storage.label} — {storage.detail}
            </p>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
            {featured.map((book, i) => (
              <div key={book.id} className={i % 2 === 1 ? "mt-6 sm:mt-10" : ""}>
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 max-w-xl">
          <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
            为认真阅读与社区而设计
          </h2>
          <p className="mt-2 text-fg-muted">
            从发现到精读，再到公开批注与热榜。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {[
            {
              icon: BookOpen,
              title: "书城与书架",
              desc: "精选书目随时加入书架，进度本机保存。",
            },
            {
              icon: Sparkles,
              title: "AI 伴读",
              desc: "官方订阅额度，或自带 OpenAI / Kimi / DeepSeek / 自定义接口。",
            },
            {
              icon: Users,
              title: "公开画线",
              desc: "选中文字即可高亮与批注，对社区可见。",
            },
            {
              icon: Flame,
              title: "热门书单榜",
              desc: "聚合真实阅读与批注热度，留言板同步洞见。",
            },
            {
              icon: Cloud,
              title: "Cloudflare 存储",
              desc: "对象存储抽象对接 R2，上传图书结构化存放。",
            },
            {
              icon: Smartphone,
              title: "手机与 Web",
              desc: "自适应布局，阅读设置与 AI 侧栏随时可用。",
            },
          ].map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5"
            >
              <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-[var(--radius-md)] bg-bg-subtle">
                <Icon className="h-5 w-5 text-accent" strokeWidth={1.6} />
              </div>
              <h3 className="font-medium tracking-tight">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-fg-muted">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-[var(--radius-2xl)] border border-border bg-bg-elevated p-6 sm:p-10">
        <div className="grid items-center gap-8 lg:grid-cols-2">
          <div>
            <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
              官方订阅或自带额度
            </h2>
            <p className="mt-3 text-fg-muted leading-relaxed">
              免费 / Plus / Pro 三档官方 AI 次数；也可在账户中配置 ChatGPT API、Kimi、DeepSeek
              或任意 OpenAI 兼容端点，使用你自己的额度。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/account">管理账户与 AI</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/rankings">查看热榜</Link>
              </Button>
            </div>
          </div>
          <div className="rounded-[var(--radius-xl)] border border-border bg-bg p-4 sm:p-6">
            <div className="rounded-[var(--radius-lg)] bg-paper px-5 py-6 text-paper-fg shadow-[var(--shadow-soft)]">
              <p className="text-[11px] tracking-[0.14em] text-paper-muted uppercase">
                试读片段
              </p>
              <p className="mt-3 font-serif text-[15px] leading-[1.85]">
                {MARKET_BOOKS[0].chapters?.[0]?.content.slice(0, 160)}…
              </p>
              <div className="mt-5 flex items-center justify-between border-t border-paper-line pt-4 text-xs text-paper-muted">
                <span>纸张主题</span>
                <span>选中即可 AI / 画线</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <section className="pb-4 text-center">
        <h2 className="font-serif text-2xl font-medium tracking-tight">
          现在就开始读
        </h2>
        <p className="mx-auto mt-2 max-w-md text-fg-muted">
          无需安装。打开书城，或把你的 PDF / EPUB 丢进墨读。
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <Button asChild size="lg">
            <Link to="/library">
              浏览书城
              <ArrowRight className="h-4 w-4" />
            </Link>
          </Button>
          <Button asChild size="lg" variant="secondary">
            <Link to="/upload">
              <Upload className="h-4 w-4" />
              上传图书
            </Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
