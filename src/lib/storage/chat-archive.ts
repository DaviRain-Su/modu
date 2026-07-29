/**
 * Account-linked AI conversation archives (Cloudflare R2 layout).
 *
 * Key: ai-chats/{userId}/{bookId}/{conversationId}.json
 * Preview: IndexedDB. With MODU_CF_API_* : also mirrors to Worker R2.
 */

import { idbGetObject, idbPutObject } from "./idb";
import {
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

export function chatArchiveKey(parts: {
  userId: string;
  bookId: string;
  conversationId: string;
}): string {
  return `ai-chats/${parts.userId}/${parts.bookId}/${parts.conversationId}.json`;
}

export async function putChatArchive(archive: ChatArchive): Promise<{ key: string }> {
  const key = chatArchiveKey({
    userId: archive.userId,
    bookId: archive.bookId,
    conversationId: archive.conversationId,
  });
  const json = JSON.stringify(archive, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  await idbPutObject({
    key,
    blob,
    contentType: "application/json",
    size: blob.size,
    updatedAt: Date.now(),
  });

  if (cloudflareWorkerConfigured()) {
    try {
      await cfWorkerPutObject({
        key,
        data: json,
        contentType: "application/json",
      });
    } catch (e) {
      console.warn("[chat-archive] CF mirror failed", e);
    }
  }

  return { key };
}

export async function getChatArchive(
  key: string,
): Promise<ChatArchive | null> {
  const obj = await idbGetObject(key);
  if (!obj) return null;
  try {
    const text = await obj.blob.text();
    return JSON.parse(text) as ChatArchive;
  } catch {
    return null;
  }
}
