export type BookFormat = "epub" | "pdf" | "text";
export type BookSource = "market" | "upload" | "community";

/** 版权可见性 */
export type BookVisibility = "public_domain" | "private" | "public_domain_community";

/** 公版声明依据 */
export type PublicDomainBasis =
  | "ancient"
  | "author_life_plus"
  | "pre_1929"
  | "project_gutenberg"
  | "other";

export type BookCategory =
  | "文学"
  | "社科"
  | "科技"
  | "历史"
  | "商业"
  | "生活"
  | "幻想"
  | "全部";

export interface Chapter {
  id: string;
  title: string;
  content: string;
  href?: string;
}

export interface Book {
  id: string;
  title: string;
  author: string;
  description: string;
  coverColor: string;
  coverText?: string;
  category: Exclude<BookCategory, "全部">;
  format: BookFormat;
  source: BookSource;
  visibility: BookVisibility;
  license: string;
  licenseNote?: string;
  pdBasis?: PublicDomainBasis;
  sourceUrl?: string;
  tags: string[];
  rating: number;
  readers: number;
  wordCount: number;
  chapters?: Chapter[];
  storageKey?: string;
  fileName?: string;
  fileSize?: number;
  pageCount?: number;
  previewText?: string;
  createdAt: number;
  progress?: number;
  lastReadAt?: number;
  lastChapterId?: string;
  lastPage?: number;
}

export interface ReadingProgress {
  bookId: string;
  progress: number;
  lastChapterId?: string;
  lastPage?: number;
  lastCfi?: string;
  updatedAt: number;
  bookmarks: Bookmark[];
  highlights: Highlight[];
}

export interface Bookmark {
  id: string;
  label: string;
  chapterId?: string;
  page?: number;
  cfi?: string;
  createdAt: number;
}

export interface Highlight {
  id: string;
  text: string;
  note?: string;
  chapterId?: string;
  page?: number;
  /** gold | vermilion | celadon */
  color?: "gold" | "vermilion" | "celadon";
  isPublic?: boolean;
  createdAt: number;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  kind?: "explain" | "summary" | "translate" | "chat" | "insight";
  createdAt: number;
}
