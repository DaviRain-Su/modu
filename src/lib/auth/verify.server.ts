import { getRequest } from "@tanstack/react-start/server";
import { auth, authConfigured } from "./server";
import {
  cloudflareAuthBackendConfigured,
  cloudflareAuthBase,
} from "@/lib/cloudflare/auth-proxy";

/**
 * Server-side session resolution (server-only).
 *
 * Default: local Better Auth (PGLite / Neon).
 * When MODU_CF_API_URL is set: the same-origin `/api/auth/*` surface proxies to
 * Cloudflare Worker/D1, so session verification also goes there — never mix the
 * two stores for identity.
 */

/** True when a real database is configured server-side. */
const databaseConfigured = Boolean(process.env.DATABASE_URL?.trim());

/** Re-export so callers can branch on it without importing `server.ts`. */
export { authConfigured };

if (databaseConfigured && !authConfigured) {
  console.error(
    "[auth] DATABASE_URL is set but auth is disabled (VITE_AUTH_ENABLED=false) " +
      "— requireUserId() will reject every request (fail closed) rather than " +
      "share one dev user on a real database.",
  );
}

/** Dev fallback user id, used only when auth is disabled (VITE_AUTH_ENABLED=false). */
export const DEV_USER_ID = "dev-user";

/**
 * Thrown by `requireUserId` when the caller has no valid session. Carries
 * `status: 401`; the message is a stable contract — match
 * `err.message === "Unauthorized"` client-side to send the visitor to sign-in.
 */
export class UnauthorizedError extends Error {
  readonly status = 401;
  constructor() {
    super("Unauthorized");
    this.name = "UnauthorizedError";
  }
}

export type VerifiedUser = { id: string; email: string | null };

function withBearer(headers: Headers, bearerToken?: string): Headers {
  if (!bearerToken) return headers;
  const next = new Headers(headers);
  next.set("Authorization", `Bearer ${bearerToken}`);
  return next;
}

async function getCloudflareSessionUser(
  request: Request,
  bearerToken?: string,
): Promise<VerifiedUser | null> {
  const base = cloudflareAuthBase();
  if (!base) return null;

  const headers = new Headers();
  const pass = [
    "cookie",
    "authorization",
    "origin",
    "referer",
    "user-agent",
    "x-forwarded-for",
    "x-forwarded-host",
    "x-forwarded-proto",
    "x-real-ip",
  ];
  for (const name of pass) {
    const value = request.headers.get(name);
    if (value) headers.set(name, value);
  }
  if (bearerToken) headers.set("Authorization", `Bearer ${bearerToken}`);
  const secret = process.env.MODU_CF_API_SECRET?.trim();
  if (secret) headers.set("x-modu-secret", secret);

  try {
    const res = await fetch(`${base}/api/auth/get-session`, {
      method: "GET",
      headers,
      signal: AbortSignal.timeout(8000),
    });
    if (!res.ok) return null;
    const body = (await res.json().catch(() => null)) as {
      user?: { id?: string; email?: string | null };
      session?: { user?: { id?: string; email?: string | null } };
    } | null;
    const user = body?.user ?? body?.session?.user;
    if (!user?.id) return null;
    return { id: user.id, email: user.email ?? null };
  } catch (error) {
    console.warn("[auth] Cloudflare session lookup failed", error);
    return null;
  }
}

/**
 * Resolve the signed-in user from the current request, or `null` when auth isn't
 * configured / nobody is signed in. Safe to call from server functions and SSR
 * loaders.
 *
 * `bearerToken` is for the LIVE PREVIEW: the app runs in a partitioned iframe
 * whose cookies don't reach the server, so `authMiddleware` forwards the session
 * as a bearer token, which we present as `Authorization: Bearer …` (the `bearer`
 * plugin resolves it). When deployed no token is passed and the cookie is used.
 */
export async function getSessionUser(
  bearerToken?: string,
): Promise<VerifiedUser | null> {
  if (!authConfigured && !cloudflareAuthBackendConfigured()) return null;
  const request = getRequest();
  if (!request) return null;

  if (cloudflareAuthBackendConfigured()) {
    return getCloudflareSessionUser(request, bearerToken);
  }

  const headers = withBearer(request.headers, bearerToken);
  const session = await auth.api.getSession({ headers });
  if (!session?.user) return null;
  return { id: session.user.id, email: session.user.email ?? null };
}

/**
 * Resolve the current user id for a server function, or throw when unauthorized.
 * Prefer `authMiddleware` (`./middleware`), which calls this for you.
 * - Auth enabled (default) -> the verified session user id; throws
 *   `UnauthorizedError` when signed out. Works in the sandbox preview too (real
 *   sign-in via the baked preview client).
 * - Auth disabled (`VITE_AUTH_ENABLED=false`) + `DATABASE_URL` set -> throw (fail
 *   closed): one shared dev user on a real database would let every visitor
 *   read/write everyone's rows.
 * - Auth disabled + no database -> the shared dev user id.
 */
export async function requireUserId(bearerToken?: string): Promise<string> {
  if (!authConfigured && !cloudflareAuthBackendConfigured()) {
    if (databaseConfigured) {
      throw new Error(
        "Auth is disabled (VITE_AUTH_ENABLED=false) but DATABASE_URL is set — " +
          "refusing to fall back to the shared dev user against a real database.",
      );
    }
    return DEV_USER_ID;
  }
  const user = await getSessionUser(bearerToken);
  if (!user) throw new UnauthorizedError();
  return user.id;
}
