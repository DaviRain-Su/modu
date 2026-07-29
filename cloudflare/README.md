# 墨读 Cloudflare 后端（本地可部署）

独立 Worker：R2 对象存储 + Workers AI。登录（Google / X / 邮箱）仍由**主应用** Better Auth 处理；本 Worker 不负责 OAuth。

## 一分钟本地起服务

```bash
cd cloudflare
# 首次：登录 Cloudflare（可选，纯本地模拟可跳过）
# npx wrangler login

# 密钥（本地文件 cloudflare/.dev.vars，勿提交 git）
echo 'MODU_API_SECRET=dev-secret-change-me' > .dev.vars

npx wrangler dev --port 8787
# → http://127.0.0.1:8787/health
```

## 主应用如何接

在主应用运行环境注入（平台面板 / 本机 export，**不要**提交 `.env`）：

| 变量 | 示例 |
|---|---|
| `MODU_CF_API_URL` | `http://127.0.0.1:8787` |
| `MODU_CF_API_SECRET` | 与 Worker `MODU_API_SECRET` 相同 |
| `VITE_CF_API_URL` | 同上（可选，前端健康检查） |
| `VITE_R2_PUBLIC_URL` | 若配置了 R2 自定义域 |

登录相关（主应用，不是 Worker）：

| 变量 | 说明 |
|---|---|
| `DATABASE_URL` | Neon 连接串 |
| `BETTER_AUTH_URL` | 前端公开 URL |
| `BETTER_AUTH_SECRET` | 会话密钥 |
| `GROK_AUTH_CLIENT_ID` / `SECRET` | Google & X（Grok 中介） |

## API

| 方法 | 路径 | 鉴权 | 说明 |
|---|---|---|---|
| GET | `/health` | 否 | 存活 |
| POST | `/ai/chat` | `x-modu-secret` | Workers AI |
| PUT | `/storage/:key` | 密钥 | 上传 R2 |
| GET | `/storage/:key` | 否* | 下载 |
| DELETE | `/storage/:key` | 密钥 | 删除 |
| GET | `/storage?prefix=` | 否* | 列举 |

\* 生产建议给读操作也加鉴权或仅暴露公开前缀。

### AI 示例

```bash
curl -s http://127.0.0.1:8787/ai/chat \
  -H 'content-type: application/json' \
  -H 'x-modu-secret: dev-secret-change-me' \
  -d '{"messages":[{"role":"user","content":"用一句话解释道德经第一章"}]}'
```

## 正式发布

```bash
npx wrangler r2 bucket create modu-books
npx wrangler secret put MODU_API_SECRET
# 改 wrangler.toml 的 ALLOWED_ORIGINS 为你的前端域名
npx wrangler deploy
```

把部署得到的 `https://modu-api.<subdomain>.workers.dev` 填进主应用的 `MODU_CF_API_URL`。
