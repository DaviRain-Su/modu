/** 同一句划线的归一化 key，用于多人想法聚合 */
export function normalizeQuote(text: string): string {
  return text
    .replace(/\s+/g, " ")
    .replace(/[「」『』""'']/g, "")
    .trim();
}

export function quotesMatch(a: string, b: string): boolean {
  const na = normalizeQuote(a);
  const nb = normalizeQuote(b);
  if (!na || !nb) return false;
  if (na === nb) return true;
  // 允许一方是另一方的子串（选区略长短）
  if (na.length >= 8 && nb.includes(na)) return true;
  if (nb.length >= 8 && na.includes(nb)) return true;
  return false;
}
