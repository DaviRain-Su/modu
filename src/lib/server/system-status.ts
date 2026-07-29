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

    const appDataStore = dbSource;
    const authStore = cfAuth
      ? "cloudflare-d1"
      : dbSource === "neon"
        ? "neon"
        : "pglite";
    const objectStore =
      workerReachable || r2Public
        ? "cloudflare-r2"
        : "indexeddb-local";
    const persistentAppData = appDataStore === "neon";
    const persistentAuth = cfAuth || appDataStore === "neon";

    return {
      ok: true as const,
      /** @deprecated use authStore / appDataStore / objectStore */
      database: appDataStore,
      authStore,
      appDataStore,
      objectStore,
      persistentDatabase: persistentAppData,
      persistentAuth,
      authBackend: cfAuth ? "cloudflare-worker" : authStore,
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
      loginReady: persistentAuth || process.env.NODE_ENV !== "production",
      notes: [
        cfAuth
          ? workerReachable
            ? "登录已接到 Cloudflare Worker + D1（会话持久）。"
            : "已配置 MODU_CF_API_URL，但 Worker 不可达 — 请确认 wrangler deploy 与密钥。"
          : "登录使用主应用 Better Auth（Neon 或预览 PGLite）。",
        persistentAppData
          ? "业务数据（资料 / 批注 / AI 对话 / 书架元数据）在 Neon。"
          : "业务数据当前在预览 PGLite（重启会清空）。部署请配置 DATABASE_URL。",
        objectStore === "cloudflare-r2"
          ? "图书对象存储可用（R2 / Worker）。"
          : "图书文件目前仅本机 IndexedDB；配置 Worker 后可写 R2。",
        !grokAuthCustom
          ? "Google / X：正式域需 GROK_AUTH_CLIENT_ID/SECRET。"
          : "已配置 Google / X OAuth。",
        !cloudflareAiRest && !workerReachable
          ? "官方 AI 将本地降级，直到 Worker 或 CF 密钥就绪。"
          : "官方 AI 通道可用。",
      ],
    };
  },
);
