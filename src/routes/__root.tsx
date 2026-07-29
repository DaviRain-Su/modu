import { useEffect } from "react";
import {
  createRootRoute,
  HeadContent,
  Outlet,
  Scripts,
} from "@tanstack/react-router";
import { Toaster } from "sonner";
import { AppShell } from "@/components/layout/AppShell";
import { useLibraryStore } from "@/lib/store/library";
import appCss from "../styles.css?url";

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
          "墨读 — 支持 PDF / EPUB 的在线阅读器，书城精选、本地上传、AI 伴读，手机与电脑皆宜。",
      },
      { name: "theme-color", content: "#0b0b0c" },
    ],
    links: [{ rel: "stylesheet", href: appCss }],
  }),
  component: RootComponent,
});

function RootComponent() {
  const init = useLibraryStore((s) => s.init);

  useEffect(() => {
    void init();
  }, [init]);

  return (
    <html lang="zh-CN" suppressHydrationWarning>
      <head>
        <HeadContent />
      </head>
      <body>
        <AppShell>
          <Outlet />
        </AppShell>
        <Toaster
          theme="dark"
          position="top-center"
          toastOptions={{
            className: "border border-border bg-bg-elevated text-fg",
          }}
        />
        <Scripts />
      </body>
    </html>
  );
}
