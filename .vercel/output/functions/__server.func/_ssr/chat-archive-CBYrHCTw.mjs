import { a as cloudflareWorkerConfigured, i as cfWorkerPutObject } from "./worker-client-BJ3tkfEZ.mjs";
import { o as idbPutObject, r as idbGetObject } from "./idb-Dffr1slE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-archive-CBYrHCTw.js
/**
* Account-linked AI conversation archives (Cloudflare R2 layout).
*
* Key: ai-chats/{userId}/{bookId}/{conversationId}.json
* Preview: IndexedDB. With MODU_CF_API_* : also mirrors to Worker R2.
*/
function chatArchiveKey(parts) {
	return `ai-chats/${parts.userId}/${parts.bookId}/${parts.conversationId}.json`;
}
async function putChatArchive(archive) {
	const key = chatArchiveKey({
		userId: archive.userId,
		bookId: archive.bookId,
		conversationId: archive.conversationId
	});
	const json = JSON.stringify(archive, null, 2);
	const blob = new Blob([json], { type: "application/json" });
	await idbPutObject({
		key,
		blob,
		contentType: "application/json",
		size: blob.size,
		updatedAt: Date.now()
	});
	if (cloudflareWorkerConfigured()) try {
		await cfWorkerPutObject({
			key,
			data: json,
			contentType: "application/json"
		});
	} catch (e) {
		console.warn("[chat-archive] CF mirror failed", e);
	}
	return { key };
}
async function getChatArchive(key) {
	const obj = await idbGetObject(key);
	if (!obj) return null;
	try {
		const text = await obj.blob.text();
		return JSON.parse(text);
	} catch {
		return null;
	}
}
//#endregion
export { putChatArchive as n, getChatArchive as t };
