export type Locale = "zh" | "en";

export type Messages = {
  brand: string;
  brandTag: string;
  nav: {
    home: string;
    library: string;
    rankings: string;
    shelf: string;
    upload: string;
    account: string;
    me: string;
    login: string;
    logout: string;
  };
  theme: { toLight: string; toDark: string };
  lang: { zh: string; en: string; switchTo: string };
  landing: {
    badge: string;
    title1: string;
    title2: string;
    lead: string;
    ctaLibrary: string;
    ctaUpload: string;
    featPd: string;
    featPdD: string;
    featPrivate: string;
    featPrivateD: string;
    featAi: string;
    featAiD: string;
    featRank: string;
    featRankD: string;
    featMobile: string;
    featMobileD: string;
    featCloud: string;
    featCloudD: string;
  };
  login: {
    title: string;
    subtitle: string;
    welcome: string;
    create: string;
    email: string;
    password: string;
    name: string;
    signIn: string;
    signUp: string;
    orEmail: string;
    continueGoogle: string;
    continueX: string;
    noAccount: string;
    hasAccount: string;
    backHome: string;
    systemStatus: string;
    aboutTitle: string;
    aboutEmail: string;
    aboutSocial: string;
    aboutPersist: string;
    oauthFail: string;
  };
  library: {
    title: string;
    lead: string;
    search: string;
    empty: string;
    official: string;
    community: string;
  };
  shelf: {
    title: string;
    lead: string;
    empty: string;
    continue: string;
    progress: string;
  };
  rankings: {
    title: string;
    lead: string;
    hot: string;
    empty: string;
  };
  upload: {
    title: string;
    lead: string;
    private: string;
    community: string;
    pickFile: string;
    titleField: string;
    authorField: string;
    submit: string;
    busy: string;
    privateHint: string;
    communityHint: string;
  };
  account: {
    title: string;
    profile: string;
    ai: string;
    plan: string;
    notSignedIn: string;
    goLogin: string;
  };
  reader: {
    toc: string;
    settings: string;
    font: string;
    size: string;
    theme: string;
    ai: string;
    highlight: string;
    note: string;
    progress: string;
    prev: string;
    next: string;
  };
  common: {
    loading: string;
    save: string;
    cancel: string;
    confirm: string;
    back: string;
    open: string;
    addShelf: string;
    onShelf: string;
    publicDomain: string;
    private: string;
  };
};

