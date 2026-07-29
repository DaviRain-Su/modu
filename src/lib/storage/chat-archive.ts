/**
 * Account-linked AI conversation archives (Cloudflare R2 layout).
 *
 * Key: ai-chats/{userId}/{bookId}/{conversationId}.json
 * Server: Postgres messages are the source of truth; optional R2 mirror.
 * Browser: IndexedDB cache only (never required on the server).
 */

import { idbGetObject, idbPutObject } from "./idb";
import {
  cfWorkerGetObjectText,
  cfWorkerPutObject,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";

export type ChatArchiveMessage = {
  id: string;
  role: string;
  content: string;
  kind?: string;
  quote?: string | null;
  createdAt: string;
};

export type ChatArchive = {
  conversationId: string;
  userId: string;
  bookId: string;
  title: string;
  messages: ChatArchiveMessage[];
  updatedAt: string;
  engine: string;
};

function isBrowser(): boolean {
  return typeof window !== "undefined" && typeof indexedDB !== "undefined";
}

export function chatArchiveKey(parts: {
  userId: string;
  bookId: string;
  conversationId: string;
}): string {
  return `ai-chats/${parts.userId}/${parts.bookId}/${parts.conversationId}.json`;
}

export async function putChatArchive(
  archive: ChatArchive,
): Promise<{ key: string; mirrored: boolean }> {
  const key = chatArchiveKey({
    userId: archive.userId,
    bookId: archive.bookId,
    conversationId: archive.conversationId,
  });
  const json = JSON.stringify(archive, null, 2);
  let mirrored = false;

  if (cloudflareWorkerConfigured()) {
    try {
      await cfWorkerPutObject({
        key,
        data: json,
        contentType: "application/json",
      });
      mirrored = true;
    } catch (e) {
      console.warn("[chat-archive] CF mirror failed", e);
    }
  }

  // Browser-only local cache. Server code must not depend on IndexedDB.
  if (isBrowser()) {
    try {
      const blob = new Blob([json], { type: "application/json" });
      await idbPutObject({
        key,
        blob,
        contentType: "application/json",
        size: blob.size,
        updatedAt: Date.now(),
      });
    } catch (e) {
      console.warn("[chat-archive] local cache write failed", e);
    }
  }

  return { key, mirrored };
}

export async function getChatArchive(
  key: string,
): Promise<ChatArchive | null> {
  if (cloudflareWorkerConfigured()) {
    try {
      const text = await cfWorkerGetObjectText(key);
      if (text) return JSON.parse(text) as ChatArchive;
    } catch (e) {
      console.warn("[chat-archive] CF read failed", e);
    }
  }

  if (!isBrowser()) return null;

  try {
    const obj = await idbGetObject(key);
    if (!obj) return null;
    const text = await obj.blob.text();
    return JSON.parse(text) as ChatArchive;
  } catch {
    return null;
  }
}
