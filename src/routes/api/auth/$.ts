import { createFileRoute } from "@tanstack/react-router";
import { auth } from "@/lib/auth/server";
import {
  cloudflareAuthBackendConfigured,
  proxyAuthToCloudflare,
} from "@/lib/cloudflare/auth-proxy";

/**
 * Better Auth HTTP surface.
 *
 * - Default: this app's Better Auth (PGLite / Neon)
 * - When MODU_CF_API_URL is set: proxy to Cloudflare Worker (D1 持久登录)
 */
async function handle({ request }: { request: Request }) {
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
