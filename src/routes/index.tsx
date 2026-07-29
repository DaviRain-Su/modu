import { createFileRoute, Link } from "@tanstack/react-router";
import {
  ArrowRight,
  BookOpen,
  Cloud,
  Smartphone,
  Sparkles,
  Upload,
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
              在线阅读 · PDF / EPUB · AI 伴读
            </Badge>
            <h1 className="max-w-xl text-balance font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              把世界装进口袋，
              <br />
              也装进一段安静的光。
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              墨读是面向手机与电脑的在线阅读器：书城发现好书，一键加入书架；支持上传
              PDF / EPUB；阅读时随时唤起 AI 解释、摘要与笔记。
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/library">
                  进入书城
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild variant="secondary" size="lg">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  上传图书
                </Link>
              </Button>
            </div>
            <p className="mt-6 text-xs text-fg-subtle">
              存储：{storage.label} — {storage.detail}
            </p>
          </div>

          <div className="relative mx-auto grid w-full max-w-md grid-cols-2 gap-3 sm:gap-4">
            {featured.map((book, i) => (
              <div
                key={book.id}
                className={cnLift(i)}
              >
                <BookCard book={book} />
              </div>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mb-8 max-w-xl">
          <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
            为认真阅读而设计
          </h2>
          <p className="mt-2 text-fg-muted">
            从发现到精读，完整链路都在一个产品里。
          </p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {[
            {
              icon: BookOpen,
              title: "书城与书架",
              desc: "精选书目随时加入书架，进度自动同步到本机。",
            },
            {
              icon: Upload,
              title: "PDF / EPUB",
              desc: "上传个人藏书，浏览器内沉浸阅读，无需安装客户端。",
            },
            {
              icon: Sparkles,
              title: "AI 伴读",
              desc: "选中句子即可解释、摘要、翻译或生成读书洞见。",
            },
            {
              icon: Cloud,
              title: "Cloudflare 存储",
              desc: "对象存储抽象对接 R2，文件按 books/ 路径结构化存放。",
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
            <div className="mb-3 inline-flex items-center gap-2 text-sm text-fg-muted">
              <Smartphone className="h-4 w-4" />
              手机与 Web 自适应
            </div>
            <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
              通勤路上，或深夜桌前
            </h2>
            <p className="mt-3 text-fg-muted leading-relaxed">
              底部导航与大触控目标为拇指而设；宽屏下阅读区与 AI
              侧栏并排。字号、行距、纸张/羊皮纸/夜间主题随时切换。
            </p>
            <div className="mt-6 flex flex-wrap gap-3">
              <Button asChild>
                <Link to="/shelf">我的书架</Link>
              </Button>
              <Button asChild variant="outline">
                <Link to="/book/$bookId" params={{ bookId: featured[0].id }}>
                  试读精选
                </Link>
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
                <span>AI 可解释选中文字</span>
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
        <Button asChild size="lg" className="mt-6">
          <Link to="/library">
            浏览书城
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}

function cnLift(i: number) {
  return i % 2 === 1 ? "mt-6 sm:mt-10" : "";
}
