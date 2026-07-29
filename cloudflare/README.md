# 墨读 · Cloudflare 后端

正式后端：**Better Auth 登录（D1）** · **图书/对话对象（R2）** · **Workers AI**。  
前端（如 `https://modu.grok.me`）通过 `MODU_CF_API_URL` + `MODU_CF_API_SECRET` 接入。

> 详细打勾清单见仓库根目录 [docs/DEPLOY-CHECKLIST.md](../docs/DEPLOY-CHECKLIST.md)。

---

## 架构

```text
浏览器
  │
  ▼
前端站点 (Vercel / Grok 发布)  ──────────────────────────┐
  │ 页面 SSR / Server Functions                           │
  │                                                       │
  ├─ 配置了 MODU_CF_* 时 ──► 本 Worker                     │
  │     /api/auth/*   Better Auth + D1                    │
  │     /storage/*    R2 (BOOKS)                          │
  │     /ai/chat      Workers AI                          │
  │     /health                                           │
  │                                                       │
  └─ 未配置时 ──► 主应用内 PGLite（易丢）+ IndexedDB ──┘
```

---

## 一次性初始化

```bash
cd cloudflare
npm install
npx wrangler login

# 1) D1
npx wrangler d1 create modu
# 编辑 wrangler.toml → database_id / preview_database_id

# 2) R2
npx wrangler r2 bucket create modu-books
# 可选 preview: npx wrangler r2 bucket create modu-books-preview

# 3) 域名相关 vars（wrangler.toml [vars]）
#    APP_ORIGIN = "https://modu.grok.me"
#    ALLOWED_ORIGINS = "https://modu.grok.me,http://127.0.0.1:8080,..."

# 4) 建表（含进度 / 弹幕）
npm run db:init:remote

# 5) Secrets
npx wrangler secret put MODU_API_SECRET
npx wrangler secret put BETTER_AUTH_SECRET
npx wrangler secret put GROK_AUTH_CLIENT_ID      # 联邦 Google/X
npx wrangler secret put GROK_AUTH_CLIENT_SECRET

# 6) 发布
npx wrangler deploy
curl https://modu-api.<你的>.workers.dev/health
```

### wrangler.toml 要点

| 项 | 说明 |
|---|---|
| `name` | `modu-api` |
| `DB` | D1 binding `modu` |
| `BOOKS` | R2 bucket `modu-books` |
| `AI` | Workers AI binding |
| `APP_ORIGIN` | **必须**等于前端正式域名 |
| `ALLOWED_ORIGINS` | CORS 白名单 |
| `AI_MODEL` | 默认 `@cf/qwen/...` |

密钥**不要**写进 toml，只用 `wrangler secret put` 或 `.dev.vars`。

---

## 主应用环境变量

在前端发布面板 / `.env.local`：

```bash
BETTER_AUTH_URL=https://modu.grok.me
MODU_CF_API_URL=https://modu-api.<subdomain>.workers.dev
MODU_CF_API_SECRET=<同 MODU_API_SECRET>
# 可选
VITE_CF_API_URL=https://modu-api.<subdomain>.workers.dev
```

设好后健康接口应反映 **Cloudflare Worker** 后端，登录会话进 **D1**。

---

## 本地联调

```bash
cd cloudflare
cp .dev.vars.example .dev.vars
# 编辑 .dev.vars：MODU_API_SECRET / BETTER_AUTH_SECRET

npm run db:init    # 本地 D1
npm run dev        # http://127.0.0.1:8787

# 另一终端（仓库根）
export MODU_CF_API_URL=http://127.0.0.1:8787
export MODU_CF_API_SECRET=dev-secret-change-me
export BETTER_AUTH_URL=http://127.0.0.1:8080
npm run dev
```

或根目录：`npm run cf:dev`。

---

## API 一览

| 方法 / 路径 | 说明 | 鉴权 |
|---|---|---|
| `GET /health` | D1 / R2 / AI 状态 | 无 |
| `* /api/auth/*` | Better Auth（邮箱 · Google · X 联邦） | Cookie / Bearer |
| `POST /ai/chat` | Workers AI 聊天 | Header `x-modu-secret` |
| `PUT /storage/*` | 写入 R2 | `x-modu-secret` |
| `GET /storage/*` | 读取 R2 | 视实现 |
| `POST /v1/profile/ensure` | 初始化用户档案 | 会话 |

主应用 Server Functions（进度 `reading_progress_cloud`、弹幕 `reading_danmaku`）在接上共享 D1 或经 Worker 代理后与本 schema 对齐；`schema.sql` 已包含对应表。

---

## 登录（Google / X）

默认经 **Grok OIDC**：

- Issuer: `https://auth.grok.me`（可用 `GROK_AUTH_ISSUER` 覆盖）
- Provider id: `grok-google` · `grok-x`
- 需 `GROK_AUTH_CLIENT_ID` / `GROK_AUTH_CLIENT_SECRET`

**回调域名**必须是用户浏览器地址栏里的前端 origin（`APP_ORIGIN` / `BETTER_AUTH_URL`），不是 workers.dev。

邮箱密码：Better Auth 标准流程；生产务必 HTTPS。

---

## Schema

[`schema.sql`](./schema.sql) 包含：

- Better Auth：`user` / `session` / `account` / `verification`
- 档案 / AI 设置 / 订阅 / 用量
- 批注 `annotations` · 阅读记录 `book_reads`
- AI 会话消息
- **进度** `reading_progress_cloud`
- **弹幕** `reading_danmaku`
- 社区公版 `community_pd_books`（预留）

改 schema 后对 remote 再执行一次 `npm run db:init:remote`（`IF NOT EXISTS` 安全）。

---

## 故障速查

| 现象 | 处理 |
|---|---|
| `database_id` 全 0 | 未 create D1 或未回填 toml |
| CORS | `ALLOWED_ORIGINS` 加前端域名 |
| 401 AI/storage | 前端 secret 与 `MODU_API_SECRET` 不一致 |
| OAuth 回不来 | `APP_ORIGIN` ≠ 实际访问域名；回调 URI 未登记 |
| 登录后刷新掉线 | 前端未设 `MODU_CF_*`，仍走多实例 PGLite |

---

## 脚本

| npm script | 作用 |
|---|---|
| `npm run dev` | `wrangler dev --port 8787` |
| `npm run deploy` | 发布 Worker |
| `npm run db:init` | 本地 D1 执行 schema |
| `npm run db:init:remote` | 远程 D1 执行 schema |
