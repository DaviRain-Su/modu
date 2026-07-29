import { useEffect } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { AuthProvider } from "@/lib/auth/provider";
import { useCurrentUserState } from "@/lib/auth/use-current-user";
import { AppThemeProvider, useAppTheme } from "@/lib/theme/app-theme";
import { useLibraryStore } from "@/lib/store/library";
import appCss from "../styles.css?url";

// Prevent theme flash before React hydrates
const themeBootScript = `(function(){try{var t=localStorage.getItem('modu_app_theme');if(t!=='light'&&t!=='dark')t='dark';document.documentElement.dataset.theme=t;document.documentElement.style.colorScheme=t;}catch(e){document.documentElement.dataset.theme='dark';}})();`;

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      {
        name: "viewport",
        content: "width=device-width, initial-scale=1, viewport-fit=cover",
      },
      {
        title: "墨读 · 在线阅读器",
      },
      {
        name: "description",
        content:
          "墨读 — 支持 PDF / EPUB 的在线阅读器，公版书城、私有上传、AI 伴读，手机与电脑皆宜。",
      },
      { name: "theme-color", content: "#0b0b0c" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function ThemedToaster() {
  const { theme } = useAppTheme();
  return (
    <Toaster
      theme={theme === "light" ? "light" : "dark"}
      position="top-center"
      toastOptions={{
        className: "border border-border bg-bg-elevated text-fg",
      }}
    />
  );
}

function LibraryBootstrap() {
  const init = useLibraryStore((s) => s.init);
  const syncFromCloud = useLibraryStore((s) => s.syncFromCloud);
  const { user, isPending } = useCurrentUserState();

  useEffect(() => {
    void init();
  }, [init]);

  useEffect(() => {
    if (isPending) return;
    void syncFromCloud(user?.id ?? null);
  }, [isPending, syncFromCloud, user?.id]);

  return null;
}

function RootComponent() {
  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <HeadContent />
        <script dangerouslySetInnerHTML={{ __html: themeBootScript }} />
      </head>
      <body>
        <AppThemeProvider>
          <AuthProvider>
            <LibraryBootstrap />
            <AppShell>
              <Outlet />
            </AppShell>
            <ThemedToaster />
          </AuthProvider>
        </AppThemeProvider>
        <Scripts />
      </body>
    </html>
  );
}
