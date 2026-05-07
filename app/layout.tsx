import type { Metadata } from "next";
import { Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/content/site.config";
import { cookies } from "next/headers";
import { languageCookie, normalizeLocale } from "@/lib/i18n/shared";

const noto = Noto_Serif_Devanagari({
  subsets: ["latin", "devanagari"],
  weight: ["400", "500", "700"],
  variable: "--font-display",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-body",
  display: "swap",
});

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: `${siteConfig.siteName} — Sacred rituals in Gokarna`,
    template: `%s · ${siteConfig.siteName}`,
  },
  description: siteConfig.tagline,
  openGraph: {
    title: siteConfig.siteName,
    description: siteConfig.tagline,
    url: siteUrl,
    siteName: siteConfig.siteName,
    locale: "en_IN",
    type: "website",
  },
  robots: { index: true, follow: true },
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(languageCookie)?.value);
  return (
    <html lang={initialLocale} data-scroll-behavior="smooth" className={`${noto.variable} ${inter.variable}`}>
      <body className="min-h-screen flex flex-col bg-parchment text-ink">{children}</body>
    </html>
  );
}
