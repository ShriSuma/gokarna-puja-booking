import { locales, type Locale } from "./messages";

export const languageCookie = "site_lang";

export function normalizeLocale(value: string | undefined): Locale {
  if (value && (locales as readonly string[]).includes(value)) return value as Locale;
  return "en";
}

