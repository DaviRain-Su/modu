/**
 * When MODU_CF_API_URL is set, Better Auth runs on the Cloudflare Worker (D1).
 * Same-origin `/api/auth/*` on the app proxies there so cookies stay on the site domain.
 */

export function cloudflareAuthBackendConfigured(): boolean {
  return Boolean(process.env.MODU_CF_API_URL?.trim());
}

export function cloudflareAuthBase(): string | null {
  const u = process.env.MODU_CF_API_URL?.trim();
  return u ? u.replace(/\/$/, "") : null;
}

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
  // /api/auth/sign-in/email → {base}/api/auth/sign-in/email
  const path = incoming.pathname; // already /api/auth/...
  const target = `${base}${path}${incoming.search}`;

  const headers = new Headers();
  // Forward client identity headers
  const pass = [
    "content-type",
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
    const v = request.headers.get(name);
    if (v) headers.set(name, v);
  }
  // Ensure Origin is the public app origin for Better Auth CSRF
  if (!headers.has("origin")) {
    const host =
      request.headers.get("x-forwarded-host") ||
      request.headers.get("host") ||
      "";
    const proto = request.headers.get("x-forwarded-proto") || "https";
    if (host) headers.set("origin", `${proto}://${host.split(",")[0].trim()}`);
  }
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
        hint: "Check MODU_CF_API_URL and that wrangler deploy / dev is running",
      }),
      { status: 502, headers: { "content-type": "application/json" } },
    );
  }

  // Rebuild headers (multi Set-Cookie)
  const out = new Headers();
  upstream.headers.forEach((value, key) => {
    if (key.toLowerCase() === "set-cookie") return;
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

  return new Response(upstream.body, {
    status: upstream.status,
    statusText: upstream.statusText,
    headers: out,
  });
}
