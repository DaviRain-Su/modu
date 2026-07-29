import { t as openDB } from "../_libs/idb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/r2-Cy3jOD0T.js
var DB_NAME = "modu-reader";
var DB_VERSION = 1;
var dbPromise = null;
function getDb() {
	if (typeof indexedDB === "undefined") return Promise.reject(/* @__PURE__ */ new Error("IndexedDB unavailable"));
	if (!dbPromise) dbPromise = openDB(DB_NAME, DB_VERSION, { upgrade(db) {
		if (!db.objectStoreNames.contains("objects")) db.createObjectStore("objects", { keyPath: "key" });
		if (!db.objectStoreNames.contains("books")) db.createObjectStore("books", { keyPath: "id" });
		if (!db.objectStoreNames.contains("progress")) db.createObjectStore("progress", { keyPath: "bookId" });
	} });
	return dbPromise;
}
async function idbPutObject(obj) {
	await (await getDb()).put("objects", obj);
}
async function idbGetObject(key) {
	return await (await getDb()).get("objects", key) ?? null;
}
async function idbDeleteObject(key) {
	await (await getDb()).delete("objects", key);
}
async function idbSaveBookMeta(id, data) {
	await (await getDb()).put("books", {
		id,
		json: JSON.stringify(data),
		updatedAt: Date.now()
	});
}
async function idbListBookMeta() {
	return (await (await getDb()).getAll("books")).map((r) => JSON.parse(r.json));
}
async function idbDeleteBookMeta(id) {
	await (await getDb()).delete("books", id);
}
async function idbSaveProgress(bookId, data) {
	await (await getDb()).put("progress", {
		bookId,
		json: JSON.stringify(data),
		updatedAt: Date.now()
	});
}
async function idbListProgress() {
	return (await (await getDb()).getAll("progress")).map((r) => JSON.parse(r.json));
}
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
		detail: "当前使用浏览器 IndexedDB 模拟 R2 对象存储。部署时配置 Cloudflare R2 即可无缝切换。"
	};
}
//#endregion
export { idbListBookMeta as a, idbSaveProgress as c, idbDeleteBookMeta as i, putBookFile as l, describeStorage as n, idbListProgress as o, getBookBlobUrl as r, idbSaveBookMeta as s, deleteBookFile as t };
