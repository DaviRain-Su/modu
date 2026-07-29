import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import {
  cloudflareAuthBackendConfigured,
  proxyAuthToCloudflare,
} from "@/lib/cloudflare/auth-proxy";

/**
 * Better Auth HTTP surface.
 *
 * Google / X 必须走主应用 Better Auth（平台注入的 GROK_AUTH_CLIENT_*）。
 * Worker 上的 grok_preview 只允许 *.grok-sandbox.com，正式域 modu.grok.me
 * 会报 Invalid redirect URI。
 *
 * 仅当显式 MODU_CF_AUTH_ON_WORKER=true（且 Worker 已配正式 GROK_AUTH secrets）
 * 时才把登录整站反代到 D1。
 */
async function handle({ request }: { request: Request }) {
  const path = new URL(request.url).pathname;
  // OAuth 相关路径永远不反代到 Worker preview
  const isOAuthPath =
    path.includes("/oauth2") ||
    path.includes("/callback/") ||
    path.includes("/sign-in/social") ||
    path.includes("/sign-in/oauth");

  if (isOAuthPath) {
    return auth.handler(request);
  }

  // 非 OAuth：仅显式开启时走 Worker D1
  if (cloudflareAuthBackendConfigured()) {
    return proxyAuthToCloudflare(request);
  }

  return auth.handler(request);
}

export const Route = createFileRoute("/api/auth/$")({
  server: {
    handlers: {
      GET: handle,
      POST: handle,
    },
  },
});
