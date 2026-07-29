# 墨读 · Modu

**公版优先的在线阅读器**——书城、上传、划线批注、共读想法（同一句划线）、AI 伴读。  
灵感来自微信读书式体验，版权边界对齐 liber / empty：公版可共读，私有仅自己。

| | |
|---|---|
| 预览域名示例 | `https://modu.grok.me` |
| 前端栈 | React 19 · TanStack Start · Vite · Tailwind v4 |
| 正式后端 | Cloudflare Worker · D1 · R2 · Workers AI |
| 本地/预览兜底 | PGLite + IndexedDB（无账号时仍可演示） |

---

## 功能一览

| 模块 | 说明 |
|---|---|
| **落地页** | 产品介绍、入口 |
| **书城** | 仅公版书（官方目录 + 社区声明公版） |
| **书架** | 在读进度、上传书 |
| **阅读器** | 正文 / EPUB 优先；划线（金/朱/青）、批注、主题字体 |
| **共读想法（同一句划线）** | 同一句原文上多人留下想法（登录后写入后端） |
| **AI 伴读** | 划词解释/摘要/翻译；多轮对话；Pi 统一模型层 |
| **账户** | 资料、AI 自带 Key（DeepSeek 等）、订阅档位 UI |
| **登录** | Google · X · 邮箱（接 Cloudflare 后持久） |
| **上传** | 默认**私有**；可选声明公版上架（需依据） |
| **公版 CLI** | 运营侧打包公版书进官方目录 |

**格式策略：** 优先 **EPUB**（目录、重排、进度 CFI）。TXT/MD 可用。PDF 可上传但非重点。

---

## 快速开始（只跑前端预览）

```bash
npm install          # 模板通常已装好
npm run dev          # http://0.0.0.0:8080
```

不配 Cloudflare 时：

- 登录可用，但 **PGLite 非跨实例持久**（正式站会丢 session）
- 图书文件在浏览器 **IndexedDB**
- 弹幕 / 进度 API 写本进程内存库

正式上线务必接 Cloudflare，见下方与 [docs/DEPLOY-CHECKLIST.md](./docs/DEPLOY-CHECKLIST.md)。

---

## 项目结构

```text
src/
  routes/           # 页面：/ library shelf upload read book login account rankings
  components/       # UI · reader（Text/Epub/划线/弹幕/AI）
  lib/
    books/          # 公版 catalog · 版权规则 · 解析上传
    auth/           # Better Auth 客户端
    server/         # Server Functions（进度、弹幕、社交、AI）
    storage/        # R2 抽象 + IndexedDB 兜底
    ai/             # Pi gateway · 本地 assist
  components/reader/
cloudflare/         # 正式后端 Worker（D1 + R2 + AI + Auth）
migrations/         # 主应用 PGLite / Postgres SQL
scripts/
  modu-pd-cli.mjs   # 公版书入库 CLI
  migrate.mjs
docs/
  DEPLOY-CHECKLIST.md
examples/
  pd-book.sample.json
```

---

## 环境变量

复制 [`.env.example`](./.env.example) → `.env.local` 或发布面板。

### 正式站最少必填

| 变量 | 作用 |
|---|---|
| `BETTER_AUTH_URL` | 前端 HTTPS 根，如 `https://modu.grok.me` |
| `MODU_CF_API_URL` | Cloudflare Worker 根 URL |
| `MODU_CF_API_SECRET` | 与 Worker `MODU_API_SECRET` 一致 |

### 常用可选

| 变量 | 作用 |
|---|---|
| `VITE_CF_API_URL` | 客户端可见的 Worker URL |
| `DATABASE_URL` | 外部 Postgres（有则优先于 PGLite） |
| `CLOUDFLARE_ACCOUNT_ID` / `CLOUDFLARE_API_KEY` | 主应用内调 Workers AI |
| `R2_PUBLIC_URL` / `VITE_R2_PUBLIC_URL` | R2 公开读 |
| `AI_MODEL` | 默认模型 id |

完整清单与打勾步骤：**[docs/DEPLOY-CHECKLIST.md](./docs/DEPLOY-CHECKLIST.md)**  
Worker 细节：**[cloudflare/README.md](./cloudflare/README.md)**

---

## Cloudflare 后端（你需要在本机做）

沙箱/构建环境**无法**登录你的 Cloudflare 账号。请在自己电脑执行：

```bash
cd cloudflare
npm install
npx wrangler login

npx wrangler d1 create modu
# 把 database_id 填进 wrangler.toml

npx wrangler r2 bucket create modu-books

# 修改 wrangler.toml 中 APP_ORIGIN / ALLOWED_ORIGINS 为你的前端域名
npm run db:init:remote

npx wrangler secret put MODU_API_SECRET
npx wrangler secret put BETTER_AUTH_SECRET
# 联邦 Google/X（推荐）:
npx wrangler secret put GROK_AUTH_CLIENT_ID
npx wrangler secret put GROK_AUTH_CLIENT_SECRET

npx wrangler deploy
# → https://modu-api.<subdomain>.workers.dev
```

