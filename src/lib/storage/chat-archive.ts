/**
 * Account-linked AI conversation archives (Cloudflare R2 layout).
 *
 * Key layout mirrors liber's user-scoped blobs:
 *   ai-chats/{userId}/{bookId}/{conversationId}.json
 *
 * Preview: IndexedDB. Production: same keys under R2 when VITE_R2_PUBLIC_URL is set.
 */

import { idbGetObject, idbPutObject } from "./idb";

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
  const blob = new Blob([JSON.stringify(archive, null, 2)], {
    type: "application/json",
  });
  await idbPutObject({
    key,
    blob,
    contentType: "application/json",
    size: blob.size,
    updatedAt: Date.now(),
  });
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
