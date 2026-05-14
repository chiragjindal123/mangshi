import { createContext, useContext, useEffect, useState, type ReactNode } from "react";

export type Lang = "en" | "zh";

type Dict = Record<string, { en: string; zh: string }>;

export const dict = {
  "nav.culture": { en: "Culture", zh: "文化" },
  "nav.box": { en: "The Box", zh: "盲盒" },
  "nav.mission": { en: "Mission", zh: "使命" },
  "nav.join": { en: "Join", zh: "加入" },
  "footer.explore": { en: "Explore", zh: "探索" },
  "footer.recognition": { en: "Recognition", zh: "榮譽" },
  "footer.culture": { en: "Hakka Culture", zh: "客家文化" },
  "footer.box": { en: "The Blind Box", zh: "盲盒體驗" },
  "footer.mission": { en: "Our Mission", zh: "我們的使命" },
  "footer.join": { en: "Get Involved", zh: "參與我們" },
  "footer.tagline": {
    en: "A student-led initiative rescuing surplus harvest from Taiwanese farms — served as Hakka heritage meals, sealed for surprise.",
    zh: "由學生發起的計畫,搶救台灣農地的剩食 —— 化為客家家鄉味,封盒成驚喜。",
  },
  "footer.copyright": { en: "© 2026 Hakka Blind Box Initiative", zh: "© 2026 客家盲盒計畫" },
} satisfies Dict;

type Key = keyof typeof dict;

const LangCtx = createContext<{ lang: Lang; setLang: (l: Lang) => void; t: (k: Key) => string }>({
  lang: "en",
  setLang: () => {},
  t: (k) => dict[k].en,
});

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [lang, setLangState] = useState<Lang>("en");

  useEffect(() => {
    const stored = typeof window !== "undefined" ? (localStorage.getItem("lang") as Lang | null) : null;
    if (stored === "en" || stored === "zh") setLangState(stored);
  }, []);

  const setLang = (l: Lang) => {
    setLangState(l);
    if (typeof window !== "undefined") localStorage.setItem("lang", l);
  };

  const t = (k: Key) => dict[k][lang];
  return <LangCtx.Provider value={{ lang, setLang, t }}>{children}</LangCtx.Provider>;
}

export const useLang = () => useContext(LangCtx);
