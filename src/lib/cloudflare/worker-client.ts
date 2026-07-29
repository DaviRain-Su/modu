/**
 * 主应用 → Cloudflare Worker 服务端客户端。
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
      signal: AbortSignal.timeout(5000),
    });
    const text = await res.text();
    return { ok: res.ok, detail: text.slice(0, 800) };
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

export async function cfWorkerGetObjectText(key: string): Promise<string | null> {
  const base = baseUrl();
  if (!base) return null;
  const res = await fetch(storageUrl(key), {
    method: "GET",
    headers: {
      "x-modu-secret": secret(),
    },
  });
  if (res.status === 404) return null;
  if (!res.ok) {
    throw new Error(`CF R2 get ${res.status}`);
  }
  return res.text();
}

export async function cfWorkerDeleteObject(key: string): Promise<void> {
  const base = baseUrl();
  if (!base) throw new Error("MODU_CF_API_URL 未配置");
  const res = await fetch(storageUrl(key), {
    method: "DELETE",
    headers: {
      "x-modu-secret": secret(),
    },
  });
  if (!res.ok && res.status !== 404) {
    throw new Error(`CF R2 delete ${res.status}`);
  }
}

export async function cfWorkerCreateStorageTicket(input: {
  key: string;
  method: "GET" | "PUT" | "DELETE";
  expiresInSeconds?: number;
}): Promise<{ key: string; method: string; url: string; expiresAt: number }> {
  const base = baseUrl();
  if (!base) throw new Error("MODU_CF_API_URL 未配置");
  const res = await fetch(`${base}/v1/storage/ticket`, {
    method: "POST",
    headers: {
      "content-type": "application/json",
      "x-modu-secret": secret(),
    },
    body: JSON.stringify(input),
  });
  if (!res.ok) {
    const text = await res.text().catch(() => "");
    throw new Error(`CF storage ticket ${res.status}: ${text.slice(0, 200)}`);
  }
  return (await res.json()) as {
    key: string;
    method: string;
    url: string;
    expiresAt: number;
  };
}

export async function cfWorkerEnsureProfile(input: {
  userId: string;
  displayName?: string;
}): Promise<void> {
  const base = baseUrl();
  if (!base || !secret()) return;
  try {
    await fetch(`${base}/v1/profile/ensure`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
        "x-modu-secret": secret(),
      },
      body: JSON.stringify(input),
    });
  } catch (e) {
    console.warn("[cf] ensure profile failed", e);
  }
}
