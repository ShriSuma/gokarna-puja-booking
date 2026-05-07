"use client";

import { motion } from "framer-motion";
import { locales, type Locale, useI18n } from "@/lib/i18n";

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  return (
    <motion.label
      initial={{ opacity: 0, y: -8 }}
      animate={{ opacity: 1, y: 0 }}
      className="inline-flex items-center gap-2 rounded-md border border-maroon/15 bg-white/70 px-2 py-1 text-xs text-maroon"
    >
      <span className="hidden sm:inline">{t("lang.label")}</span>
      <select
        aria-label={t("lang.label")}
        className="bg-transparent text-sm"
        value={locale}
        onChange={(e) => void setLocale(e.target.value as Locale)}
      >
        {locales.map((l) => (
          <option key={l} value={l}>
            {t(`lang.${l}`)}
          </option>
        ))}
      </select>
    </motion.label>
  );
}

