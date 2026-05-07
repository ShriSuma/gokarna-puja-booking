"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import type { PujaListItem } from "@/lib/pujas";
import { useI18n } from "@/lib/i18n";

function splitLines(text?: string) {
  if (!text) return [];
  return text
    .split(/\r?\n/)
    .map((l) => l.trim())
    .filter(Boolean);
}

export function PujaCard({ puja, index = 0 }: { puja: PujaListItem; index?: number }) {
  const [open, setOpen] = useState(false);
  const { t } = useI18n();
  const emotional = puja.popupEmotional || puja.shortDescription;
  const requirementLines = splitLines(puja.popupRequirements);
  const benefitLines = splitLines(puja.popupBenefits);
  const cover = puja.coverImageSrc || "/placeholders/temple-arch.svg";
  const imgUnopt = Boolean(puja.coverImageSrc?.startsWith("/uploads"));

  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(puja.price);

  return (
    <>
    <motion.button
      type="button"
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      whileHover={{ y: -4, rotateX: 2, rotateY: -2 }}
      whileTap={{ scale: 0.98 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.45 }}
      style={{ transformStyle: "preserve-3d", perspective: 900 }}
      onClick={() => setOpen(true)}
      className="puja-card group temple-frame relative rounded-xl bg-white/70 p-6 backdrop-blur-sm transition-colors duration-200 hover:border-maroon/25 hover:bg-white hover:shadow-lg"
    >
      <h3 className="font-display text-2xl text-maroon group-hover:text-brass transition-colors">
        <span className="focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded-sm">
          {puja.name}
        </span>
      </h3>
      <p className="mt-3 font-body text-lg leading-relaxed text-ink/85">{puja.shortDescription}</p>
      <div className="mt-4 flex flex-wrap items-center gap-3 font-body text-base text-ink/70">
        <span>{price}</span>
        <span aria-hidden>·</span>
        <span>
          {puja.durationMinutes} {t("pujaDetail.minutesShort")}
        </span>
      </div>
      <span className="mt-5 inline-flex rounded-md border border-maroon/25 px-4 py-2 font-body text-maroon transition group-hover:border-maroon group-hover:bg-sandstone-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon">
        {t("cta.bookPuja")}
      </span>
    </motion.button>
    <AnimatePresence>
      {open && (
        <motion.div
          className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-deep/70 p-4 backdrop-blur-sm"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={() => setOpen(false)}
        >
          <motion.div
            initial={{ opacity: 0, y: 24, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 18, scale: 0.97 }}
            transition={{ duration: 0.28 }}
            className="relative max-h-[90vh] w-full max-w-2xl overflow-auto rounded-2xl bg-parchment p-6 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setOpen(false)}
              className="absolute right-4 top-4 rounded-full border border-maroon/25 px-2 py-0.5 text-maroon"
            >
              ×
            </button>
            <div className="overflow-hidden rounded-xl">
              <Image
                src={cover}
                alt={puja.name}
                width={1200}
                height={560}
                className="h-52 w-full object-cover"
                unoptimized={imgUnopt}
              />
            </div>
            <h3 className="mt-4 font-display text-3xl text-maroon">{puja.name}</h3>
            <p className="mt-2 font-semibold text-maroon">{t("popup.spiritual")}</p>
            <p className="mt-2 font-body text-lg text-ink/85">{emotional}</p>
            <div className="mt-4 grid gap-4 md:grid-cols-2">
              <div>
                <p className="font-semibold text-maroon">{t("popup.requirements")}</p>
                {requirementLines.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
                    {requirementLines.map((r) => (
                      <li key={r}>{r}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-ink/75">{t("book.intro")}</p>
                )}
              </div>
              <div>
                <p className="font-semibold text-maroon">{t("popup.benefits")}</p>
                {benefitLines.length ? (
                  <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-ink/80">
                    {benefitLines.map((b) => (
                      <li key={b}>{b}</li>
                    ))}
                  </ul>
                ) : (
                  <p className="mt-2 text-sm text-ink/75">{puja.shortDescription}</p>
                )}
              </div>
            </div>
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                href={`/book?puja=${encodeURIComponent(puja.slug)}`}
                className="btn-shine btn-ripple rounded-md bg-maroon px-4 py-2 text-parchment"
              >
                {t("cta.bookPuja")}
              </Link>
              <Link href={`/pujas/${puja.slug}`} className="rounded-md border border-maroon/25 px-4 py-2 text-maroon">
                {t("popup.details")}
              </Link>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
    </>
  );
}
