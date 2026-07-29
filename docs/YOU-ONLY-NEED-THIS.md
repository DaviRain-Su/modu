# 你只需要做这一件事（本机终端）

发布面板可以**先不用填**。我已经在前端代码里写好：  
正式站自动连 `https://modu-api.davirain-yin.workers.dev`。

但 Worker 里的登录库适配器之前有 bug（health 绿、注册却 500），  
**必须在你自己电脑上重新 deploy 一次 Worker**（我这边登不了你的 Cloudflare）。

---

## 打开 Mac 终端，复制粘贴

```bash
cd /Users/davirian/orca/modu/cloudflare

# 1) 装依赖（若已装过会很快）
npm install --legacy-peer-deps

# 2) 确认你还在登录 Cloudflare（若提示登录，按浏览器完成）
npx wrangler login

# 3) 发布修复后的 Worker
npx wrangler deploy

# 4) 测登录是否修好（应返回 token，不要 500）
curl -sS -X POST https://modu-api.davirain-yin.workers.dev/api/auth/sign-up/email \
  -H 'content-type: application/json' \
  -H 'origin: https://modu.grok.me' \
  -d '{"email":"test'$(date +%s)'@example.com","password":"TestPass123!","name":"测试"}'
```

第 4 步如果看到 `"token":"..."` 和用户信息 → **Worker 登录 OK**。

---

## 然后：让前端用上「自动连后端」的代码

把仓库最新代码发布到 `modu.grok.me`（Grok 里点一次发布/同步即可）。

打开：

https://modu.grok.me/api/health

期望：

- `authBackend`: `cloudflare-worker`
- `cloudflare.workerReachable`: `true`

再到登录页用**邮箱重新注册**一次。

---

## 发布面板什么时候才需要？

| 情况 | 要不要填 |
|---|---|
| 只想邮箱登录持久 | **不用填**（自动连 + Worker redeploy） |
| 上传到 R2 / 官方 AI 要密钥 | 再填 `MODU_CF_API_SECRET`（= 本机 `.dev.vars` 里的 `MODU_API_SECRET`） |
| 进度/弹幕也要跨发布不丢 | 再配 Neon 的 `DATABASE_URL` |

---

## 做完回我一句

「Worker 部署好了」或把 `curl` 注册返回的前两行贴过来即可。
