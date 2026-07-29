/**
 * 墨读版权策略（底线）
 *
 * 1. 书城只上架「公版 / Public Domain」图书，可自由加入书架阅读。
 * 2. 用户上传一律 private：仅本人书架可见，**禁止**进入书城、禁止他人打开正文。
 * 3. 内部榜单可统计阅读行为；私有书的公开内容仅限「评论 / 摘要」，
 *    不得把大段原文当公开批注外泄。
 */

import type { Book } from "./types";
import { MARKET_BOOKS, isMarketBookId } from "./catalog";

/** 用户上传 id 约定：upload_* */
export function isPrivateBookId(bookId: string): boolean {
  return bookId.startsWith("upload_");
}

export function isPublicDomainMarketBook(book: Book): boolean {
  return (
    book.source === "market" &&
    book.visibility === "public_domain" &&
    !isPrivateBookId(book.id)
  );
}

/** 是否允许出现在书城列表 */
export function canListInMarket(book: Book): boolean {
  return isPublicDomainMarketBook(book);
}

/** 上传是否允许「发布到书城」——永远否 */
export function canPublishUploadToMarket(): false {
  return false;
}

export function resolveBookMeta(bookId: string): Book | undefined {
  if (isPrivateBookId(bookId)) return undefined;
  return MARKET_BOOKS.find((b) => b.id === bookId);
}

/**
 * 公开批注净化：
 * - 公版书：可公开短摘录 + 评论
 * - 私有书：公开时**清空原文摘录**，只保留读者自己的评论/摘要
 */
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

  if (isPrivateBookId(input.bookId) || !isMarketBookId(input.bookId)) {
    // 私有书：禁止公开原文
    if (!note) {
      return {
        quote: "",
        note: "",
        isPublic: false,
        blocked:
          "私有图书不能公开原文摘录。请填写你的评论或摘要后再公开，或改为仅自己可见。",
      };
    }
    return {
      quote: "", // 绝不外泄私有书原文
      note: note.slice(0, 500),
      isPublic: true,
    };
  }

  // 公版书：摘录可公开，仍限长
  return {
    quote: quote.slice(0, 400),
    note,
    isPublic: true,
  };
}

/** 榜单展示名：私有书不暴露真实书名给他人 */
export function publicBookLabel(bookId: string, known?: Book | null): {
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
  const b = known ?? resolveBookMeta(bookId);
  if (b && isPublicDomainMarketBook(b)) {
    return {
      title: b.title,
      author: b.author,
      linkable: true,
      isPrivate: false,
    };
  }
  return {
    title: "公版书目外条目",
    author: "—",
    linkable: false,
    isPrivate: false,
  };
}

export const COPYRIGHT_POLICY_SUMMARY = {
  market:
    "书城仅收录公版（Public Domain）图书，可自由加入书架与阅读，不涉及商业版权分发。",
  upload:
    "用户上传仅限个人阅读，默认私有；系统禁止将上传图书公开到书城，亦禁止他人访问正文。",
  social:
    "阅读数据可参与内部榜单；私有书仅可公开「评论 / 摘要」，不得公开大段原文。",
} as const;
