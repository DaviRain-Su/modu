export type BookFormat = "epub" | "pdf" | "text";
export type BookSource = "market" | "upload";

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
  /** EPUB spine href for navigation (optional) */
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
  tags: string[];
  rating: number;
  readers: number;
  wordCount: number;
  /** Built-in sample chapters (text format) or parsed TOC */
  chapters?: Chapter[];
  /** R2 / storage object key for binary file */
  storageKey?: string;
  /** Local blob URL or object URL for reading uploaded files */
  fileName?: string;
  fileSize?: number;
  pageCount?: number;
  /** Short text extract for AI / listing */
  previewText?: string;
  createdAt: number;
  progress?: number; // 0-100
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
