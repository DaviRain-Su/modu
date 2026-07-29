# 墨读 · 上线联调清单（Checklist）

按顺序打勾。完成 **A + B + C** 后，正式站登录与数据应可持久。

---

## A. Cloudflare 后端（本机一次）

- [ ] 安装 Node 20+、登录：`npx wrangler login`
- [ ] `cd cloudflare && npm install`
- [ ] 创建 D1：`npx wrangler d1 create modu`  
      → 把返回的 `database_id` 写入 [`wrangler.toml`](../cloudflare/wrangler.toml)
- [ ] 创建 R2：`npx wrangler r2 bucket create modu-books`  
      （及可选 `modu-books-preview`）
- [ ] 确认 `wrangler.toml`：
  - [ ] `APP_ORIGIN = "https://你的前端域名"`（如 `https://modu.grok.me`）
  - [ ] `ALLOWED_ORIGINS` 含该域名与本地 `http://127.0.0.1:8080`
- [ ] 远程建表：`npm run db:init:remote`（执行 `schema.sql`）
- [ ] 写入 Secrets：

```bash
npx wrangler secret put MODU_API_SECRET      # 随机 ≥32 字符
npx wrangler secret put BETTER_AUTH_SECRET   # 随机 ≥32 字符
npx wrangler secret put GROK_AUTH_CLIENT_ID  # 若用 Grok 联邦 Google/X
npx wrangler secret put GROK_AUTH_CLIENT_SECRET
```

- [ ] 部署：`npx wrangler deploy`  
      → 记下 `https://modu-api.<account>.workers.dev`
- [ ] 健康检查：`curl https://modu-api....workers.dev/health` 应返回 D1/R2 ok

### 本地 Worker 联调（可选）

```bash
cd cloudflare
cp .dev.vars.example .dev.vars   # 填 secret
npm run db:init
npm run dev                      # :8787
```

---

## B. 主应用环境变量（Vercel / Grok 发布 / `.env.local`）

| 变量 | 必填 | 说明 |
|---|---|---|
| `BETTER_AUTH_URL` | ✅ | 前端正式 URL，如 `https://modu.grok.me` |
| `MODU_CF_API_URL` | ✅ 正式 | Worker URL，无尾斜杠 |
| `MODU_CF_API_SECRET` | ✅ 正式 | = Worker 的 `MODU_API_SECRET` |
| `VITE_CF_API_URL` | 可选 | 与 `MODU_CF_API_URL` 相同（客户端） |
| `DATABASE_URL` | 可选 | 有 Neon 时用；否则依赖 CF / PGLite |
| `CLOUDFLARE_ACCOUNT_ID` + `CLOUDFLARE_API_KEY` | 可选 | 主应用内 Pi → Workers AI |
| `R2_PUBLIC_URL` / `VITE_R2_PUBLIC_URL` | 可选 | R2 公开读 |

- [ ] 复制根目录 [`.env.example`](../.env.example) → `.env.local` 或发布面板
- [ ] 重新部署前端
- [ ] 打开 `/api/health`：应见 `authBackend: cloudflare-worker` 或类似，且 `persistentDatabase: true`（接好时）

---

## C. 登录（Google / X / 邮箱）

### C1. 经 Grok 联邦（推荐，与预览一致）

- [ ] Worker 已设 `GROK_AUTH_CLIENT_ID` / `SECRET`
- [ ] `APP_ORIGIN` = 前端正式域名
- [ ] 在 Grok / 平台 OAuth 应用里把 **Redirect URI** 配成：  
      `https://你的前端域名/api/auth/callback/grok-google`  
      `https://你的前端域名/api/auth/callback/grok-x`  
      （具体 path 以 Better Auth 插件为准；见登录失败时 Network 里的 redirect_uri）
- [ ] 邮箱注册：同域 cookie / bearer 正常即可

### C2. 自备 Google / X 应用（备选）

- [ ] Google Cloud Console：OAuth Web 客户端，回调到 `BETTER_AUTH_URL` + Better Auth callback path
- [ ] X Developer Portal：同样配置回调
- [ ] 把 client id/secret 注入 auth 层（Grok 联邦或 Worker secret）

### C3. 验收

- [ ] 正式站点「使用 Google 登录」→ 跳转 → 回站已登录
- [ ] X 登录同上
- [ ] 邮箱注册 / 登录
- [ ] 刷新页面 session 仍在（**关键**；PGLite 多实例会丢）
- [ ] 另一设备同账号可见进度 / 弹幕（D1 已接时）

---

## D. 存储与 AI

- [ ] 上传 EPUB → 文件在 R2（或未配时 IndexedDB，仅本机）
- [ ] 账户页配置 DeepSeek / 自定义 API → 伴读可用
- [ ] 官方 AI：Worker `/ai/chat` 或 `CLOUDFLARE_*` + Pi
- [ ] 公版书共读想法：登录后对同一句划线留言，刷新仍在

---

## E. 公版书运营 CLI

```bash
npm run pd:scaffold
npm run pd:validate -- examples/pd-book.sample.json
npm run pd:pack -- examples/pd-book.sample.json
# 审 book.json 后并入 src/lib/books/catalog.ts
```

- [ ] 仅上传**已确认公版**书目
- [ ] 保留 `evidence` / `sourceUrl` / `pdBasis`

---

## F. 常见故障

| 现象 | 排查 |
|---|---|
| 登录无反应 / 转一圈失败 | `BETTER_AUTH_URL` 是否等于当前访问域名；OAuth redirect 是否匹配 |
| 部署后登录丢失 | 未接 `MODU_CF_API_*`，仍在无状态 PGLite |
| CORS 错误 | Worker `ALLOWED_ORIGINS` 是否含前端域名 |
| 401 from Worker | `MODU_CF_API_SECRET` ≠ `MODU_API_SECRET` |
| 健康检查 R2 fail | bucket 名与 wrangler binding 不一致 |
| 弹幕发不出去 | 未登录；或非公版书；或 D1 未建 `reading_danmaku` |

---

## G. 建议顺序（最短路径）

1. A 全做完 → Worker `/health` 绿  
2. B 环境变量 → 前端 redeploy  
3. C 登录验收  
4. D 上传 + 弹幕  
5. E 补书  

更完整说明见根目录 [README.md](../README.md) 与 [cloudflare/README.md](../cloudflare/README.md)。
