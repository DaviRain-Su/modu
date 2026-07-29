import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import { getSessionUser } from "@/lib/auth/verify.server";

export type PublicProfile = {
  userId: string;
  displayName: string;
  bio: string;
  avatarUrl: string | null;
  plan: string;
  annotationCount: number;
  readCount: number;
};

async function ensureProfileRow(
  sql: Awaited<ReturnType<typeof getSql>>,
  userId: string,
  email?: string | null,
) {
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
}

export const ensureMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const session = await getSessionUser();
    await ensureProfileRow(sql, context.userId, session?.email);
    return { ok: true as const };
  });

export const getMyProfile = createServerFn({ method: "GET" })
  .middleware([authMiddleware])
  .handler(async ({ context }) => {
    const sql = await getSql();
    const session = await getSessionUser();
    await ensureProfileRow(sql, context.userId, session?.email);
    const rows = await sql<{
      user_id: string;
      display_name: string;
      bio: string;
      avatar_url: string | null;
      plan: string;
    }>`
      select p.user_id, p.display_name, p.bio, p.avatar_url, coalesce(s.plan, 'free') as plan
      from user_profiles p
      left join user_subscriptions s on s.user_id = p.user_id
      where p.user_id = ${context.userId}
    `;
    const r = rows[0];
    if (!r) throw new Error("Profile missing");
    return {
      userId: r.user_id,
      displayName: r.display_name,
      bio: r.bio,
      avatarUrl: r.avatar_url,
      plan: r.plan,
    };
  });

export const updateMyProfile = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator((input: { displayName: string; bio: string }) => ({
    displayName: input.displayName.trim().slice(0, 40),
    bio: input.bio.trim().slice(0, 280),
  }))
  .handler(async ({ context, data }) => {
    const sql = await getSql();
    await sql`
      update user_profiles
      set display_name = ${data.displayName || "读者"},
          bio = ${data.bio},
          updated_at = now()
      where user_id = ${context.userId}
    `;
    return { ok: true as const };
  });

export const getPublicProfile = createServerFn({ method: "GET" })
  .validator((userId: string) => userId.trim())
  .handler(async ({ data: userId }) => {
    const sql = await getSql();
    const rows = await sql<{
      user_id: string;
      display_name: string;
      bio: string;
      avatar_url: string | null;
      plan: string;
    }>`
      select p.user_id, p.display_name, p.bio, p.avatar_url, coalesce(s.plan, 'free') as plan
      from user_profiles p
      left join user_subscriptions s on s.user_id = p.user_id
      where p.user_id = ${userId}
    `;
    const r = rows[0];
    if (!r) return null;
    const ann = await sql<{ c: number }>`
      select count(*)::int as c from annotations where user_id = ${userId} and is_public = true
    `;
    const reads = await sql<{ c: number }>`
      select count(*)::int as c from book_reads where user_id = ${userId}
    `;
    return {
      userId: r.user_id,
      displayName: r.display_name,
      bio: r.bio,
      avatarUrl: r.avatar_url,
      plan: r.plan,
      annotationCount: ann[0]?.c ?? 0,
      readCount: reads[0]?.c ?? 0,
    } satisfies PublicProfile;
  });

export const listPublicAnnotationsByUser = createServerFn({ method: "GET" })
  .validator((userId: string) => userId.trim())
  .handler(async ({ data: userId }) => {
    const sql = await getSql();
    return sql<{
      id: string;
      book_id: string;
      quote: string;
      note: string;
      kind: string;
      created_at: string;
    }>`
      select id, book_id, quote, note, kind, created_at::text
      from annotations
      where user_id = ${userId} and is_public = true
      order by created_at desc
      limit 50
    `;
  });
