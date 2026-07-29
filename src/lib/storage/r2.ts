/**
 * Object storage for uploaded books.
 * - With Cloudflare Worker: signed tickets → R2 (plus local IDB cache)
 * - Offline / unconfigured: IndexedDB only
 */

import {
  idbDeleteObject,
  idbGetObject,
  idbListObjects,
  idbPutObject,
  type StoredObject,
} from "./idb";
import {
  createBookDeleteTicket,
  createBookReadTicket,
  createBookUploadTicket,
} from "@/lib/server/storage";

export type StorageBackend = "r2" | "indexeddb";

const R2_PUBLIC = (import.meta as ImportMeta & { env?: Record<string, string> })
  .env?.VITE_R2_PUBLIC_URL as string | undefined;

const CF_API_HINT = (import.meta as ImportMeta & {
  env?: Record<string, string>;
}).env?.VITE_CF_API_URL as string | undefined;

export function storageBackend(): StorageBackend {
  return CF_API_HINT?.trim() || R2_PUBLIC?.trim() ? "r2" : "indexeddb";
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
}): Promise<{ key: string; url: string; backend: StorageBackend }> {
  const key = objectKey(input);
  const contentType =
    input.contentType || input.blob.type || "application/octet-stream";

  // Always keep a local cache so the reader works offline.
  await idbPutObject({
    key,
    blob: input.blob,
    contentType,
    size: input.blob.size,
    updatedAt: Date.now(),
  });

  try {
    const ticket = await createBookUploadTicket({
      data: { bookId: input.bookId, fileName: input.fileName },
    });
    const res = await fetch(ticket.url, {
      method: "PUT",
      headers: { "content-type": contentType },
      body: input.blob,
    });
    if (!res.ok) throw new Error(`R2 upload failed (${res.status})`);
    return {
      key: ticket.key || key,
      url: R2_PUBLIC
        ? `${R2_PUBLIC.replace(/\/$/, "")}/${ticket.key || key}`
        : ticket.url.split("?")[0]!,
      backend: "r2",
    };
  } catch (error) {
    console.warn("[storage] R2 upload unavailable, kept local copy", error);
  }

  return { key, url: `idb://${key}`, backend: "indexeddb" };
}

export async function getBookFile(key: string): Promise<StoredObject | null> {
  const local = await idbGetObject(key);
  if (local) return local;

  try {
    const ticket = await createBookReadTicket({ data: key });
    const res = await fetch(ticket.url);
    if (!res.ok) return null;
    const blob = await res.blob();
    const contentType =
      res.headers.get("content-type") || "application/octet-stream";
    const obj: StoredObject = {
      key,
      blob,
      contentType,
      size: blob.size,
      updatedAt: Date.now(),
    };
    await idbPutObject(obj);
    return obj;
  } catch (error) {
    console.warn("[storage] R2 read failed", error);
    return null;
  }
}

export async function getBookBlobUrl(key: string): Promise<string | null> {
  const obj = await getBookFile(key);
  if (!obj) return null;
  return URL.createObjectURL(obj.blob);
}

export async function deleteBookFile(key: string): Promise<void> {
  await idbDeleteObject(key);
  try {
    const ticket = await createBookDeleteTicket({ data: key });
    await fetch(ticket.url, { method: "DELETE" });
  } catch (error) {
    console.warn("[storage] R2 delete failed", error);
  }
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
  if (storageBackend() === "r2") {
    return {
      backend: "r2",
      label: "Cloudflare R2",
      detail:
        "登录后上传经 Worker 签名写入 R2，本机保留缓存副本以便离线阅读。",
    };
  }
  return {
    backend: "indexeddb",
    label: "本机对象存储",
    detail:
      "当前未配置 Cloudflare Worker 时，图书保存在本机 IndexedDB。配置后将写入 R2。",
  };
}
