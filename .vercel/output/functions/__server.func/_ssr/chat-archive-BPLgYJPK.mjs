import { o as idbPutObject, r as idbGetObject } from "./idb-Dffr1slE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/chat-archive-BPLgYJPK.js
/**
* Account-linked AI conversation archives (Cloudflare R2 layout).
*
* Key layout mirrors liber's user-scoped blobs:
*   ai-chats/{userId}/{bookId}/{conversationId}.json
*
* Preview: IndexedDB. Production: same keys under R2 when VITE_R2_PUBLIC_URL is set.
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
	const blob = new Blob([JSON.stringify(archive, null, 2)], { type: "application/json" });
	await idbPutObject({
		key,
		blob,
		contentType: "application/json",
		size: blob.size,
		updatedAt: Date.now()
	});
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
