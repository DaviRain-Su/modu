/**
 * Better Auth on Cloudflare D1 — 持久登录（Google / X / 邮箱）。
 * 主应用通过 /api/auth/* 反代到本 Worker，cookie 仍落在 APP_ORIGIN。
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import type { Env } from "./env";
import { appOrigin, parseAllowedOrigins } from "./env";

const GROK_PROVIDERS = [
  { providerId: "grok-google", idp: "google" },
  { providerId: "grok-x", idp: "twitter" },
] as const;

const GROK_ISSUER_DEFAULT = "https://auth.grok.me";
const PREVIEW_CLIENT_ID = "grok_preview";
const PREVIEW_CLIENT_SECRET =
  "8bcdb7fc5a33874ad933ca568918d5790388a0795e44c4d1dea691f801b17ec5";

export function createAuth(env: Env) {
  const origin = appOrigin(env);
  const issuer = (env.GROK_AUTH_ISSUER || GROK_ISSUER_DEFAULT).replace(
    /\/+$/,
    "",
  );
  const clientId = env.GROK_AUTH_CLIENT_ID || PREVIEW_CLIENT_ID;
  const clientSecret = env.GROK_AUTH_CLIENT_SECRET || PREVIEW_CLIENT_SECRET;
  const secret =
    env.BETTER_AUTH_SECRET ||
    env.MODU_API_SECRET ||
    "modu-cf-dev-secret-change-me";

  const trusted = [
    origin,
    ...parseAllowedOrigins(env),
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://*.grok.me",
    "https://*.grok-sandbox.com",
  ];

  return betterAuth({
    baseURL: origin,
    secret,
    database: env.DB,
    trustedOrigins: trusted,
    emailAndPassword: { enabled: true },
    account: {
      encryptOAuthTokens: true,
      accountLinking: {
        enabled: true,
        trustedProviders: GROK_PROVIDERS.map((p) => p.providerId),
        requireLocalEmailVerified: false,
      },
    },
    session: { cookieCache: { enabled: true, maxAge: 300 } },
    advanced: {
      useSecureCookies: false,
      defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
      cookies: {
        session_token: { name: "__Host-grok-auth.session_token" },
        session_data: { name: "__Host-grok-auth.session_data" },
        account_data: { name: "__Host-grok-auth.account_data" },
        dont_remember: { name: "__Host-grok-auth.dont_remember" },
      },
    },
    plugins: [
      genericOAuth({
        config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
          providerId,
          clientId,
          clientSecret,
          authorizationUrl: `${issuer}/api/auth/oauth2/authorize`,
          tokenUrl: `${issuer}/api/auth/oauth2/token`,
          userInfoUrl: `${issuer}/api/auth/oauth2/userinfo`,
          scopes: ["openid", "profile", "email"],
          authorizationUrlParams: { idp, prompt: "login" },
        })),
      }),
      bearer(),
    ],
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
