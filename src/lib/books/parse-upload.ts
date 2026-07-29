/**
 * Client-side parse of uploaded books: PDF / EPUB / text.
 * Extracts title, author, page count, TOC, and preview text for AI / UI.
 */

import type { BookFormat, Chapter } from "./types";

export type ParseResult = {
  format: BookFormat;
  title?: string;
  author?: string;
  pageCount?: number;
  wordCount?: number;
  /** Text / simplified chapter list for TOC */
  chapters?: Chapter[];
  /** First ~2k chars for AI / description */
  previewText?: string;
  contentType: string;
};

const MAX_BYTES = 80 * 1024 * 1024; // 80MB

export function detectFormat(file: File): BookFormat | null {
  const name = file.name.toLowerCase();
  const type = (file.type || "").toLowerCase();
  if (name.endsWith(".pdf") || type === "application/pdf") return "pdf";
  if (
    name.endsWith(".epub") ||
    type === "application/epub+zip" ||
    type === "application/epub"
  )
    return "epub";
  if (
    name.endsWith(".txt") ||
    name.endsWith(".md") ||
    name.endsWith(".markdown") ||
    type.startsWith("text/")
  )
    return "text";
  return null;
}

export function assertUploadable(file: File): BookFormat {
  if (file.size <= 0) throw new Error("文件是空的");
  if (file.size > MAX_BYTES) {
    throw new Error(
      `文件过大（${(file.size / 1024 / 1024).toFixed(1)}MB），请控制在 80MB 以内`,
    );
  }
  const format = detectFormat(file);
  if (!format) {
    throw new Error("仅支持 PDF、EPUB，或 TXT / Markdown 文本");
  }
  return format;
}

export async function parseUploadedBook(file: File): Promise<ParseResult> {
  const format = assertUploadable(file);
  if (format === "pdf") return parsePdf(file);
  if (format === "epub") return parseEpub(file);
  return parseText(file);
}

async function parseText(file: File): Promise<ParseResult> {
  const text = await file.text();
  const chapters = splitTextChapters(text, file.name);
  return {
    format: "text",
    title: file.name.replace(/\.[^.]+$/, ""),
    wordCount: [...text].length,
    chapters,
    previewText: text.slice(0, 2000),
    contentType: file.type || "text/plain",
  };
}

function splitTextChapters(text: string, fileName: string): Chapter[] {
  const idBase = fileName.replace(/\W+/g, "_").slice(0, 24) || "ch";
  // Split on common Chinese/English chapter headings
  const re =
    /(?:^|\n)((?:第[\d一二三四五六七八九十百千]+[章节回部卷]|Chapter\s+\d+|CHAPTER\s+\d+)[^\n]{0,40})\n/gi;
  const parts = text.split(re);
  if (parts.length < 3) {
    return [
      {
        id: `${idBase}_full`,
        title: "全文",
        content: text,
      },
    ];
  }
  const chapters: Chapter[] = [];
  // parts: [preamble, title1, body1, title2, body2, ...]
  if (parts[0]?.trim()) {
    chapters.push({
      id: `${idBase}_0`,
      title: "前言",
      content: parts[0].trim(),
    });
  }
  for (let i = 1; i < parts.length; i += 2) {
    const title = (parts[i] || `章节 ${chapters.length + 1}`).trim();
    const content = (parts[i + 1] || "").trim();
    chapters.push({
      id: `${idBase}_${chapters.length + 1}`,
      title,
      content,
    });
  }
  return chapters.filter((c) => c.content.length > 0 || c.title);
}

