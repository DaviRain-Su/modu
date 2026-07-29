import { Link, useRouterState } from "@tanstack/react-router";
import { BookMarked, BookOpen, Home, Library, Upload } from "lucide-react";
import { cn } from "@/lib/utils";

const nav = [
  { to: "/", label: "首页", icon: Home, match: (p: string) => p === "/" },
  {
    to: "/library",
    label: "书城",
    icon: Library,
    match: (p: string) => p.startsWith("/library") || p.startsWith("/book"),
  },
  {
    to: "/shelf",
    label: "书架",
    icon: BookMarked,
    match: (p: string) => p.startsWith("/shelf"),
  },
  {
    to: "/upload",
    label: "上传",
    icon: Upload,
    match: (p: string) => p.startsWith("/upload"),
  },
] as const;

export function AppShell({
  children,
  hideNav,
}: {
  children: React.ReactNode;
  hideNav?: boolean;
}) {
  const pathname = useRouterState({ select: (s) => s.location.pathname });
  const isReader = pathname.startsWith("/read");

  if (isReader || hideNav) {
    return <>{children}</>;
  }

  return (
    <div className="min-h-dvh bg-bg text-fg">
      <header className="sticky top-0 z-40 border-b border-border/80 bg-bg/90 backdrop-blur-md safe-pt">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between gap-4 px-4 sm:h-16 sm:px-6">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-[var(--radius-md)] bg-primary text-primary-fg">
              <BookOpen className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <div className="leading-tight">
              <div className="text-sm font-semibold tracking-tight">墨读</div>
              <div className="hidden text-[11px] text-fg-subtle sm:block">
                沉浸阅读 · AI 伴读
              </div>
            </div>
          </Link>

          <nav className="hidden items-center gap-1 md:flex">
            {nav.map((item) => {
              const active = item.match(pathname);
              return (
                <Link
                  key={item.to}
                  to={item.to}
                  className={cn(
                    "rounded-[var(--radius-md)] px-3.5 py-2 text-sm transition-colors",
                    active
                      ? "bg-bg-subtle text-fg"
                      : "text-fg-muted hover:bg-bg-subtle/70 hover:text-fg",
                  )}
                >
                  {item.label}
                </Link>
              );
            })}
          </nav>

          <Link
            to="/library"
            className="hidden rounded-[var(--radius-md)] bg-primary px-3.5 py-2 text-sm font-medium text-primary-fg sm:inline-flex"
          >
            开始阅读
          </Link>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-4 pb-24 pt-6 sm:px-6 sm:pb-10 sm:pt-8">
        {children}
      </main>

      <nav className="fixed inset-x-0 bottom-0 z-40 border-t border-border bg-bg/95 backdrop-blur-md safe-pb md:hidden">
        <div className="mx-auto grid max-w-lg grid-cols-4 px-2 pt-1">
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
        </div>
      </nav>
    </div>
  );
}
