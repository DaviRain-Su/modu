/**
 * Worker 运行时 Env —— 与 wrangler.toml 绑定一一对应。
 * 主应用通过 MODU_CF_API_URL + MODU_API_SECRET 调用。
 *
 * 若本机未装 @cloudflare/workers-types，用最小桩类型通过检查。
 */

export interface R2ObjectBody {
  body: ReadableStream | null;
  httpEtag: string;
  httpMetadata?: { contentType?: string };
}

export interface R2BucketLike {
  get(key: string): Promise<R2ObjectBody | null>;
  put(
    key: string,
    value: ArrayBuffer | ArrayBufferView | string | ReadableStream,
    options?: { httpMetadata?: { contentType?: string } },
  ): Promise<unknown>;
  delete(key: string): Promise<void>;
  list(opts?: { prefix?: string; limit?: number }): Promise<{
    objects: { key: string; size: number; uploaded?: Date }[];
    truncated: boolean;
  }>;
}

export interface AiLike {
  run(model: string, input: unknown): Promise<unknown>;
}

export interface Env {
  BOOKS: R2BucketLike;
  AI: AiLike;
  DB?: unknown;
  ALLOWED_ORIGINS: string;
  MODU_API_SECRET: string;
  AI_MODEL?: string;
  AI_GATEWAY_ID?: string;
}

export function parseAllowedOrigins(env: Env): string[] {
  return (env.ALLOWED_ORIGINS || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);
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
      "content-type,authorization,x-modu-secret",
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
