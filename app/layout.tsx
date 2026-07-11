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
    default: `${siteConfig.siteName} | Ganapati Maarigoli`,
    template: `%s | ${siteConfig.siteName}`,
  },
  description: "Book authentic Gokarna pooja, Tithi, Shradh, and Rudrabhisheka rituals with experienced Pandit Ganapati Maarigoli near Mahabaleshwara Temple.",
  keywords: ["Gokarna pooja", "Tithi in gokarna", "Pandit in Gokarna", "Gokarna rituals", "Mahabaleshwara temple pooja", "Pinda Pradana Gokarna", "Narayan Bali Gokarna", "Rudrabhisheka"],
  openGraph: {
    title: `${siteConfig.siteName} — Expert Pandit for Gokarna Pooja`,
    description: "Book authentic Gokarna pooja, Tithi, Shradh, and Rudrabhisheka rituals.",
    url: siteUrl,
    siteName: siteConfig.siteName,
    locale: "en_IN",
    type: "website",
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@type": "LocalBusiness",
  "name": siteConfig.siteName,
  "image": `${siteUrl}/owner/owner-new.jpg`,
  "telephone": siteConfig.ownerPhone,
  "email": siteConfig.ownerEmail,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": "Subramanya Temple",
    "addressLocality": "Gokarna",
    "addressRegion": "Karnataka",
    "addressCountry": "IN"
  },
  "geo": {
    "@type": "GeoCoordinates",
    "latitude": 14.5422,
    "longitude": 74.3188
  },
  "url": siteUrl,
  "founder": {
    "@type": "Person",
    "name": siteConfig.ownerName
  },
  "description": siteConfig.tagline
};

export default async function RootLayout({ children }: { children: React.ReactNode }) {
  const cookieStore = await cookies();
  const initialLocale = normalizeLocale(cookieStore.get(languageCookie)?.value);
  return (
    <html lang={initialLocale} data-scroll-behavior="smooth" className={`${noto.variable} ${inter.variable}`}>
      <head>
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData) }}
        />
      </head>
      <body className="min-h-screen flex flex-col bg-parchment text-ink">{children}</body>
    </html>
  );
}
