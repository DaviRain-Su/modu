import { createServerFn } from "@tanstack/react-start";
import { getSql } from "@/lib/db";
import { authMiddleware } from "@/lib/auth/middleware";
import type { Book, Chapter, PublicDomainBasis } from "@/lib/books/types";
import { canContributeAsPublicDomain } from "@/lib/books/copyright";
import { uid } from "@/lib/utils";

/** 整本 chapters_json 上限（UTF-8 字节）。中文约 3 字节/字，故按字节计更准。 */
const MAX_CHAPTERS_JSON_BYTES = 2_500_000; // ~2.5MB
/** 单章最大「字符」数（Unicode code points，中文算 1） */
const MAX_CHAPTER_CHARS = 120_000;
/** 最多章节数 */
const MAX_CHAPTERS = 400;

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

/** 按 Unicode 字符截断（中文友好） */
function clipChars(s: string, max: number): string {
  const chars = [...s];
  if (chars.length <= max) return s;
  return chars.slice(0, max).join("") + "\n\n……（本章后续已省略）";
}

/**
 * 压缩章节列表，保证 JSON 字节数不超限。
 * 中文每字约 3 字节，旧逻辑 450KB 很容易误伤整本古籍。
 */
function packChapters(raw: Chapter[]): {
  chapters: Chapter[];
  truncated: boolean;
} {
  let truncated = false;
  const normalized = raw
    .map((c) => {
      const title = (c.title || "章节").slice(0, 200);
      const full = c.content || "";
      const content = clipChars(full, MAX_CHAPTER_CHARS);
      if ([...full].length > MAX_CHAPTER_CHARS) truncated = true;
      return {
        id: c.id || uid("ch"),
        title,
        content,
      };
    })
    .filter((c) => c.content.trim().length > 0)
    .slice(0, MAX_CHAPTERS);

  if (raw.length > MAX_CHAPTERS) truncated = true;

  // 从尾部删章直到 JSON 合身
  let chapters = normalized;
  while (chapters.length > 1) {
    const json = JSON.stringify(chapters);
    if (json.length <= MAX_CHAPTERS_JSON_BYTES) break;
    chapters = chapters.slice(0, -1);
    truncated = true;
  }

  // 仍超：进一步缩短最后一章
  let json = JSON.stringify(chapters);
  if (json.length > MAX_CHAPTERS_JSON_BYTES && chapters.length > 0) {
    truncated = true;
    const last = chapters[chapters.length - 1]!;
    let lo = 1000;
    let hi = [...last.content].length;
    let best = last.content;
    while (lo <= hi) {
      const mid = Math.floor((lo + hi) / 2);
      const trial = {
        ...last,
        content: clipChars(last.content, mid),
      };
      const packed = [...chapters.slice(0, -1), trial];
      if (JSON.stringify(packed).length <= MAX_CHAPTERS_JSON_BYTES) {
        best = trial.content;
        lo = mid + 1;
      } else {
        hi = mid - 1;
      }
    }
    chapters = [
      ...chapters.slice(0, -1),
      { ...last, content: best },
    ];
    json = JSON.stringify(chapters);
  }

  if (json.length > MAX_CHAPTERS_JSON_BYTES) {
    // 最后手段：只留一章极短预览
    truncated = true;
    const first = chapters[0]!;
    chapters = [
      {
        id: first.id,
        title: first.title,
        content: clipChars(first.content, 8000),
      },
    ];
  }

  if (truncated) {
    chapters.push({
      id: uid("note"),
      title: "关于本书长度",
      content:
        "本书原文较长（尤其是中文 UTF-8 体积更大）。社区书城已自动收录可展示的章节正文；完整 EPUB/原文件请用「仅私有阅读」上传到个人书架，体验不受此限制。",
    });
  }

  return { chapters, truncated };
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

    const rawChapters = (data.chapters || []).filter(
      (c) => (c.content || "").trim().length > 0,
    );

    if (rawChapters.length === 0) {
      throw new Error(
        "公版上架需要可分享的正文。请上传 TXT/Markdown，或可解析出文本的 EPUB；纯扫描 PDF 请先转文本，或仅作私有阅读。",
      );
    }

    const { chapters, truncated } = packChapters(rawChapters);
    const chaptersJson = JSON.stringify(chapters);

    if (chaptersJson.length > MAX_CHAPTERS_JSON_BYTES) {
      const mb = (chaptersJson.length / 1024 / 1024).toFixed(2);
      throw new Error(
        `正文仍然过大（约 ${mb}MB）。请：① 改用「仅私有阅读」上传完整 EPUB；或 ② 公版贡献时只上传节选章节的 TXT。中文按 UTF-8 体积较大，属正常现象。`,
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

    const status = "approved";
    const descBase = (data.description || "用户贡献的公版读物").trim();
    const description = (
      truncated
        ? `${descBase}（正文较长，社区版已自动收录可展示章节；完整文件请私有上传）`
        : descBase
    ).slice(0, 2000);

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
        ${description},
        ${(data.category || "文学").slice(0, 40)},
        ${data.format},
        ${data.coverColor || "#2c241c"},
        ${data.title.trim().slice(0, 4)},
        ${data.pdBasis},
        ${(data.pdBasisNote || "").trim().slice(0, 500)},
        ${(data.sourceUrl || "").trim().slice(0, 500)},
        ${(data.yearOrEra || "").trim().slice(0, 80)},
        ${status},
        ${"社区公版 · 用户声明 · 可举报"},
        ${chaptersJson},
        ${wordCount}
      )
    `;

    const book = rowToBook({
      id,
      title: data.title.trim().slice(0, 200),
      author: data.author.trim().slice(0, 120),
      description,
      category: data.category || "文学",
      format: data.format,
      coverColor: data.coverColor || "#2c241c",
      coverText: data.title.trim().slice(0, 4),
      pdBasis: data.pdBasis,
      pdBasisNote: data.pdBasisNote || "",
      sourceUrl: data.sourceUrl || "",
      yearOrEra: data.yearOrEra || "",
      status,
      license: "社区公版 · 用户声明 · 可举报",
      chapters,
      wordCount,
      contributorId: context.userId,
      createdAt: new Date().toISOString(),
    });

    return { id, book, truncated };
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
