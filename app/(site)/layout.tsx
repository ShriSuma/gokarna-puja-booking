import { cookies } from "next/headers";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { Providers } from "@/app/providers";
import { languageCookie, normalizeLocale } from "@/lib/i18n/shared";
import { getServerI18n } from "@/lib/i18n/server";

export default async function SiteLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(languageCookie)?.value);
  const { t } = await getServerI18n();
  return (
    <Providers initialLocale={initialLocale}>
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:absolute focus:z-50 focus:m-4 focus:rounded-md focus:bg-maroon focus:px-3 focus:py-2 focus:text-parchment"
      >
        {t("nav.skipToContent")}
      </a>
      <Navbar />
      <main id="main" className="flex-1">
        {children}
      </main>
      <Footer />
    </Providers>
  );
}
