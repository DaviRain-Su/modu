# 墨读 · 环境变量（已大幅简化）

## 你现在几乎不用填面板

正式前端（`NODE_ENV=production`，例如 `https://modu.grok.me`）会**自动**连接：

`https://modu-api.davirain-yin.workers.dev`

代码在 [`src/lib/cloudflare/defaults.ts`](../src/lib/cloudflare/defaults.ts)。

因此：

1. **重新发布前端一次**（让这段自动连接代码上线）
2. 打开 `https://modu.grok.me/api/health`
3. 应看到 `authBackend: "cloudflare-worker"`、`cloudflare.workerReachable: true`
4. 用邮箱**重新注册**一次（旧 PGLite 账号不会自动迁到 D1）

**不必**再为「能登录」去填 `MODU_CF_API_URL`。

---

## 可选覆盖（高级）

若要改 Worker 地址或关自动连接：

| 变量 | 作用 |
|---|---|
| `MODU_CF_API_URL` | 覆盖默认 Worker URL |
| `MODU_CF_AUTO_LINK=false` | 关闭生产自动连接 |
| `MODU_CF_API_SECRET` | 与 Worker `MODU_API_SECRET` 相同；**上传 R2 / 官方 AI** 需要 |
| `BETTER_AUTH_URL` | 覆盖站点根，默认 `https://modu.grok.me` |
| `DATABASE_URL` | 进度/弹幕等业务表持久（Neon） |

---

## 验收

```text
https://modu.grok.me/api/health
```

| 字段 | 期望 |
|---|---|
| `authBackend` | `cloudflare-worker` |
| `persistentDatabase` | `true` |
| `cloudflare.workerReachable` | `true` |
| `cloudflare.workerUrlAuto` | `true`（未手填 env 时） |

Worker 本身：

```text
https://modu-api.davirain-yin.workers.dev/health
```

应已是 `d1/r2/ai: true`。
