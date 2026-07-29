/**
 * 书城目录 —— **仅公版（Public Domain）图书**
 *
 * 收录原则：
 * - 作者去世已超过版权保护期，或本身属于公共领域的作品
 * - 正文使用公版原文节选（便于在线试读），非当代受版权保护文本
 * - 禁止上架有版权争议的现当代商业出版物
 */

import type { Book, Chapter } from "./types";

function ch(id: string, title: string, paragraphs: string[]): Chapter {
  return {
    id,
    title,
    content: paragraphs.join("\n\n"),
  };
}

const PD = {
  visibility: "public_domain" as const,
  source: "market" as const,
  format: "text" as const,
  license: "公版 · Public Domain",
};

/** 书城公版书目 */
export const MARKET_BOOKS: Book[] = [
  {
    id: "pd_lunyu",
    title: "论语（节选）",
    author: "孔子及其弟子",
    description:
      "儒家核心经典。收录学而、为政等篇章节选。成书于先秦，属公共领域，可自由阅读与传播。",
    coverColor: "#2c241c",
    coverText: "论语",
    category: "历史",
    ...PD,
    licenseNote: "先秦文献 · 公版",
    tags: ["公版", "国学", "儒家"],
    rating: 4.9,
    readers: 520000,
    wordCount: 18000,
    chapters: [
      ch("ly1", "学而第一（节选）", [
        "子曰：「学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？」",
        "曾子曰：「吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？」",
        "子曰：「弟子入则孝，出则弟，谨而信，泛爱众，而亲仁。行有余力，则以学文。」",
      ]),
      ch("ly2", "为政第二（节选）", [
        "子曰：「为政以德，譬如北辰，居其所而众星共之。」",
        "子曰：「学而不思则罔，思而不学则殆。」",
        "子曰：「由！诲女知之乎？知之为知之，不知为不知，是知也。」",
      ]),
      ch("ly3", "里仁第四（节选）", [
        "子曰：「里仁为美。择不处仁，焉得知？」",
        "子曰：「朝闻道，夕死可矣。」",
        "子曰：「见贤思齐焉，见不贤而内自省也。」",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 1),
  },
  {
    id: "pd_daodejing",
    title: "道德经（节选）",
    author: "老子",
    description:
      "道家思想源头。选录开篇与修身相关章节。古代文献，公共领域。",
    coverColor: "#1e2f28",
    coverText: "道德",
    category: "社科",
    ...PD,
    licenseNote: "先秦文献 · 公版",
    tags: ["公版", "道家", "哲学"],
    rating: 4.8,
    readers: 410000,
    wordCount: 12000,
    chapters: [
      ch("ddj1", "第一章", [
        "道可道，非常道。名可名，非常名。无名天地之始；有名万物之母。",
        "故常无欲，以观其妙；常有欲，以观其徼。此两者，同出而异名，同谓之玄。玄之又玄，众妙之门。",
      ]),
      ch("ddj2", "第八章", [
        "上善若水。水善利万物而不争，处众人之所恶，故几于道。",
        "居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。夫唯不争，故无尤。",
      ]),
      ch("ddj3", "第三十三章", [
        "知人者智，自知者明。胜人者有力，自胜者强。知足者富。强行者有志。不失其所者久。死而不亡者寿。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 2),
  },
  {
    id: "pd_tangshi300",
    title: "唐诗三百首（选）",
    author: "蘅塘退士 编 · 诸家",
    description:
      "清代蘅塘退士编选的唐诗启蒙读本中的名篇。原作唐代诗歌，均已进入公共领域。",
    coverColor: "#3a2820",
    coverText: "唐诗",
    category: "文学",
    ...PD,
    licenseNote: "唐代诗歌 · 公版",
    tags: ["公版", "诗词", "古典"],
    rating: 4.9,
    readers: 680000,
    wordCount: 25000,
    chapters: [
      ch("ts1", "静夜思 · 李白", [
        "床前明月光，疑是地上霜。",
        "举头望明月，低头思故乡。",
      ]),
      ch("ts2", "春晓 · 孟浩然", [
        "春眠不觉晓，处处闻啼鸟。",
        "夜来风雨声，花落知多少。",
      ]),
      ch("ts3", "登鹳雀楼 · 王之涣", [
        "白日依山尽，黄河入海流。",
        "欲穷千里目，更上一层楼。",
      ]),
      ch("ts4", "黄鹤楼送孟浩然之广陵 · 李白", [
        "故人西辞黄鹤楼，烟花三月下扬州。",
        "孤帆远影碧空尽，唯见长江天际流。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 3),
  },
  {
    id: "pd_xiyouji",
    title: "西游记（第一回节选）",
    author: "吴承恩",
    description:
      "明代神魔小说开篇：花果山、石猴出世。原著属公共领域；此处为开篇节选供在线阅读。",
    coverColor: "#2a1e38",
    coverText: "西游",
    category: "幻想",
    ...PD,
    licenseNote: "明代小说 · 公版",
    tags: ["公版", "古典小说", "神魔"],
    rating: 4.8,
    readers: 890000,
    wordCount: 8000,
    chapters: [
      ch("xyj1", "第一回 · 灵根育孕源流出（节选）", [
        "诗曰：混沌未分天地乱，茫茫渺渺无人见。自从盘古破鸿蒙，开辟从兹清浊辨。",
        "盖闻天地之数，有十二万九千六百岁为一元。将一元分为十二会……",
        "那座山正当顶上，有一块仙石。其石有三丈六尺五寸高，有二丈四尺围圆。内育仙胞，一日迸裂，产一石卵，似圆球样大。因见风，化作一个石猴。",
        "那猴在山中，却会行走跳跃，食草木，饮涧泉，采山花，觅树果；与狼虫为伴，虎豹为群，獐鹿为友，猕猿为亲；夜宿石崖之下，朝游峰洞之中。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 4),
  },
  {
    id: "pd_hongloumeng",
    title: "红楼梦（第一回节选）",
    author: "曹雪芹",
    description:
      "古典名著开篇「甄士隐梦幻识通灵」。原著公共领域；节选仅供公版阅读体验。",
    coverColor: "#3d2430",
    coverText: "红楼",
    category: "文学",
    ...PD,
    licenseNote: "清代小说 · 公版",
    tags: ["公版", "古典小说", "红楼"],
    rating: 4.9,
    readers: 920000,
    wordCount: 9000,
    chapters: [
      ch("hlm1", "第一回 · 甄士隐梦幻识通灵（节选）", [
        "此开卷第一回也。作者自云：因曾历过一番梦幻之后，故将真事隐去，而借「通灵」之说，撰此《石头记》一书也。",
        "列位看官：你道此书从何而来？说起根由虽近荒唐，细按则深有趣味。待在下将此来历注明，方使阅者了然不惑。",
        "原来女娲氏炼石补天之时，于大荒山无稽崖练成高经十二丈、方经二十四丈顽石三万六千五百零一块。娲皇氏只用了三万六千五百块，只单单剩了一块未用，便弃在此山青埂峰下。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 5),
  },
  {
    id: "pd_luxun_nahan",
    title: "呐喊 · 自序（节选）",
    author: "鲁迅",
    description:
      "鲁迅《呐喊》自序名段。作者 1936 年逝世，依多数法域已进入公共领域；收录经典段落供公版阅读。",
    coverColor: "#1c1c1c",
    coverText: "呐喊",
    category: "文学",
    ...PD,
    licenseNote: "现代文学经典 · 公版（作者去世已逾保护期）",
    tags: ["公版", "鲁迅", "现代文学"],
    rating: 4.9,
    readers: 750000,
    wordCount: 6000,
    chapters: [
      ch("lx1", "自序（节选）", [
        "我在年青时候也曾经做过许多梦，后来大半忘却了，但自己也并不以为可惜。所谓回忆者，虽说可以使人欢欣，有时也不免使人寂寞，使精神的丝缕还牵着已逝的寂寞的时光，又有什么意味呢，而我偏苦于不能全忘却，这不能全忘的一部分，到现在便成了《呐喊》的来由。",
        "有谁从小康人家而坠入困顿的么，我以为在这途路中，大概可以看见世人的真面目；我要到 N 进 K 学堂去了，仿佛是想走异路，逃异地，去寻求别样的人们。",
        "假如一间铁屋子，是绝无窗户而万难破毁的，里面有许多熟睡的人们，不久都要闷死了，然而是从昏睡入死灭，并不感到就死的悲哀。现在你大嚷起来，惊起了较为清醒的几个人，使这不幸的少数者来受无可挽救的临终的苦楚，你倒以为对得起他们么？",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 6),
  },
  {
    id: "pd_alice",
    title: "Alice’s Adventures in Wonderland（excerpt）",
    author: "Lewis Carroll",
    description:
      "1865 English classic. Public domain worldwide. Opening chapters for bilingual reading practice.",
    coverColor: "#1a3040",
    coverText: "Alice",
    category: "幻想",
    ...PD,
    licenseNote: "Project Gutenberg · Public Domain",
    tags: ["公版", "English", "经典"],
    rating: 4.7,
    readers: 1200000,
    wordCount: 15000,
    chapters: [
      ch("alice1", "Chapter I · Down the Rabbit-Hole (excerpt)", [
        "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”",
        "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
      ]),
      ch("alice2", "Chapter II · The Pool of Tears (excerpt)", [
        "“Curiouser and curiouser!” cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); “now I’m opening out like the largest telescope that ever was! Good-bye, feet!”",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 7),
  },
  {
    id: "pd_pride",
    title: "Pride and Prejudice（excerpt）",
    author: "Jane Austen",
    description:
      "1813 English novel. Public domain. Famous opening and early dialogue for classic reading.",
    coverColor: "#3a2a28",
    coverText: "Pride",
    category: "文学",
    ...PD,
    licenseNote: "Project Gutenberg · Public Domain",
    tags: ["公版", "English", "小说"],
    rating: 4.8,
    readers: 980000,
    wordCount: 12000,
    chapters: [
      ch("pp1", "Chapter 1 (excerpt)", [
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 8),
  },
];

export const CATEGORIES = [
  "全部",
  "文学",
  "社科",
  "历史",
  "幻想",
  "生活",
  "科技",
  "商业",
] as const;

export function isMarketBookId(id: string): boolean {
  return MARKET_BOOKS.some((b) => b.id === id);
}

export function getMarketBook(id: string): Book | undefined {
  return MARKET_BOOKS.find((b) => b.id === id);
}

/** 书城公开列表 —— 仅公版 */
export function listMarketBooks(): Book[] {
  return MARKET_BOOKS.filter(
    (b) => b.visibility === "public_domain" && b.source === "market",
  );
}
