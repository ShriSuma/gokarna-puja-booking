import type { Metadata } from "next";
import Script from "next/script";
import { Inter, Noto_Serif_Devanagari } from "next/font/google";
import "./globals.css";
import { siteConfig } from "@/content/site.config";
import { cookies } from "next/headers";
import { languageCookie, normalizeLocale } from "@/lib/i18n/shared";
import { GoogleAdsTracker } from "@/components/GoogleAdsTracker";

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

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || "https://www.bookgokarnapooja.com";

export const metadata: Metadata = {
  metadataBase: new URL(siteUrl),
  title: {
    default: "Gokarna Narayana Bali & Pitru Dosha Nivarana Pooja | Pandit Ganapati Maarigoli",
    template: `%s | ${siteConfig.siteName}`,
  },
  description: "Book authentic Narayana Bali & Pitru Dosha Nivarana Pooja in Gokarna with Vedic Pandit Ganapati Maarigoli near Mahabaleshwara Temple. Mahalaya Pitru Paksha, Pinda Pradhan, Tithi Shradh, & Tripindi. Call or WhatsApp for Muhurtha.",
  keywords: [
    "Narayana Bali Gokarna",
    "Pitru Dosha Nivarana Pooja Gokarna",
    "Narayana Bali Pitru Dosha Nivarana",
    "Gokarna Narayana Bali Puja",
    "Pitru Paksha Gokarna",
    "Mahalaya Pitru Paksha pooja",
    "Pinda Pradana Gokarna",
    "Pinda Daan in Gokarna",
    "Tarpana in Gokarna",
    "Gokarna Shradh booking",
    "Mahalaya Amavasya Gokarna",
    "Tripindi Shraddha Gokarna",
    "Pitru Dosha Nivarana",
    "Gokarna pooja booking",
    "Tithi in gokarna",
    "Pandit in Gokarna contact number",
    "Best Purohit in Gokarna",
    "Pandit Ganapati Maarigoli",
    "Gokarna rituals",
    "Mahabaleshwara temple pooja",
    "Rudrabhisheka Gokarna",
    "Subramanya temple Gokarna"
  ],
  openGraph: {
    title: "Gokarna Narayana Bali & Pitru Dosha Nivarana Pooja | Pandit Ganapati Maarigoli",
    description: "Book authentic Narayana Bali & Pitru Dosha Nivarana Pooja in Gokarna with Vedic Pandit Ganapati Maarigoli. Mahalaya Pitru Paksha, Pinda Pradhan, & Shradh. Call or WhatsApp for Muhurtha.",
    url: siteUrl,
    siteName: siteConfig.siteName,
    images: [
      {
        url: `${siteUrl}/images/pujas/narayana-bali.png`,
        width: 1200,
        height: 630,
        alt: "Gokarna Narayana Bali & Pitru Dosha Nivarana Pooja - Pandit Ganapati Maarigoli",
      },
    ],
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Gokarna Narayana Bali & Pitru Dosha Nivarana Pooja | Pandit Ganapati Maarigoli",
    description: "Authentic Narayana Bali, Pitru Dosha Nivarana & Shradh rituals in sacred Gokarna with Pandit Ganapati Maarigoli. Call or WhatsApp for Muhurtha.",
    images: [`${siteUrl}/images/pujas/narayana-bali.png`],
  },
  alternates: {
    canonical: siteUrl,
  },
  robots: { index: true, follow: true, googleBot: { index: true, follow: true } },
};

