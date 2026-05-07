"use client";

import Link from "next/link";
import { useState } from "react";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/content/site.config";
import { LanguageSwitcher } from "@/components/LanguageSwitcher";
import { useI18n } from "@/lib/i18n";

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
  const { t } = useI18n();

  return (
    <header className="sticky top-0 z-40 border-b border-maroon/10 bg-parchment/90 backdrop-blur-md">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 md:py-4">
        <Link href="/" className="group flex flex-col focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded-md">
          <span className="font-display text-xl text-maroon transition group-hover:text-brass md:text-2xl">
            {siteConfig.siteName}
          </span>
          <span className="text-sm text-maroon/70 font-display tracking-wide">{siteConfig.tagline}</span>
        </Link>

        <nav className="hidden items-center gap-4 md:flex" aria-label="Primary">
          <LanguageSwitcher />
          {links.map((l) => (
            <motion.div key={l.href} whileTap={{ scale: 0.95 }}>
              <Link
                href={l.href}
                className={`relative rounded-sm font-body text-lg transition focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon ${
                  pathname === l.href ? "text-maroon" : "text-ink/90 hover:text-maroon"
                }`}
              >
                {t(l.key)}
                {pathname === l.href ? (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded bg-brass transition-opacity duration-200" />
                ) : null}
              </Link>
            </motion.div>
          ))}
          <Link
            href="/book"
            className="btn-shine btn-ripple rounded-md bg-brass px-4 py-2 font-body text-lg font-semibold text-maroon-deep shadow hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
          >
            {t("cta.bookPuja")}
          </Link>
        </nav>

        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md border border-maroon/20 p-2 md:hidden"
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

      <AnimatePresence>
        {open && (
          <motion.div
            id="mobile-nav"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            className="border-t border-maroon/10 bg-parchment md:hidden"
          >
            <div className="flex flex-col gap-2 px-4 py-4">
              <LanguageSwitcher />
              {links.map((l) => (
                <Link
                  key={l.href}
                  href={l.href}
                  className={`rounded-md px-2 py-2 text-lg transition ${
                    pathname === l.href
                      ? "bg-maroon text-parchment"
                      : "text-ink hover:bg-sandstone-100"
                  }`}
                  onClick={() => setOpen(false)}
                >
                  {t(l.key)}
                </Link>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
