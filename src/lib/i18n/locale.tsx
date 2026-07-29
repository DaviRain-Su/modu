import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { catalogs, type Locale, type Messages } from "./messages";

const KEY = "modu_locale";

function detectDefault(): Locale {
  if (typeof navigator === "undefined") return "zh";
  try {
    const stored = localStorage.getItem(KEY);
    if (stored === "zh" || stored === "en") return stored;
  } catch {
    /* ignore */
  }
  const lang = (navigator.language || "zh").toLowerCase();
  if (lang.startsWith("en")) return "en";
  return "zh";
}

function applyDom(locale: Locale) {
  if (typeof document === "undefined") return;
  document.documentElement.lang = locale === "en" ? "en" : "zh-CN";
  try {
    document.title =
      locale === "en"
        ? "Modu · Online Reader"
        : "墨读 · 在线阅读器";
  } catch {
    /* ignore */
  }
}

type Ctx = {
  locale: Locale;
  setLocale: (l: Locale) => void;
  toggle: () => void;
  t: Messages;
};

const LocaleCtx = createContext<Ctx | null>(null);

export function LocaleProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("zh");

  useEffect(() => {
    const l = detectDefault();
    setLocaleState(l);
    applyDom(l);
  }, []);

  const setLocale = useCallback((l: Locale) => {
    setLocaleState(l);
    applyDom(l);
    try {
      localStorage.setItem(KEY, l);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setLocale(locale === "zh" ? "en" : "zh");
  }, [locale, setLocale]);

  const value = useMemo(
    () => ({
      locale,
      setLocale,
      toggle,
      t: catalogs[locale],
    }),
    [locale, setLocale, toggle],
  );

  return <LocaleCtx.Provider value={value}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) {
    // SSR / fallback
    return {
      locale: "zh" as Locale,
      setLocale: () => {},
      toggle: () => {},
      t: catalogs.zh,
    };
  }
  return ctx;
}

export function useT() {
  return useLocale().t;
}
