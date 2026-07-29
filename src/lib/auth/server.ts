/**
 * Self-hosted Better Auth for THIS app (server-only).
 *
 * Pre-wired for live preview + deploy — do not rewrite this file. To enable
 * local email/password, flip the flag in `./email-password` only (see auth skill).
 *
 * The app runs its own Better Auth at `/api/auth/*`, so the session cookie stays
 * on this app's own origin. Sign-in federates to the shared **Grok auth broker**
 * (`GROK_AUTH_ISSUER`) via the `genericOAuth` plugin — the broker brokers the
 * upstream sign-in methods (Google, X, …) and holds their shared secrets; this
 * app only holds its own client id/secret and names the upstream it wants via
 * each provider's `idp` hint.
 *
 * Tri-mode:
 *   - Deployed: the deployer injects a per-app `GROK_AUTH_*` + `BETTER_AUTH_URL`
 *     + `DATABASE_URL`, so real federated auth is persisted in Postgres.
 *   - Sandbox live preview: no injection -> falls back to the shared **preview
 *     client** (`./preview`) and derives the preview's `https://*.grok-sandbox.com`
 *     origin from the request, so real sign-in works (no demo users). Sessions
 *     and identities persist in the embedded PGLite DB (same DB as app data);
 *     the process restart wipes both. Live-preview iframe clients use a bearer
 *     token (partitioned cookies) — see `client.ts`.
 *   - Explicitly off (`VITE_AUTH_ENABLED=false`): no providers; per-user server
 *     functions fall back to a dev user (see `verify.server.ts`).
 *
 * NEVER import this from client code — it pulls in `pg` + the preview secret +
 * server-only Better Auth internals. The client uses `@/lib/auth/client`;
 * components read the user via `@/lib/auth/use-current-user`; server functions get
 * a verified id via `@/lib/auth/middleware`.
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import { tanstackStartCookies } from "better-auth/tanstack-start";
import { getCookie } from "@tanstack/react-start/server";
import { randomBytes } from "node:crypto";
import { Pool } from "pg";
import { ensureDbReady, getPglite } from "../db";
import { emailAndPasswordEnabled } from "./email-password";
import { GROK_PROVIDERS } from "./providers";
import { pgliteDialect } from "./pglite-dialect";
import {
  GROK_ISSUER_DEFAULT,
  PREVIEW_ALLOWED_HOSTS,
  PREVIEW_CLIENT_ID,
  PREVIEW_CLIENT_SECRET,
} from "./preview";

// Kick (and share) PGLite bootstrap as soon as the auth server module loads.
void ensureDbReady();

/**
 * Preview secret must outlive module reloads: PGLite (and its session rows) is
 * stored on `globalThis`, so an HMR re-eval of this file must NOT mint a new
 * signing secret or every existing session becomes invalid mid-dev. Process
 * restart clears both the secret and PGLite together.
 */
const globalAuthRef = globalThis as typeof globalThis & {
  __grokAuthPreviewSecret__?: string;
};
function previewAuthSecret(): string {
  globalAuthRef.__grokAuthPreviewSecret__ ??= randomBytes(32).toString("hex");
  return globalAuthRef.__grokAuthPreviewSecret__;
}

/** Read an env var, treating empty/whitespace as unset. */
const env = (key: string): string | undefined => {
  const value = process.env[key]?.trim();
  return value ? value : undefined;
};

// Explicit off-switch. The deployer sets `VITE_AUTH_ENABLED=true` when it
// provisions auth; set it to "false" to force auth off everywhere (dev user).
const authDisabled = env("VITE_AUTH_ENABLED") === "false";

// Broker federation creds: the deployer injects a per-app client when deployed;
// otherwise fall back to the shared live-preview client, which the broker accepts
// for any `*.grok-sandbox.com` callback (see `./preview`).
const grokIssuer = env("GROK_AUTH_ISSUER") ?? GROK_ISSUER_DEFAULT;
// 正式域（modu.grok.me / *.grok.me）禁止回落到 grok_preview：
// preview 客户端只允许 *.grok-sandbox.com，否则 Invalid redirect URI。
const explicitBase = env("BETTER_AUTH_URL") || "";
const vercelHost =
  env("VERCEL_PROJECT_PRODUCTION_URL") ||
  env("VERCEL_URL") ||
  env("VERCEL_BRANCH_URL") ||
  "";
