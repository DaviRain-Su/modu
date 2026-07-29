import type { Highlight } from "@/lib/books/types";
import type { HighlightColor } from "@/components/reader/SelectionToolbar";
import { HIGHLIGHT_COLORS } from "@/components/reader/SelectionToolbar";

export type LocalHighlight = Highlight & {
  color?: HighlightColor;
  chapterId?: string;
};

/** Wrap first occurrence of quote in HTML-safe mark tags for rendering */
export function applyHighlightMarks(
  text: string,
  highlights: LocalHighlight[],
): { kind: "text" | "mark"; text: string; color?: HighlightColor }[] {
  if (!highlights.length) return [{ kind: "text", text }];

  // longest first to prefer fuller quotes
  const sorted = [...highlights]
    .filter((h) => h.text && text.includes(h.text))
    .sort((a, b) => b.text.length - a.text.length);

  if (!sorted.length) return [{ kind: "text", text }];

  type Seg = { kind: "text" | "mark"; text: string; color?: HighlightColor };
  let segments: Seg[] = [{ kind: "text", text }];

  for (const hl of sorted) {
    const next: Seg[] = [];
    for (const seg of segments) {
      if (seg.kind === "mark") {
        next.push(seg);
        continue;
      }
      const parts = seg.text.split(hl.text);
      parts.forEach((part, i) => {
        if (part) next.push({ kind: "text", text: part });
        if (i < parts.length - 1) {
          next.push({
            kind: "mark",
            text: hl.text,
            color: hl.color || "gold",
          });
        }
      });
    }
    segments = next;
  }
  return segments;
}

export function markClass(color?: HighlightColor): string {
  return (
    HIGHLIGHT_COLORS.find((c) => c.id === color)?.mark ||
    HIGHLIGHT_COLORS[0].mark
  );
}
