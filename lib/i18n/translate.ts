import { messages, type Locale } from "./messages";

export function readMessagePath(obj: unknown, path: string): unknown {
  return path.split(".").reduce<unknown>((acc, segment) => {
    if (acc == null) return undefined;
    if (Array.isArray(acc)) {
      const i = Number(segment);
      if (!Number.isInteger(i) || i < 0 || i >= acc.length) return undefined;
      return acc[i];
    }
    if (typeof acc === "object") {
      return (acc as Record<string, unknown>)[segment];
    }
    return undefined;
  }, obj);
}

function interpolate(template: string, vars?: Record<string, string | number>): string {
  if (!vars) return template;
  let s = template;
  for (const [k, v] of Object.entries(vars)) {
    s = s.split(`{{${k}}}`).join(String(v));
  }
  return s;
}

/** Same resolution rules as the client I18nProvider: nested keys, numeric array segments, English fallback. */
export function translate(locale: Locale, key: string, vars?: Record<string, string | number>): string {
  const preferred = readMessagePath(messages[locale], key);
  let raw: string | undefined;
  if (typeof preferred === "string") raw = preferred;
  else {
    const fallback = readMessagePath(messages.en, key);
    if (typeof fallback === "string") raw = fallback;
  }
  if (raw === undefined) {
    if (process.env.NODE_ENV === "development") {
      return `[i18n missing: ${key}]`;
    }
    return "";
  }
  return interpolate(raw, vars);
}
