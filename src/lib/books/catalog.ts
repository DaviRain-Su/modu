/**
 * 书城目录 —— **仅公版（Public Domain）图书**
 */
import type { Book, Chapter } from "./types";
import { EXTRA_MARKET_BOOKS } from "./catalog-extra";

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

const CORE_MARKET_BOOKS: Book[] = [
  {
    id: "pd_lunyu",
    title: "论语",
    author: "孔子及其弟子",
    description:
      "儒家核心经典选篇：学而、为政、里仁、述而、雍也。先秦文献，公共领域。",
    coverColor: "#2c241c",
    coverText: "论语",
    category: "历史",
    ...PD,
    licenseNote: "先秦文献 · 公版",
    tags: ["公版", "国学", "儒家"],
    rating: 4.9,
    readers: 520000,
    wordCount: 22000,
    chapters: [
      ch("ly1", "学而第一", [
        "子曰：「学而时习之，不亦说乎？有朋自远方来，不亦乐乎？人不知而不愠，不亦君子乎？」",
        "有子曰：「其为人也孝弟，而好犯上者，鲜矣；不好犯上，而好作乱者，未之有也。君子务本，本立而道生。孝弟也者，其为仁之本与！」",
        "子曰：「巧言令色，鲜矣仁！」",
        "曾子曰：「吾日三省吾身：为人谋而不忠乎？与朋友交而不信乎？传不习乎？」",
        "子曰：「道千乘之国，敬事而信，节用而爱人，使民以时。」",
        "子曰：「弟子入则孝，出则弟，谨而信，泛爱众，而亲仁。行有余力，则以学文。」",
      ]),
      ch("ly2", "为政第二", [
        "子曰：「为政以德，譬如北辰，居其所而众星共之。」",
        "子曰：「诗三百，一言以蔽之，曰『思无邪』。」",
        "子曰：「道之以政，齐之以刑，民免而无耻；道之以德，齐之以礼，有耻且格。」",
        "子曰：「吾十有五而志于学，三十而立，四十而不惑，五十而知天命，六十而耳顺，七十而从心所欲，不逾矩。」",
        "子曰：「学而不思则罔，思而不学则殆。」",
        "子曰：「由！诲女知之乎？知之为知之，不知为不知，是知也。」",
      ]),
      ch("ly3", "里仁第四", [
        "子曰：「里仁为美。择不处仁，焉得知？」",
        "子曰：「不仁者不可以久处约，不可以长处乐。仁者安仁，知者利仁。」",
        "子曰：「唯仁者能好人，能恶人。」",
        "子曰：「朝闻道，夕死可矣。」",
        "子曰：「见贤思齐焉，见不贤而内自省也。」",
        "子曰：「父母在，不远游，游必有方。」",
      ]),
      ch("ly4", "述而第七", [
        "子曰：「述而不作，信而好古，窃比于我老彭。」",
        "子曰：「默而识之，学而不厌，诲人不倦，何有于我哉？」",
        "子曰：「德之不修，学之不讲，闻义不能徙，不善不能改，是吾忧也。」",
        "子曰：「志于道，据于德，依于仁，游于艺。」",
        "子曰：「三人行，必有我师焉：择其善者而从之，其不善者而改之。」",
      ]),
      ch("ly5", "雍也第六（选）", [
        "子曰：「贤哉，回也！一箪食，一瓢饮，在陋巷，人不堪其忧，回也不改其乐。贤哉，回也！」",
        "子曰：「知者乐水，仁者乐山。知者动，仁者静。知者乐，仁者寿。」",
        "子曰：「质胜文则野，文胜质则史。文质彬彬，然后君子。」",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 1),
  },
  {
    id: "pd_daodejing",
    title: "道德经",
    author: "老子",
    description: "道家源头。选录开篇至修身名章。古代文献，公共领域。",
    coverColor: "#1e2f28",
    coverText: "道德",
    category: "社科",
    ...PD,
    licenseNote: "先秦文献 · 公版",
    tags: ["公版", "道家", "哲学"],
    rating: 4.8,
    readers: 410000,
    wordCount: 16000,
    chapters: [
      ch("ddj1", "道经 · 一至五", [
        "道可道，非常道。名可名，非常名。无名天地之始；有名万物之母。故常无，欲以观其妙；常有，欲以观其徼。此两者，同出而异名，同谓之玄。玄之又玄，众妙之门。",
        "天下皆知美之为美，斯恶已。皆知善之为善，斯不善已。有无相生，难易相成，长短相形，高下相倾，音声相和，前后相随。",
        "不尚贤，使民不争；不贵难得之货，使民不为盗；不见可欲，使民心不乱。是以圣人之治，虚其心，实其腹，弱其志，强其骨。常使民无知无欲。使夫智者不敢为也。为无为，则无不治。",
        "道冲，而用之或不盈。渊兮，似万物之宗。挫其锐，解其纷，和其光，同其尘。湛兮，似或存。吾不知谁之子，象帝之先。",
        "天地不仁，以万物为刍狗；圣人不仁，以百姓为刍狗。天地之间，其犹橐籥乎？虚而不屈，动而愈出。多言数穷，不如守中。",
      ]),
      ch("ddj2", "道经 · 八、九、十一", [
        "上善若水。水善利万物而不争，处众人之所恶，故几于道。居善地，心善渊，与善仁，言善信，正善治，事善能，动善时。夫唯不争，故无尤。",
        "持而盈之，不如其已；揣而锐之，不可长保。金玉满堂，莫之能守；富贵而骄，自遗其咎。功遂身退，天之道也。",
        "三十辐，共一毂，当其无，有车之用。埏埴以为器，当其无，有器之用。凿户牖以为室，当其无，有室之用。故有之以为利，无之以为用。",
      ]),
      ch("ddj3", "德经 · 选", [
        "知人者智，自知者明。胜人者有力，自胜者强。知足者富。强行者有志。不失其所者久。死而不亡者寿。",
        "大道废，有仁义；智慧出，有大伪；六亲不和，有孝慈；国家昏乱，有忠臣。",
        "为学日益，为道日损。损之又损，以至于无为。无为而无不为。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 2),
  },
  {
    id: "pd_tangshi300",
    title: "唐诗三百首（选）",
    author: "蘅塘退士 编 · 诸家",
    description: "唐诗名篇选录。唐代诗歌均已进入公共领域。",
    coverColor: "#3a2820",
    coverText: "唐诗",
    category: "文学",
    ...PD,
    licenseNote: "唐代诗歌 · 公版",
    tags: ["公版", "诗词", "古典"],
    rating: 4.9,
    readers: 680000,
    wordCount: 12000,
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
      ch("ts5", "望庐山瀑布 · 李白", [
        "日照香炉生紫烟，遥看瀑布挂前川。",
        "飞流直下三千尺，疑是银河落九天。",
      ]),
      ch("ts6", "枫桥夜泊 · 张继", [
        "月落乌啼霜满天，江枫渔火对愁眠。",
        "姑苏城外寒山寺，夜半钟声到客船。",
      ]),
      ch("ts7", "清明 · 杜牧", [
        "清明时节雨纷纷，路上行人欲断魂。",
        "借问酒家何处有？牧童遥指杏花村。",
      ]),
      ch("ts8", "赋得古原草送别 · 白居易", [
        "离离原上草，一岁一枯荣。",
        "野火烧不尽，春风吹又生。",
        "远芳侵古道，晴翠接荒城。",
        "又送王孙去，萋萋满别情。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 3),
  },
  {
    id: "pd_xiyouji",
    title: "西游记（第一回）",
    author: "吴承恩",
    description: "明代神魔小说开篇：仙石育猴。原著公版。",
    coverColor: "#2a1e38",
    coverText: "西游",
    category: "幻想",
    ...PD,
    licenseNote: "明代小说 · 公版",
    tags: ["公版", "古典小说", "神魔"],
    rating: 4.8,
    readers: 890000,
    wordCount: 12000,
    chapters: [
      ch("xyj1", "灵根育孕源流出 · 上", [
        "诗曰：混沌未分天地乱，茫茫渺渺无人见。自从盘古破鸿蒙，开辟从兹清浊辨。覆载群生仰至仁，发明万物皆成善。欲知造化会元功，须看西游释厄传。",
        "盖闻天地之数，有十二万九千六百岁为一元。将一元分为十二会，乃子、丑、寅、卯、辰、巳、午、未、申、酉、戌、亥之十二支也。每会该一万八百岁。",
        "且不说天盘地数，那花果山有一块仙石。其石有三丈六尺五寸高，有二丈四尺围圆。三丈六尺五寸高，按周天三百六十五度；二丈四尺围圆，按政历二十四气。",
      ]),
      ch("xyj2", "灵根育孕源流出 · 下", [
        "内育仙胞，一日迸裂，产一石卵，似圆球样大。因见风，化作一个石猴。五官俱备，四肢皆全。便就学爬学走，拜了四方。",
        "目运两道金光，射冲斗府。惊动高天上圣大慈仁者玉皇大天尊玄穹高上帝，驾座金阙云宫灵霄宝殿，聚集仙卿，见有金光焰焰，即命千里眼、顺风耳开南天门观看。",
        "那猴在山中，却会行走跳跃，食草木，饮涧泉，采山花，觅树果；与狼虫为伴，虎豹为群，獐鹿为友，猕猿为亲；夜宿石崖之下，朝游峰洞之中。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 4),
  },
  {
    id: "pd_hongloumeng",
    title: "红楼梦（第一回）",
    author: "曹雪芹",
    description: "开篇「甄士隐梦幻识通灵」。原著公版。",
    coverColor: "#3d2430",
    coverText: "红楼",
    category: "文学",
    ...PD,
    licenseNote: "清代小说 · 公版",
    tags: ["公版", "古典小说", "红楼"],
    rating: 4.9,
    readers: 920000,
    wordCount: 10000,
    chapters: [
      ch("hlm1", "甄士隐梦幻识通灵 · 上", [
        "此开卷第一回也。作者自云：因曾历过一番梦幻之后，故将真事隐去，而借「通灵」之说，撰此《石头记》一书也。故曰「甄士隐」云云。",
        "但书中所记何事何人？自又云：「今风尘碌碌，一事无成，忽念及当日所有之女子，一一细考较去，觉其行止见识，皆出于我之上。何我堂堂须眉，诚不若彼裙钗哉？」",
        "列位看官：你道此书从何而来？说起根由虽近荒唐，细按则深有趣味。待在下将此来历注明，方使阅者了然不惑。",
      ]),
      ch("hlm2", "甄士隐梦幻识通灵 · 下", [
        "原来女娲氏炼石补天之时，于大荒山无稽崖练成高经十二丈、方经二十四丈顽石三万六千五百零一块。娲皇氏只用了三万六千五百块，只单单剩了一块未用，便弃在此山青埂峰下。",
        "谁知此石自经煅炼之后，灵性已通，因见众石俱得补天，独自己无材不堪入选，遂自怨自叹，日夜悲号惭愧。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 5),
  },
  {
    id: "pd_luxun_nahan",
    title: "呐喊 · 自序与狂人日记（选）",
    author: "鲁迅",
    description:
      "《呐喊》自序及《狂人日记》开篇。作者 1936 年逝世，多数法域已入公版。",
    coverColor: "#1c1c1c",
    coverText: "呐喊",
    category: "文学",
    ...PD,
    licenseNote: "现代文学 · 公版（作者去世已逾保护期）",
    tags: ["公版", "鲁迅", "现代文学"],
    rating: 4.9,
    readers: 750000,
    wordCount: 8000,
    chapters: [
      ch("lx1", "自序", [
        "我在年青时候也曾经做过许多梦，后来大半忘却了，但自己也并不以为可惜。所谓回忆者，虽说可以使人欢欣，有时也不免使人寂寞，使精神的丝缕还牵着已逝的寂寞的时光，又有什么意味呢，而我偏苦于不能全忘却，这不能全忘的一部分，到现在便成了《呐喊》的来由。",
        "有谁从小康人家而坠入困顿的么，我以为在这途路中，大概可以看见世人的真面目；我要到 N 进 K 学堂去了，仿佛是想走异路，逃异地，去寻求别样的人们。",
        "假如一间铁屋子，是绝无窗户而万难破毁的，里面有许多熟睡的人们，不久都要闷死了，然而是从昏睡入死灭，并不感到就死的悲哀。现在你大嚷起来，惊起了较为清醒的几个人，使这不幸的少数者来受无可挽救的临终的苦楚，你倒以为对得起他们么？",
        "然而几个人既然起来，你不能说决没有毁坏这铁屋的希望。",
      ]),
      ch("lx2", "狂人日记（节选）", [
        "某君昆仲，今隐其名，皆余昔日在中学时良友；分隔多年，消息渐阙。日前偶闻其一大病；适归故乡，迂道往访，则仅晤一人，言病者其弟也。",
        "劳君远道来视，然已早愈，赴某地候补矣。因大笑，出示日记二册，谓可见当日病状，不妨献诸旧友。持归阅一过，知所患盖「迫害狂」之类。语颇错杂无伦次，又多荒唐之言；亦不著月日，惟墨色字体不一，知非一时所书。间亦有略具联络者，今撮录一篇，以供医家研究。",
        "今天晚上，很好的月光。我不见他，已是三十多年；今天见了，精神分外爽快。才知道以前的三十多年，全是发昏；然而须十分小心。不然，那赵家的狗，何以看我两眼呢？我怕得有理。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 6),
  },
  {
    id: "pd_alice",
    title: "Alice’s Adventures in Wonderland（Ch. I–II）",
    author: "Lewis Carroll",
    description: "1865 English classic. Public domain worldwide.",
    coverColor: "#1a3040",
    coverText: "Alice",
    category: "幻想",
    ...PD,
    licenseNote: "Project Gutenberg · Public Domain",
    tags: ["公版", "English", "经典"],
    rating: 4.7,
    readers: 1200000,
    wordCount: 18000,
    chapters: [
      ch("alice1", "Chapter I · Down the Rabbit-Hole", [
        "Alice was beginning to get very tired of sitting by her sister on the bank, and of having nothing to do: once or twice she had peeped into the book her sister was reading, but it had no pictures or conversations in it, “and what is the use of a book,” thought Alice “without pictures or conversations?”",
        "So she was considering in her own mind (as well as she could, for the hot day made her feel very sleepy and stupid), whether the pleasure of making a daisy-chain would be worth the trouble of getting up and picking the daisies, when suddenly a White Rabbit with pink eyes ran close by her.",
        "There was nothing so very remarkable in that; nor did Alice think it so very much out of the way to hear the Rabbit say to itself, “Oh dear! Oh dear! I shall be late!” (when she thought it over afterwards, it occurred to her that she ought to have wondered at this, but at the time it all seemed quite natural); but when the Rabbit actually took a watch out of its waistcoat-pocket, and looked at it, and then hurried on, Alice started to her feet, for it flashed across her mind that she had never before seen a rabbit with either a waistcoat-pocket, or a watch to take out of it, and burning with curiosity, she ran across the field after it, and fortunately was just in time to see it pop down a large rabbit-hole under the hedge.",
        "In another moment down went Alice after it, never once considering how in the world she was to get out again.",
      ]),
      ch("alice2", "Chapter II · The Pool of Tears", [
        "“Curiouser and curiouser!” cried Alice (she was so much surprised, that for the moment she quite forgot how to speak good English); “now I’m opening out like the largest telescope that ever was! Good-bye, feet!” (for when she looked down at her feet, they seemed to be almost out of sight, they were getting so far off).",
        "“Oh, my poor little feet, I wonder who will put on your shoes and stockings for you now, dears? I’m sure I shan’t be able! I shall be a great deal too far off to trouble myself about you: you must manage the best way you can—but I must be kind to them,” thought Alice, “or perhaps they won’t walk the way I want to go! Let me see: I’ll give them a new pair of boots every Christmas.”",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 7),
  },
  {
    id: "pd_pride",
    title: "Pride and Prejudice（Ch. 1）",
    author: "Jane Austen",
    description: "1813 English novel opening. Public domain.",
    coverColor: "#3a2a28",
    coverText: "Pride",
    category: "文学",
    ...PD,
    licenseNote: "Project Gutenberg · Public Domain",
    tags: ["公版", "English", "小说"],
    rating: 4.8,
    readers: 980000,
    wordCount: 8000,
    chapters: [
      ch("pp1", "Chapter 1", [
        "It is a truth universally acknowledged, that a single man in possession of a good fortune, must be in want of a wife.",
        "However little known the feelings or views of such a man may be on his first entering a neighbourhood, this truth is so well fixed in the minds of the surrounding families, that he is considered the rightful property of some one or other of their daughters.",
        "“My dear Mr. Bennet,” said his lady to him one day, “have you heard that Netherfield Park is let at last?”",
        "Mr. Bennet replied that he had not.",
        "“But it is,” returned she; “for Mrs. Long has just been here, and she told me all about it.”",
        "Mr. Bennet made no answer.",
        "“Do you not want to know who has taken it?” cried his wife impatiently.",
        "“You want to tell me, and I have no objection to hearing it.”",
        "This was invitation enough.",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 8),
  },
  {
    id: "pd_sunzi_bingfa",
    title: "孙子兵法",
    author: "孙武",
    description: "始计、作战、谋攻三篇。先秦兵书，公共领域。",
    coverColor: "#2c241c",
    coverText: "孙子",
    category: "历史",
    ...PD,
    licenseNote: "先秦兵书 · 公版",
    tags: ["公版", "兵法", "古典"],
    rating: 4.8,
    readers: 640000,
    wordCount: 6000,
    chapters: [
      ch("c1", "始计第一", [
        "孙子曰：兵者，国之大事，死生之地，存亡之道，不可不察也。",
        "故经之以五事，校之以计，而索其情：一曰道，二曰天，三曰地，四曰将，五曰法。",
        "道者，令民与上同意也，故可以与之死，可以与之生，而不畏危。天者，阴阳、寒暑、时制也。地者，远近、险易、广狭、死生也。将者，智、信、仁、勇、严也。法者，曲制、官道、主用也。",
        "凡此五者，将莫不闻，知之者胜，不知者不胜。故校之以计，而索其情，曰：主孰有道？将孰有能？天地孰得？法令孰行？兵众孰强？士卒孰练？赏罚孰明？吾以此知胜负矣。",
      ]),
      ch("c2", "作战第二", [
        "孙子曰：凡用兵之法，驰车千驷，革车千乘，带甲十万，千里馈粮；则内外之费，宾客之用，胶漆之材，车甲之奉，日费千金，然后十万之师举矣。",
        "其用战也胜，久则钝兵挫锐，攻城则力屈，久暴师则国用不足。夫钝兵挫锐，屈力殚货，则诸侯乘其弊而起，虽有智者，不能善其后矣。故兵闻拙速，未睹巧之久也。",
      ]),
      ch("c3", "谋攻第三", [
        "孙子曰：凡用兵之法，全国为上，破国次之；全军为上，破军次之；全旅为上，破旅次之；全卒为上，破卒次之；全伍为上，破伍次之。是故百战百胜，非善之善者也；不战而屈人之兵，善之善者也。",
        "故上兵伐谋，其次伐交，其次伐兵，其下攻城。攻城之法为不得已。",
        "故善用兵者，屈人之兵而非战也，拔人之城而非攻也，毁人之国而非久也，必以全争于天下，故兵不顿而利可全，此谋攻之法也。",
      ]),
    ],
    createdAt: Date.UTC(2020, 0, 9),
  },
];

export const MARKET_BOOKS: Book[] = [
  ...CORE_MARKET_BOOKS,
  ...EXTRA_MARKET_BOOKS,
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

export function listMarketBooks(): Book[] {
  return MARKET_BOOKS.filter(
    (b) => b.visibility === "public_domain" && b.source === "market",
  );
}
