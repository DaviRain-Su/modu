/**
 * When Cloudflare auth is **explicitly** enabled, Better Auth runs on the Worker (D1).
 * Same-origin `/api/auth/*` proxies there.
 *
 * 重要：不能「只因为生产自动连了 Worker URL」就反代登录。
 * Worker 若仍用 grok_preview，redirect_uri=https://modu.grok.me/... 会被
 * auth.grok.me 拒绝 → {"message":"Invalid redirect URI"}。
 *
 * 正式 OAuth 应由主应用 Better Auth 使用平台注入的 GROK_AUTH_CLIENT_*；
 * 只有显式配置 MODU_CF_API_URL / MODU_CF_API_SECRET / MODU_CF_AUTH_ON_WORKER
 * 时才把登录反代到 Worker（且 Worker 上须配置同样的 GROK_AUTH 密钥）。
 */
import { resolveCfApiUrl } from "./defaults";

/**
 * 是否把 /api/auth/* 反代到 Cloudflare Worker。
 * 自动连 Worker URL（R2/AI）≠ 自动反代登录。
 */
export function cloudflareAuthBackendConfigured(): boolean {
  // 显式关掉
  if (process.env.MODU_CF_AUTH_ON_WORKER === "false") return false;
  // 强制开（Worker 已配好 GROK_AUTH secrets）
  if (process.env.MODU_CF_AUTH_ON_WORKER === "true") {
    return Boolean(resolveCfApiUrl());
  }
  // 用户在发布面板手填了 Worker URL 或密钥 → 视为要走 D1 登录
  const explicitUrl = Boolean(process.env.MODU_CF_API_URL?.trim());
  const hasSecret = Boolean(process.env.MODU_CF_API_SECRET?.trim());
  if (explicitUrl || hasSecret) {
    return Boolean(resolveCfApiUrl());
  }
  // 仅自动推断的 Worker URL：不反代登录（避免 grok_preview + 正式域 Invalid redirect URI）
  return false;
}

export function cloudflareAuthBase(): string | null {
  if (!cloudflareAuthBackendConfigured()) return null;
  return resolveCfApiUrl();
}

/** 反代时必须丢掉的响应头（编码/长度/连接类） */
const STRIP_RESPONSE_HEADERS = new Set([
  "content-encoding",
  "content-length",
  "transfer-encoding",
  "connection",
  "keep-alive",
  "proxy-authenticate",
  "proxy-authorization",
  "te",
  "trailer",
  "upgrade",
  "cf-ray",
  "cf-cache-status",
  "cf-connecting-ip",
  "nel",
  "report-to",
  "alt-svc",
  "server",
  "expect-ct",
]);

/**
 * Forward an `/api/auth/*` request to the Cloudflare Worker.
 * Preserves method, body, cookies, and returns Set-Cookie / set-auth-token.
 */
export async function proxyAuthToCloudflare(
  request: Request,
): Promise<Response> {
  const base = cloudflareAuthBase();
  if (!base) {
    return new Response(JSON.stringify({ error: "CF auth not configured" }), {
      status: 503,
      headers: { "content-type": "application/json" },
    });
  }

  const incoming = new URL(request.url);
  const path = incoming.pathname;
  const target = `${base}${path}${incoming.search}`;

  const publicHost = (
    request.headers.get("x-forwarded-host") ||
    request.headers.get("host") ||
    ""
  )
    .split(",")[0]
    .trim();
  const publicProto = (
    request.headers.get("x-forwarded-proto") ||
    incoming.protocol.replace(":", "") ||
    "https"
  )
    .split(",")[0]
    .trim();

  const headers = new Headers();
  const pass = [
    "content-type",
    "cookie",
    "authorization",
    "origin",
    "referer",
    "user-agent",
    "x-forwarded-for",
    "x-real-ip",
  ];
  for (const name of pass) {
    const v = request.headers.get(name);
    if (v) headers.set(name, v);
  }
  if (publicHost) {
    headers.set("x-forwarded-host", publicHost);
    headers.set("x-forwarded-proto", publicProto || "https");
  }
  if (!headers.has("origin") && publicHost) {
    headers.set("origin", `${publicProto || "https"}://${publicHost}`);
  }
  // 避免 gzip 双重解码（ERR_CONTENT_DECODING_FAILED）
  headers.set("accept-encoding", "identity");

  const secret = process.env.MODU_CF_API_SECRET?.trim();
  if (secret) headers.set("x-modu-secret", secret);

  const method = request.method.toUpperCase();
  const init: RequestInit = {
    method,
    headers,
    redirect: "manual",
  };
  if (method !== "GET" && method !== "HEAD") {
    init.body = await request.arrayBuffer();
  }

  let upstream: Response;
  try {
    upstream = await fetch(target, init);
  } catch (e) {
    const msg = e instanceof Error ? e.message : String(e);
    return new Response(
      JSON.stringify({
        error: "Cloudflare auth backend unreachable",
        detail: msg,
        hint: "Check Worker is deployed",
        target: base,
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    const k = key.toLowerCase();
    if (k === "set-cookie") return;
    if (STRIP_RESPONSE_HEADERS.has(k)) return;
    out.append(key, value);
  });

  const getSetCookie = (
    upstream.headers as Headers & { getSetCookie?: () => string[] }
  ).getSetCookie?.();
  if (getSetCookie && getSetCookie.length) {
    for (const c of getSetCookie) out.append("set-cookie", c);
  } else {
    const single = upstream.headers.get("set-cookie");
    if (single) out.append("set-cookie", single);
  }

  const bodyBuf = await upstream.arrayBuffer();
  return new Response(bodyBuf, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}
