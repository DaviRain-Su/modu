import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { GROK_PROVIDERS } from "./providers";

/**
 * Better Auth client for this React SPA (browser-side).
 *
 * Talks to this app's OWN Better Auth at same-origin `/api/auth/*`. In the live
 * preview the app is an embedded iframe with PARTITIONED cookies, so after a
 * popup sign-in it can't read the session cookie — it authenticates with a
 * bearer token instead (captured from the popup, see `signIn`). The `onRequest`
 * hook attaches that token when present; when deployed (cookie auth) no token
 * is stored, so nothing changes.
 *
 * Email/password: cookies use `__Host-` + Secure. Browsers often refuse them on
 * non-HTTPS origins (and live-preview iframes partition cookies). The bearer
 * plugin returns `set-auth-token` — we always capture that so login works even
 * when Set-Cookie is dropped.
 */
export const authClient = createAuthClient({
  plugins: [genericOAuthClient()],
  fetchOptions: {
    onRequest(ctx) {
      const token = getBearerToken();
      if (token) ctx.headers.set("Authorization", `Bearer ${token}`);
      return ctx;
    },
    onSuccess(ctx) {
      const fromHeader = ctx.response.headers.get("set-auth-token");
      if (fromHeader) {
        setBearerToken(fromHeader);
        return;
      }
      try {
        const data = ctx.data as { token?: string } | undefined;
        if (data?.token && typeof data.token === "string") {
          setBearerToken(data.token);
        }
      } catch {
        /* ignore */
      }
    },
  },
});

/**
 * True when sign-in UI should be shown. On by default (preview via the baked
 * preview client, deployed apps via the injected per-app client); set
 * `VITE_AUTH_ENABLED=false` to force it off (dev user — see `use-current-user`).
 */
export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

/** The upstream providers to render sign-in buttons for. */
export { GROK_PROVIDERS };

// ── Live-preview bearer token ────────────────────────────────────────────────
const BEARER_KEY = "grok-auth.bearer-token";

/** The stored preview bearer token, or null. */
export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return window.sessionStorage.getItem(BEARER_KEY);
  } catch {
    return null;
  }
}

function setBearerToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) window.sessionStorage.setItem(BEARER_KEY, token);
    else window.sessionStorage.removeItem(BEARER_KEY);
  } catch {
    /* storage unavailable — ignore */
  }
}

/**
 * Persist a session token from email sign-in/up (or any path that returns one).
 */
export function captureSessionToken(token: string | null | undefined): void {
  if (token && token.trim()) setBearerToken(token.trim());
}

/**
 * Email / password sign-in. Always captures bearer so login works when cookies
 * are blocked (iframe preview, Secure cookies on http).
 */
export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<void> {
  const { data, error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  });
  if (error) throw new Error(error.message ?? "登录失败");
  const token =
    (data as { token?: string } | null)?.token ?? getBearerToken();
  if (token) setBearerToken(token);
  await authClient.getSession();
}

/** Email / password sign-up + auto session (same bearer capture). */
export async function signUpWithEmail(input: {
  email: string;
  password: string;
  name: string;
}): Promise<void> {
  const { data, error } = await authClient.signUp.email({
    email: input.email,
    password: input.password,
    name: input.name,
  });
  if (error) throw new Error(error.message ?? "注册失败");
  const token =
    (data as { token?: string } | null)?.token ?? getBearerToken();
  if (token) setBearerToken(token);
  await authClient.getSession();
}

/**
 * True when we must use a popup (cannot top-navigate the frame to Google/X).
 * - Official live preview: `*.grok-sandbox.com`
 * - Any embedded iframe (Grok chat preview, etc.)
 */
function needsPopupSignIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.self !== window.top) return true;
  } catch {
    // Cross-origin parent access throws → we are embedded
    return true;
  }
  return window.location.hostname.endsWith(".grok-sandbox.com");
}

/** Message the popup posts back to the opener once sign-in completes. */
type PopupMessage = {
  source: "grok-auth-popup";
  token: string | null;
  error?: string;
};

/**
 * Request OAuth URL from this app's Better Auth (same-origin).
 * Uses raw fetch so we always see the real error body.
 */