async function parsePdf(file: File): Promise<ParseResult> {
  const pdfjs = await import("pdfjs-dist");
  pdfjs.GlobalWorkerOptions.workerSrc = new URL(
    "pdfjs-dist/build/pdf.worker.min.mjs",
    import.meta.url,
  ).toString();

  const data = new Uint8Array(await file.arrayBuffer());
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const doc: any = await pdfjs.getDocument({ data }).promise;
  try {
    const pageCount: number = doc.numPages || 0;
    let title: string | undefined;
    let author: string | undefined;
    try {
      const meta = await doc.getMetadata?.();
      title = meta?.info?.Title || undefined;
      author = meta?.info?.Author || undefined;
      if (typeof title === "string") title = title.trim() || undefined;
      if (typeof author === "string") author = author.trim() || undefined;
    } catch {
      /* ignore meta */
    }

    // Extract text from first few pages for preview + AI
    const previewParts: string[] = [];
    const maxPages = Math.min(pageCount, 5);
    for (let i = 1; i <= maxPages; i++) {
      try {
        const page = await doc.getPage(i);
        const content = await page.getTextContent();
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        const line = (content.items as any[])
          .map((it) => (typeof it.str === "string" ? it.str : ""))
          .join(" ")
          .replace(/\s+/g, " ")
          .trim();
        if (line) previewParts.push(line);
      } catch {
        /* skip page */
      }
    }
    const previewText = previewParts.join("\n\n").slice(0, 3000);

    return {
      format: "pdf",
      title: title || file.name.replace(/\.pdf$/i, ""),
      author,
      pageCount,
      wordCount: Math.round(file.size / 2),
      previewText,
      contentType: "application/pdf",
      chapters: pageCount
        ? Array.from({ length: Math.min(pageCount, 200) }, (_, i) => ({
            id: `pdf_p${i + 1}`,
            title: `第 ${i + 1} 页`,
            content: "", // rendered by PdfReader
          }))
        : undefined,
    };
  } finally {
    try {
      doc.destroy?.();
    } catch {
      /* ignore */
    }
  }
}

