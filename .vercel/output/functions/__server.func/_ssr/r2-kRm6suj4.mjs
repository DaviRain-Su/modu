import { n as idbDeleteObject, o as idbPutObject, r as idbGetObject } from "./idb-Dffr1slE.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r2-kRm6suj4.js
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
function objectKey(parts) {
	return `books/${parts.owner}/${parts.bookId}/${parts.fileName}`;
}
async function putBookFile(input) {
	const key = objectKey(input);
	const contentType = input.contentType || input.blob.type || "application/octet-stream";
	await idbPutObject({
		key,
		blob: input.blob,
		contentType,
		size: input.blob.size,
		updatedAt: Date.now()
	});
	return {
		key,
		url: `idb://${key}`
	};
}
async function getBookBlobUrl(key) {
	const obj = await idbGetObject(key);
	if (!obj) return null;
	return URL.createObjectURL(obj.blob);
}
async function deleteBookFile(key) {
	await idbDeleteObject(key);
}
function describeStorage() {
	return {
		backend: "indexeddb",
		label: "Cloudflare R2（本地模拟）",
		detail: "预览用 IndexedDB 模拟 R2：图书与 ai-chats 对话档案共用同一 key 布局。部署后配置 R2 / Workers AI 即可切换。"
	};
}
//#endregion
export { putBookFile as i, describeStorage as n, getBookBlobUrl as r, deleteBookFile as t };
