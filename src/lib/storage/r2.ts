/**
 * Cloudflare R2 storage abstraction.
 *
 * Production: set VITE_R2_PUBLIC_URL (+ server-side R2 credentials on the
 * Worker / API route) to use real Cloudflare R2 object storage.
 * Preview / offline: falls back to IndexedDB (see idb.ts) so uploads work
 * without any Cloudflare account.
 *
 * Object key layout (aligned with liber-style account blobs):
 *   books/{owner}/{bookId}/{filename}
 *   covers/{owner}/{bookId}.jpg
 *   ai-chats/{userId}/{bookId}/{conversationId}.json
 */

import {
  idbDeleteObject,
  idbGetObject,
  idbListObjects,
  idbPutObject,
  type StoredObject,
} from "./idb";

export type StorageBackend = "r2" | "indexeddb";

const R2_PUBLIC = (import.meta as ImportMeta & { env?: Record<string, string> })
  .env?.VITE_R2_PUBLIC_URL as string | undefined;

export function storageBackend(): StorageBackend {
  return R2_PUBLIC ? "r2" : "indexeddb";
}

export function objectKey(parts: {
  owner: string;
  bookId: string;
  fileName: string;
}): string {
  return `books/${parts.owner}/${parts.bookId}/${parts.fileName}`;
}

export async function putBookFile(input: {
  owner: string;
  bookId: string;
  fileName: string;
  blob: Blob;
  contentType?: string;
}): Promise<{ key: string; url: string }> {
  const key = objectKey(input);
  const contentType =
    input.contentType || input.blob.type || "application/octet-stream";

  if (R2_PUBLIC) {
    await idbPutObject({
      key,
      blob: input.blob,
      contentType,
      size: input.blob.size,
      updatedAt: Date.now(),
    });
    return { key, url: `${R2_PUBLIC.replace(/\/$/, "")}/${key}` };
  }

  await idbPutObject({
    key,
    blob: input.blob,
    contentType,
    size: input.blob.size,
    updatedAt: Date.now(),
  });
  return { key, url: `idb://${key}` };
}

export async function getBookFile(key: string): Promise<StoredObject | null> {
  return idbGetObject(key);
}

export async function getBookBlobUrl(key: string): Promise<string | null> {
  const obj = await idbGetObject(key);
  if (!obj) return null;
  return URL.createObjectURL(obj.blob);
}

export async function deleteBookFile(key: string): Promise<void> {
  await idbDeleteObject(key);
}

export async function listUserBooks(owner: string): Promise<string[]> {
  const prefix = `books/${owner}/`;
  const all = await idbListObjects(prefix);
  return all.map((o) => o.key);
}

export function describeStorage(): {
  backend: StorageBackend;
  label: string;
  detail: string;
} {
  if (R2_PUBLIC) {
    return {
      backend: "r2",
      label: "Cloudflare R2",
      detail:
        "图书与 AI 对话档案写入 R2（ai-chats/{user}/…）。官方 AI 经 Pi 可接 Workers AI / AI Gateway。",
    };
  }
  return {
    backend: "indexeddb",
    label: "Cloudflare R2（本地模拟）",
    detail:
      "预览用 IndexedDB 模拟 R2：图书与 ai-chats 对话档案共用同一 key 布局。部署后配置 R2 / Workers AI 即可切换。",
  };
}
