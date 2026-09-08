"use client";

import { createContext, useContext, useEffect, useMemo, useState } from "react";
import { dict } from "@/i18n/translations";
import type { Lang } from "@/types";

type Ctx = {
  lang: Lang;
  setLang: (lang: Lang) => void;
  d: ReturnType<typeof dict>;
};

const LangContext = createContext<Ctx | null>(null);

export function LangProvider({
  initialLang,
  children,
}: {
  initialLang: Lang;
  children: React.ReactNode;
}) {
  const [lang, setLangState] = useState<Lang>(initialLang);

  useEffect(() => {
    document.documentElement.lang = lang;
    document.documentElement.dir = lang === "ar" ? "rtl" : "ltr";
    document.cookie = `enclos_lang=${lang}; path=/; max-age=31536000`;
  }, [lang]);

  const value = useMemo(
    () => ({
      lang,
      setLang: setLangState,
      d: dict(lang),
    }),
    [lang],
  );

  return <LangContext.Provider value={value}>{children}</LangContext.Provider>;
}

export function useLang() {
  const ctx = useContext(LangContext);
  if (!ctx) throw new Error("useLang must be used within LangProvider");
  return ctx;
}
