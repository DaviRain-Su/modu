import { genericOAuthClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { GROK_PROVIDERS } from "./providers";

/**
 * Better Auth client for this React SPA (browser-side).
 *
 * Talks to this app's OWN Better Auth at same-origin `/api/auth/*`.
 * Captures bearer (`set-auth-token`) so login works when Secure cookies are
 * dropped (iframe preview / some mobile browsers).
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

export const authEnabled = import.meta.env.VITE_AUTH_ENABLED !== "false";

export { GROK_PROVIDERS };

// ── Session bearer（双写 session + local，避免关标签/刷新丢登录） ──
const BEARER_KEY = "grok-auth.bearer-token";

export function getBearerToken(): string | null {
  if (typeof window === "undefined") return null;
  try {
    return (
      window.sessionStorage.getItem(BEARER_KEY) ||
      window.localStorage.getItem(BEARER_KEY)
    );
  } catch {
    return null;
  }
}

function setBearerToken(token: string | null): void {
  if (typeof window === "undefined") return;
  try {
    if (token) {
      window.sessionStorage.setItem(BEARER_KEY, token);
      window.localStorage.setItem(BEARER_KEY, token);
    } else {
      window.sessionStorage.removeItem(BEARER_KEY);
      window.localStorage.removeItem(BEARER_KEY);
    }
  } catch {
    /* storage unavailable */
  }
}

export function captureSessionToken(token: string | null | undefined): void {
  if (token && token.trim()) setBearerToken(token.trim());
}

function extractToken(data: unknown): string | null {
  if (!data || typeof data !== "object") return null;
  const d = data as { token?: string; session?: { token?: string } };
  if (typeof d.token === "string" && d.token) return d.token;
  if (typeof d.session?.token === "string" && d.session.token)
    return d.session.token;
  return null;
}

export async function signInWithEmail(input: {
  email: string;
  password: string;
}): Promise<void> {
  const { data, error } = await authClient.signIn.email({
    email: input.email,
    password: input.password,
  });
  if (error) {
    const msg = error.message ?? "登录失败";
    // 统一友好文案
    if (/invalid|credential|password|email/i.test(msg)) {
      throw new Error(
        "邮箱或密码不正确。若站点刚重新发布过，预览库账号可能已清空——请重新注册。",
      );
    }
    throw new Error(msg);
  }
  const token = extractToken(data) ?? getBearerToken();
  if (token) setBearerToken(token);
  // 兜底：再拉一次 session（有的环境只靠 cookie）
  const sess = await authClient.getSession();
  if (!getBearerToken() && !sess.data?.user) {
    throw new Error(
      "登录接口已响应，但浏览器未能保存会话。请允许本站 Cookie 后重试，或换用无痕窗口外的正常标签。",
    );
  }
}

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
  if (error) {
    const msg = error.message ?? "注册失败";
    if (/already exists|exists/i.test(msg)) {
      throw new Error("该邮箱已注册，请直接登录");
    }
    throw new Error(msg);
  }
  const token = extractToken(data) ?? getBearerToken();
  if (token) setBearerToken(token);
  const sess = await authClient.getSession();
  if (!getBearerToken() && !sess.data?.user) {
    throw new Error(
      "注册成功但会话未保存。请回到登录页用同一邮箱密码登录一次。",
    );
  }
}

function needsPopupSignIn(): boolean {
  if (typeof window === "undefined") return false;
  try {
    if (window.self !== window.top) return true;
  } catch {
    return true;
  }
  return window.location.hostname.endsWith(".grok-sandbox.com");
}

type PopupMessage = {
  source: "grok-auth-popup";
  token: string | null;
  error?: string;
};

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

  const absCallback = new URL(callbackURL, window.location.origin).toString();
  const absError = new URL(
    errorCallbackURL,
    window.location.origin,
  ).toString();

  const res = await fetch("/api/auth/sign-in/oauth2", {
    method: "POST",
    credentials: "include",
    headers,
    body: JSON.stringify({
      providerId,
      callbackURL: absCallback,
      errorCallbackURL: absError,
    }),
  });

  const text = await res.text();
  let json: {
    url?: string;
    message?: string;
    code?: string;
    error?: string;
    data?: { url?: string };
  } = {};
  try {
    json = text ? JSON.parse(text) : {};
  } catch {
    /* not json */
  }

  if (!res.ok) {
    const raw =
      json.message ||
      json.error ||
      `登录接口失败 (${res.status})${text ? `: ${text.slice(0, 120)}` : ""}`;
    if (/invalid origin|forbidden/i.test(raw)) {
      throw new Error(
        "登录域名未受信任。请在发布环境设置 BETTER_AUTH_URL 为当前站点地址（如 https://modu.grok.me）。",
      );
    }
    throw new Error(raw);
  }

  const url = json.url || json.data?.url || null;
  if (!url) {
    throw new Error("未获得登录跳转地址，请刷新后重试");
  }
  return url;
}

/**
 * Google / X 登录
 * - iframe / sandbox：弹窗
 * - 正式站顶层：整页跳转（最稳）
 */
export async function signIn(
  providerId: string,
  opts: { callbackURL?: string; errorCallbackURL?: string } = {},
): Promise<void> {
  const callbackURL = opts.callbackURL ?? "/account";
  const errorCallbackURL = opts.errorCallbackURL ?? "/login?error=oauth";
  const usePopup = needsPopupSignIn();

  // 同步打开弹窗（必须在 await 之前，否则会被浏览器拦截）
  const popup = usePopup ? openSignInPopup(providerId) : null;

  // 不 await signOut，避免卡住「没反应」
  void authClient.signOut().catch(() => {});

  if (usePopup) {
    if (!popup) {
      throw new Error(
        "浏览器拦截了登录弹窗。请允许本站弹窗后重试，或在新标签打开网站再登录。",
      );
    }
    // 弹窗路径里会自己拿 token；先清旧 token 避免误用
    setBearerToken(null);
    const token = await waitForPopupToken(popup);
    if (!token) throw new Error("登录已取消或未完成，请重试");
    setBearerToken(token);
    try {
      await authClient.getSession();
    } catch {
      /* recover */
    }
    if (typeof window !== "undefined") {
      window.location.assign(callbackURL);
    }
    return;
  }

  // 顶层：先拿到 URL 再跳转；失败则保留当前会话
  try {
    const url = await requestOAuthUrl(
      providerId,
      callbackURL,
      errorCallbackURL,
    );
    setBearerToken(null);
    window.location.assign(url);
  } catch (e) {
    // 二次尝试：better-auth 客户端插件
    try {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const anyClient = authClient as any;
      if (anyClient.signIn?.oauth2) {
        await anyClient.signIn.oauth2({
          providerId,
          callbackURL,
          errorCallbackURL,
        });
        return;
      }
    } catch {
      /* fall through */
    }
    throw e;
  }
}

function openSignInPopup(providerId: string): Window | null {
  const origin = window.location.origin;
  const url = `${origin}/auth/popup?providerId=${encodeURIComponent(providerId)}`;
  const name = `grok-signin-${Date.now()}`;
  return window.open(url, name, "popup,width=520,height=680");
}

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

export async function signOut(redirectTo = "/"): Promise<void> {
  try {
    await authClient.signOut();
  } finally {
    setBearerToken(null);
  }
  window.location.href = redirectTo;
}
