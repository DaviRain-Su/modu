import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-UADDUZ8i.mjs";
import { r as getSql } from "./db-DKVoAHtB.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { t as getChatArchive } from "./chat-archive-BPLgYJPK.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ai-conversations-sXTeuntJ.js
var listMyConversations_createServerFn_handler = createServerRpc({
	id: "6fefea7c5a61163a3c2d6eb46986f0dc76c7cefb74fd62a2eff55ec3493054cd",
	name: "listMyConversations",
	filename: "src/lib/server/ai-conversations.ts"
}, (opts) => listMyConversations.__executeServer(opts));
var listMyConversations = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((input) => input ?? {}).handler(listMyConversations_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	const bookId = data.bookId?.trim();
	return (bookId ? await sql`
          select c.id, c.book_id, c.title, c.updated_at::text,
                 (select count(*)::int from ai_messages m where m.conversation_id = c.id) as c
          from ai_conversations c
          where c.user_id = ${context.userId} and c.book_id = ${bookId}
          order by c.updated_at desc
          limit 30
        ` : await sql`
          select c.id, c.book_id, c.title, c.updated_at::text,
                 (select count(*)::int from ai_messages m where m.conversation_id = c.id) as c
          from ai_conversations c
          where c.user_id = ${context.userId}
          order by c.updated_at desc
          limit 50
        `).map((r) => ({
		id: r.id,
		bookId: r.book_id,
		title: r.title,
		updatedAt: r.updated_at,
		messageCount: r.c
	}));
});
var getMyConversation_createServerFn_handler = createServerRpc({
	id: "b9146f1e5a21785371bed7f8711dab0c9c1ac66dcb28aaae11e93ee3ea999b47",
	name: "getMyConversation",
	filename: "src/lib/server/ai-conversations.ts"
}, (opts) => getMyConversation.__executeServer(opts));
var getMyConversation = createServerFn({ method: "GET" }).middleware([authMiddleware]).validator((id) => id.trim()).handler(getMyConversation_createServerFn_handler, async ({ context, data: id }) => {
	const sql = await getSql();
	const c = (await sql`
      select id, book_id, title, storage_key, updated_at::text
      from ai_conversations
      where id = ${id} and user_id = ${context.userId}
    `)[0];
	if (!c) return null;
	const messages = await sql`
      select id, role, content, kind, quote, created_at::text
      from ai_messages
      where conversation_id = ${id}
      order by created_at asc
    `;
	let archive = null;
	if (c.storage_key) archive = await getChatArchive(c.storage_key);
	return {
		id: c.id,
		bookId: c.book_id,
		title: c.title,
		storageKey: c.storage_key,
		updatedAt: c.updated_at,
		messages: messages.map((m) => ({
			id: m.id,
			role: m.role,
			content: m.content,
			kind: m.kind,
			quote: m.quote,
			createdAt: m.created_at
		})),
		archive
	};
});
var deleteMyConversation_createServerFn_handler = createServerRpc({
	id: "bd6d4ac2829137909f63c0378644abcf6f45320608ee557ca1f322402f849f07",
	name: "deleteMyConversation",
	filename: "src/lib/server/ai-conversations.ts"
}, (opts) => deleteMyConversation.__executeServer(opts));
var deleteMyConversation = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((id) => id.trim()).handler(deleteMyConversation_createServerFn_handler, async ({ context, data: id }) => {
	await (await getSql())`
      delete from ai_conversations
      where id = ${id} and user_id = ${context.userId}
    `;
	return { ok: true };
});
//#endregion
export { deleteMyConversation_createServerFn_handler, getMyConversation_createServerFn_handler, listMyConversations_createServerFn_handler };