export const zh: Messages = {
  brand: "墨读",
  brandTag: "沉浸阅读 · AI 伴读",
  nav: {
    home: "首页",
    library: "书城",
    rankings: "热榜",
    shelf: "书架",
    upload: "上传",
    account: "账户",
    me: "我的",
    login: "登录",
    logout: "退出",
  },
  theme: { toLight: "浅色", toDark: "深色" },
  lang: { zh: "中文", en: "EN", switchTo: "切换语言" },
  landing: {
    badge: "公版书城 · 私有上传 · AI 伴读",
    title1: "把世界装进口袋，",
    title2: "也装进一段安静的光。",
    lead: "墨读：书城只上架公版图书；你可上传私有 PDF/EPUB 仅自己阅读；阅读时 AI 伴读，手机与电脑都适配。",
    ctaLibrary: "浏览公版书城",
    ctaUpload: "私有上传",
    featPd: "公版书城",
    featPdD: "只收录公共领域作品，可自由加入书架，避免版权风险。",
    featPrivate: "私有上传",
    featPrivateD: "PDF/EPUB 只进你的书架，系统禁止上架书城。",
    featAi: "AI 伴读",
    featAiD: "选段解释、摘要、翻译；可接自有 API 或官方额度。",
    featRank: "内部榜单",
    featRankD: "公版热度公开；私有书仅可分享评论/摘要，不露原文。",
    featMobile: "双端适配",
    featMobileD: "手机点按翻页，电脑键盘与宽屏双页，阅读节奏自如。",
    featCloud: "云端就绪",
    featCloudD: "可接 Cloudflare 存储与 AI，登录后同步进度与批注。",
  },
  login: {
    title: "登录墨读",
    subtitle: "Google · X · 邮箱 —— 同步书架、批注与 AI 档案",
    welcome: "欢迎回来",
    create: "创建账户",
    email: "邮箱",
    password: "密码",
    name: "昵称",
    signIn: "邮箱登录",
    signUp: "注册",
    orEmail: "或使用邮箱",
    continueGoogle: "使用 Google 继续",
    continueX: "使用 X 继续",
    noAccount: "还没有账户？",
    hasAccount: "已有账户？",
    backHome: "返回首页",
    systemStatus: "系统状态",
    aboutTitle: "关于登录（当前环境）",
    aboutEmail: "邮箱可直接注册/登录。若提示密码错误，多半是站点重新发布后预览库被清空——请重新注册同一个邮箱即可。",
    aboutSocial: "Google / X 需要正式 OAuth 配置；未配置时请先用邮箱。点按钮会跳转授权页。",
    aboutPersist: "要让账号永久保存，请按 README 接 Cloudflare D1 或 DATABASE_URL。",
    oauthFail: "社交登录未完成。请重试；若反复失败，可先用邮箱注册登录。",
  },
  library: {
    title: "公版书城",
    lead: "仅展示公共领域图书。私有上传不会出现在这里。",
    search: "搜索书名或作者…",
    empty: "暂无匹配的公版书",
    official: "官方公版",
    community: "社区公版",
  },
  shelf: {
    title: "我的书架",
    lead: "在读书与上传书都在这里。",
    empty: "书架还是空的，去书城挑一本，或上传你的书。",
    continue: "继续阅读",
    progress: "进度",
  },
  rankings: {
    title: "热门书单",
    lead: "基于阅读热度的内部榜（公版优先展示）。",
    hot: "热读",
    empty: "还没有足够的阅读数据。",
  },
  upload: {
    title: "上传图书",
    lead: "默认仅私有。若确为公版，可声明后贡献到社区书城。",
    private: "仅私有阅读",
    community: "声明公版上架",
    pickFile: "选择文件",
    titleField: "书名",
    authorField: "作者",
    submit: "开始上传",
    busy: "处理中…",
    privateHint: "文件进个人书架，不公开到书城。",
    communityHint: "中文整本体积较大时会自动收录可展示章节；完整文件建议同时私有保存。",
  },
  account: {
    title: "账户",
    profile: "个人资料",
    ai: "AI 设置",
    plan: "订阅",
    notSignedIn: "尚未登录",
    goLogin: "去登录",
  },
  reader: {
    toc: "目录",
    settings: "阅读设置",
    font: "字体",
    size: "字号",
    theme: "主题",
    ai: "AI 伴读",
    highlight: "划线",
    note: "批注",
    progress: "进度",
    prev: "上一页",
    next: "下一页",
  },
  common: {
    loading: "加载中…",
    save: "保存",
    cancel: "取消",
    confirm: "确认",
    back: "返回",
    open: "打开",
    addShelf: "加入书架",
    onShelf: "已在书架",
    publicDomain: "公版",
    private: "私有",
  },
};

