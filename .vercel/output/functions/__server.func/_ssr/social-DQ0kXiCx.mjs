import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-UADDUZ8i.mjs";
import { t as createSsrRpc } from "./createSsrRpc-B2Izd0c7.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-DQ0kXiCx.js
var recordBookRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((bookId) => bookId.trim()).handler(createSsrRpc("bb1f1147934a0dd82d418e1c2eb7cfbc1517d8c2db5555fa59596d47f7e7b887"));
var createAnnotation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookId: input.bookId.trim(),
	quote: input.quote.trim().slice(0, 2e3),
	note: (input.note ?? "").trim().slice(0, 2e3),
	chapterId: input.chapterId?.trim() || null,
	page: input.page ?? null,
	kind: input.kind ?? "highlight",
	isPublic: input.isPublic !== false
})).handler(createSsrRpc("f5041d0d880fa3e5b9247ff303599589c781305ce5ef6c50d03faae34f0e0663"));
var listBookAnnotations = createServerFn({ method: "GET" }).validator((bookId) => bookId.trim()).handler(createSsrRpc("27b10c1d8c7e00d5686f848f268be1a26b613a93d30f3574b14090b94325a71c"));
createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id.trim()).handler(createSsrRpc("ce541efa2c439727e0f9e86d79be680c3416c1cd55a54e4d124f22cf8bbadd88"));
var getHotBooks = createServerFn({ method: "GET" }).handler(createSsrRpc("585cc5b942e2224ddaa8724ac475bb370fce65febae60730b76a3bf55b068d7b"));
var getRecentPublicNotes = createServerFn({ method: "GET" }).handler(createSsrRpc("89d9d67ad3f11396b0fc4a61cda83e3a154a5fa5185a090dd994cd581cad6587"));
//#endregion
export { recordBookRead as a, listBookAnnotations as i, getHotBooks as n, getRecentPublicNotes as r, createAnnotation as t };
