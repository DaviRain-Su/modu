import { createFileRoute } from "@tanstack/react-router";
import { dbSource } from "@/lib/db";
import { authConfigured } from "@/lib/auth/server";
import { emailAndPasswordEnabled } from "@/lib/auth/email-password";
import {
  cfWorkerHealth,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";
import { cloudflareAuthBackendConfigured } from "@/lib/cloudflare/auth-proxy";
import { LOGIN_METHODS } from "@/lib/env/contract";

export const Route = createFileRoute("/api/health")({
  server: {
    handlers: {
      GET: async () => {
        const has = (k: string) => Boolean(process.env[k]?.trim());
        const cfAuth = cloudflareAuthBackendConfigured();
        const worker =
          cloudflareWorkerConfigured() || cfAuth
            ? await cfWorkerHealth()
            : { ok: false, detail: null };
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
            betterAuthUrl: Boolean(process.env.BETTER_AUTH_URL?.trim()),
            grokClient: has("GROK_AUTH_CLIENT_ID"),
            cloudflareD1: cfAuth,
          },
          cloudflare: {
            workerUrl: Boolean(process.env.MODU_CF_API_URL?.trim()),
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
