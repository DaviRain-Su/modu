#!/usr/bin/env node
/**
 * 墨读 · 公版书入库 CLI（授权运营侧使用）
 *
 * 对齐 liber 的 import-public-domain-texts 思路：
 * - 只接受带 license/evidence 的公版清单
 * - 输出可并入官方 catalog 的 JSON / TS 片段
 * - 后续可接 Cloudflare Worker + R2 真正上架
 *
 * 用法：
 *   node scripts/modu-pd-cli.mjs validate examples/pd-book.json
 *   node scripts/modu-pd-cli.mjs pack examples/pd-book.json --out /tmp/pd-out
 *   node scripts/modu-pd-cli.mjs scaffold
 *
 * 注意：此工具不会自动把任意文件公开上架；
 * 用户端上传默认私有，社区公版需声明；官方 catalog 由此 CLI 打包后人工/CI 合并。
 */

import { createHash } from "node:crypto";
import {
  mkdir,
  readFile,
  writeFile,
  access,
} from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, "..");

const PD_BASIS = new Set([
  "ancient",
  "author_life_plus",
  "pre_1929",
  "project_gutenberg",
  "other",
]);

function usage() {
  console.log(`
墨读公版 CLI  modu-pd-cli

  scaffold                 生成示例公版书 JSON
  validate <file.json>     校验清单
  pack <file.json> [--out dir]  打包为 catalog 片段 + 内容哈希

环境（后续云端推送预留）：
  MODU_ADMIN_TOKEN   管理端 token
  MODU_API_BASE      默认 https://modu.example/api
`);
}

function die(msg) {
  console.error("error:", msg);
  process.exit(1);
}

function assertBook(raw, file) {
  if (!raw || typeof raw !== "object") die(`${file}: 根必须是对象`);
  const req = ["id", "title", "author", "pdBasis", "chapters"];
  for (const k of req) {
    if (raw[k] == null || raw[k] === "") die(`${file}: 缺少 ${k}`);
  }
  if (!PD_BASIS.has(raw.pdBasis)) {
    die(`${file}: pdBasis 必须是 ${[...PD_BASIS].join("|")}`);
  }
  if (!Array.isArray(raw.chapters) || raw.chapters.length === 0) {
    die(`${file}: chapters 不能为空`);
  }
  for (const [i, ch] of raw.chapters.entries()) {
    if (!ch.title || !Array.isArray(ch.paragraphs) || !ch.paragraphs.length) {
      die(`${file}: chapters[${i}] 需要 title + paragraphs[]`);
    }
  }
  if (!raw.evidence && !raw.sourceUrl) {
    die(`${file}: 请提供 evidence 或 sourceUrl（公版依据）`);
  }
  return raw;
}

function toCatalogEntry(book) {
  const chapters = book.chapters.map((ch, i) => ({
    id: ch.id || `c${i + 1}`,
    title: ch.title,
    content: ch.paragraphs.join("\n\n"),
  }));
  const wordCount = chapters.reduce(
    (n, c) => n + [...c.content].length,
    0,
  );
  const body = JSON.stringify({ title: book.title, chapters });
  const contentHash = createHash("sha256").update(body).digest("hex").slice(0, 16);

  return {
    id: book.id.startsWith("pd_") ? book.id : `pd_${book.id}`,
    title: book.title,
    author: book.author,
    description: book.description || `${book.title} · 公版`,
    coverColor: book.coverColor || "#2c241c",
    coverText: book.coverText || book.title.slice(0, 2),
    category: book.category || "文学",
    format: "text",
    source: "market",
    visibility: "public_domain",
    license: "公版 · Public Domain",
    licenseNote: [book.pdBasis, book.evidence, book.sourceUrl]
      .filter(Boolean)
      .join(" · "),
    sourceUrl: book.sourceUrl,
    tags: ["公版", ...(book.tags || [])],
    rating: 4.8,
    readers: book.readers || 1000,
    wordCount,
    chapters,
    contentHash,
    createdAt: Date.now(),
  };
}

async function cmdScaffold() {
  const sample = {
    id: "sunzi_bingfa",
    title: "孙子兵法（节选）",
    author: "孙武",
    pdBasis: "ancient",
    evidence: "先秦兵书，公共领域",
    sourceUrl: "https://zh.wikisource.org/wiki/孫子兵法",
    category: "历史",
    tags: ["兵法", "古典"],
    description: "《始计》《作战》篇节选。公版古籍。",
    chapters: [
      {
        title: "始计第一",
        paragraphs: [
          "孙子曰：兵者，国之大事，死生之地，存亡之道，不可不察也。",
          "故经之以五事，校之以计，而索其情：一曰道，二曰天，三曰地，四曰将，五曰法。",
        ],
      },
      {
        title: "作战第二",
        paragraphs: [
          "孙子曰：凡用兵之法，驰车千驷，革车千乘，带甲十万，千里馈粮。",
          "则内外之费，宾客之用，胶漆之材，车甲之奉，日费千金，然后十万之师举矣。",
        ],
      },
    ],
  };
  const out = path.join(root, "examples", "pd-book.sample.json");
  await mkdir(path.dirname(out), { recursive: true });
  await writeFile(out, JSON.stringify(sample, null, 2) + "\n", "utf8");
  console.log("wrote", out);
  console.log("next: node scripts/modu-pd-cli.mjs validate examples/pd-book.sample.json");
}

async function cmdValidate(file) {
  const abs = path.resolve(file);
  const raw = JSON.parse(await readFile(abs, "utf8"));
  const book = assertBook(raw, abs);
  const entry = toCatalogEntry(book);
  console.log("ok:", entry.id, entry.title);
  console.log("  chapters:", entry.chapters.length, "words:", entry.wordCount);
  console.log("  hash:", entry.contentHash);
  console.log("  license:", entry.licenseNote);
}

async function cmdPack(file, outDir) {
  const abs = path.resolve(file);
  const raw = JSON.parse(await readFile(abs, "utf8"));
  const book = assertBook(raw, abs);
  const entry = toCatalogEntry(book);
  const dir = path.resolve(outDir || path.join(root, "tmp", "pd-pack", entry.id));
  await mkdir(dir, { recursive: true });
  await writeFile(
    path.join(dir, "book.json"),
    JSON.stringify(entry, null, 2) + "\n",
    "utf8",
  );
  // TS snippet for merging into catalog.ts (manual review)
  const ts = `// AUTO-PACKED ${entry.id} hash=${entry.contentHash}
// Merge into MARKET_BOOKS after review. Do NOT auto-merge copyrighted works.
`;
  await writeFile(path.join(dir, "MERGE_NOTE.txt"), ts, "utf8");
  console.log("packed →", dir);
  console.log("Review book.json then merge into src/lib/books/catalog.ts");
  console.log(
    "Cloudflare push: set MODU_ADMIN_TOKEN + implement /api/admin/pd-import (next)",
  );
}

const [cmd, arg, ...rest] = process.argv.slice(2);
if (!cmd || cmd === "-h" || cmd === "--help") {
  usage();
  process.exit(0);
}

try {
  if (cmd === "scaffold") await cmdScaffold();
  else if (cmd === "validate") {
    if (!arg) die("需要 json 文件路径");
    await cmdValidate(arg);
  } else if (cmd === "pack") {
    if (!arg) die("需要 json 文件路径");
    let out;
    const i = rest.indexOf("--out");
    if (i >= 0) out = rest[i + 1];
    await cmdPack(arg, out);
  } else {
    die(`未知命令: ${cmd}`);
  }
} catch (e) {
  die(e instanceof Error ? e.message : String(e));
}
