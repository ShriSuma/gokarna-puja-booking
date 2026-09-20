"use client";

import { useI18n } from "@/lib/i18n";
import { getPitruPakshaWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/content/site.config";

export function PitruPakshaBanner() {
  const { t, locale } = useI18n();
  const whatsappUrl = getPitruPakshaWhatsAppUrl(locale);
  const announcementText =
    t("banner.pitruAnnouncement") ||
    "🕉️ Mahalaya Pitru Paksha & Narayana Bali Puja Bookings Now Open! Pre-book sacred ancestral rites in Gokarna • Guided by Pandit Ganapati Maarigoli • Call or WhatsApp for Muhurtha";

  return (
    <div 
      className="relative z-50 w-full overflow-hidden bg-gradient-to-r from-maroon-deep via-maroon to-maroon-deep text-parchment py-3 sm:py-3.5 shadow-xl border-b-2 border-brass/40"
      role="region"
      aria-label="Special Announcement"
    >
      <div className="flex flex-col lg:flex-row items-center justify-between mx-auto max-w-7xl px-3 sm:px-6 gap-3">
        {/* Rolling Marquee Announcement */}
        <div className="relative flex-1 w-full overflow-hidden select-none">
          <div className="flex w-max animate-marquee items-center gap-12 font-body text-xs sm:text-sm md:text-base font-semibold tracking-wide hover:[animation-play-state:paused]">
            <span className="flex items-center gap-2.5">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-brass/30 text-brass-light border border-brass/50 animate-pulse">
                {t("contact.pitruBadge") || "Pitru Paksha"}
              </span>
              <span>{announcementText}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-brass/30 text-brass-light border border-brass/50 animate-pulse">
                {t("contact.pitruBadge") || "Pitru Paksha"}
              </span>
              <span>{announcementText}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-brass/30 text-brass-light border border-brass/50 animate-pulse">
                {t("contact.pitruBadge") || "Pitru Paksha"}
              </span>
              <span>{announcementText}</span>
            </span>
            <span className="flex items-center gap-2.5">
              <span className="inline-block px-2.5 py-1 rounded-md text-xs font-bold bg-brass/30 text-brass-light border border-brass/50 animate-pulse">
                {t("contact.pitruBadge") || "Pitru Paksha"}
              </span>
              <span>{announcementText}</span>
            </span>
          </div>
        </div>

        {/* Big 3D Dancing Call & WhatsApp CTAs (Desktop & Mobile) */}
        <div className="flex items-center justify-center gap-3 sm:gap-4 shrink-0 pt-1 lg:pt-0">
          {/* Big 3D Dancing Call Button */}
          <a
            href={`tel:${siteConfig.ownerPhone}`}
            className="animate-dance-3d inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brass-light via-brass to-brass-light text-maroon-deep font-display font-extrabold text-xs sm:text-sm md:text-base px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-2xl border-2 border-white/80 hover:border-white transition-transform active:scale-95 cursor-pointer"
            title={t("contact.pitruCallTooltip") || "Call Panditji"}
          >
            <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-maroon text-parchment shadow-inner">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <span className="tracking-wide">Call Panditji: +91 78926 76490</span>
          </a>

          {/* Big 3D Dancing WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-dance-3d-wa inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white font-display font-extrabold text-xs sm:text-sm md:text-base px-3.5 sm:px-5 py-2 sm:py-2.5 shadow-2xl border-2 border-white/80 hover:border-white transition-transform active:scale-95 cursor-pointer"
            title={t("contact.pitruWhatsappTooltip") || "WhatsApp Inquiry"}
          >
            <span className="flex h-5 w-5 sm:h-6 sm:w-6 items-center justify-center rounded-full bg-white/20 shadow-inner">
              <svg className="w-3.5 h-3.5 sm:w-4 sm:h-4 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>
        </div>
      </div>
    </div>
  );
}
