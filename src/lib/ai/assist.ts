import { uid } from "@/lib/utils";
import type { AiMessage } from "@/lib/books/types";

export type AiAction =
  | "explain"
  | "summary"
  | "translate"
  | "insight"
  | "chat";

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

function trimText(text: string, max = 800) {
  const t = text.replace(/\s+/g, " ").trim();
  if (t.length <= max) return t;
  return t.slice(0, max) + "…";
}

function countSentences(text: string) {
  return text.split(/[。！？.!?]+/).filter((s) => s.trim().length > 4);
}

function extractKeyPhrases(text: string): string[] {
  const cleaned = text.replace(/[^\u4e00-\u9fa5a-zA-Z0-9\s]/g, " ");
  const cn = cleaned.match(/[\u4e00-\u9fa5]{2,6}/g) ?? [];
  const en = cleaned.match(/[A-Za-z]{4,}/g) ?? [];
  const freq = new Map<string, number>();
  for (const w of [...cn, ...en]) {
    const k = w.toLowerCase();
    if (k.length < 2) continue;
    freq.set(k, (freq.get(k) ?? 0) + 1);
  }
  return [...freq.entries()]
    .sort((a, b) => b[1] - a[1])
    .slice(0, 6)
    .map(([w]) => w);
}

function explainPassage(text: string, bookTitle?: string): string {
  const phrases = extractKeyPhrases(text);
  const sentences = countSentences(text);
  const scope = bookTitle ? `《${bookTitle}》` : "这段文字";
  const head = sentences[0]?.trim() ?? text.slice(0, 40);
  return [
    `关于${scope}中选中的段落，我这样理解：`,
    ``,
    `**核心意思**`,
    sentences.length > 1
      ? `作者先提出「${head.slice(0, 48)}${head.length > 48 ? "…" : ""}」，随后用 ${sentences.length} 个层次展开论证或叙事。整体语气偏${text.includes("？") || text.includes("?") ? "思辨" : "叙述"}。`
      : `这段话集中表达了一个观点：${trimText(text, 120)}`,
    ``,
    phrases.length
      ? `**关键词**\n${phrases.map((p) => `· ${p}`).join("\n")}`
      : "",
    ``,
    `**阅读提示**`,
    `可以把这段与上下文对照：留意作者如何铺垫、转折或收束。若有生词，可再选中单词让我精讲。`,
  ]
    .filter(Boolean)
    .join("\n");
}

function summarizePassage(text: string): string {
  const sentences = countSentences(text);
  const phrases = extractKeyPhrases(text);
  if (sentences.length === 0) {
    return `**摘要**\n${trimText(text, 160)}`;
  }
  const pick = [
    sentences[0],
    sentences[Math.floor(sentences.length / 2)],
    sentences[sentences.length - 1],
  ]
    .filter(Boolean)
    .map((s) => s!.trim())
    .filter((s, i, arr) => arr.indexOf(s) === i)
    .slice(0, 3);

  return [
    `**一句话摘要**`,
    trimText(pick[0] ?? text, 100),
    ``,
    `**要点**`,
    ...pick.map((s, i) => `${i + 1}. ${trimText(s, 90)}`),
    phrases.length ? `\n**主题词**：${phrases.slice(0, 4).join(" · ")}` : "",
  ].join("\n");
}

function translatePassage(text: string): string {
  // Lightweight bilingual assist: mirror structure + plain paraphrase
  const isMostlyCn = (text.match(/[\u4e00-\u9fa5]/g)?.length ?? 0) > text.length * 0.3;
  if (isMostlyCn) {
    return [
      `**中英对照（意译）**`,
      ``,
      `原文：${trimText(text, 280)}`,
      ``,
      `English (paraphrase): This passage discusses ${extractKeyPhrases(text).slice(0, 3).join(", ") || "its central theme"}, unfolding the idea through careful observation and reasoned narrative. The author invites the reader to slow down and notice the texture of everyday experience.`,
      ``,
      `（说明：这是阅读辅助意译，非逐字机器翻译。正式引用请对照权威译本。）`,
    ].join("\n");
  }
  return [
    `**英中对照（意译）**`,
    ``,
    `Original: ${trimText(text, 280)}`,
    ``,
    `中文意译：这段文字围绕「${extractKeyPhrases(text).slice(0, 3).join("、") || "核心主题"}」展开，作者以细腻观察与层层推进的方式，引导读者放慢节奏、体察细节。`,
    ``,
    `（说明：辅助意译，便于理解，非专业出版译本。）`,
  ].join("\n");
}

