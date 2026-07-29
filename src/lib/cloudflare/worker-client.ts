/**
 * 主应用 → 独立 Cloudflare Worker 的服务端客户端。
 * 配置 MODU_CF_API_URL + MODU_CF_API_SECRET 后启用。
 */

function baseUrl(): string | null {
  const u =
    process.env.MODU_CF_API_URL?.trim() ||
    process.env.VITE_CF_API_URL?.trim();
  return u ? u.replace(/\/$/, "") : null;
}

function secret(): string {
  return process.env.MODU_CF_API_SECRET?.trim() || "";
}

function storageUrl(key: string): string {
  const base = baseUrl()!;
  const path = key
    .split("/")
    .filter(Boolean)
    .map(encodeURIComponent)
    .join("/");
  return `${base}/storage/${path}`;
}

export function cloudflareWorkerConfigured(): boolean {
  return Boolean(baseUrl() && secret());
}

export async function cfWorkerHealth(): Promise<{
  ok: boolean;
  detail: string | null;
}> {
  const base = baseUrl();
  if (!base) return { ok: false, detail: null };
  try {
    const res = await fetch(`${base}/health`, {
      signal: AbortSignal.timeout(4000),
    });
    const text = await res.text();
    return { ok: res.ok, detail: text.slice(0, 500) };
  } catch (e) {
    return { ok: false, detail: String(e) };
  }
}

export async function cfWorkerAiChat(input: {
  messages: { role: string; content: string }[];
  system?: string;
  model?: string;
}): Promise<{ text: string; model?: string }> {
  const base = baseUrl();
  if (!base) throw new Error("MODU_CF_API_URL 未配置");
  const res = await fetch(`${base}/ai/chat`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-modu-secret": secret(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const t = await res.text().catch(() => "");
    throw new Error(`CF AI ${res.status}: ${t.slice(0, 200)}`);
  }
  const json = (await res.json()) as { text?: string; model?: string };
  if (!json.text) throw new Error("CF AI 返回为空");
  return { text: json.text, model: json.model };
}

export async function cfWorkerPutObject(input: {
  key: string;
  data: ArrayBuffer | Uint8Array | string;
  contentType?: string;
}): Promise<{ key: string; size: number }> {
  const base = baseUrl();
  if (!base) throw new Error("MODU_CF_API_URL 未配置");

  let body: BodyInit;
  if (typeof input.data === "string") {
    body = input.data;
  } else if (input.data instanceof ArrayBuffer) {
    body = input.data;
  } else {
    body = input.data.buffer.slice(
      input.data.byteOffset,
      input.data.byteOffset + input.data.byteLength,
    ) as ArrayBuffer;
  }

  const res = await fetch(storageUrl(input.key), {
    method: "PUT",
    headers: {
      "content-type": input.contentType || "application/octet-stream",
      "x-modu-secret": secret(),
    },
    body,
  });
  if (!res.ok) {
    throw new Error(`CF R2 put ${res.status}`);
  }
  return (await res.json()) as { key: string; size: number };
}
