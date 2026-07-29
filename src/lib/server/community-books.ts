import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Book, Chapter, PublicDomainBasis } from "@/lib/books/types";
import { canContributeAsPublicDomain } from "@/lib/books/copyright";
import { uid } from "@/lib/utils";

const MAX_CHAPTERS_JSON = 450_000; // ~450KB text payload

export type CommunityBookRow = {
  id: string;
  title: string;
  author: string;
  description: string;
  category: string;
  format: string;
  coverColor: string;
  coverText: string | null;
  pdBasis: string;
  pdBasisNote: string;
  sourceUrl: string;
  yearOrEra: string;
  status: string;
  license: string;
  chapters: Chapter[];
  wordCount: number;
  contributorId: string;
  createdAt: string;
};

function rowToBook(r: CommunityBookRow): Book {
  return {
    id: r.id,
    title: r.title,
    author: r.author,
    description: r.description,
    coverColor: r.coverColor,
    coverText: r.coverText || "公版",
    category: (r.category as Book["category"]) || "文学",
    format: (r.format as Book["format"]) || "text",
    source: "community",
    visibility: "public_domain_community",
    license: r.license || "社区公版 · 用户声明",
    licenseNote: [
      r.pdBasis,
      r.yearOrEra,
      r.sourceUrl ? `来源 ${r.sourceUrl}` : "",
    ]
      .filter(Boolean)
      .join(" · "),
    pdBasis: r.pdBasis as PublicDomainBasis,
    sourceUrl: r.sourceUrl || undefined,
    tags: ["社区公版", "用户贡献", r.format.toUpperCase()],
    rating: 4.5,
    readers: 1,
    wordCount: r.wordCount,
    chapters: r.chapters,
    createdAt: Date.parse(r.createdAt) || Date.now(),
  };
}

function parseChapters(json: string): Chapter[] {
  try {
    const v = JSON.parse(json) as Chapter[];
    return Array.isArray(v) ? v : [];
  } catch {
    return [];
  }
}

export const listCommunityPdBooks = createServerFn({ method: "GET" }).handler(
  async () => {
    const sql = await getSql();
    try {
      const rows = await sql<{
        id: string;
        contributor_id: string;
        title: string;
        author: string;
        description: string;
        category: string;
        format: string;
        cover_color: string;
        cover_text: string | null;
        pd_basis: string;
        pd_basis_note: string;
        source_url: string;
        year_or_era: string;
        status: string;
        license: string;
        chapters_json: string;
        word_count: number;
        created_at: string;
      }>`
        select * from community_pd_books
        where status = 'approved'
        order by created_at desc
        limit 100
      `;
      return rows.map((r) =>
        rowToBook({
          id: r.id,
          title: r.title,
          author: r.author,
          description: r.description,
          category: r.category,
          format: r.format,
          coverColor: r.cover_color,
          coverText: r.cover_text,
          pdBasis: r.pd_basis,
          pdBasisNote: r.pd_basis_note,
          sourceUrl: r.source_url,
          yearOrEra: r.year_or_era,
          status: r.status,
          license: r.license,
          chapters: parseChapters(r.chapters_json),
          wordCount: r.word_count,
          contributorId: r.contributor_id,
          createdAt: r.created_at,
        }),
      );
    } catch {
      // table not migrated yet
      return [] as Book[];
    }
  },
);

