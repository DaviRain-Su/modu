/**
 * 墨读 · 环境变量契约（不写 .env 文件）
 *
 * 推荐架构：前端 modu.grok.me + Cloudflare Worker（D1 登录 / R2 / AI）
 */

export type AppServerEnv = {
  /** Cloudflare Worker 基址 — 设置后登录反代到 CF D1 */
  MODU_CF_API_URL?: string;
  MODU_CF_API_SECRET?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_SECRET?: string;
  /** 仅在不用 CF 时可选（Neon） */
  DATABASE_URL?: string;
  VITE_AUTH_ENABLED?: string;
  GROK_AUTH_ISSUER?: string;
  GROK_AUTH_CLIENT_ID?: string;
  GROK_AUTH_CLIENT_SECRET?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_KEY?: string;
  CF_API_TOKEN?: string;
  AI_GATEWAY_ID?: string;
  AI_MODEL?: string;
};

export type AppClientEnv = {
  VITE_AUTH_ENABLED?: string;
  VITE_CF_API_URL?: string;
  VITE_R2_PUBLIC_URL?: string;
};

export const ENV_CHECKLIST = {
  /** 推荐：Cloudflare 后端 */
  cloudflareBackend: [
    "MODU_CF_API_URL",
    "MODU_CF_API_SECRET",
    "BETTER_AUTH_URL=https://modu.grok.me",
    "Worker secrets: BETTER_AUTH_SECRET, MODU_API_SECRET",
    "D1 database + schema.sql",
    "R2 bucket BOOKS",
  ],
  login: [
    "MODU_CF_API_URL（优先）或 DATABASE_URL",
    "BETTER_AUTH_URL",
    "GROK_AUTH_CLIENT_ID",
    "GROK_AUTH_CLIENT_SECRET",
  ],
  optionalAi: [
    "Workers AI binding on Worker",
    "or CLOUDFLARE_ACCOUNT_ID + API key",
  ],
} as const;

export const LOGIN_METHODS = [
  { id: "google", label: "Google", via: "Grok Auth Broker → Google" },
  { id: "x", label: "X (Twitter)", via: "Grok Auth Broker → X" },
  { id: "email", label: "邮箱密码", via: "Cloudflare D1 / Better Auth" },
] as const;
