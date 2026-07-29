/**
 * 墨读 Cloudflare Worker — 正式后端
 *
 * - /api/auth/*     Better Auth + D1（登录持久化）
 * - /health
 * - /ai/chat        Workers AI
 * - /storage/*      R2（需密钥或签名 ticket）
 * - /v1/*           业务 API（档案 / 存储 ticket）
 */

import { createAuth } from "./auth";
import {
  type Env,
  assertSecret,
  corsHeaders,
  appOrigin,
} from "./env";

const encoder = new TextEncoder();

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const cors = corsHeaders(env, request);
    if (request.method === "OPTIONS") {
      return new Response(null, { status: 204, headers: cors });
    }

    const url = new URL(request.url);
    const path = url.pathname.replace(/\/+$/, "") || "/";

    try {
      // ── Auth (Better Auth on D1) ──────────────────────────────────
      if (path === "/api/auth" || path.startsWith("/api/auth/")) {
        if (!env.DB) {
          return json({ error: "D1 binding missing" }, cors, 503);
        }
        const auth = createAuth(env);
        const res = await auth.handler(request);
        return withCors(res, cors);
      }

      if (path === "/health" || path === "/") {
        let d1ok = false;
        try {
          if (env.DB) {
            await env.DB.prepare("select 1 as x").first();
            d1ok = true;
          }
        } catch {
          d1ok = false;
        }
        return json(
          {
            ok: true,
            service: "modu-cloudflare",
            appOrigin: appOrigin(env),
            d1: d1ok,
            r2: Boolean(env.BOOKS),
            ai: Boolean(env.AI),
            model: env.AI_MODEL || "@cf/qwen/qwen3-30b-a3b-fp8",
            auth: true,
            time: new Date().toISOString(),
          },
          cors,
        );
      }

      if (path === "/ai/chat" && request.method === "POST") {
        if (!assertSecret(env, request)) {
          return json({ error: "unauthorized" }, cors, 401);
        }
        return await handleAiChat(request, env, cors);
      }

      if (path === "/v1/storage/ticket" && request.method === "POST") {
        if (!assertSecret(env, request)) {
          return json({ error: "unauthorized" }, cors, 401);
        }
        return await createStorageTicket(request, env, cors, url);
      }

      if (path.startsWith("/storage")) {
        return await handleStorage(request, env, cors, path, url);
      }

      // 业务：确保用户档案行存在
      if (path === "/v1/profile/ensure" && request.method === "POST") {
        if (!assertSecret(env, request)) {
          return json({ error: "unauthorized" }, cors, 401);
        }
        return await ensureProfile(request, env, cors);
      }

      return json({ error: "not found", path }, cors, 404);
    } catch (e) {
      const message = e instanceof Error ? e.message : "internal error";
      console.error("[modu-api]", message, e);
      return json({ error: message }, cors, 500);
    }
  },
};

function withCors(res: Response, cors: Record<string, string>): Response {
  const headers = new Headers(res.headers);
  for (const [k, v] of Object.entries(cors)) {
    if (!headers.has(k)) headers.set(k, v);
  }
  return new Response(res.body, {
    status: res.status,
    statusText: res.statusText,
    headers,
  });
}

async function ensureProfile(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as {
    userId?: string;
    displayName?: string;
  };
  if (!body.userId) return json({ error: "userId required" }, cors, 400);
  await env.DB.prepare(
    `insert into user_profiles (user_id, display_name) values (?, ?)
     on conflict(user_id) do update set
       display_name = coalesce(excluded.display_name, user_profiles.display_name),
       updated_at = datetime('now')`,
  )
    .bind(body.userId, body.displayName || null)
    .run();
  await env.DB.prepare(
    `insert into user_subscriptions (user_id, plan, status) values (?, 'free', 'active')
     on conflict(user_id) do nothing`,
  )
    .bind(body.userId)
    .run();
  await env.DB.prepare(
    `insert into user_ai_settings (user_id, provider) values (?, 'official')
     on conflict(user_id) do nothing`,
  )
    .bind(body.userId)
    .run();
  return json({ ok: true }, cors);
}

async function handleAiChat(
  request: Request,
  env: Env,
  cors: Record<string, string>,
): Promise<Response> {
  if (!env.AI) return json({ error: "AI binding missing" }, cors, 503);
  const body = (await request.json().catch(() => ({}))) as {
    messages?: { role: string; content: string }[];
    system?: string;
    model?: string;
    max_tokens?: number;
  };
  const messages = body.messages ?? [];
  if (!messages.length) return json({ error: "messages required" }, cors, 400);
  const model = body.model || env.AI_MODEL || "@cf/qwen/qwen3-30b-a3b-fp8";
  const payload = {
    messages: body.system
      ? [{ role: "system", content: body.system }, ...messages]
      : messages,
    max_tokens: body.max_tokens ?? 900,
  };
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const result: unknown = await (env.AI as any).run(model, payload);
  const text = extractWorkersAiText(result);
  return json({ text, model, provider: "workers-ai" }, cors);
}

function extractWorkersAiText(result: unknown): string {
  if (!result) return "";
  if (typeof result === "string") return result.trim();
  const r = result as Record<string, unknown>;
  if (typeof r.response === "string") return r.response.trim();
  if (typeof r.result === "string") return String(r.result).trim();
  if (r.result && typeof r.result === "object") {
    const inner = r.result as Record<string, unknown>;
    if (typeof inner.response === "string") return inner.response.trim();
  }
  const choices = r.choices as { message?: { content?: string } }[] | undefined;
  if (choices?.[0]?.message?.content) {
    return String(choices[0].message.content).trim();
  }
  return JSON.stringify(result).slice(0, 2000);
}

