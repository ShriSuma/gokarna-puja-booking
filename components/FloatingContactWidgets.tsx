"use client";

import { motion } from "framer-motion";
import { useI18n } from "@/lib/i18n";
import { getPitruPakshaWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/content/site.config";

export function FloatingContactWidgets() {
  const { t, locale } = useI18n();
  const whatsappUrl = getPitruPakshaWhatsAppUrl(locale);
  const tooltipText = t("contact.pitruWhatsappTooltip") || "Pitru Paksha Inquiry";
  const descText = t("contact.pitruWhatsappDesc") || "Chat on WhatsApp for rituals & dates";
  const callTooltip = t("contact.pitruCallTooltip") || "Call Panditji";
  const callNowText = t("contact.callNow") || "Call Panditji";

  return (
    <>
      {/* ========================================================================= */}
      {/* DESKTOP & TABLET: Floating Bottom Actions (Dual Sides)                    */}
      {/* ========================================================================= */}

      {/* BOTTOM-LEFT: Floating Call Button (3D Dancing) */}
      <div className="hidden md:block fixed bottom-6 left-6 z-40">
        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="relative group"
        >
          {/* Big 3D Dancing Call Button */}
          <a
            href={`tel:${siteConfig.ownerPhone}`}
            className="animate-dance-3d flex items-center gap-3.5 rounded-2xl bg-gradient-to-r from-brass-light via-brass to-brass-light text-maroon-deep px-5 py-3.5 shadow-2xl border-2 border-white/90 hover:border-white transition-all duration-300 hover:scale-105 active:scale-95 cursor-pointer"
            aria-label={callNowText}
            title={callTooltip}
          >
            <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-xl bg-maroon text-parchment border border-brass/50 shadow-inner">
              <svg className="h-6 w-6 text-brass-light animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <div className="flex flex-col text-left pr-2">
              <span className="text-[11px] uppercase font-extrabold tracking-wider text-maroon-deep/90 flex items-center gap-1.5">
                <span className="h-2 w-2 rounded-full bg-green-500 animate-ping inline-block" />
                {callTooltip}
              </span>
              <span className="font-display font-extrabold text-base md:text-lg tracking-wide text-maroon-deep">
                {callTooltip}
              </span>
            </div>
          </a>
        </motion.div>
      </div>

      {/* BOTTOM-RIGHT: Floating WhatsApp Widget (3D Dancing with Tooltip) */}
      <div className="hidden md:block fixed bottom-6 right-6 z-40">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="relative group flex items-center"
        >
          {/* Tooltip Card beside WhatsApp Icon */}
          <div className="mr-3 pointer-events-none group-hover:pointer-events-auto transition-all duration-300 opacity-95 group-hover:opacity-100 transform translate-x-0 group-hover:-translate-x-1">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="block bg-white/95 backdrop-blur-md text-ink rounded-2xl p-3.5 shadow-2xl border-2 border-[#25D366]/40 hover:border-[#25D366] transition-colors max-w-xs cursor-pointer"
            >
              <div className="flex items-center gap-2 mb-1">
                <span className="h-2.5 w-2.5 rounded-full bg-[#25D366] animate-ping" />
                <span className="font-display font-extrabold text-sm text-maroon">
                  {tooltipText}
                </span>
                <span className="ml-auto text-[10px] font-bold bg-[#25D366]/15 text-[#198754] px-2 py-0.5 rounded-full">
                  {t("contact.pitruBadge") || "Open"}
                </span>
              </div>
              <p className="text-xs text-ink/80 font-body leading-snug">
                {descText}
              </p>
            </a>
          </div>

          {/* Big 3D Dancing WhatsApp Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-dance-3d-wa flex h-16 w-16 items-center justify-center rounded-2xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white shadow-2xl border-2 border-white/90 hover:scale-110 active:scale-95 transition-transform cursor-pointer"
            aria-label={tooltipText}
            title={tooltipText}
          >
            <svg className="h-9 w-9 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>
        </motion.div>
      </div>

      {/* ========================================================================= */}
      {/* MOBILE VIEW: Bottom Sticky Quick Bar with Big 3D Dancing Buttons           */}
      {/* ========================================================================= */}
      <div className="block md:hidden fixed bottom-3 inset-x-3 z-50">
        <div className="flex items-center gap-3 p-2 rounded-2xl bg-white/95 backdrop-blur-md shadow-2xl border-2 border-brass/30">
          {/* Big 3D Dancing Call Button */}
          <a
            href={`tel:${siteConfig.ownerPhone}`}
            className="animate-dance-3d flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-brass-light via-brass to-brass-light text-maroon-deep py-3 px-3 text-xs sm:text-sm font-display font-extrabold shadow-xl border border-white/80 active:scale-95 transition-transform cursor-pointer"
            aria-label={callNowText}
          >
            <svg className="h-4 w-4 text-maroon-deep shrink-0 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
            <span className="truncate">{callTooltip}</span>
          </a>

          {/* Big 3D Dancing WhatsApp Inquiry Button */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-dance-3d-wa flex-1 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white py-3 px-3 text-xs sm:text-sm font-display font-extrabold shadow-xl border border-white/80 active:scale-95 transition-transform cursor-pointer"
            aria-label={tooltipText}
          >
            <svg className="h-4 w-4 fill-current shrink-0" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
            <span className="truncate">WhatsApp</span>
          </a>
        </div>
      </div>
    </>
  );
}
