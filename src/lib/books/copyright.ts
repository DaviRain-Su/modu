/**
 * 墨读版权策略
 *
 * 1. 官方书城：仅公版目录（catalog）。
 * 2. 用户上传默认 private，正文不对他人开放。
 * 3. 若用户**主动声明**为公版并完成合规表单，可贡献到「社区公版」书城
 *    （无法 100% 自动鉴定真伪 → 靠声明 + 依据 + 来源 + 举报下架）。
 * 4. 未声明公版的内容禁止上架。
 * 5. 公开社交：私有书只可公开评论/摘要，不可公开原文。
 */

import type { Book, PublicDomainBasis } from "./types";
import { MARKET_BOOKS } from "./catalog";

export function isPrivateBookId(bookId: string): boolean {
  // 社区公版 id: community_* ；官方: pd_* ；私有: upload_*
  return bookId.startsWith("upload_");
}

export function isCommunityBookId(bookId: string): boolean {
  return bookId.startsWith("community_");
}

export function isOfficialMarketId(bookId: string): boolean {
  return MARKET_BOOKS.some((b) => b.id === bookId);
}

/** 可出现在书城的 id（官方公版 + 社区公版） */
export function isListableMarketId(bookId: string): boolean {
  return isOfficialMarketId(bookId) || isCommunityBookId(bookId);
}

export function isPublicDomainMarketBook(book: Book): boolean {
  if (isPrivateBookId(book.id)) return false;
  return (
    book.visibility === "public_domain" ||
    book.visibility === "public_domain_community"
  );
}

export function canListInMarket(book: Book): boolean {
  return isPublicDomainMarketBook(book) && book.source !== "upload";
}

/**
 * 用户上传能否申请上架：
 * - 必须主动选择「贡献公版」
 * - 必须完成声明（由调用方校验表单）
 * - PDF 无正文时通常无法作为社区全文上架（需 TXT/EPUB 可解析文本）
 */
export function canContributeAsPublicDomain(input: {
  personalUseAck: boolean;
  pdContribute: boolean;
  pdBasis?: PublicDomainBasis;
  title?: string;
  author?: string;
}): { ok: true } | { ok: false; reason: string } {
  if (!input.pdContribute) {
    return { ok: false, reason: "未选择贡献为公版" };
  }
  if (!input.personalUseAck) {
    return { ok: false, reason: "请先完成版权确认" };
  }
  if (!input.title?.trim() || !input.author?.trim()) {
    return { ok: false, reason: "公版贡献需填写准确书名与作者" };
  }
  if (!input.pdBasis) {
    return { ok: false, reason: "请选择公版依据" };
  }
  return { ok: true };
}

export function sanitizePublicAnnotation(input: {
  bookId: string;
  quote: string;
  note: string;
  isPublic: boolean;
}): { quote: string; note: string; isPublic: boolean; blocked?: string } {
  const quote = input.quote.trim().slice(0, 2000);
  const note = input.note.trim().slice(0, 2000);

  if (!input.isPublic) {
    return { quote, note, isPublic: false };
  }

  if (isPrivateBookId(input.bookId)) {
    if (!note) {
      return {
        quote: "",
        note: "",
        isPublic: false,
        blocked:
          "私有图书不能公开原文。请填写评论/摘要后再公开，或改为仅自己可见。",
      };
    }
    return { quote: "", note: note.slice(0, 500), isPublic: true };
  }

  // 官方/社区公版：允许短摘录
  return {
    quote: quote.slice(0, 400),
    note,
    isPublic: true,
  };
}

export function publicBookLabel(
  bookId: string,
  known?: Book | null,
): {
  title: string;
  author: string;
  linkable: boolean;
  isPrivate: boolean;
} {
  if (isPrivateBookId(bookId)) {
    return {
      title: "私密阅读（内容未公开）",
      author: "仅阅读者可见书名",
      linkable: false,
      isPrivate: true,
    };
  }
  if (known && isPublicDomainMarketBook(known)) {
    return {
      title: known.title,
      author: known.author,
      linkable: true,
      isPrivate: false,
    };
  }
  const official = MARKET_BOOKS.find((b) => b.id === bookId);
  if (official) {
    return {
      title: official.title,
      author: official.author,
      linkable: true,
      isPrivate: false,
    };
  }
  if (isCommunityBookId(bookId)) {
    return {
      title: known?.title || "社区公版书",
      author: known?.author || "社区贡献",
      linkable: Boolean(known),
      isPrivate: false,
    };
  }
  return {
    title: "未公开书目",
    author: "—",
    linkable: false,
    isPrivate: false,
  };
}

export const PD_BASIS_OPTIONS: {
  id: PublicDomainBasis;
  label: string;
  hint: string;
}[] = [
  {
    id: "ancient",
    label: "古代 / 古籍",
    hint: "如先秦、唐宋明清已无版权主体的作品",
  },
  {
    id: "author_life_plus",
    label: "作者去世已满保护期",
    hint: "多数法域为去世后 50–70 年，请自行核实",
  },
  {
    id: "pre_1929",
    label: "1929 年前出版（美公版常见标准）",
    hint: "适用于已进入美国公版的英语等作品",
  },
  {
    id: "project_gutenberg",
    label: "来自 Project Gutenberg 等公版库",
    hint: "建议填写来源链接",
  },
  {
    id: "other",
    label: "其他公版依据",
    hint: "请在说明中写清理由",
  },
];

export const COPYRIGHT_POLICY_SUMMARY = {
  market:
    "书城包含：① 官方精选公版 ② 经用户公版声明后的「社区公版」。受版权保护的作品禁止上架。",
  upload:
    "上传默认私有。只有你主动声明并填写公版依据后，才可申请进入社区公版书城；未声明的永远不上架。",
  verify:
    "系统无法自动鉴定版权。公版贡献依赖用户声明、来源信息与社区举报；违规内容可随时下架。",
  social:
    "私有书公开时只允许评论/摘要；公版书可公开短摘录。",
} as const;
