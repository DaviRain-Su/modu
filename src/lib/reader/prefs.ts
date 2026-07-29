export type ReaderTheme = "paper" | "cream" | "sage" | "sepia" | "night";
export type ReaderFont = "serif" | "sans" | "kai" | "mono";
/**
 * Kindle 式阅读模式：
 * - auto: 宽屏双页，窄屏单页
 * - single / double: 强制单页 / 双页对开
 * - scroll: 连续滚动
 */
export type ReaderLayout = "auto" | "single" | "double" | "scroll";

export type ReaderPrefs = {
  theme: ReaderTheme;
  font: ReaderFont;
  layout: ReaderLayout;
  fontSize: number;
  lineHeight: number;
  letterSpacing: number;
  maxWidth: number;
};

export const DEFAULT_READER_PREFS: ReaderPrefs = {
  theme: "paper",
  font: "serif",
  layout: "auto",
  fontSize: 19,
  lineHeight: 1.95,
  letterSpacing: 0.03,
  maxWidth: 38,
};

const KEY = "modu_reader_prefs";

export function loadReaderPrefs(): ReaderPrefs {
  if (typeof window === "undefined") return DEFAULT_READER_PREFS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_READER_PREFS;
    const p = JSON.parse(raw) as Partial<ReaderPrefs>;
    let layout: ReaderLayout = DEFAULT_READER_PREFS.layout;
    if (p.layout === "scroll") layout = "scroll";
    else if (p.layout === "single") layout = "single";
    else if (p.layout === "double") layout = "double";
    else if (p.layout === "auto" || p.layout === "paged") layout = "auto";
    return {
      theme: (["paper", "cream", "sage", "sepia", "night"] as const).includes(
        p.theme as ReaderTheme,
      )
        ? (p.theme as ReaderTheme)
        : DEFAULT_READER_PREFS.theme,
      font: (["serif", "sans", "kai", "mono"] as const).includes(
        p.font as ReaderFont,
      )
        ? (p.font as ReaderFont)
        : DEFAULT_READER_PREFS.font,
      layout,
      fontSize: clamp(Number(p.fontSize) || 19, 14, 28),
      lineHeight: clamp(Number(p.lineHeight) || 1.95, 1.5, 2.4),
      letterSpacing: clamp(Number(p.letterSpacing) || 0.03, 0, 0.12),
      maxWidth: clamp(Number(p.maxWidth) || 38, 32, 52),
    };
  } catch {
    return DEFAULT_READER_PREFS;
  }
}

export function saveReaderPrefs(prefs: ReaderPrefs) {
  try {
    localStorage.setItem(KEY, JSON.stringify(prefs));
  } catch {
    /* ignore */
  }
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

export const READER_THEME_META: {
  id: ReaderTheme;
  label: string;
  sampleClass: string;
}[] = [
  { id: "paper", label: "纸张", sampleClass: "bg-[#f4efe4] text-[#1c1915]" },
  { id: "cream", label: "奶油", sampleClass: "bg-[#faf6ef] text-[#2a241c]" },
  { id: "sage", label: "护眼", sampleClass: "bg-[#e8efe6] text-[#1e2a1c]" },
  { id: "sepia", label: "羊皮", sampleClass: "bg-[#efe6d4] text-[#3a3226]" },
  { id: "night", label: "夜间", sampleClass: "bg-[#12100e] text-[#e4dfd4]" },
];

export const READER_LAYOUT_META: {
  id: ReaderLayout;
  label: string;
  hint: string;
}[] = [
  { id: "auto", label: "自动", hint: "宽屏双页 · 手机单页" },
  { id: "single", label: "单页", hint: "一次一页 · 专注" },
  { id: "double", label: "双页", hint: "对开 · 像摊开的书" },
  { id: "scroll", label: "滚动", hint: "连续长文" },
];

export const READER_FONT_META: {
  id: ReaderFont;
  label: string;
  hint: string;
  family: string;
}[] = [
  {
    id: "serif",
    label: "衬线",
    hint: "宋体风格 · 长文舒适",
    family:
      '"Noto Serif SC", "Songti SC", "Source Han Serif SC", "Iowan Old Style", Georgia, serif',
  },
  {
    id: "sans",
    label: "黑体",
    hint: "无衬线 · 清晰利落",
    family:
      '"Noto Sans SC", "PingFang SC", "Hiragino Sans GB", system-ui, sans-serif',
  },
  {
    id: "kai",
    label: "楷体",
    hint: "手写感 · 诗词笔记",
    family: '"Kaiti SC", "STKaiti", "KaiTi", "Noto Serif SC", serif',
  },
  {
    id: "mono",
    label: "等宽",
    hint: "技术文档 · 对照",
    family: 'ui-monospace, "SF Mono", Menlo, Consolas, monospace',
  },
];

export function readerThemeClass(theme: ReaderTheme): string {
  switch (theme) {
    case "night":
      return "rd-theme-night";
    case "sepia":
      return "rd-theme-sepia";
    case "sage":
      return "rd-theme-sage";
    case "cream":
      return "rd-theme-cream";
    default:
      return "rd-theme-paper";
  }
}

export function readerFontFamily(font: ReaderFont): string {
  return (
    READER_FONT_META.find((f) => f.id === font)?.family ||
    READER_FONT_META[0].family
  );
}