const looksLikeOfficialHost =
  /modu\.grok\.me/i.test(explicitBase) ||
  /modu\.grok\.me/i.test(vercelHost) ||
  (/\.grok\.me$/i.test(vercelHost.replace(/^https?:\/\//, "").split("/")[0] || "") &&
    !/sandbox/i.test(vercelHost));
const injectedClientId = env("GROK_AUTH_CLIENT_ID");
const injectedClientSecret = env("GROK_AUTH_CLIENT_SECRET");
const grokClientId =
  injectedClientId ||
  (looksLikeOfficialHost ? undefined : PREVIEW_CLIENT_ID);
const grokClientSecret =
  injectedClientSecret ||
  (looksLikeOfficialHost ? undefined : PREVIEW_CLIENT_SECRET);

/** True when federated sign-in is active (real auth is enforced). */
export const authConfigured =
  !authDisabled && Boolean(grokClientId && grokClientSecret);

// This app's own Better Auth origin. When deployed the deployer injects the
// public URL. In the sandbox live preview there's no fixed URL (each preview gets
// a dynamic `*.grok-sandbox.com` host), so we hand Better Auth a dynamic baseURL:
// it derives the origin per-request from the (proxied) host, validated against the
// preview allowlist, which makes the OAuth `redirect_uri` the concrete preview URL
// the broker's preview client accepts.
const explicitBaseURL = env("BETTER_AUTH_URL");
// Explicit `string[]` (not a readonly tuple) — Better Auth's DynamicBaseURLConfig
// requires a mutable `allowedHosts: string[]`.
const previewAllowedHosts: string[] = [...PREVIEW_ALLOWED_HOSTS];
// Local `npm run dev` (port 8080 contract). Browsers may send Origin as any of
// these for the same server — trusting only `localhost` rejects `127.0.0.1` and
// breaks email/password with "Invalid origin".
const LOCAL_DEV_ORIGINS: string[] = [
  "http://localhost:8080",
  "http://127.0.0.1:8080",
  "http://[::1]:8080",
];

// Vercel injects hostnames without scheme (e.g. my-app.vercel.app). Without
// trusting them, deployed email/password hits "Invalid origin" and OAuth
// redirect_uri is wrong when BETTER_AUTH_URL is missing.
// Also trust the Grok Apps host (`*.grok.me`, e.g. https://modu.grok.me).
function deployHosts(): string[] {
  const hosts = new Set<string>();
  const push = (raw?: string) => {
    if (!raw) return;
    const h = raw
      .replace(/^https?:\/\//, "")
      .replace(/\/$/, "")
      .trim();
    if (h) hosts.add(h);
  };
  push(env("VERCEL_URL"));
  push(env("VERCEL_PROJECT_PRODUCTION_URL"));
  push(env("VERCEL_BRANCH_URL"));
  // Host-only form of BETTER_AUTH_URL (when set) so baseURL allowlist matches.
  push(explicitBaseURL);
  // Common platform wildcards
  hosts.add("*.vercel.app");
  hosts.add("*.grok.me");
  hosts.add("modu.grok.me");
  return [...hosts];
}

const deployHostList = deployHosts();

/** Origin strings only (scheme + host). Bare hostnames break Better Auth checks. */
function toOrigins(hosts: string[]): string[] {
  const out = new Set<string>();
  for (const host of hosts) {
    if (!host) continue;
    if (host.startsWith("http://") || host.startsWith("https://")) {
      out.add(host.replace(/\/$/, ""));
      continue;
    }
    if (host.startsWith("*.")) {
      out.add(`https://${host}`);
      out.add(`http://${host}`);
      continue;
    }
    // host only
    out.add(`https://${host}`);
    // local-ish
    if (
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "[::1]" ||
      host.endsWith(".localhost")
    ) {
      out.add(`http://${host}`);
      out.add(`http://${host}:8080`);
    }
  }
  return [...out];
}

const deployOrigins = toOrigins(deployHostList);

const baseURL = explicitBaseURL ?? {
  // Include loopback hosts so dynamic baseURL resolves for local email/password
  // (not only the preview wildcard). Also trust Vercel / Grok Apps hosts.
  allowedHosts: [
    ...previewAllowedHosts,
    ...deployHostList,
    "localhost",
    "127.0.0.1",
    "[::1]",
  ],
  // `auto` → trust both http:// and https:// expansions of allowedHosts
  // (preview is https; local dev is http).
  protocol: "auto" as const,
  fallback: "http://localhost:8080",
};

// Origins Better Auth accepts on credentialed POSTs (sign-up/sign-in, etc.).
// Missing entries here surface as FORBIDDEN "Invalid origin".
// Always include Grok Apps + Vercel hosts even when BETTER_AUTH_URL is set, so a
// slight URL mismatch (www / trailing slash) does not hard-break login.
const trustedOrigins: string[] = [
  ...(explicitBaseURL ? [explicitBaseURL.replace(/\/$/, "")] : []),
  ...toOrigins(previewAllowedHosts),
  ...deployOrigins,
  ...LOCAL_DEV_ORIGINS,
  // 保险：正式域名
  "https://modu.grok.me",
];

const databaseUrl = env("DATABASE_URL");

// Static broker OAuth endpoints (skip OIDC discovery on every sign-in / callback).
// Discovery would cost an extra network hop to the broker before the popup can
// even redirect to Google/X — the live-preview popup felt stuck on the app for
// that whole round-trip. These paths match the broker's discovery document.
const issuerBase = grokIssuer.replace(/\/+$/, "");
const grokAuthorizationUrl = `${issuerBase}/api/auth/oauth2/authorize`;
const grokTokenUrl = `${issuerBase}/api/auth/oauth2/token`;
const grokUserInfoUrl = `${issuerBase}/api/auth/oauth2/userinfo`;

// Real Postgres when `DATABASE_URL` is set (deployed apps), else the app's
// embedded PGLite (preview) via a Kysely dialect — so Better Auth persists to the
// SAME DB as app data, including email/password users. Both use the Better Auth
// schema from `migrations/0001_auth.sql`.
const database = databaseUrl
  ? new Pool({ connectionString: databaseUrl })
  : { dialect: pgliteDialect(() => getPglite()), type: "postgres" as const };

/** Session token cookie name — also read by the live-preview popup completion page. */
export const SESSION_TOKEN_COOKIE = "__Host-grok-auth.session_token";

// Built separately so the `betterAuth({...})` call stays easy to edit without
// breaking brackets (models often trip on the conditional plugin spread).
const grokOAuthPlugin = authConfigured
  ? genericOAuth({
      config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
        providerId,
        clientId: grokClientId as string,
        clientSecret: grokClientSecret as string,
        // Prefer static endpoints over `discoveryUrl` so initiating (and
        // completing) OAuth does not wait on a broker discovery fetch.
        authorizationUrl: grokAuthorizationUrl,
        tokenUrl: grokTokenUrl,
        userInfoUrl: grokUserInfoUrl,
        scopes: ["openid", "profile", "email"],
        // `prompt: "login"` forces the broker to re-authenticate against the
        // upstream on every sign-in instead of silently reusing an existing
        // broker session. Combined with the broker sending Google
        // `prompt=select_account`, this makes "Sign in with Google" always show
        // an account picker — without it, a second click (or a different
        // provider after Google) completes in the background with no UI.
        // `access_type: "offline"` is required for Google refresh tokens.
        // `idp` is the app-builder extension the broker uses to pick Google/X/…
        authorizationUrlParams: {
          access_type: "offline",
          prompt: "login",
          idp,
        },
      })),
    })
  : null;

export const auth = betterAuth({
  appName: "墨读",
  secret: env("BETTER_AUTH_SECRET") ?? previewAuthSecret(),
  baseURL,
  trustedOrigins,
  database,
  emailAndPassword: {
    enabled: emailAndPasswordEnabled,
    minPasswordLength: 8,
  },
  session: {
    // 7 days — matches product expectation for a reading app
    expiresIn: 60 * 60 * 24 * 7,
    updateAge: 60 * 60 * 24,
    cookieCache: {
      enabled: true,
      maxAge: 60 * 5,
    },
  },
  advanced: {
    useSecureCookies: true,
    // __Host- prefix requires Secure + Path=/ + no Domain
    cookiePrefix: "grok-auth",
  },
  plugins: [
    bearer(),
    tanstackStartCookies(),
    ...(grokOAuthPlugin ? [grokOAuthPlugin] : []),
  ],
});

/**
 * Read the raw session token cookie (for popup completion page).
 * Prefer `auth.api.getSession` for normal server-side checks.
 */
export function readSessionTokenCookie(): string | undefined {
  try {
    return getCookie(SESSION_TOKEN_COOKIE) ?? undefined;
  } catch {
    return undefined;
  }
}
