import { cookies } from "next/headers";
import { languageCookie, normalizeLocale } from "./shared";
import { translate } from "./translate";

export async function getServerI18n() {
  const store = await cookies();
  const locale = normalizeLocale(store.get(languageCookie)?.value);
  return {
    locale,
    t: (key: string, vars?: Record<string, string | number>) => translate(locale, key, vars),
  };
}