async function requestOAuthUrl(
  providerId: string,
  callbackURL: string,
  errorCallbackURL: string,
): Promise<string> {
  const headers: Record<string, string> = {
    "content-type": "application/json",
  };
  const bearer = getBearerToken();
  if (bearer) headers.authorization = `Bearer ${bearer}`;

  const res = await fetch("/api/auth/sign-in/oauth2", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      providerId,
      callbackURL,
      errorCallbackURL,
    }),
  });

  const text = await res.text();
  let json: { url?: string; message?: string; code?: string; error?: string } =
    {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    /* not json */
  }

  if (!res.ok) {
    throw new Error(
      json.message ||
        json.error ||
        `登录接口失败 (${res.status})${text ? `: ${text.slice(0, 120)}` : ""}`,
    );
  }

  // better-auth client may wrap; also accept top-level url
  const url =
    json.url ||
    (json as { data?: { url?: string } }).data?.url ||
    null;
  if (!url) {
    throw new Error("未获得登录跳转地址，请刷新后重试");
  }
  return url;
}

/**
 * Start sign-in with one upstream provider (`providerId` from `GROK_PROVIDERS`),
 * federating through the Grok auth broker.
 *
 * - **Iframe / live preview**: popup → `/auth/popup` → broker → postMessage token
 * - **Top-level (modu.grok.me 等)**: full-page redirect to broker / Google / X
 */
export async function signIn(
  providerId: string,
  opts: { callbackURL?: string; errorCallbackURL?: string } = {},
): Promise<void> {
  const callbackURL = opts.callbackURL ?? "/";
  const errorCallbackURL = opts.errorCallbackURL ?? "/login?error=oauth";
  const usePopup = needsPopupSignIn();

  // Open popup SYNCHRONOUSLY on user gesture before any await
  const popup = usePopup ? openSignInPopup(providerId) : null;

  // Clear prior identity — do NOT block redirect on signOut (hangs = "没反应")
  setBearerToken(null);
  void authClient.signOut().catch(() => {
    /* ignore */
  });

  if (usePopup) {
    if (!popup) {
      throw new Error(
        "浏览器拦截了登录弹窗。请允许本站弹窗后重试，或在新标签打开网站再登录。",
      );
    }
    const token = await waitForPopupToken(popup);
    if (!token) throw new Error("登录已取消或未完成，请重试");
    setBearerToken(token);
    try {
      await authClient.getSession();
    } catch {
      /* session store will recover */
    }
    if (typeof window !== "undefined") {
      const dest = new URL(callbackURL, window.location.origin);
      const here = window.location;
      if (
        dest.origin !== here.origin ||
        dest.pathname !== here.pathname ||
        dest.search !== here.search
      ) {
        window.location.assign(callbackURL);
      }
    }
    return;
  }

  // Top-level: get OAuth URL then hard-navigate (most reliable)
  const url = await requestOAuthUrl(providerId, callbackURL, errorCallbackURL);
  window.location.assign(url);
}

/**
 * Open `/auth/popup` in a new window. Must run synchronously inside the click
 * handler (no await before this).
 */
function openSignInPopup(providerId: string): Window | null {
  const origin = window.location.origin;
  const url = `${origin}/auth/popup?providerId=${encodeURIComponent(providerId)}`;
  const name = `grok-signin-${Date.now()}`;
  return window.open(url, name, "popup,width=520,height=680");
}

/**
 * Wait for the popup's completion page to postMessage the session bearer (or
 * for the user to dismiss the popup).
 */
function waitForPopupToken(popup: Window): Promise<string | null> {
  return new Promise((resolve) => {
    const origin = window.location.origin;
    let settled = false;
    let closeTimer: number | undefined;
    const settle = (token: string | null) => {
      if (settled) return;
      settled = true;
      cleanup();
      resolve(token);
    };
    const onMessage = (event: MessageEvent) => {
      if (event.origin !== origin) return;
      const data = event.data as PopupMessage | undefined;
      if (!data || data.source !== "grok-auth-popup") return;
      settle(data.token ?? null);
    };
    const pollTimer = window.setInterval(() => {
      if (!popup.closed) return;
      window.clearInterval(pollTimer);
      closeTimer = window.setTimeout(() => settle(null), 400);
    }, 300);
    function cleanup() {
      window.clearInterval(pollTimer);
      if (closeTimer !== undefined) window.clearTimeout(closeTimer);
      window.removeEventListener("message", onMessage);
    }
    window.addEventListener("message", onMessage);
  });
}

/** Sign out of THIS app's local session, clear the preview token, then redirect. */
export async function signOut(redirectTo = "/"): Promise<void> {
  try {
    await authClient.signOut();
  } finally {
    setBearerToken(null);
  }
  window.location.href = redirectTo;
}
