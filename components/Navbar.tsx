"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";
import { getPitruPakshaWhatsAppUrl } from "@/lib/whatsapp";

const links = [
  { href: "/", key: "nav.home" },
  { href: "/pujas", key: "nav.pujas" },
  { href: "/book", key: "nav.book" },
  { href: "/gallery", key: "nav.gallery" },
  { href: "/contact", key: "nav.contact" },
];

export function Navbar() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const { t, locale } = useI18n();
  const whatsappUrl = getPitruPakshaWhatsAppUrl(locale);

  return (
    <header className="sticky top-0 z-40 border-b border-maroon/10 bg-parchment/95 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-3 px-4 py-2.5 md:py-3.5">
        <Link href="/" title="Ganapati Maarigoli" className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded-md">
          <span className="font-display text-xl text-maroon transition group-hover:text-brass md:text-2xl">
            {siteConfig.siteName}
          </span>
          <span className="text-xs sm:text-sm text-maroon/70 font-display tracking-wide">{siteConfig.tagline}</span>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden items-center gap-3 lg:gap-4 md:flex" aria-label="Primary">
          <LanguageSwitcher />

          {links.map((l) => (
            <motion.div key={l.href} whileTap={{ scale: 0.95 }}>
              <Link
                href={l.href}
                className={`relative rounded-sm font-body text-base lg:text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon ${
                  pathname === l.href ? "text-maroon font-semibold" : "text-ink/90 hover:text-maroon"
                }`}
              >
                {t(l.key)}
                {pathname === l.href ? (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded bg-brass transition-opacity duration-200" />
                ) : null}
              </Link>
            </motion.div>
          ))}

          {/* Big 3D Dancing Call Button (Desktop) */}
          <a
            href={`tel:${siteConfig.ownerPhone}`}
            className="animate-dance-3d inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brass-light via-brass to-brass-light text-maroon-deep font-display font-extrabold text-xs lg:text-sm px-3.5 py-2 shadow-xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={`${t("contact.pitruCallTooltip") || "Call Panditji"}: ${siteConfig.ownerPhone}`}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-maroon text-parchment shadow-inner">
              <svg className="w-3.5 h-3.5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
            </span>
            <span className="tracking-wide">{siteConfig.ownerPhone}</span>
          </a>

          {/* Big 3D Dancing WhatsApp Button (Desktop) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-dance-3d-wa inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white font-display font-extrabold text-xs lg:text-sm px-3.5 py-2 shadow-xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
            title={t("contact.pitruWhatsappTooltip") || "Chat on WhatsApp"}
          >
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-white/20 shadow-inner">
              <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
            </span>
            <span>WhatsApp</span>
          </a>

          <Link
            href="/book"
            className="btn-shine btn-ripple rounded-md bg-brass px-3.5 py-2 font-body text-base lg:text-lg font-semibold text-maroon-deep shadow hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon shrink-0"
          >
            {t("cta.bookPuja")}
          </Link>
        </nav>

        {/* Mobile Header Quick Actions & Hamburger */}
        <div className="flex items-center gap-2.5 md:hidden">
          {/* Big 3D Dancing Call Icon (Mobile Header) */}
          <a
            href={`tel:${siteConfig.ownerPhone}`}
            className="animate-dance-3d flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-brass-light via-brass to-brass-light text-maroon-deep shadow-xl border-2 border-white/80 active:scale-90"
            aria-label={t("contact.pitruCallTooltip") || "Call"}
            title={`Call ${siteConfig.ownerPhone}`}
          >
            <svg className="w-5 h-5 animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
            </svg>
          </a>

          {/* Big 3D Dancing WhatsApp Icon (Mobile Header) */}
          <a
            href={whatsappUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="animate-dance-3d-wa flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white shadow-xl border-2 border-white/80 active:scale-90"
            aria-label={t("contact.pitruWhatsappTooltip") || "WhatsApp"}
            title="Chat on WhatsApp"
          >
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
            </svg>
          </a>

          {/* Menu Toggle */}
          <button
            type="button"
            className="inline-flex items-center justify-center rounded-md border border-maroon/20 p-2"
            aria-expanded={open}
            aria-controls="mobile-nav"
            onClick={() => setOpen((v) => !v)}
          >
            <span className="sr-only">{t("nav.openMenu")}</span>
            <span className="flex flex-col gap-1.5" aria-hidden>
              <span className={`block h-0.5 w-6 bg-maroon transition ${open ? "translate-y-2 rotate-45" : ""}`} />
              <span className={`block h-0.5 w-6 bg-maroon transition ${open ? "opacity-0" : ""}`} />
              <span className={`block h-0.5 w-6 bg-maroon transition ${open ? "-translate-y-2 -rotate-45" : ""}`} />
            </span>
          </button>
        </div>
      </div>

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-maroon/10 bg-parchment md:hidden shadow-lg"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              <div className="flex items-center justify-between pb-2 border-b border-maroon/10">
                <span className="text-xs font-medium text-ink/70">Language:</span>
                <LanguageSwitcher />
              </div>

              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-3 py-2 text-lg transition ${
                    pathname === l.href
                      ? "bg-maroon text-parchment font-semibold"
                      : "text-ink hover:bg-sandstone-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(l.key)}
                </Link>
              ))}

              <div className="pt-2 border-t border-maroon/10 flex flex-col gap-2">
                <a
                  href={`tel:${siteConfig.ownerPhone}`}
                  className="flex items-center justify-center gap-2 rounded-lg bg-maroon/10 px-4 py-2.5 text-maroon font-semibold text-sm hover:bg-maroon hover:text-parchment transition-colors"
                >
                  <svg className="w-4 h-4 text-brass" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{t("contact.pitruCallTooltip") || "Call"}: {siteConfig.ownerPhone}</span>
                </a>

                <a
                  href={whatsappUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-center gap-2 rounded-lg bg-[#25D366] px-4 py-2.5 text-white font-semibold text-sm shadow-sm"
                >
                  <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                    <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
                  </svg>
                  <span>{t("contact.pitruWhatsappTooltip") || "WhatsApp Inquiry"}</span>
                </a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