const structuredData = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "LocalBusiness",
      "@id": `${siteUrl}/#organization`,
      "name": siteConfig.siteName,
      "image": `${siteUrl}/owner/owner-new.jpg`,
      "telephone": "+917892676490",
      "email": siteConfig.ownerEmail,
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "Subramanya Temple, Near Mahabaleshwara Temple",
        "addressLocality": "Gokarna",
        "addressRegion": "Karnataka",
        "postalCode": "581326",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 14.5422,
        "longitude": 74.3188
      },
      "hasMap": siteConfig.mapLink,
      "url": siteUrl,
      "priceRange": "₹₹",
      "aggregateRating": {
        "@type": "AggregateRating",
        "ratingValue": "4.9",
        "reviewCount": "58",
        "bestRating": "5",
        "worstRating": "1"
      },
      "founder": {
        "@type": "Person",
        "name": siteConfig.ownerName,
        "jobTitle": siteConfig.ownerTitle
      },
      "description": "Authentic Narayana Bali, Pitru Dosha Nivarana, Mahalaya Pitru Paksha, Pinda Pradhan, and Vedic rituals conducted in Gokarna by Pandit Ganapati Maarigoli near Mahabaleshwara Temple.",
      "areaServed": [
        { "@type": "City", "name": "Gokarna" },
        { "@type": "City", "name": "Bengaluru" },
        { "@type": "City", "name": "Hubli" },
        { "@type": "City", "name": "Mangaluru" },
        { "@type": "City", "name": "Hyderabad" },
        { "@type": "City", "name": "Chennai" },
        { "@type": "City", "name": "Mumbai" },
        { "@type": "City", "name": "Pune" }
      ],
      "hasOfferCatalog": {
        "@type": "OfferCatalog",
        "name": "Sacred Gokarna Rites",
        "itemListElement": [
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Narayana Bali & Pitru Dosha Nivarana Pooja"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pitru Paksha & Mahalaya Rites"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Pinda Pradhan"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Tripindi Shraddha"
            }
          },
          {
            "@type": "Offer",
            "itemOffered": {
              "@type": "Service",
              "name": "Tarpana & Shraddha"
            }
          }
        ]
      }
    },
    {
      "@type": "FAQPage",
      "@id": `${siteUrl}/#faq`,
      "mainEntity": [
        {
          "@type": "Question",
          "name": "How can I book Pitru Paksha and Narayana Bali puja in Gokarna?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "You can connect directly with Vedic Pandit Ganapati Maarigoli by calling or messaging on WhatsApp. We provide date selection (muhurtha), arrange all required samagri, and assist with family gotra sankalpa."
          }
        },
        {
          "@type": "Question",
          "name": "Why is Gokarna holy for Narayana Bali and Pitru Tarpana?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Gokarna is one of the revered Mukti Kshetras of India. Conducting Narayana Bali, Tripindi Shraddha, and Pinda Pradhan near the shores of Mahabaleshwara Atmalinga relieves Pitru Dosha and brings liberation (moksha) to ancestral souls."
          }
        },
        {
          "@type": "Question",
          "name": "What samagri and items should devotees bring?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "All primary sacred materials (samagri), dharbha, homa woods, and puja items are prepared by Pandit Ganapati Maarigoli. Devotees should bring family gotra details and names of ancestors, and wear traditional attire (dhoti/uttariya for men, saree for women)."
          }
        },
        {
          "@type": "Question",
          "name": "Can we perform rituals on Mahalaya Amavasya in Gokarna?",
          "acceptedAnswer": {
            "@type": "Answer",
            "text": "Yes, Mahalaya Amavasya (Sarvapitri Amavasya) is the most auspicious day of Pitru Paksha for honoring all ancestors. Advance reservation is recommended due to high devotee pilgrimage during this time."
          }
        }
      ]
    }
  ]
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
      <body className="min-h-screen flex flex-col bg-parchment text-ink">
        {/* Google Tag (gtag.js) for Google Ads */}
        <Script
          src="https://www.googletagmanager.com/gtag/js?id=AW-18461450287"
          strategy="afterInteractive"
        />
        <Script id="google-ads-gtag" strategy="afterInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', 'AW-18461450287');
            gtag('event', 'conversion', {
              'send_to': 'AW-18461450287/b-a3COulm_0cEK_AjeNE',
              'value': 1.0,
              'currency': 'INR'
            });
          `}
        </Script>

        {/* Global Google Ads Call & WhatsApp Event Tracker */}
        <GoogleAdsTracker />

        {children}
      </body>
    </html>
  );
}
