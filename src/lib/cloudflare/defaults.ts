/**
 * 正式后端 Worker（已部署）。
 * 生产环境未配 MODU_CF_API_URL 时自动使用，避免必须在发布面板手填。
 * 可用环境变量覆盖；设 MODU_CF_AUTO_LINK=false 可关闭自动连接。
 */
export const DEFAULT_MODU_CF_API_URL =
  "https://modu-api.davirain-yin.workers.dev";

export const DEFAULT_APP_ORIGIN = "https://modu.grok.me";

/**
 * 解析 Cloudflare Worker 根 URL（无尾斜杠）。
 * 优先级：MODU_CF_API_URL → VITE_CF_API_URL → 生产自动默认
 */
export function resolveCfApiUrl(): string | null {
  const fromEnv =
    process.env.MODU_CF_API_URL?.trim() ||
    process.env.VITE_CF_API_URL?.trim() ||
    "";
  if (fromEnv) return fromEnv.replace(/\/$/, "");

  if (process.env.MODU_CF_AUTO_LINK === "false") return null;

  // 显式要求自动连
  if (process.env.MODU_CF_AUTO_LINK === "true") {
    return DEFAULT_MODU_CF_API_URL;
  }

  // 生产构建 / 已知正式域名 → 自动连已上线的 Worker
  const better = process.env.BETTER_AUTH_URL || "";
  const vercel =
    process.env.VERCEL_URL ||
    process.env.VERCEL_PROJECT_PRODUCTION_URL ||
    process.env.VERCEL_BRANCH_URL ||
    "";
  const looksLikeModu =
    better.includes("modu.grok.me") ||
    vercel.includes("modu.grok.me") ||
    vercel.includes("modu");

  if (process.env.NODE_ENV === "production" || looksLikeModu) {
    return DEFAULT_MODU_CF_API_URL;
  }

  return null;
}

/** 登录 cookie / OAuth 用的站点根 */
export function resolveBetterAuthUrl(): string | null {
  const explicit = process.env.BETTER_AUTH_URL?.trim();
  if (explicit) return explicit.replace(/\/$/, "");

  const vercel = process.env.VERCEL_PROJECT_PRODUCTION_URL?.trim();
  if (vercel) {
    const host = vercel.replace(/^https?:\/\//, "").replace(/\/$/, "");
    return `https://${host}`;
  }

  if (process.env.NODE_ENV === "production") {
    return DEFAULT_APP_ORIGIN;
  }
  return null;
}
