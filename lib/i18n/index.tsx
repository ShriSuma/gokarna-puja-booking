"use client";

import { createContext, useContext, useMemo } from "react";
import { locales, type Locale } from "./messages";
export { locales, type Locale };
export { languageCookie, normalizeLocale } from "./shared";
import { translate as translateMessage } from "./translate";

type I18nValue = {
  locale: Locale;
  t: (key: string, vars?: Record<string, string | number>) => string;
  setLocale: (next: Locale) => void;
};

const I18nContext = createContext<I18nValue | null>(null);

export function I18nProvider({
  children,
  locale,
  setLocale,
}: {
  children: React.ReactNode;
  locale: Locale;
  setLocale: (next: Locale) => void;
}) {
  const value = useMemo<I18nValue>(
    () => ({
      locale,
      t: (key, vars) => translateMessage(locale, key, vars),
      setLocale,
    }),
    [locale, setLocale],
  );
  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>;
}

export function useI18n() {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within I18nProvider");
  return ctx;
}

