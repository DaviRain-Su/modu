/**
 * Better Auth on Cloudflare D1 — 持久登录（Google / X / 邮箱）。
 * 主应用通过 /api/auth/* 反代到本 Worker，cookie 仍落在 APP_ORIGIN。
 *
 * Uses a lightweight D1 adapter (Kysely-compatible surface) so we do not depend
 * on drizzle-orm being installed in the Worker bundle.
 */
import { betterAuth } from "better-auth";
import { bearer, genericOAuth } from "better-auth/plugins";
import type { Env } from "./env";
import { appOrigin, parseAllowedOrigins } from "./env";

const GROK_PROVIDERS = [
  { providerId: "grok-google", idp: "google" },
  { providerId: "grok-x", idp: "twitter" },
] as const;

const GROK_ISSUER_DEFAULT = "https://auth.grok.me";
const PREVIEW_CLIENT_ID = "grok_preview";
const PREVIEW_CLIENT_SECRET =
  "8bcdb7fc5a33874ad933ca568918d5790388a0795e44c4d1dea691f801b17ec5";

type Where = {
  field: string;
  value: unknown;
  operator?: string;
  connector?: "AND" | "OR";
};

type Sort = { field: string; direction: "asc" | "desc" };

function quoteIdent(name: string): string {
  return `"${name.replace(/"/g, '""')}"`;
}

function toSqlValue(value: unknown): unknown {
  if (value instanceof Date) return value.toISOString();
  if (typeof value === "boolean") return value ? 1 : 0;
  return value;
}

function buildWhere(where?: Where[]): { sql: string; params: unknown[] } {
  if (!where?.length) return { sql: "", params: [] };
  const parts: string[] = [];
  const params: unknown[] = [];
  where.forEach((clause, index) => {
    const connector =
      index === 0 ? "" : ` ${clause.connector === "OR" ? "OR" : "AND"} `;
    const field = quoteIdent(clause.field);
    const op = clause.operator || "eq";
    if (op === "in") {
      const values = Array.isArray(clause.value) ? clause.value : [clause.value];
      if (!values.length) {
        parts.push(`${connector}1 = 0`);
        return;
      }
      parts.push(
        `${connector}${field} in (${values.map(() => "?").join(", ")})`,
      );
      params.push(...values.map(toSqlValue));
      return;
    }
    if (op === "ne" || op === "not_eq") {
      parts.push(`${connector}${field} != ?`);
      params.push(toSqlValue(clause.value));
      return;
    }
    if (op === "gt") {
      parts.push(`${connector}${field} > ?`);
      params.push(toSqlValue(clause.value));
      return;
    }
    if (op === "gte") {
      parts.push(`${connector}${field} >= ?`);
      params.push(toSqlValue(clause.value));
      return;
    }
    if (op === "lt") {
      parts.push(`${connector}${field} < ?`);
      params.push(toSqlValue(clause.value));
      return;
    }
    if (op === "lte") {
      parts.push(`${connector}${field} <= ?`);
      params.push(toSqlValue(clause.value));
      return;
    }
    if (op === "contains") {
      parts.push(`${connector}${field} like ?`);
      params.push(`%${clause.value}%`);
      return;
    }
    if (op === "starts_with") {
      parts.push(`${connector}${field} like ?`);
      params.push(`${clause.value}%`);
      return;
    }
    if (op === "ends_with") {
      parts.push(`${connector}${field} like ?`);
      params.push(`%${clause.value}`);
      return;
    }
    parts.push(`${connector}${field} = ?`);
    params.push(toSqlValue(clause.value));
  });
  return { sql: ` where ${parts.join("")}`, params };
}

