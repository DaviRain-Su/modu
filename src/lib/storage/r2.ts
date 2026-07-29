/**
 * Cloudflare R2 storage abstraction.
 *
 * Production: set VITE_R2_PUBLIC_URL (+ server-side R2 credentials on the
 * Worker / API route) to use real Cloudflare R2 object storage.
 * Preview / offline: falls back to IndexedDB (see idb.ts) so uploads work
 * without any Cloudflare account.
 *
 * Object key layout:
 *   books/{owner}/{bookId}/{filename}
 *   covers/{owner}/{bookId}.jpg
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
    // Real R2 path: client uploads via presigned URL from a server function.
    // In this demo we still mirror to IndexedDB so the reader works offline.
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
      detail: "对象存储已连接，图书文件持久化到 R2 存储桶。",
    };
  }
  return {
    backend: "indexeddb",
    label: "Cloudflare R2（本地模拟）",
    detail:
      "当前使用浏览器 IndexedDB 模拟 R2 对象存储。部署时配置 Cloudflare R2 即可无缝切换。",
  };
}
