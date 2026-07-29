import { i as uid } from "./utils-D0dWsYTS.mjs";
import { a as idbListProgress, c as idbSaveProgress, i as idbListBookMeta, s as idbSaveBookMeta, t as idbDeleteBookMeta } from "./idb-Dffr1slE.mjs";
import { n as MARKET_BOOKS } from "./catalog-BpzRlWR9.mjs";
import { i as putBookFile, t as deleteBookFile } from "./r2-kRm6suj4.mjs";
import { t as create } from "../_libs/zustand.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/library---StLbl3.js
var SHELF_KEY = "modu_shelf_ids";
var OWNER = "local-reader";
function loadShelfIds() {
	if (typeof localStorage === "undefined") return [];
	try {
		const raw = localStorage.getItem(SHELF_KEY);
		return raw ? JSON.parse(raw) : [];
	} catch {
		return [];
	}
}
function saveShelfIds(ids) {
	if (typeof localStorage === "undefined") return;
	localStorage.setItem(SHELF_KEY, JSON.stringify(ids));
}
var useLibraryStore = create((set, get) => ({
	ready: false,
	shelfIds: [],
	uploaded: [],
	progressMap: {},
	init: async () => {
		if (get().ready) return;
		try {
			const uploaded = await idbListBookMeta();
			const progresses = await idbListProgress();
			const map = {};
			for (const p of progresses) map[p.bookId] = p;
			const shelfIds = loadShelfIds();
			const valid = /* @__PURE__ */ new Set([...MARKET_BOOKS.map((b) => b.id), ...uploaded.map((b) => b.id)]);
			const cleaned = shelfIds.filter((id) => valid.has(id));
			if (cleaned.length !== shelfIds.length) saveShelfIds(cleaned);
			set({
				ready: true,
				uploaded,
				shelfIds: cleaned,
				progressMap: map
			});
		} catch {
			set({
				ready: true,
				shelfIds: loadShelfIds()
			});
		}
	},
	addToShelf: (bookId) => {
		const ids = get().shelfIds;
		if (ids.includes(bookId)) return;
		const next = [bookId, ...ids];
		saveShelfIds(next);
		set({ shelfIds: next });
	},
	removeFromShelf: async (bookId) => {
		const next = get().shelfIds.filter((id) => id !== bookId);
		saveShelfIds(next);
		const book = get().uploaded.find((b) => b.id === bookId);
		if (book) {
			if (book.storageKey) await deleteBookFile(book.storageKey);
			await idbDeleteBookMeta(bookId);
			set({
				shelfIds: next,
				uploaded: get().uploaded.filter((b) => b.id !== bookId)
			});
		} else set({ shelfIds: next });
	},
	isOnShelf: (bookId) => get().shelfIds.includes(bookId),
	uploadBook: async (file, meta) => {
		const ext = file.name.split(".").pop()?.toLowerCase();
		const format = ext === "pdf" ? "pdf" : ext === "epub" ? "epub" : "text";
		if (format === "text" && ext !== "txt" && ext !== "md") throw new Error("仅支持 PDF、EPUB，或 TXT/MD 文本");
		const id = uid("upload");
		const baseTitle = meta?.title || file.name.replace(/\.[^.]+$/, "");
		const { key } = await putBookFile({
			owner: OWNER,
			bookId: id,
			fileName: file.name,
			blob: file,
			contentType: file.type
		});
		let chapters = void 0;
		if (format === "text") {
			const text = await file.text();
			chapters = [{
				id: `${id}_c1`,
				title: "全文",
				content: text
			}];
		}
		const book = {
			id,
			title: baseTitle,
			author: meta?.author || "我的上传",
			description: `本地上传 · ${file.name}`,
			coverColor: format === "pdf" ? "#3a2820" : format === "epub" ? "#1e2f38" : "#2a2a28",
			coverText: format.toUpperCase(),
			category: "生活",
			format,
			source: "upload",
			tags: ["上传", format.toUpperCase()],
			rating: 5,
			readers: 1,
			wordCount: Math.round(file.size / 2),
			storageKey: key,
			fileName: file.name,
			fileSize: file.size,
			chapters,
			createdAt: Date.now(),
			progress: 0
		};
		await idbSaveBookMeta(id, book);
		const shelfIds = [id, ...get().shelfIds.filter((x) => x !== id)];
		saveShelfIds(shelfIds);
		set({
			uploaded: [book, ...get().uploaded],
			shelfIds
		});
		return book;
	},
	getBook: (id) => {
		return get().uploaded.find((b) => b.id === id) || MARKET_BOOKS.find((b) => b.id === id);
	},
	allBooks: () => {
		return [...get().uploaded, ...MARKET_BOOKS];
	},
	shelfBooks: () => {
		const { shelfIds, getBook, progressMap } = get();
		return shelfIds.map((id) => {
			const b = getBook(id);
			if (!b) return null;
			const p = progressMap[id];
			return {
				...b,
				progress: p?.progress ?? b.progress ?? 0,
				lastReadAt: p?.updatedAt,
				lastChapterId: p?.lastChapterId,
				lastPage: p?.lastPage
			};
		}).filter(Boolean);
	},
	saveProgress: async (progress) => {
		await idbSaveProgress(progress.bookId, progress);
		set({ progressMap: {
			...get().progressMap,
			[progress.bookId]: progress
		} });
	},
	getProgress: (bookId) => get().progressMap[bookId]
}));
//#endregion
export { useLibraryStore as t };
