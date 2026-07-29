import { createFileRoute } from "@tanstack/react-router";
import { dbSource } from "@/lib/db";
import { authConfigured } from "@/lib/auth/server";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import {
  cfWorkerHealth,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";
import { cloudflareAuthBackendConfigured } from "@/lib/cloudflare/auth-proxy";
import {
  resolveCfApiUrl,
  resolveBetterAuthUrl,
} from "@/lib/cloudflare/defaults";
import { LOGIN_METHODS } from "@/lib/env/contract";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const has = (k: string) => Boolean(process.env[k]?.trim());
        const cfUrl = resolveCfApiUrl();
        const cfAuth = cloudflareAuthBackendConfigured();
        const worker =
          cloudflareWorkerConfigured() || cfAuth
            ? await cfWorkerHealth()
            : { ok: false, detail: null, url: null };
        const appDataStore = dbSource;
        const authStore = cfAuth
          ? "cloudflare-d1"
          : dbSource === "neon"
            ? "neon"
            : "pglite";
        const body = {
          ok: true,
          service: "modu",
          time: new Date().toISOString(),
          authStore,
          appDataStore,
          objectStore:
            worker.ok ||
            Boolean(
              process.env.VITE_R2_PUBLIC_URL?.trim() ||
                process.env.R2_PUBLIC_URL?.trim(),
            )
              ? "cloudflare-r2"
              : "indexeddb-local",
          /** @deprecated use authStore / appDataStore */
          database: appDataStore,
          persistentDatabase: appDataStore === "neon",
          persistentAuth: cfAuth || appDataStore === "neon",
          authBackend: cfAuth ? "cloudflare-worker" : authStore,
          login: {
            methods: LOGIN_METHODS.map((m) => m.id),
            emailPassword: emailAndPasswordEnabled,
            federated: authConfigured || cfAuth,
            betterAuthUrl: Boolean(
              process.env.BETTER_AUTH_URL?.trim() || resolveBetterAuthUrl(),
            ),
            grokClient: has("GROK_AUTH_CLIENT_ID"),
            cloudflareD1: cfAuth,
          },
          cloudflare: {
            workerUrl: Boolean(cfUrl),
            workerUrlValue: cfUrl,
            workerUrlFromEnv: Boolean(process.env.MODU_CF_API_URL?.trim()),
            workerUrlAuto: Boolean(
              cfUrl && !process.env.MODU_CF_API_URL?.trim(),
            ),
            workerReachable: worker.ok,
            authOnWorker: cfAuth,
            r2:
              Boolean(
                process.env.VITE_R2_PUBLIC_URL?.trim() ||
                  process.env.R2_PUBLIC_URL?.trim(),
              ) || worker.ok,
            workersAi:
              worker.ok ||
              (has("CLOUDFLARE_ACCOUNT_ID") &&
                (has("CLOUDFLARE_API_KEY") || has("CF_API_TOKEN"))),
            aiGateway: has("AI_GATEWAY_ID"),
            detail: worker.detail,
          },
          tip: cfAuth
            ? worker.ok
              ? "登录走 Cloudflare D1。Worker 须配置 GROK_AUTH_CLIENT_ID/SECRET，否则 Google/X 会 Invalid redirect URI。"
              : "已配置 Worker 登录但健康检查失败。"
            : "Google/X 走主应用 OAuth（平台 GROK_AUTH）。Worker 仅用于 R2/AI（自动连）。D1 登录需 MODU_CF_API_SECRET 或 MODU_CF_AUTH_ON_WORKER=true。",
        };
        return new Response(JSON.stringify(body, null, 2), {
          status: 200,
          headers: {
            "content-type": "application/json; charset=utf-8",
            "cache-control": "no-store",
          },
        });
      },
    },
  },
});
