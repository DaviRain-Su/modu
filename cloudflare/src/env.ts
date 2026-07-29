export interface Env {
  BOOKS: R2Bucket;
  AI: Ai;
  DB: D1Database;
  ALLOWED_ORIGINS: string;
  APP_ORIGIN: string;
  MODU_API_SECRET: string;
  BETTER_AUTH_SECRET: string;
  AI_MODEL?: string;
  AI_GATEWAY_ID?: string;
  GROK_AUTH_ISSUER?: string;
  GROK_AUTH_CLIENT_ID?: string;
  GROK_AUTH_CLIENT_SECRET?: string;
}

export function parseAllowedOrigins(env: Env): string[] {
  const list = (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
  const app = (env.APP_ORIGIN || "").trim();
  if (app && !list.includes(app)) list.push(app);
  return list;
}

export function corsHeaders(env: Env, request: Request): Record<string, string> {
  const origin = request.headers.get("Origin") || "";
  const allowed = parseAllowedOrigins(env);
  const ok =
    !origin ||
    allowed.includes("*") ||
    allowed.includes(origin) ||
    allowed.some((a) => a.startsWith("*.") && origin.endsWith(a.slice(1)));
  return {
    "access-control-allow-origin": ok ? origin || "*" : allowed[0] || "*",
    "access-control-allow-methods": "GET,POST,PUT,DELETE,OPTIONS",
    "access-control-allow-headers":
      "content-type,authorization,x-modu-secret,cookie",
    "access-control-allow-credentials": "true",
    "access-control-expose-headers": "set-auth-token,set-cookie",
    "access-control-max-age": "86400",
    vary: "Origin",
  };
}

export function assertSecret(env: Env, request: Request): boolean {
  const expected = (env.MODU_API_SECRET || "").trim();
  if (!expected) return false;
  const got =
    request.headers.get("x-modu-secret") ||
    request.headers.get("authorization")?.replace(/^Bearer\s+/i, "") ||
    "";
  return got === expected;
}

export function appOrigin(env: Env): string {
  return (env.APP_ORIGIN || "https://modu.grok.me").replace(/\/$/, "");
}
