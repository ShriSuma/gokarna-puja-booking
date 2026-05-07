"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ButtonLink } from "@/components/ButtonLink";
import { useI18n } from "@/lib/i18n";

export function HomeHero() {
  const { t } = useI18n();
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
      <div className="relative mx-auto flex max-w-6xl flex-col gap-10 px-4 py-16 md:flex-row md:items-center md:py-24">
        <div className="flex-1">
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
            className="mt-4 font-display text-4xl leading-tight text-maroon md:text-6xl text-balance"
          >
            {t("home.heroTitle")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.12 }}
            className="mt-6 max-w-xl font-body text-xl leading-relaxed text-ink/85 md:text-2xl"
          >
            {t("home.heroDesc")}
          </motion.p>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.55, delay: 0.18 }}
            className="mt-8 flex flex-wrap gap-4"
          >
            <ButtonLink href="/book">{t("cta.bookPuja")}</ButtonLink>
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
          className="temple-frame relative flex-1 rounded-2xl bg-white/70 p-8 backdrop-blur"
        >
          <div className="font-display text-5xl text-maroon/15 select-none" aria-hidden>
            ॐ
          </div>
          <p className="mt-4 font-body text-2xl leading-relaxed text-maroon">
            “{t("home.heroQuote")}”
          </p>
          <p className="mt-4 font-body text-lg text-ink/75">— {t("home.heroNote")}</p>
        </motion.div>
      </div>
    </section>
  );
}
