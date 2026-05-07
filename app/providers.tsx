"use client";

import { useCallback, useState } from "react";
import { Toaster } from "sonner";
import { I18nProvider, normalizeLocale, type Locale } from "@/lib/i18n";

export function Providers({
  children,
  initialLocale,
}: {
  children: React.ReactNode;
  initialLocale: string;
}) {
  const [locale, setLocaleState] = useState<Locale>(normalizeLocale(initialLocale));
  const setLocale = useCallback(async (next: Locale) => {
    setLocaleState(next);
    await fetch("/api/language", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ locale: next }),
    });
    window.location.reload();
  }, []);
  return (
    <I18nProvider locale={locale} setLocale={setLocale}>
      {children}
      <Toaster richColors position="top-center" closeButton />
    </I18nProvider>
  );
}
