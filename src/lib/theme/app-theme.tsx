import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

export type AppTheme = "dark" | "light";

const KEY = "modu_app_theme";

function readStored(): AppTheme {
  if (typeof window === "undefined") return "dark";
  try {
    const v = localStorage.getItem(KEY);
    if (v === "light" || v === "dark") return v;
  } catch {
    /* ignore */
  }
  return "dark";
}

function applyDom(theme: AppTheme) {
  if (typeof document === "undefined") return;
  document.documentElement.dataset.theme = theme;
  document.documentElement.style.colorScheme = theme;
  // theme-color for mobile browser chrome
  const meta = document.querySelector('meta[name="theme-color"]');
  if (meta) {
    meta.setAttribute("content", theme === "light" ? "#f6f3ed" : "#0b0b0c");
  }
}

type Ctx = {
  theme: AppTheme;
  setTheme: (t: AppTheme) => void;
  toggle: () => void;
};

const ThemeCtx = createContext<Ctx | null>(null);

export function AppThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<AppTheme>(() => {
    if (typeof document !== "undefined") {
      const d = document.documentElement.dataset.theme;
      if (d === "light" || d === "dark") return d;
    }
    return "dark";
  });

  useEffect(() => {
    const t = readStored();
    setThemeState(t);
    applyDom(t);
  }, []);

  const setTheme = useCallback((t: AppTheme) => {
    setThemeState(t);
    applyDom(t);
    try {
      localStorage.setItem(KEY, t);
    } catch {
      /* ignore */
    }
  }, []);

  const toggle = useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark");
  }, [setTheme, theme]);

  const value = useMemo(
    () => ({ theme, setTheme, toggle }),
    [theme, setTheme, toggle],
  );

  return <ThemeCtx.Provider value={value}>{children}</ThemeCtx.Provider>;
}

export function useAppTheme() {
  const ctx = useContext(ThemeCtx);
  if (!ctx) {
    return {
      theme: "dark" as AppTheme,
      setTheme: (_: AppTheme) => {},
      toggle: () => {},
    };
  }
  return ctx;
}
