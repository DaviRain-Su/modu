/**
 * Cloudflare D1 登录反代 — 默认关闭。
 *
 * 必须显式 MODU_CF_AUTH_ON_WORKER=true，且 Worker 上配置了正式
 * GROK_AUTH_CLIENT_ID/SECRET（不能是 grok_preview），才可开启。
 *
 * 否则 Google/X 会出现：
 * client_id=grok_preview + redirect_uri=https://modu.grok.me/...
 * → auth.grok.me 返回 Invalid redirect URI
 */
import { resolveCfApiUrl } from "./defaults";

export function cloudflareAuthBackendConfigured(): boolean {
  // 只有明确要求时才反代登录到 Worker
  if (process.env.MODU_CF_AUTH_ON_WORKER !== "true") return false;
  return Boolean(resolveCfApiUrl());
}

export function cloudflareAuthBase(): string | null {
  if (!cloudflareAuthBackendConfigured()) return null;
  return resolveCfApiUrl();
}

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