async function parseEpub(file: File): Promise<ParseResult> {
  const JSZip = (await import("jszip")).default;
  const zip = await JSZip.loadAsync(await file.arrayBuffer());

  // Find OPF via container.xml
  let opfPath = "OEBPS/content.opf";
  const container = zip.file("META-INF/container.xml");
  if (container) {
    const xml = await container.async("text");
    const m = xml.match(/full-path\s*=\s*["']([^"']+)["']/i);
    if (m?.[1]) opfPath = m[1];
  }

  const opfFile = zip.file(opfPath);
  if (!opfFile) {
    // Fallback: any .opf
    const anyOpf = Object.keys(zip.files).find((k) =>
      k.toLowerCase().endsWith(".opf"),
    );
    if (!anyOpf) throw new Error("无效的 EPUB：找不到内容清单 (OPF)");
    opfPath = anyOpf;
  }

  const opfXml = await zip.file(opfPath)!.async("text");
  const opfDir = opfPath.includes("/")
    ? opfPath.slice(0, opfPath.lastIndexOf("/") + 1)
    : "";

  const title =
    matchXml(opfXml, /<dc:title[^>]*>([^<]+)<\/dc:title>/i) ||
    file.name.replace(/\.epub$/i, "");
  const author =
    matchXml(opfXml, /<dc:creator[^>]*>([^<]+)<\/dc:creator>/i) || undefined;

  // Manifest id → href
  const manifest = new Map<string, string>();
  const itemRe =
    /<item\b[^>]*\bid\s*=\s*["']([^"']+)["'][^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  const itemRe2 =
    /<item\b[^>]*\bhref\s*=\s*["']([^"']+)["'][^>]*\bid\s*=\s*["']([^"']+)["'][^>]*>/gi;
  let m: RegExpExecArray | null;
  while ((m = itemRe.exec(opfXml))) {
    manifest.set(m[1], m[2]);
  }
  while ((m = itemRe2.exec(opfXml))) {
    if (!manifest.has(m[2])) manifest.set(m[2], m[1]);
  }

  // Spine order
  const spineIds: string[] = [];
  const spineRe = /<itemref\b[^>]*\bidref\s*=\s*["']([^"']+)["'][^>]*>/gi;
  while ((m = spineRe.exec(opfXml))) {
    spineIds.push(m[1]);
  }

  // NCX / nav for labels
  const labelByHref = new Map<string, string>();
  const ncxHref =
    [...manifest.entries()].find(([, href]) =>
      href.toLowerCase().endsWith(".ncx"),
    )?.[1] ||
    Object.keys(zip.files).find((k) => k.toLowerCase().endsWith(".ncx"));
  if (ncxHref) {
    const ncxPath = resolvePath(opfDir, ncxHref);
    const ncxFile = zip.file(ncxPath);
    if (ncxFile) {
      const ncx = await ncxFile.async("text");
      const np =
        /<navPoint[\s\S]*?<navLabel>\s*<text>([^<]*)<\/text>[\s\S]*?<content\s+src=["']([^"']+)["']/gi;
      while ((m = np.exec(ncx))) {
        const label = m[1].trim();
        const src = m[2].split("#")[0];
        const abs = resolvePath(ncxPath.includes("/") ? ncxPath.slice(0, ncxPath.lastIndexOf("/") + 1) : opfDir, src);
        if (label) labelByHref.set(abs, label);
        // also relative key
        labelByHref.set(src, label);
      }
    }
  }

  const chapters: Chapter[] = [];
  let previewText = "";
  let wordCount = 0;

  for (let i = 0; i < spineIds.length; i++) {
    const id = spineIds[i];
    const href = manifest.get(id);
    if (!href) continue;
    if (!/\.(x?html?|xml)$/i.test(href.split("#")[0])) continue;
    const abs = resolvePath(opfDir, href.split("#")[0]);
    const entry = zip.file(abs);
    if (!entry) continue;
    const html = await entry.async("text");
    const text = htmlToText(html);
    wordCount += [...text].length;
    if (previewText.length < 2500) {
      previewText = (previewText + "\n\n" + text).slice(0, 3000);
    }
    const label =
      labelByHref.get(abs) ||
      labelByHref.get(href.split("#")[0]) ||
      matchXml(html, /<title[^>]*>([^<]+)<\/title>/i) ||
      `第 ${chapters.length + 1} 章`;
    chapters.push({
      id: `epub_${i}_${id}`.replace(/\W+/g, "_"),
      title: label,
      content: text,
    });
  }

  if (chapters.length === 0) {
    // Still valid epub for epubjs; TOC empty is OK
    return {
      format: "epub",
      title,
      author,
      wordCount: Math.round(file.size / 3),
      previewText: previewText || undefined,
      contentType: "application/epub+zip",
    };
  }

  return {
    format: "epub",
    title,
    author,
    pageCount: chapters.length,
    wordCount,
    chapters,
    previewText,
    contentType: "application/epub+zip",
  };
}

function matchXml(xml: string, re: RegExp): string | undefined {
  const m = xml.match(re);
  return m?.[1]?.trim() || undefined;
}

function resolvePath(baseDir: string, rel: string): string {
  if (!rel) return baseDir;
  if (rel.startsWith("/")) return rel.slice(1);
  const stack = baseDir.split("/").filter(Boolean);
  for (const part of rel.split("/")) {
    if (part === ".." ) stack.pop();
    else if (part && part !== ".") stack.push(part);
  }
  return stack.join("/");
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, "")
    .replace(/<style[\s\S]*?<\/style>/gi, "")
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n\n")
    .replace(/<\/div>/gi, "\n")
    .replace(/<\/h[1-6]>/gi, "\n\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&nbsp;/g, " ")
    .replace(/&/g, "&")
    .replace(/</g, "<")
    .replace(/>/g, ">")
    .replace(/"/g, '"')
    .replace(/&#(\d+);/g, (_, n) => String.fromCharCode(Number(n)))
    .replace(/[ \t]+\n/g, "\n")
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}