function createD1Adapter(db: D1Database) {
  return {
    id: "d1",
    async create<T extends Record<string, unknown>>({
      model,
      data,
    }: {
      model: string;
      data: T;
      select?: string[];
    }): Promise<T> {
      const keys = Object.keys(data);
      const values = keys.map((k) => toSqlValue(data[k]));
      const sql = `insert into ${quoteIdent(model)} (${keys
        .map(quoteIdent)
        .join(", ")}) values (${keys.map(() => "?").join(", ")})`;
      await db
        .prepare(sql)
        .bind(...values)
        .run();
      return data;
    },
    async findOne<T>({
      model,
      where,
    }: {
      model: string;
      where: Where[];
      select?: string[];
    }): Promise<T | null> {
      const { sql, params } = buildWhere(where);
      const row = await db
        .prepare(`select * from ${quoteIdent(model)}${sql} limit 1`)
        .bind(...params)
        .first();
      return (row as T) ?? null;
    },
    async findMany<T>({
      model,
      where,
      limit,
      offset,
      sortBy,
    }: {
      model: string;
      where?: Where[];
      limit?: number;
      offset?: number;
      sortBy?: Sort;
    }): Promise<T[]> {
      const { sql, params } = buildWhere(where);
      let query = `select * from ${quoteIdent(model)}${sql}`;
      if (sortBy?.field) {
        query += ` order by ${quoteIdent(sortBy.field)} ${
          sortBy.direction === "desc" ? "desc" : "asc"
        }`;
      }
      if (typeof limit === "number") {
        query += ` limit ${Math.max(0, Math.floor(limit))}`;
      }
      if (typeof offset === "number") {
        query += ` offset ${Math.max(0, Math.floor(offset))}`;
      }
      const res = await db
        .prepare(query)
        .bind(...params)
        .all();
      return (res.results as T[]) ?? [];
    },
    async update<T extends Record<string, unknown>>({
      model,
      where,
      update,
    }: {
      model: string;
      where: Where[];
      update: T;
    }): Promise<T | null> {
      const keys = Object.keys(update);
      if (!keys.length) {
        return this.findOne<T>({ model, where });
      }
      const { sql, params } = buildWhere(where);
      const setSql = keys.map((k) => `${quoteIdent(k)} = ?`).join(", ");
      const values = keys.map((k) => toSqlValue(update[k]));
      await db
        .prepare(`update ${quoteIdent(model)} set ${setSql}${sql}`)
        .bind(...values, ...params)
        .run();
      return this.findOne<T>({ model, where });
    },
    async updateMany({
      model,
      where,
      update,
    }: {
      model: string;
      where: Where[];
      update: Record<string, unknown>;
    }): Promise<number> {
      const keys = Object.keys(update);
      if (!keys.length) return 0;
      const { sql, params } = buildWhere(where);
      const setSql = keys.map((k) => `${quoteIdent(k)} = ?`).join(", ");
      const values = keys.map((k) => toSqlValue(update[k]));
      const res = await db
        .prepare(`update ${quoteIdent(model)} set ${setSql}${sql}`)
        .bind(...values, ...params)
        .run();
      return res.meta.changes ?? 0;
    },
    async delete({
      model,
      where,
    }: {
      model: string;
      where: Where[];
    }): Promise<void> {
      const { sql, params } = buildWhere(where);
      await db
        .prepare(`delete from ${quoteIdent(model)}${sql}`)
        .bind(...params)
        .run();
    },
    async deleteMany({
      model,
      where,
    }: {
      model: string;
      where: Where[];
    }): Promise<number> {
      const { sql, params } = buildWhere(where);
      const res = await db
        .prepare(`delete from ${quoteIdent(model)}${sql}`)
        .bind(...params)
        .run();
      return res.meta.changes ?? 0;
    },
    async count({
      model,
      where,
    }: {
      model: string;
      where?: Where[];
    }): Promise<number> {
      const { sql, params } = buildWhere(where);
      const row = await db
        .prepare(
          `select count(*) as c from ${quoteIdent(model)}${sql}`,
        )
        .bind(...params)
        .first<{ c: number }>();
      return Number(row?.c ?? 0);
    },
  };
}

export function createAuth(env: Env) {
  const origin = appOrigin(env);
  const issuer = (env.GROK_AUTH_ISSUER || GROK_ISSUER_DEFAULT).replace(
    /\/+$/,
    "",
  );
  const clientId = env.GROK_AUTH_CLIENT_ID || PREVIEW_CLIENT_ID;
  const clientSecret = env.GROK_AUTH_CLIENT_SECRET || PREVIEW_CLIENT_SECRET;
  const secret =
    env.BETTER_AUTH_SECRET ||
    env.MODU_API_SECRET ||
    "modu-cf-dev-secret-change-me";

  const trusted = [
    origin,
    ...parseAllowedOrigins(env),
    "http://localhost:8080",
    "http://127.0.0.1:8080",
    "https://*.grok.me",
    "https://*.grok-sandbox.com",
  ];

  return betterAuth({
    baseURL: origin,
    secret,
    database: createD1Adapter(env.DB) as never,
    trustedOrigins: trusted,
    emailAndPassword: { enabled: true },
    account: {
      encryptOAuthTokens: true,
      accountLinking: {
        enabled: true,
        trustedProviders: GROK_PROVIDERS.map((p) => p.providerId),
        requireLocalEmailVerified: false,
      },
    },
    session: { cookieCache: { enabled: true, maxAge: 300 } },
    advanced: {
      useSecureCookies: false,
      defaultCookieAttributes: { secure: true, sameSite: "lax", path: "/" },
      cookies: {
        session_token: { name: "__Host-grok-auth.session_token" },
        session_data: { name: "__Host-grok-auth.session_data" },
        account_data: { name: "__Host-grok-auth.account_data" },
        dont_remember: { name: "__Host-grok-auth.dont_remember" },
      },
    },
    plugins: [
      genericOAuth({
        config: GROK_PROVIDERS.map(({ providerId, idp }) => ({
          providerId,
          clientId,
          clientSecret,
          authorizationUrl: `${issuer}/api/auth/oauth2/authorize`,
          tokenUrl: `${issuer}/api/auth/oauth2/token`,
          userInfoUrl: `${issuer}/api/auth/oauth2/userinfo`,
          scopes: ["openid", "profile", "email"],
          authorizationUrlParams: { idp, prompt: "login" },
        })),
      }),
      bearer(),
    ],
  });
}

export type AuthInstance = ReturnType<typeof createAuth>;
