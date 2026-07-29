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
import { useLocale, useT } from "@/lib/i18n/locale";

export const Route = createFileRoute("/")({
  component: LandingPage,
});

function LandingPage() {
  const market = listMarketBooks();
  const featured = market.slice(0, 4);
  const storage = describeStorage();
  const t = useT();
  const { locale } = useLocale();

  const features = [
    { icon: BookOpen, title: t.landing.featPd, d: t.landing.featPdD },
    { icon: Upload, title: t.landing.featPrivate, d: t.landing.featPrivateD },
    { icon: Sparkles, title: t.landing.featAi, d: t.landing.featAiD },
    { icon: Users, title: t.landing.featRank, d: t.landing.featRankD },
  ];

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
              {t.landing.badge}
            </Badge>
            <h1 className="max-w-xl text-balance font-serif text-4xl font-medium leading-[1.12] tracking-tight sm:text-5xl lg:text-[3.25rem]">
              {t.landing.title1}
              <br />
              {t.landing.title2}
            </h1>
            <p className="mt-5 max-w-lg text-base leading-relaxed text-fg-muted sm:text-lg">
              {t.landing.lead}
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Button asChild size="lg">
                <Link to="/library">
                  {t.landing.ctaLibrary}
                  <ArrowRight className="h-4 w-4" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="secondary">
                <Link to="/upload">
                  <Upload className="h-4 w-4" />
                  {t.landing.ctaUpload}
                </Link>
              </Button>
            </div>
            <p className="mt-4 flex items-start gap-2 text-xs leading-relaxed text-fg-subtle">
              <Scale className="mt-0.5 h-3.5 w-3.5 shrink-0" />
              {locale === "en"
                ? "Store lists public-domain works only. Private uploads never enter the catalog."
                : COPYRIGHT_POLICY_SUMMARY.market}
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
        {features.map(({ icon: Icon, title, d }) => (
          <div
            key={title}
            className="rounded-[var(--radius-xl)] border border-border bg-bg-elevated p-5"
          >
            <Icon className="mb-3 h-5 w-5 text-accent" />
            <h3 className="font-medium">{title}</h3>
            <p className="mt-2 text-sm leading-relaxed text-fg-muted">{d}</p>
          </div>
        ))}
      </section>

      <section className="grid items-center gap-8 rounded-[var(--radius-2xl)] border border-border bg-bg-elevated p-6 sm:grid-cols-2 sm:p-10">
        <div>
          <div className="mb-3 flex items-center gap-2 text-sm text-fg-muted">
            <Cloud className="h-4 w-4 text-accent" />
            {locale === "en" ? "Storage" : "存储"} · {storage.label}
          </div>
          <h2 className="font-serif text-2xl font-medium tracking-tight sm:text-3xl">
            {locale === "en"
              ? "Ask as you read — notes stay in your archive"
              : "边读边问，记录留在你的档案里"}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-fg-muted sm:text-base">
            {storage.detail}
          </p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Button asChild>
              <Link
                to="/read/$bookId"
                params={{ bookId: market[0]?.id || "pd_lunyu" }}
              >
                {locale === "en" ? "Try a PD sample" : "试读公版"}
              </Link>
            </Button>
            <Button asChild variant="outline">
              <Link to="/rankings">
                <Flame className="h-4 w-4" />
                {t.landing.featRank}
              </Link>
            </Button>
          </div>
        </div>
        <div className="rounded-[var(--radius-xl)] border border-border bg-paper p-6 text-paper-fg shadow-[var(--shadow-soft)]">
          <p className="text-xs uppercase tracking-wider text-paper-muted">
            {locale === "en" ? "Public-domain sample" : "公版试读"}
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
        <h2 className="font-serif text-2xl font-medium">
          {t.landing.featMobile}
        </h2>
        <p className="max-w-md text-sm text-fg-muted">
          {t.landing.featMobileD}
        </p>
        <Button asChild size="lg">
          <Link to="/library">
            {t.landing.ctaLibrary}
            <ArrowRight className="h-4 w-4" />
          </Link>
        </Button>
      </section>
    </div>
  );
}