然后在**前端发布环境**设置：

```bash
BETTER_AUTH_URL=https://modu.grok.me
MODU_CF_API_URL=https://modu-api.<subdomain>.workers.dev
MODU_CF_API_SECRET=<与 MODU_API_SECRET 相同>
```

本地双进程联调：

```bash
# 终端 1
cd cloudflare && cp .dev.vars.example .dev.vars && npm run db:init && npm run dev

# 终端 2
export MODU_CF_API_URL=http://127.0.0.1:8787
export MODU_CF_API_SECRET=dev-secret-change-me   # 与 .dev.vars 一致
export BETTER_AUTH_URL=http://127.0.0.1:8080
npm run dev
```

根目录快捷：`npm run cf:dev` · `npm run cf:deploy` · `npm run cf:db`

---

## 登录说明（Google / X / 邮箱）

1. **邮箱**：Better Auth email+password；正式站需 HTTPS + 正确 `BETTER_AUTH_URL`。
2. **Google / X**：默认经 **Grok OIDC 联邦**（`auth.grok.me`），Worker / 主应用使用  
   `GROK_AUTH_CLIENT_ID` / `GROK_AUTH_CLIENT_SECRET`。
3. OAuth 回调域名必须等于用户访问的前端域名（如 `modu.grok.me`）。
4. 未接 Cloudflare 时，serverless 多实例会表现为「点了登录没反应 / 登完又掉」——这是预期限制，接 D1 后解决。

验收步骤见 Checklist **C 节**。

---

## 版权与书城策略

| 类型 | 书城 | 弹幕/公开批注 | 说明 |
|---|---|---|---|
| 官方公版 `pd_*` | ✅ | ✅ | catalog + CLI 入库 |
| 社区声明公版 | ✅ | ✅ | 用户声明依据后上架 |
| 私有上传 | ❌ | ❌ | 默认；仅自己可读 |

运营补书：

```bash
npm run pd:scaffold
npm run pd:validate -- examples/pd-book.sample.json
npm run pd:pack -- examples/pd-book.sample.json
# 人工审阅 tmp/pd-pack/.../book.json 后合并进 src/lib/books/catalog.ts
```

---

## 常用脚本

| 命令 | 说明 |
|---|---|
| `npm run dev` | 开发服 `0.0.0.0:8080` |
| `npm run build` | 生产构建（Vercel） |
| `npm run typecheck` | TypeScript |
| `npm run db:migrate` | 应用 `migrations/*.sql` |
| `npm run cf:dev` / `cf:deploy` | Cloudflare 本地 / 发布 |
| `npm run pd:*` | 公版 CLI |

---

## 阅读与 AI 产品要点

- **划线**：选中 → 金/朱/青 → 批注框 → 本地 + 可选公开  
- **弹幕**：公版段落下「写想法」；表 `reading_danmaku`  
- **进度同步**：登录后 `reading_progress_cloud` 防抖上传；顶栏「已同步」  
- **AI**：官方通道（Workers AI / Gateway）或用户 BYOK（账户页）；内核经 `@earendil-works/pi-ai`

---

## 健康检查

```bash
curl -s https://你的域名/api/health | jq
# 关注：authBackend、persistentDatabase、cloudflare.workerUrl
```

Worker：

```bash
curl -s https://modu-api....workers.dev/health
```

---

## 相关仓库（参考）

- [liber](https://github.com/DaviRain-Su/liber) — 公版云阅读 / 划线 / Cloudflare  
- [empty](https://github.com/DaviRain-Su/empty) — 原生阅读客户端划线与批注  
- [pi.dev](https://pi.dev) — AI 工具链  

---

## 许可与内容

- **代码**：以本仓库为准（App Builder 工作区）。  
- **书城正文**：仅公共领域作品节选/全文短篇；社区上架需用户声明依据。  
- **私有上传**：不对第三方公开，用户自行确保有权阅读的文件。

---

## 文档索引

| 文档 | 内容 |
|---|---|
| [docs/DEPLOY-CHECKLIST.md](./docs/DEPLOY-CHECKLIST.md) | **上线打勾清单**（CF + 环境变量 + 登录 + 故障） |
| [cloudflare/README.md](./cloudflare/README.md) | Worker 架构、API、密钥 |
| [.env.example](./.env.example) | 主应用环境变量模板 |
| [cloudflare/.dev.vars.example](./cloudflare/.dev.vars.example) | 本地 Worker 密钥模板 |
| [examples/pd-book.sample.json](./examples/pd-book.sample.json) | 公版 CLI 示例 |

有问题优先对照 **DEPLOY-CHECKLIST 的 F 常见故障**。
