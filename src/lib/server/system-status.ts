import { createServerFn } from "@tanstack/react-start";
import { dbSource } from "@/lib/db";
import { authConfigured } from "@/lib/auth/server";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import {
  cfWorkerHealth,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";
import { cloudflareAuthBackendConfigured } from "@/lib/cloudflare/auth-proxy";

/**
 * Public deployment diagnostics — no secrets.
 */
export const getSystemStatus = createServerFn({ method: "GET" }).handler(
  async () => {
    const has = (k: string) => Boolean(process.env[k]?.trim());
    const betterAuthUrl = process.env.BETTER_AUTH_URL?.trim() || null;
    const vercelUrl = process.env.VERCEL_URL?.trim() || null;
    const r2Public = Boolean(
      process.env.VITE_R2_PUBLIC_URL?.trim() ||
        process.env.R2_PUBLIC_URL?.trim(),
    );
    const cloudflareAiRest =
      has("CLOUDFLARE_ACCOUNT_ID") &&
      (has("CLOUDFLARE_API_KEY") || has("CF_API_TOKEN"));
    const grokAuthCustom =
      has("GROK_AUTH_CLIENT_ID") && has("GROK_AUTH_CLIENT_SECRET");
    const cfAuth = cloudflareAuthBackendConfigured();
    const workerConfigured = cloudflareWorkerConfigured() || cfAuth;
    let workerReachable = false;
    let workerDetail: string | null = null;
    if (workerConfigured || cfAuth) {
      const h = await cfWorkerHealth();
      workerReachable = h.ok;
      workerDetail = h.detail;
    }

    const persistentDb = cfAuth || dbSource === "neon";

    return {
      ok: true as const,
      database: cfAuth ? "cloudflare-d1" : dbSource,
      persistentDatabase: persistentDb,
      authBackend: cfAuth
        ? "cloudflare-worker"
        : dbSource === "neon"
          ? "neon"
          : "pglite",
      emailPasswordEnabled: emailAndPasswordEnabled as boolean,
      federatedAuthConfigured: authConfigured || cfAuth,
      loginMethods: [
        { id: "google", label: "Google" },
        { id: "x", label: "X" },
        { id: "email", label: "邮箱" },
      ],
      grokAuthCustom,
      betterAuthUrlSet: Boolean(betterAuthUrl),
      vercelUrl,
      r2Configured: r2Public || workerConfigured,
      cloudflareAiConfigured: cloudflareAiRest || workerReachable,
      cloudflareWorker: {
        configured: Boolean(process.env.MODU_CF_API_URL?.trim()),
        reachable: workerReachable,
        authOnD1: cfAuth,
        detail: workerDetail,
      },
      aiGatewayConfigured: has("AI_GATEWAY_ID"),
      loginReady: persistentDb || process.env.NODE_ENV !== "production",
      notes: [
        cfAuth
          ? workerReachable
            ? "登录已接到 Cloudflare Worker + D1（账号会持久保存）。"
            : "已配置 MODU_CF_API_URL，但 Worker 不可达 — 请确认 wrangler deploy 与密钥。"
          : "未配置 Cloudflare 后端：设置 MODU_CF_API_URL 后登录将写入 D1。",
        !persistentDb
          ? "当前无持久库：正式站请部署 Cloudflare Worker（推荐）或 DATABASE_URL。"
          : "持久存储已就绪。",
        !grokAuthCustom
          ? "Google / X：正式域需 GROK_AUTH_CLIENT_ID/SECRET（可写入 Worker secret）。"
          : "已配置 Google / X OAuth。",
        !cloudflareAiRest && !workerReachable
          ? "官方 AI 将本地降级，直到 Worker 或 CF 密钥就绪。"
          : "官方 AI 通道可用。",
      ],
    };
  },
);
