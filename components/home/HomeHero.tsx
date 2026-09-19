"use client";

import Image from "next/image";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ButtonLink } from "@/components/ButtonLink";
import { useI18n } from "@/lib/i18n";
import { getPitruPakshaWhatsAppUrl } from "@/lib/whatsapp";
import { siteConfig } from "@/content/site.config";

export function HomeHero() {
  const { t, locale } = useI18n();
  const whatsappUrl = getPitruPakshaWhatsAppUrl(locale);
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, { stiffness: 80, damping: 18 });
  const sy = useSpring(y, { stiffness: 80, damping: 18 });
  const orbX = useTransform(sx, [-0.5, 0.5], [-18, 18]);
  const orbY = useTransform(sy, [-0.5, 0.5], [-12, 12]);
  const orbXReverse = useTransform(orbX, (v) => -v * 0.8);
  const orbYReverse = useTransform(orbY, (v) => -v * 0.8);
  const cardX = useTransform(orbX, (v) => v * 0.4);
  const cardY = useTransform(orbY, (v) => v * 0.3);

  function onPointerMove(e: React.MouseEvent<HTMLElement>) {
    const rect = e.currentTarget.getBoundingClientRect();
    const px = (e.clientX - rect.left) / rect.width - 0.5;
    const py = (e.clientY - rect.top) / rect.height - 0.5;
    x.set(px);
    y.set(py);
  }

  return (
    <section
      className="relative overflow-hidden border-b border-maroon/10"
      onMouseMove={onPointerMove}
    >
      <div className="absolute inset-0 bg-gradient-to-b from-saffron-light/25 via-transparent to-parchment" aria-hidden />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute -top-20 left-10 h-60 w-60 rounded-full bg-brass/20 blur-3xl"
        style={{ x: orbX, y: orbY }}
      />
      <motion.div
        aria-hidden
        className="pointer-events-none absolute right-0 top-20 h-52 w-52 rounded-full bg-maroon/15 blur-3xl"
        style={{ x: orbXReverse, y: orbYReverse }}
      />
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-14 md:flex-row md:items-center md:py-20">
        <div className="flex-1">
          {/* High-Converting Pitru Paksha Pill for Google Ads traffic */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-4 inline-flex flex-wrap items-center gap-2 rounded-full border border-brass/50 bg-gradient-to-r from-sandstone-100/95 via-sandstone-50 to-white/90 px-3.5 py-1.5 shadow-sm backdrop-blur-sm"
          >
            <span className="flex h-2 w-2 rounded-full bg-brass animate-ping" />
            <span className="font-display text-xs sm:text-sm font-bold text-maroon">
              🕉️ {t("banner.pitruPill") || "Pitru Paksha Bookings Open"}
            </span>
            <span className="text-xs text-ink/40 hidden sm:inline">•</span>
            <span className="text-xs text-ink/80 font-body hidden sm:inline">
              Narayana Bali, Pitru Dosha Nivarana & Pinda Pradhan
            </span>
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="ml-1 inline-flex items-center gap-1 rounded-full bg-[#25D366] hover:bg-[#20ba59] px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm transition-all hover:scale-105 active:scale-95"
            >
              WhatsApp →
            </a>
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="font-display text-sm uppercase tracking-[0.25em] text-maroon/70"
          >
            {t("home.heroTag")}
          </motion.p>
          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.05 }}
            className="mt-3 font-display text-4xl leading-tight text-maroon md:text-5xl lg:text-6xl text-balance"
          >
            {t("home.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-5 max-w-xl font-body text-xl leading-relaxed text-ink/85 md:text-2xl"
          >
            {t("home.heroDesc")}
          </motion.p>
          
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-wrap items-center gap-3 sm:gap-4"
          >
            <ButtonLink href="/book">{t("cta.bookPuja")}</ButtonLink>
            
            {/* Big 3D Dancing Call Button in Hero */}
            <a
              href={`tel:${siteConfig.ownerPhone}`}
              className="animate-dance-3d inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-brass-light via-brass to-brass-light text-maroon-deep px-4 py-2.5 font-body text-base sm:text-lg font-extrabold shadow-xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={t("contact.pitruCallTooltip") || "Call Panditji"}
            >
              <svg className="w-5 h-5 text-maroon-deep animate-pulse" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
              </svg>
              <span>{t("contact.callNow") || "Call Panditji"}</span>
            </a>

            {/* Big 3D Dancing WhatsApp Button in Hero */}
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="animate-dance-3d-wa inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-[#25D366] to-[#1ebe5d] text-white px-4 py-2.5 font-body text-base sm:text-lg font-extrabold shadow-xl border-2 border-white/80 hover:scale-105 active:scale-95 transition-transform cursor-pointer"
              title={t("contact.pitruWhatsappTooltip") || "Chat on WhatsApp"}
            >
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z" />
              </svg>
              <span>{t("contact.whatsappInquiry") || "WhatsApp"}</span>
            </a>

            <ButtonLink href="/pujas" variant="secondary">
              {t("cta.exploreRituals")}
            </ButtonLink>
          </motion.div>
        </div>
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 0.15 }}
          style={{ x: cardX, y: cardY }}
          className="temple-frame relative flex-1 rounded-2xl bg-white/70 p-6 backdrop-blur flex flex-col justify-between"
        >
          <div className="relative h-64 w-full mb-6 overflow-hidden rounded-xl">
            <Image 
              src="/images/atmalinga-hero.png" 
              alt="Gokarna Atmalinga" 
              fill
              priority
              sizes="(max-width: 768px) 100vw, 50vw"
              className="object-cover hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent pointer-events-none" />
            <div className="absolute bottom-4 left-4 font-display text-4xl text-white/20 select-none pointer-events-none" aria-hidden>
              ॐ
            </div>
          </div>
          <div>
            <p className="font-body text-xl leading-relaxed text-maroon italic">
              “{t("home.heroQuote")}”
            </p>
            <p className="mt-3 font-body text-base text-ink/75 font-semibold">— {t("home.heroNote")}</p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