export const submitCommunityPdBook = createServerFn({ method: "POST" })
  .middleware([authMiddleware])
  .validator(
    (input: {
      title: string;
      author: string;
      description?: string;
      category?: string;
      format: "text" | "epub" | "pdf";
      pdBasis: PublicDomainBasis;
      pdBasisNote?: string;
      sourceUrl?: string;
      yearOrEra?: string;
      chapters: Chapter[];
      wordCount?: number;
      coverColor?: string;
      personalUseAck: boolean;
      pdContribute: boolean;
    }) => input,
  )
  .handler(async ({ context, data }) => {
    const gate = canContributeAsPublicDomain({
      personalUseAck: data.personalUseAck,
      pdContribute: data.pdContribute,
      pdBasis: data.pdBasis,
      title: data.title,
      author: data.author,
    });
    if (!gate.ok) throw new Error(gate.reason);

    // 社区全文上架需要可阅读的文本章节（PDF 无文本则拒绝）
    const chapters = (data.chapters || [])
      .map((c) => ({
        id: c.id || uid("ch"),
        title: (c.title || "章节").slice(0, 200),
        content: (c.content || "").slice(0, 100_000),
      }))
      .filter((c) => c.content.trim().length > 0);

    if (chapters.length === 0) {
      throw new Error(
        "公版上架需要可分享的正文。请上传 TXT/Markdown，或可解析出文本的 EPUB；纯扫描 PDF 请先转文本，或仅作私有阅读。",
      );
    }

    const chaptersJson = JSON.stringify(chapters);
    if (chaptersJson.length > MAX_CHAPTERS_JSON) {
      throw new Error(
        "正文过长，暂不支持整本超大上架。可节选公版章节后贡献，或仅私有阅读。",
      );
    }

    if (data.pdBasis === "other" && !(data.pdBasisNote || "").trim()) {
      throw new Error("选择「其他」时请填写公版说明");
    }
    if (
      data.pdBasis === "project_gutenberg" &&
      !(data.sourceUrl || "").trim()
    ) {
      throw new Error("来自公版库时请填写来源链接（如 Gutenberg）");
    }

    const sql = await getSql();
    const id = uid("community");
    const wordCount =
      data.wordCount ||
      chapters.reduce((n, c) => n + [...c.content].length, 0);

    await sql`
      insert into community_pd_books (
        id, contributor_id, title, author, description, category, format,
        cover_color, cover_text, pd_basis, pd_basis_note, source_url,
        year_or_era, status, license, chapters_json, word_count
      ) values (
        ${id},
        ${context.userId},
        ${data.title.trim().slice(0, 200)},
        ${data.author.trim().slice(0, 120)},
        ${(data.description || "用户贡献的公版读物").trim().slice(0, 2000)},
        ${(data.category || "文学").slice(0, 40)},
        ${data.format},
        ${data.coverColor || "#2c241c"},
        ${data.title.trim().slice(0, 4)},
        ${data.pdBasis},
        ${(data.pdBasisNote || "").trim().slice(0, 500)},
        ${(data.sourceUrl || "").trim().slice(0, 500)},
        ${(data.yearOrEra || "").trim().slice(0, 80)},
        ${"approved"},
        ${"社区公版 · 用户声明 · 可举报"},
        ${chaptersJson},
        ${wordCount}
      )
    `;

    const book = rowToBook({
      id,
      title: data.title.trim(),
      author: data.author.trim(),
      description: (data.description || "用户贡献的公版读物").trim(),
      category: data.category || "文学",
      format: data.format,
      coverColor: data.coverColor || "#2c241c",
      coverText: data.title.trim().slice(0, 4),
      pdBasis: data.pdBasis,
      pdBasisNote: data.pdBasisNote || "",
      sourceUrl: data.sourceUrl || "",
      yearOrEra: data.yearOrEra || "",
      status: "approved",
      license: "社区公版 · 用户声明 · 可举报",
      chapters,
      wordCount,
      contributorId: context.userId,
      createdAt: new Date().toISOString(),
    });

    return { id, book };
  });

export const getCommunityBook = createServerFn({ method: "GET" })
  .validator((id: string) => id.trim())
  .handler(async ({ data: id }) => {
    if (!id.startsWith("community_")) return null;
    const sql = await getSql();
    try {
      const rows = await sql<{
        id: string;
        contributor_id: string;
        title: string;
        author: string;
        description: string;
        category: string;
        format: string;
        cover_color: string;
        cover_text: string | null;
        pd_basis: string;
        pd_basis_note: string;
        source_url: string;
        year_or_era: string;
        status: string;
        license: string;
        chapters_json: string;
        word_count: number;
        created_at: string;
      }>`
        select * from community_pd_books
        where id = ${id} and status = 'approved'
        limit 1
      `;
      const r = rows[0];
      if (!r) return null;
      return rowToBook({
        id: r.id,
        title: r.title,
        author: r.author,
        description: r.description,
        category: r.category,
        format: r.format,
        coverColor: r.cover_color,
        coverText: r.cover_text,
        pdBasis: r.pd_basis,
        pdBasisNote: r.pd_basis_note,
        sourceUrl: r.source_url,
        yearOrEra: r.year_or_era,
        status: r.status,
        license: r.license,
        chapters: parseChapters(r.chapters_json),
        wordCount: r.word_count,
        contributorId: r.contributor_id,
        createdAt: r.created_at,
      });
    } catch {
      return null;
    }
  });
