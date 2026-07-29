import { createServerFn } from "@tanstack/react-start";
import { dbSource } from "@/lib/db";
import { authConfigured } from "@/lib/auth/server";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import {
  cfWorkerHealth,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";

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
    const workerConfigured = cloudflareWorkerConfigured();
    let workerReachable = false;
    let workerDetail: string | null = null;
    if (workerConfigured) {
      const h = await cfWorkerHealth();
      workerReachable = h.ok;
      workerDetail = h.detail;
    }

    const persistentDb = dbSource === "neon";

    return {
      ok: true as const,
      database: dbSource,
      persistentDatabase: persistentDb,
      emailPasswordEnabled: emailAndPasswordEnabled as boolean,
      federatedAuthConfigured: authConfigured,
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
        configured: workerConfigured,
        reachable: workerReachable,
        detail: workerDetail,
      },
      aiGatewayConfigured: has("AI_GATEWAY_ID"),
      loginReady: persistentDb || process.env.NODE_ENV !== "production",
      notes: [
        !persistentDb
          ? "数据库仍是内存 PGLite：正式登录请配置 DATABASE_URL（Neon）。"
          : "已连接持久数据库。",
        !grokAuthCustom
          ? "Google / X：预览客户端仅沙箱可靠；正式域需 GROK_AUTH_CLIENT_ID/SECRET。"
          : "已配置正式 Google / X OAuth 客户端。",
        workerConfigured
          ? workerReachable
            ? "Cloudflare Worker 已连通（R2 / Workers AI）。"
            : "已配置 MODU_CF_API_URL，但 Worker 暂不可达（检查 wrangler dev / 部署）。"
          : "未配置独立 CF Worker：设置 MODU_CF_API_URL + MODU_CF_API_SECRET。",
        !cloudflareAiRest && !workerReachable
          ? "官方 AI 将使用本地伴读降级，直到 Worker 或 CF 密钥就绪。"
          : "官方 AI 通道可用。",
      ],
    };
  },
);