export const en: Messages = {
  brand: "Modu",
  brandTag: "Immersive reading · AI companion",
  nav: {
    home: "Home",
    library: "Library",
    rankings: "Charts",
    shelf: "Shelf",
    upload: "Upload",
    account: "Account",
    me: "Me",
    login: "Sign in",
    logout: "Sign out",
  },
  theme: { toLight: "Light", toDark: "Dark" },
  lang: { zh: "中文", en: "EN", switchTo: "Language" },
  landing: {
    badge: "Public domain · Private uploads · AI reading",
    title1: "Carry the world in your pocket,",
    title2: "and a quiet light with it.",
    lead: "Modu lists only public-domain books in the store. Upload private PDF/EPUB for yourself. AI sits beside you while you read — on phone and desktop.",
    ctaLibrary: "Browse public domain",
    ctaUpload: "Private upload",
    featPd: "Public-domain store",
    featPdD: "Only works in the public domain — safe to add to your shelf.",
    featPrivate: "Private uploads",
    featPrivateD: "PDF/EPUB stay on your shelf; never listed in the store.",
    featAi: "AI companion",
    featAiD: "Explain, summarize, translate selections; bring your own key or use ours.",
    featRank: "Internal charts",
    featRankD: "Public heat for PD books; private books share notes only, never full text.",
    featMobile: "Phone & desktop",
    featMobileD: "Tap zones on mobile, keyboard and dual-page on desktop.",
    featCloud: "Cloud-ready",
    featCloudD: "Cloudflare storage & AI; progress and notes sync when signed in.",
  },
  login: {
    title: "Sign in to Modu",
    subtitle: "Google · X · Email — sync shelf, notes, and AI profile",
    welcome: "Welcome back",
    create: "Create account",
    email: "Email",
    password: "Password",
    name: "Display name",
    signIn: "Sign in with email",
    signUp: "Sign up",
    orEmail: "Or use email",
    continueGoogle: "Continue with Google",
    continueX: "Continue with X",
    noAccount: "No account yet?",
    hasAccount: "Already have an account?",
    backHome: "Back home",
    systemStatus: "System status",
    aboutTitle: "About sign-in (this environment)",
    aboutEmail:
      "Email sign-up works now. If a password suddenly fails after redeploy, re-register the same email (preview DB may reset).",
    aboutSocial:
      "Google / X need production OAuth. If they fail, use email first.",
    aboutPersist:
      "For permanent accounts, connect Cloudflare D1 or DATABASE_URL (see README).",
    oauthFail:
      "Social sign-in did not finish. Retry, or register with email.",
  },
  library: {
    title: "Public-domain library",
    lead: "Only public-domain titles. Private uploads never appear here.",
    search: "Search title or author…",
    empty: "No matching public-domain books",
    official: "Official PD",
    community: "Community PD",
  },
  shelf: {
    title: "My shelf",
    lead: "In-progress and uploaded books live here.",
    empty: "Shelf is empty — browse the library or upload a book.",
    continue: "Continue",
    progress: "Progress",
  },
  rankings: {
    title: "Popular charts",
    lead: "Internal ranking by reading heat (public-domain first).",
    hot: "Hot",
    empty: "Not enough reading data yet.",
  },
  upload: {
    title: "Upload a book",
    lead: "Private by default. Declare public domain only when you can prove it.",
    private: "Private only",
    community: "Contribute as PD",
    pickFile: "Choose file",
    titleField: "Title",
    authorField: "Author",
    submit: "Upload",
    busy: "Working…",
    privateHint: "Stays on your shelf — never listed in the store.",
    communityHint:
      "Long Chinese texts are packed automatically for the community shelf; keep a full private copy for the complete file.",
  },
  account: {
    title: "Account",
    profile: "Profile",
    ai: "AI settings",
    plan: "Subscription",
    notSignedIn: "Not signed in",
    goLogin: "Sign in",
  },
  reader: {
    toc: "Contents",
    settings: "Reader settings",
    font: "Font",
    size: "Size",
    theme: "Theme",
    ai: "AI",
    highlight: "Highlight",
    note: "Note",
    progress: "Progress",
    prev: "Previous",
    next: "Next",
  },
  common: {
    loading: "Loading…",
    save: "Save",
    cancel: "Cancel",
    confirm: "Confirm",
    back: "Back",
    open: "Open",
    addShelf: "Add to shelf",
    onShelf: "On shelf",
    publicDomain: "Public domain",
    private: "Private",
  },
};

export const catalogs: Record<Locale, Messages> = { zh, en };