function insightPassage(text: string, bookTitle?: string): string {
  const phrases = extractKeyPhrases(text);
  return [
    `**AI 洞见**${bookTitle ? ` · 《${bookTitle}》` : ""}`,
    ``,
    `1. **视角**：作者不止在陈述事实，更在邀请你进入一种${text.length > 200 ? "沉浸式" : "凝练"}的思考姿态。`,
    `2. **结构**：留意句群之间的递进——从具体场景到抽象判断，是经典非虚构/文学的常用路径。`,
    `3. **可迁移问题**：若把这段放到今天的生活里，哪个词最刺痛你？${phrases[0] ? `或许是「${phrases[0]}」。` : ""}`,
    ``,
    `你可以继续问我：「这段和下一章有什么关系？」或「帮我写一段读书笔记」。`,
  ].join("\n");
}

function chatReply(question: string, context?: string, bookTitle?: string): string {
  const q = question.trim();
  const ctx = context ? trimText(context, 400) : "";
  const lower = q.toLowerCase();

  if (/笔记|读书笔记|读后感/.test(q)) {
    return [
      `**读书笔记草稿**${bookTitle ? ` · 《${bookTitle}》` : ""}`,
      ``,
      ctx
        ? `今日读到：${trimText(ctx, 120)}`
        : `围绕当前章节的主题，可以这样记：`,
      ``,
      `· 事实 / 情节：用一句话复述发生了什么。`,
      `· 感受：哪一处触动了你？用自己的话写下。`,
      `· 联想：这与你的经历、其他书或社会现象如何呼应？`,
      `· 行动：读完后你想改变或尝试的一件小事。`,
      ``,
      `需要我根据选中段落生成完整笔记，请先选中文字再点「摘要」或「洞见」。`,
    ].join("\n");
  }

  if (/人物|角色|主角/.test(q)) {
    return [
      `关于人物，建议从三层看：`,
      `1. **外在行动**——做了什么；`,
      `2. **内在动机**——为什么；`,
      `3. **关系网络**——与其他角色如何互相定义。`,
      ctx ? `\n结合你提供的段落：${trimText(ctx, 160)}` : "",
      `\n可以把具体人名或片段发给我，我帮你梳理人物弧光。`,
    ]
      .filter(Boolean)
      .join("\n");
  }

  if (/总结|概括|讲了什么|讲什么/.test(q) || lower.includes("summary")) {
    return ctx
      ? summarizePassage(ctx)
      : `请先在正文中选中一段，或告诉我章节标题，我再为你总结。`;
  }

  if (/翻译|translate|英文|中文/.test(q)) {
    return ctx
      ? translatePassage(ctx)
      : `选中要翻译的段落，或把原文粘贴到对话框，我可以给出中英意译对照。`;
  }

  return [
    `我已收到你的问题：${trimText(q, 120)}`,
    ``,
    ctx
      ? `结合当前语境（${trimText(ctx, 80)}），建议这样切入：`
      : `结合当前阅读，建议这样切入：`,
    ``,
    `· 先用自己的话复述一遍问题相关的段落；`,
    `· 再问「作者为什么要这样写」而不是只问「写了什么」；`,
    `· 最后把结论落到你自己的经验上。`,
    ``,
    bookTitle
      ? `在《${bookTitle}》里继续往下读时，可以随时选中句子，用「解释 / 摘要 / 翻译 / 洞见」快速启动。`
      : `选中正文中的句子，可以用顶部快捷操作更快得到回答。`,
    ``,
    `（墨读 AI 伴读在本地完成辅助推理，适合边读边想；正式学术引用请核对原书。）`,
  ].join("\n");
}

export async function runAiAssist(input: {
  action: AiAction;
  text?: string;
  question?: string;
  bookTitle?: string;
}): Promise<AiMessage> {
  // Simulate network / model latency for a natural feel
  await sleep(420 + Math.random() * 480);

  const text = input.text?.trim() ?? "";
  let content: string;

  switch (input.action) {
    case "explain":
      content = text
        ? explainPassage(text, input.bookTitle)
        : "请先选中一段正文，再使用「解释」。";
      break;
    case "summary":
      content = text
        ? summarizePassage(text)
        : "请先选中一段正文，再使用「摘要」。";
      break;
    case "translate":
      content = text
        ? translatePassage(text)
        : "请先选中一段正文，再使用「翻译」。";
      break;
    case "insight":
      content = text
        ? insightPassage(text, input.bookTitle)
        : "请先选中一段正文，再使用「洞见」。";
      break;
    case "chat":
    default:
      content = chatReply(input.question ?? "", text || undefined, input.bookTitle);
      break;
  }

  return {
    id: uid("ai"),
    role: "assistant",
    content,
    kind: input.action,
    createdAt: Date.now(),
  };
}
