/**
 * 墨读 · 环境变量契约（接口定义，不写入 .env 文件）
 *
 * 你在本地 / Cloudflare / 主机平台里按名注入即可。
 * 前端可读：仅 `VITE_*`。
 * 服务端 / Worker：其余全部。
 */

/** 主应用（TanStack / Vercel 等）运行时 */
export type AppServerEnv = {
  DATABASE_URL?: string;
  BETTER_AUTH_URL?: string;
  BETTER_AUTH_SECRET?: string;
  VITE_AUTH_ENABLED?: string;
  GROK_AUTH_ISSUER?: string;
  GROK_AUTH_CLIENT_ID?: string;
  GROK_AUTH_CLIENT_SECRET?: string;
  CLOUDFLARE_ACCOUNT_ID?: string;
  CLOUDFLARE_API_KEY?: string;
  CF_API_TOKEN?: string;
  AI_GATEWAY_ID?: string;
  AI_MODEL?: string;
  /** 独立 Cloudflare Worker 基址 */
  MODU_CF_API_URL?: string;
  MODU_CF_API_SECRET?: string;
};

/** 浏览器可见 */
export type AppClientEnv = {
  VITE_AUTH_ENABLED?: string;
  VITE_CF_API_URL?: string;
  VITE_R2_PUBLIC_URL?: string;
};

/**
 * Cloudflare Worker 环境（wrangler 绑定名）
 * 类型细节见 cloudflare/src/env.ts
 */
export type CloudflareWorkerEnvKeys = {
  BOOKS: "R2Bucket binding";
  AI: "Workers AI binding";
  DB?: "optional D1";
  ALLOWED_ORIGINS: string;
  MODU_API_SECRET: string;
  AI_MODEL?: string;
  AI_GATEWAY_ID?: string;
};

export const ENV_CHECKLIST = {
  login: [
    "DATABASE_URL",
    "BETTER_AUTH_URL",
    "BETTER_AUTH_SECRET",
    "GROK_AUTH_CLIENT_ID",
    "GROK_AUTH_CLIENT_SECRET",
  ],
  cloudflareWorker: [
    "ALLOWED_ORIGINS",
    "MODU_API_SECRET",
    "R2 bucket: BOOKS",
    "AI binding",
  ],
  appToWorker: ["MODU_CF_API_URL", "MODU_CF_API_SECRET"],
  optionalAi: [
    "CLOUDFLARE_ACCOUNT_ID",
    "CLOUDFLARE_API_KEY",
    "AI_GATEWAY_ID",
    "AI_MODEL",
  ],
} as const;

export const LOGIN_METHODS = [
  { id: "google", label: "Google", via: "Grok Auth Broker → Google" },
  { id: "x", label: "X (Twitter)", via: "Grok Auth Broker → X" },
  { id: "email", label: "邮箱密码", via: "本应用 Better Auth + 数据库" },
] as const;
