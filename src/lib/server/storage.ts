import { createServerFn } from "@tanstack/react-start";
import { authMiddleware } from "@/lib/auth/middleware";
import {
  cfWorkerCreateStorageTicket,
  cloudflareWorkerConfigured,
} from "@/lib/cloudflare/worker-client";

function cleanSegment(value: unknown, label: string, max = 180): string {
  const text = typeof value === "string" ? value.trim().slice(0, max) : "";
  if (!text || text === "." || text === ".." || /[\\/\0]/.test(text)) {
    throw new Error(`${label} 无效`);
  }
  return text;
}

function parseBookKey(key: string): {
  owner: string;
  bookId: string;
  fileName: string;
} | null {
  const parts = key.split("/").filter(Boolean);
  if (parts.length !== 4 || parts[0] !== "books") return null;
  try {
    return {
      owner: cleanSegment(parts[1], "账户 ID"),
      bookId: cleanSegment(parts[2], "图书 ID"),
      fileName: cleanSegment(parts[3], "文件名", 240),
    };
  } catch {
    return null;
  }
}

export const isObjectStorageConfigured = createServerFn({ method: "GET" })
  .handler(async () => ({
    configured: cloudflareWorkerConfigured(),
  }));

export const createBookUploadTicket = createServerFn({ method: "POST" })
  .validator((input: { bookId: string; fileName: string }) => ({
    bookId: cleanSegment(input.bookId, "图书 ID"),
    fileName: cleanSegment(input.fileName, "文件名", 240),
  }))
  .middleware([authMiddleware])
  .handler(async ({ context, data }) => {
    if (!cloudflareWorkerConfigured()) {
      throw new Error("对象存储未配置");
    }
    const key = `books/${context.userId}/${data.bookId}/${data.fileName}`;
    return cfWorkerCreateStorageTicket({ key, method: "PUT" });
  });

export const createBookReadTicket = createServerFn({ method: "POST" })
  .validator((key: string) => key.trim().slice(0, 700))
  .middleware([authMiddleware])
  .handler(async ({ context, data: key }) => {
    if (!cloudflareWorkerConfigured()) {
      throw new Error("对象存储未配置");
    }
    const parsed = parseBookKey(key);
    if (!parsed || parsed.owner !== context.userId) {
      throw new Error("无权读取此图书文件");
    }
    return cfWorkerCreateStorageTicket({ key, method: "GET" });
  });

export const createBookDeleteTicket = createServerFn({ method: "POST" })
  .validator((key: string) => key.trim().slice(0, 700))
  .middleware([authMiddleware])
  .handler(async ({ context, data: key }) => {
    if (!cloudflareWorkerConfigured()) {
      throw new Error("对象存储未配置");
    }
    const parsed = parseBookKey(key);
    if (!parsed || parsed.owner !== context.userId) {
      throw new Error("无权删除此图书文件");
    }
    return cfWorkerCreateStorageTicket({ key, method: "DELETE" });
  });
