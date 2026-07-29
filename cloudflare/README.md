# 墨读 · Cloudflare 后端

这是**正式后端**：登录（D1）、图书文件（R2）、AI（Workers AI）。  
前端站点（如 `https://modu.grok.me`）通过环境变量接到这里。

## 架构

```
浏览器 → modu.grok.me（前端 / Vercel）
              │
              ├─ /api/auth/*  ──反代──►  Cloudflare Worker  Better Auth + D1
              ├─ AI / 上传档案 ──────►  Worker  R2 + Workers AI
              └─ 页面 SSR 仍在前端
```

## 一次性初始化

```bash
cd cloudflare
npm install

# 登录 Cloudflare
npx wrangler login

# 创建 D1 + R2
npx wrangler d1 create modu
# 把返回的 database_id 填进 wrangler.toml 的 database_id

npx wrangler r2 bucket create modu-books

# 建表
npm run db:init:remote

# 密钥
npx wrangler secret put MODU_API_SECRET      # 随机长串
npx wrangler secret put BETTER_AUTH_SECRET   # 随机长串
# 若平台已注入 Google/X，可再 put GROK_AUTH_CLIENT_ID / SECRET

# 改 wrangler.toml:
#   APP_ORIGIN = "https://modu.grok.me"
#   ALLOWED_ORIGINS 含该域名

npx wrangler deploy
# → 得到 https://modu-api.<你的子域>.workers.dev
```

## 主应用环境变量（Grok 发布面板 / 平台注入）

| 变量 | 值 |
|---|---|
| `MODU_CF_API_URL` | `https://modu-api.<subdomain>.workers.dev` |
| `MODU_CF_API_SECRET` | 与 Worker 的 `MODU_API_SECRET` 相同 |
| `BETTER_AUTH_URL` | `https://modu.grok.me` |
| `VITE_CF_API_URL` | 同上 Worker URL（可选） |

设好后：**登录走 Cloudflare D1，账号会持久保存**（不再依赖 Neon / 内存 PGLite）。

## 本地联调

```bash
# 终端 1 — Worker
cd cloudflare
echo 'MODU_API_SECRET=dev-secret
BETTER_AUTH_SECRET=dev-auth-secret' > .dev.vars
npm run db:init    # 本地 D1
npm run dev        # :8787

# 终端 2 — 主应用
export MODU_CF_API_URL=http://127.0.0.1:8787
export MODU_CF_API_SECRET=dev-secret
export BETTER_AUTH_URL=http://127.0.0.1:8080
npm run dev
```

## API 一览

| 路径 | 说明 |
|---|---|
| `GET /health` | D1 / R2 / AI 状态 |
| `* /api/auth/*` | 登录（邮箱 / Google / X） |
| `POST /ai/chat` | Workers AI（需 `x-modu-secret`） |
| `PUT/GET /storage/...` | R2 |
| `POST /v1/profile/ensure` | 初始化用户档案行 |
