import { Link, useRouterState } from "@tanstack/react-router";
import {
  BookMarked,
  BookOpen,
  Flame,
  Home,
  Library,
  Moon,
  Sun,
  Upload,
  UserRound,
} from "lucide-react";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { signOut } from "@/lib/auth/client";
import { useAppTheme } from "@/lib/theme/app-theme";
import { useLocale, useT } from "@/lib/i18n/locale";
import { cn } from "@/lib/utils";

function ThemeToggle() {
  const { theme, toggle } = useAppTheme();
  const t = useT();
  return (
    <button
      type="button"
      onClick={toggle}
      className="inline-flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] text-fg-muted transition-colors hover:bg-bg-subtle hover:text-fg"
      aria-label={theme === "dark" ? t.theme.toLight : t.theme.toDark}
      title={theme === "dark" ? t.theme.toLight : t.theme.toDark}
    >
      {theme === "dark" ? (
        <Sun className="h-4 w-4" strokeWidth={1.75} />
      ) : (
        <Moon className="h-4 w-4" strokeWidth={1.75} />
      )}
    </button>
  );
}

function LangToggle() {
  const { locale, setLocale } = useLocale();
  const t = useT();
  return (
    <div
      className="inline-flex h-9 items-center rounded-[var(--radius-md)] border border-border/80 bg-bg-subtle/40 p-0.5 text-xs font-medium"
      role="group"
      aria-label={t.lang.switchTo}
    >
      <button
        type="button"
        onClick={() => setLocale("zh")}
        className={cn(
          "rounded-[calc(var(--radius-md)-2px)] px-2 py-1 transition-colors",
          locale === "zh"
            ? "bg-bg-elevated text-fg shadow-sm"
            : "text-fg-subtle hover:text-fg",
        )}
      >
        {t.lang.zh}
      </button>
      <button
        type="button"
        onClick={() => setLocale("en")}
        className={cn(
          "rounded-[calc(var(--radius-md)-2px)] px-2 py-1 transition-colors",
          locale === "en"
            ? "bg-bg-elevated text-fg shadow-sm"
            : "text-fg-subtle hover:text-fg",
        )}
      >
        {t.lang.en}
      </button>
    </div>
  );
}

function AuthSlot() {
  const { user, isPending } = useCurrentUserState();
  const t = useT();
  if (isPending) {
    return (
      <div className="h-9 w-20 animate-pulse rounded-[var(--radius-md)] bg-bg-subtle" />
    );
  }
  if (!user) {
    return (
      <Link
        to="/login"
        className="rounded-[var(--radius-md)] bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg"
      >
        {t.nav.login}
      </Link>
    );
  }
  return (
    <div className="flex items-center gap-1 sm:gap-2">
      <Link
        to="/account"
        className="flex max-w-[9rem] items-center gap-2 rounded-[var(--radius-md)] px-2 py-1.5 text-sm hover:bg-bg-subtle"
      >
        <span className="flex h-8 w-8 items-center justify-center rounded-full bg-bg-subtle text-xs font-medium">
          {(user.displayName ?? user.primaryEmail ?? "U").charAt(0)}
        </span>
        <span className="hidden truncate sm:inline">
          {user.displayName ?? t.nav.account}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => void signOut()}
        className="hidden text-xs text-fg-subtle hover:text-fg md:inline"
      >
        {t.nav.logout}
      </button>
    </div>
  );
}

export function AppShell({
  children,
  hideNav,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isReader = pathname.startsWith("/read");
  const t = useT();

  const nav = [
    { to: "/", label: t.nav.home, icon: Home, match: (p: string) => p === "/" },
    {
      to: "/library",
      label: t.nav.library,
      icon: Library,
      match: (p: string) => p.startsWith("/library") || p.startsWith("/book"),
    },
    {
      to: "/rankings",
      label: t.nav.rankings,
      icon: Flame,
      match: (p: string) => p.startsWith("/rankings"),
    },
    {
      to: "/shelf",
      label: t.nav.shelf,
      icon: BookMarked,
      match: (p: string) => p.startsWith("/shelf"),
    },
  ] as const;

  if (isReader || hideNav) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-bg text-fg transition-colors duration-200">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md safe-pt">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-3 px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-fg">
              <BookOpen className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">
                {t.brand}
              </div>
              <div className="hidden text-[11px] text-fg-subtle sm:block">
                {t.brandTag}
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 lg:flex">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
                    active
                      ? "bg-bg-subtle text-fg"
                      : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
            <Link
              to="/upload"
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
                pathname.startsWith("/upload")
                  ? "bg-bg-subtle text-fg"
                  : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg",
              )}
            >
              {t.nav.upload}
            </Link>
            <Link
              to="/account"
              className={cn(
                "rounded-[var(--radius-md)] px-3 py-2 text-sm transition-colors",
                pathname.startsWith("/account")
                  ? "bg-bg-subtle text-fg"
                  : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg",
              )}
            >
              {t.nav.account}
            </Link>
          </nav>

          <div className="flex items-center gap-1.5">
            <LangToggle />
            <ThemeToggle />
            <AuthSlot />
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md safe-pb lg:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-5 px-1 pt-1">
          {nav.map((item) => {
            const Icon = item.icon;
            const active = item.match(pathname);
            return (
              <Link
                key={item.to}
                to={item.to}
                className={cn(
                  "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
                  active ? "text-fg" : "text-fg-subtle",
                )}
              >
                <Icon className="h-5 w-5" strokeWidth={active ? 2.1 : 1.7} />
                {item.label}
              </Link>
            );
          })}
          <Link
            to="/account"
            className={cn(
              "flex min-h-14 flex-col items-center justify-center gap-0.5 text-[11px]",
              pathname.startsWith("/account") || pathname.startsWith("/login")
                ? "text-fg"
                : "text-fg-subtle",
            )}
          >
            <UserRound
              className="h-5 w-5"
              strokeWidth={pathname.startsWith("/account") ? 2.1 : 1.7}
            />
            {t.nav.me}
          </Link>
        </div>
      </nav>
    </div>
  );
}
