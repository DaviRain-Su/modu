import { i as uid } from "./utils-D0dWsYTS.mjs";
import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CHxE_ZiV.mjs";
import { i as getSql } from "./db-BwYgqUFs.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { getSessionUser } from "./verify.server-uzTvClrZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/social-DT3Ldey_.js
async function ensureProfile(sql, userId) {
	await sql`
    insert into user_profiles (user_id, display_name)
    values (${userId}, ${(await getSessionUser())?.email?.split("@")[0] || "读者"})
    on conflict (user_id) do nothing
  `;
}
var recordBookRead_createServerFn_handler = createServerRpc({
	id: "bb1f1147934a0dd82d418e1c2eb7cfbc1517d8c2db5555fa59596d47f7e7b887",
	name: "recordBookRead",
	filename: "src/lib/server/social.ts"
}, (opts) => recordBookRead.__executeServer(opts));
var recordBookRead = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((bookId) => bookId.trim()).handler(recordBookRead_createServerFn_handler, async ({ context, data: bookId }) => {
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	await sql`
      insert into book_reads (user_id, book_id) values (${context.userId}, ${bookId})
    `;
	return { ok: true };
});
var createAnnotation_createServerFn_handler = createServerRpc({
	id: "f5041d0d880fa3e5b9247ff303599589c781305ce5ef6c50d03faae34f0e0663",
	name: "createAnnotation",
	filename: "src/lib/server/social.ts"
}, (opts) => createAnnotation.__executeServer(opts));
var createAnnotation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	bookId: input.bookId.trim(),
	quote: input.quote.trim().slice(0, 2e3),
	note: (input.note ?? "").trim().slice(0, 2e3),
	chapterId: input.chapterId?.trim() || null,
	page: input.page ?? null,
	kind: input.kind ?? "highlight",
	isPublic: input.isPublic !== false
})).handler(createAnnotation_createServerFn_handler, async ({ context, data }) => {
	if (!data.quote) throw new Error("请选择或输入画线内容");
	const sql = await getSql();
	await ensureProfile(sql, context.userId);
	const id = uid("ann");
	await sql`
      insert into annotations (
        id, user_id, book_id, chapter_id, page, quote, note, kind, is_public
      ) values (
        ${id},
        ${context.userId},
        ${data.bookId},
        ${data.chapterId},
        ${data.page},
        ${data.quote},
        ${data.note},
        ${data.kind},
        ${data.isPublic}
      )
    `;
	return { id };
});
var listBookAnnotations_createServerFn_handler = createServerRpc({
	id: "27b10c1d8c7e00d5686f848f268be1a26b613a93d30f3574b14090b94325a71c",
	name: "listBookAnnotations",
	filename: "src/lib/server/social.ts"
}, (opts) => listBookAnnotations.__executeServer(opts));
var listBookAnnotations = createServerFn({ method: "GET" }).validator((bookId) => bookId.trim()).handler(listBookAnnotations_createServerFn_handler, async ({ data: bookId }) => {
	return (await (await getSql())`
      select a.id, a.user_id, coalesce(p.display_name, '读者') as display_name,
             a.book_id, a.chapter_id, a.page, a.quote, a.note, a.kind,
             a.is_public, a.created_at::text
      from annotations a
      left join user_profiles p on p.user_id = a.user_id
      where a.book_id = ${bookId} and a.is_public = true
      order by a.created_at desc
      limit 80
    `).map((r) => ({
		id: r.id,
		userId: r.user_id,
		displayName: r.display_name,
		bookId: r.book_id,
		chapterId: r.chapter_id,
		page: r.page,
		quote: r.quote,
		note: r.note,
		kind: r.kind,
		isPublic: r.is_public,
		createdAt: r.created_at
	}));
});
var deleteMyAnnotation_createServerFn_handler = createServerRpc({
	id: "ce541efa2c439727e0f9e86d79be680c3416c1cd55a54e4d124f22cf8bbadd88",
	name: "deleteMyAnnotation",
	filename: "src/lib/server/social.ts"
}, (opts) => deleteMyAnnotation.__executeServer(opts));
var deleteMyAnnotation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id.trim()).handler(deleteMyAnnotation_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`
      delete from annotations where id = ${id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
var getHotBooks_createServerFn_handler = createServerRpc({
	id: "585cc5b942e2224ddaa8724ac475bb370fce65febae60730b76a3bf55b068d7b",
	name: "getHotBooks",
	filename: "src/lib/server/social.ts"
}, (opts) => getHotBooks.__executeServer(opts));
var getHotBooks = createServerFn({ method: "GET" }).handler(getHotBooks_createServerFn_handler, async () => {
	const sql = await getSql();
	const reads = await sql`
      select book_id, count(*)::int as c from book_reads group by book_id
    `;
	const anns = await sql`
      select book_id, count(*)::int as c from annotations
      where is_public = true group by book_id
    `;
	const map = /* @__PURE__ */ new Map();
	for (const r of reads) map.set(r.book_id, {
		bookId: r.book_id,
		readCount: r.c,
		annotationCount: 0,
		score: r.c * 2
	});
	for (const a of anns) {
		const cur = map.get(a.book_id);
		if (cur) {
			cur.annotationCount = a.c;
			cur.score = cur.readCount * 2 + a.c * 3;
		} else map.set(a.book_id, {
			bookId: a.book_id,
			readCount: 0,
			annotationCount: a.c,
			score: a.c * 3
		});
	}
	return [...map.values()].sort((a, b) => b.score - a.score).slice(0, 20);
});
var getRecentPublicNotes_createServerFn_handler = createServerRpc({
	id: "89d9d67ad3f11396b0fc4a61cda83e3a154a5fa5185a090dd994cd581cad6587",
	name: "getRecentPublicNotes",
	filename: "src/lib/server/social.ts"
}, (opts) => getRecentPublicNotes.__executeServer(opts));
var getRecentPublicNotes = createServerFn({ method: "GET" }).handler(getRecentPublicNotes_createServerFn_handler, async () => {
	return (await (await getSql())`
      select a.id, a.user_id, coalesce(p.display_name, '读者') as display_name,
             a.book_id, a.quote, a.note, a.created_at::text
      from annotations a
      left join user_profiles p on p.user_id = a.user_id
      where a.is_public = true and a.note <> ''
      order by a.created_at desc
      limit 30
    `).map((r) => ({
		id: r.id,
		userId: r.user_id,
		displayName: r.display_name,
		bookId: r.book_id,
		quote: r.quote,
		note: r.note,
		createdAt: r.created_at
	}));
});
//#endregion
export { createAnnotation_createServerFn_handler, deleteMyAnnotation_createServerFn_handler, getHotBooks_createServerFn_handler, getRecentPublicNotes_createServerFn_handler, listBookAnnotations_createServerFn_handler, recordBookRead_createServerFn_handler };
