export type ReaderTheme = "paper" | "cream" | "sage" | "sepia" | "night";
export type ReaderFont = "serif" | "sans" | "kai" | "mono";

export type ReaderPrefs = {
  theme: ReaderTheme;
  font: ReaderFont;
  fontSize: number; // 14–28
  lineHeight: number; // 1.5–2.4
  letterSpacing: number; // 0–0.12 em
  maxWidth: number; // rem, 32–48
};

export const DEFAULT_READER_PREFS: ReaderPrefs = {
  theme: "paper",
  font: "serif",
  fontSize: 18,
  lineHeight: 1.9,
  letterSpacing: 0.02,
  maxWidth: 40,
};

const KEY = "modu_reader_prefs";

export function loadReaderPrefs(): ReaderPrefs {
  if (typeof window === "undefined") return DEFAULT_READER_PREFS;
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return DEFAULT_READER_PREFS;
    const p = JSON.parse(raw) as Partial<ReaderPrefs>;
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
      fontSize: clamp(Number(p.fontSize) || 18, 14, 28),
      lineHeight: clamp(Number(p.lineHeight) || 1.9, 1.5, 2.4),
      letterSpacing: clamp(Number(p.letterSpacing) || 0.02, 0, 0.12),
      maxWidth: clamp(Number(p.maxWidth) || 40, 32, 52),
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
  {
    id: "paper",
    label: "纸张",
    sampleClass: "bg-[#f7f2e8] text-[#1c1915]",
  },
  {
    id: "cream",
    label: "奶油",
    sampleClass: "bg-[#faf6ef] text-[#2a241c]",
  },
  {
    id: "sage",
    label: "护眼",
    sampleClass: "bg-[#e8efe6] text-[#1e2a1c]",
  },
  {
    id: "sepia",
    label: "羊皮",
    sampleClass: "bg-[#efe6d4] text-[#3a3226]",
  },
  {
    id: "night",
    label: "夜间",
    sampleClass: "bg-[#141414] text-[#e4dfd4]",
  },
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
      '"Songti SC", "Noto Serif SC", "Iowan Old Style", "Palatino Linotype", Palatino, Georgia, serif',
  },
  {
    id: "sans",
    label: "黑体",
    hint: "无衬线 · 清晰利落",
    family:
      '"PingFang SC", "Hiragino Sans GB", "Noto Sans SC", "Segoe UI", system-ui, sans-serif',
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
      return "bg-[#141414] text-[#e4dfd4]";
    case "sepia":
      return "bg-[#efe6d4] text-[#3a3226]";
    case "sage":
      return "bg-[#e8efe6] text-[#1e2a1c]";
    case "cream":
      return "bg-[#faf6ef] text-[#2a241c]";
    case "paper":
    default:
      return "bg-[#f7f2e8] text-[#1c1915]";
  }
}

export function readerFontFamily(font: ReaderFont): string {
  return (
    READER_FONT_META.find((f) => f.id === font)?.family ||
    READER_FONT_META[0].family
  );
}
