import { i as createServerFn } from "./ssr.mjs";
import { t as authMiddleware } from "./middleware-CHxE_ZiV.mjs";
import { i as getSql } from "./db-BwYgqUFs.mjs";
import { t as createServerRpc } from "./createServerRpc-CcvdN_gc.mjs";
import { n as cfWorkerEnsureProfile } from "./worker-client-BJ3tkfEZ.mjs";
import { getSessionUser } from "./verify.server-uzTvClrZ.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/profile-BNzdix3g.js
async function ensureProfileRow(sql, userId, email) {
	const fallback = email?.split("@")[0] || "读者";
	await sql`
    insert into user_profiles (user_id, display_name)
    values (${userId}, ${fallback})
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into user_subscriptions (user_id, plan, status)
    values (${userId}, 'free', 'active')
    on conflict (user_id) do nothing
  `;
	await sql`
    insert into user_ai_settings (user_id, provider)
    values (${userId}, 'official')
    on conflict (user_id) do nothing
  `;
	await cfWorkerEnsureProfile({
		userId,
		displayName: fallback
	});
}
var ensureMyProfile_createServerFn_handler = createServerRpc({
	id: "b1e72ad542101f5c789eb6af686d9cae40dbfbcd7e8099043e24e1a56dd62980",
	name: "ensureMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => ensureMyProfile.__executeServer(opts));
var ensureMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).handler(ensureMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const session = await getSessionUser();
	await ensureProfileRow(sql, context.userId, session?.email);
	return { ok: true };
});
var getMyProfile_createServerFn_handler = createServerRpc({
	id: "43089abf67b0d2fc04dd8ee11c57f4f4a6f26a675e0ebab772a5634a77d97f36",
	name: "getMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => getMyProfile.__executeServer(opts));
var getMyProfile = createServerFn({ method: "GET" }).middleware([authMiddleware]).handler(getMyProfile_createServerFn_handler, async ({ context }) => {
	const sql = await getSql();
	const session = await getSessionUser();
	await ensureProfileRow(sql, context.userId, session?.email);
	const r = (await sql`
      select p.user_id, p.display_name, p.bio, p.avatar_url, coalesce(s.plan, 'free') as plan
      from user_profiles p
      left join user_subscriptions s on s.user_id = p.user_id
      where p.user_id = ${context.userId}
    `)[0];
	if (!r) throw new Error("Profile missing");
	return {
		userId: r.user_id,
		displayName: r.display_name,
		bio: r.bio,
		avatarUrl: r.avatar_url,
		plan: r.plan
	};
});
var updateMyProfile_createServerFn_handler = createServerRpc({
	id: "2516a54386004386c896f1a0ac5bdf163cb6fe80f8ce05136f7c7b30edbcc98d",
	name: "updateMyProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => updateMyProfile.__executeServer(opts));
var updateMyProfile = createServerFn({ method: "POST" }).middleware([authMiddleware]).validator((input) => ({
	displayName: input.displayName.trim().slice(0, 40),
	bio: input.bio.trim().slice(0, 280)
})).handler(updateMyProfile_createServerFn_handler, async ({ context, data }) => {
	const sql = await getSql();
	await ensureProfileRow(sql, context.userId);
	await sql`
      update user_profiles
      set display_name = ${data.displayName},
          bio = ${data.bio},
          updated_at = now()
      where user_id = ${context.userId}
    `;
	await cfWorkerEnsureProfile({
		userId: context.userId,
		displayName: data.displayName
	});
	return { ok: true };
});
var getPublicProfile_createServerFn_handler = createServerRpc({
	id: "0e7a8b2c9bea19bdb107f5b2b2da3c2ee12deed900d6705770e11c06c6ac9d7a",
	name: "getPublicProfile",
	filename: "src/lib/server/profile.ts"
}, (opts) => getPublicProfile.__executeServer(opts));
var getPublicProfile = createServerFn({ method: "GET" }).validator((input) => input).handler(getPublicProfile_createServerFn_handler, async ({ data }) => {
	const sql = await getSql();
	const r = (await sql`
      select p.user_id, p.display_name, p.bio, p.avatar_url, coalesce(s.plan, 'free') as plan
      from user_profiles p
      left join user_subscriptions s on s.user_id = p.user_id
      where p.user_id = ${data.userId}
    `)[0];
	if (!r) return null;
	const ann = await sql`
      select count(*)::int as c from annotations
      where user_id = ${data.userId} and is_public = true
    `;
	const reads = await sql`
      select count(*)::int as c from book_reads where user_id = ${data.userId}
    `;
	return {
		userId: r.user_id,
		displayName: r.display_name,
		bio: r.bio,
		avatarUrl: r.avatar_url,
		plan: r.plan,
		annotationCount: ann[0]?.c ?? 0,
		readCount: reads[0]?.c ?? 0
	};
});
var listPublicAnnotationsByUser_createServerFn_handler = createServerRpc({
	id: "85b36a8ae330be55ee95794310da400d61502ab34f6b4021345db19b8fbeffbb",
	name: "listPublicAnnotationsByUser",
	filename: "src/lib/server/profile.ts"
}, (opts) => listPublicAnnotationsByUser.__executeServer(opts));
var listPublicAnnotationsByUser = createServerFn({ method: "GET" }).validator((input) => input).handler(listPublicAnnotationsByUser_createServerFn_handler, async ({ data }) => {
	return (await getSql())`
      select id, book_id, quote, note, coalesce(kind, 'note') as kind, created_at::text
      from annotations
      where user_id = ${data.userId} and is_public = true
      order by created_at desc
      limit 50
    `;
});
//#endregion
export { ensureMyProfile_createServerFn_handler, getMyProfile_createServerFn_handler, getPublicProfile_createServerFn_handler, listPublicAnnotationsByUser_createServerFn_handler, updateMyProfile_createServerFn_handler };
