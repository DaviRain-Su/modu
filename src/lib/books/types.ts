export type BookFormat = "epub" | "pdf" | "text";
export type BookSource = "market" | "upload";

/** 版权可见性：书城仅 public_domain；用户上传强制 private */
export type BookVisibility = "public_domain" | "private";

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
  /** 书城书 = public_domain；上传 = private（永不进书城） */
  visibility: BookVisibility;
  /** 例如 "公版 / Public Domain"、"仅自己可见" */
  license: string;
  /** 许可说明 / 来源（古登堡、中华古籍等） */
  licenseNote?: string;
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
  createdAt: number;
}

export interface AiMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
  kind?: "explain" | "summary" | "translate" | "chat" | "insight";
  createdAt: number;
}