async function createStorageTicket(
  request: Request,
  env: Env,
  cors: Record<string, string>,
  url: URL,
): Promise<Response> {
  const body = (await request.json().catch(() => ({}))) as {
    key?: string;
    method?: string;
    expiresInSeconds?: number;
  };
  const key = sanitizeKey(body.key || "");
  const method = (body.method || "GET").toUpperCase();
  if (!key) return json({ error: "invalid key" }, cors, 400);
  if (!["GET", "PUT", "DELETE"].includes(method)) {
    return json({ error: "invalid method" }, cors, 400);
  }
  const expiresIn = Math.min(
    Math.max(Number(body.expiresInSeconds) || 600, 30),
    3600,
  );
  const exp = Math.floor(Date.now() / 1000) + expiresIn;
  const token = await signTicket(env, method, key, exp);
  const ticketUrl = new URL(`/storage/${encodeURIComponent(key).replace(/%2F/g, "/")}`, url.origin);
  // Keep path segments encoded individually
  ticketUrl.pathname = `/storage/${key
    .split("/")
    .map(encodeURIComponent)
    .join("/")}`;
  ticketUrl.searchParams.set("exp", String(exp));
  ticketUrl.searchParams.set("sig", token);
  return json(
    {
      key,
      method,
      url: ticketUrl.toString(),
      expiresAt: exp * 1000,
    },
    cors,
  );
}

async function handleStorage(
  request: Request,
  env: Env,
  cors: Record<string, string>,
  path: string,
  url: URL,
): Promise<Response> {
  if (!env.BOOKS) return json({ error: "R2 binding missing" }, cors, 503);

  if (path === "/storage" && request.method === "GET") {
    if (!assertSecret(env, request)) {
      return json({ error: "unauthorized" }, cors, 401);
    }
    const prefix = url.searchParams.get("prefix") || "";
    const listed = await env.BOOKS.list({ prefix, limit: 100 });
    return json(
      {
        objects: listed.objects.map((o) => ({
          key: o.key,
          size: o.size,
          uploaded: o.uploaded?.toISOString?.() ?? null,
        })),
        truncated: listed.truncated,
      },
      cors,
    );
  }

  const key = sanitizeKey(
    decodeURIComponent(path.replace(/^\/storage\/?/, "")),
  );
  if (!key) {
    return json({ error: "invalid key" }, cors, 400);
  }

  const authorized =
    assertSecret(env, request) ||
    (await verifyTicket(env, request.method, key, url));
  if (!authorized) return json({ error: "unauthorized" }, cors, 401);

  if (request.method === "GET") {
    const obj = await env.BOOKS.get(key);
    if (!obj) return json({ error: "not found" }, cors, 404);
    const headers = new Headers(cors);
    headers.set(
      "content-type",
      obj.httpMetadata?.contentType || "application/octet-stream",
    );
    headers.set("etag", obj.httpEtag);
    headers.set("cache-control", "private, max-age=60");
    return new Response(obj.body, { status: 200, headers });
  }

  if (request.method === "PUT") {
    const contentType =
      request.headers.get("content-type") || "application/octet-stream";
    const bytes = await request.arrayBuffer();
    await env.BOOKS.put(key, bytes, {
      httpMetadata: { contentType },
    });
    return json({ ok: true, key, size: bytes.byteLength }, cors);
  }

  if (request.method === "DELETE") {
    await env.BOOKS.delete(key);
    return json({ ok: true, key }, cors);
  }

  return json({ error: "method not allowed" }, cors, 405);
}

function sanitizeKey(key: string): string {
  const cleaned = key
    .split("/")
    .map((part) => part.trim())
    .filter(Boolean)
    .join("/");
  if (!cleaned || cleaned.includes("..") || cleaned.startsWith("/")) return "";
  return cleaned;
}

async function signTicket(
  env: Env,
  method: string,
  key: string,
  exp: number,
): Promise<string> {
  const secret = env.MODU_API_SECRET || env.BETTER_AUTH_SECRET || "";
  const material = `${method.toUpperCase()}\n${key}\n${exp}`;
  const keyBytes = await crypto.subtle.importKey(
    "raw",
    encoder.encode(secret),
    { name: "HMAC", hash: "SHA-256" },
    false,
    ["sign"],
  );
  const sig = await crypto.subtle.sign("HMAC", keyBytes, encoder.encode(material));
  return bufferToBase64Url(sig);
}

async function verifyTicket(
  env: Env,
  method: string,
  key: string,
  url: URL,
): Promise<boolean> {
  const exp = Number(url.searchParams.get("exp") || 0);
  const sig = url.searchParams.get("sig") || "";
  if (!exp || !sig) return false;
  if (exp < Math.floor(Date.now() / 1000)) return false;
  const expected = await signTicket(env, method, key, exp);
  return timingSafeEqual(expected, sig);
}

function bufferToBase64Url(buf: ArrayBuffer): string {
  const bytes = new Uint8Array(buf);
  let binary = "";
  for (let i = 0; i < bytes.length; i += 1) binary += String.fromCharCode(bytes[i]!);
  return btoa(binary).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/g, "");
}

function timingSafeEqual(a: string, b: string): boolean {
  if (a.length !== b.length) return false;
  let out = 0;
  for (let i = 0; i < a.length; i += 1) {
    out |= a.charCodeAt(i) ^ b.charCodeAt(i);
  }
  return out === 0;
}

function json(
  data: unknown,
  cors: Record<string, string>,
  status = 200,
): Response {
  return new Response(JSON.stringify(data, null, 2), {
    status,
    headers: {
      ...cors,
      "content-type": "application/json; charset=utf-8",
    },
  });
}
