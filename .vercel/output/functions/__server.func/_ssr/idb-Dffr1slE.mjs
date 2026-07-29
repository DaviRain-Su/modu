import { t as openDB } from "../_libs/idb.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/idb-Dffr1slE.js
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
//#endregion
export { idbListProgress as a, idbSaveProgress as c, idbListBookMeta as i, idbDeleteObject as n, idbPutObject as o, idbGetObject as r, idbSaveBookMeta as s, idbDeleteBookMeta as t };
