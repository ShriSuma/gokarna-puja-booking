"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import type { GalleryItem } from "@/lib/gallery";
import { useI18n } from "@/lib/i18n";

function PlaceholderTile({ label }: { label: string }) {
  return (
    <div className="flex aspect-[4/5] flex-col items-center justify-center rounded-xl border border-dashed border-maroon/25 bg-sandstone-100/80 p-4 text-center">
      <span className="font-display text-3xl text-maroon/25" aria-hidden>
        ✦
      </span>
      <p className="mt-3 font-body text-lg text-ink/60">{label}</p>
    </div>
  );
}

export function GalleryGrid({
  items,
  emptyMessage,
  placeholderLabel,
}: {
  items: GalleryItem[];
  emptyMessage: string;
  placeholderLabel?: string;
}) {
  const [lightbox, setLightbox] = useState<GalleryItem | null>(null);
  const { t } = useI18n();

  const placeholders = useMemo(() => Array.from({ length: 6 }), []);

  if (!items.length) {
    return (
      <div className="space-y-6">
        <p className="text-center font-body text-xl text-ink/75">{emptyMessage}</p>
        <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
          {placeholders.map((_, i) => (
            <div key={i} className="mb-4 break-inside-avoid">
              <PlaceholderTile label={placeholderLabel ?? t("gallery.emptyGrid")} />
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="columns-1 gap-4 sm:columns-2 lg:columns-3">
        {items.map((item, i) => (
          <motion.button
            type="button"
            key={item.src + i}
            className="group mb-4 w-full break-inside-avoid text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon rounded-xl"
            onClick={() => setLightbox(item)}
            initial={{ opacity: 0, y: 12 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: (i % 6) * 0.05 }}
          >
            <div className="relative overflow-hidden rounded-xl temple-frame">
              <Image
                src={item.src}
                alt={item.alt}
                width={900}
                height={1200}
                priority={i === 0}
                className="h-auto w-full object-cover transition duration-500 group-hover:scale-[1.03]"
                unoptimized={item.src.startsWith("/uploads")}
              />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-maroon/35 to-transparent opacity-0 transition group-hover:opacity-100" />
            </div>
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {lightbox && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center bg-maroon-deep/80 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-label={t("gallery.lightboxAria")}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setLightbox(null)}
          >
            <motion.div
              initial={{ scale: 0.96, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.96, opacity: 0 }}
              className="max-h-[90vh] max-w-5xl overflow-hidden rounded-xl bg-parchment shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="relative max-h-[85vh]">
                <Image
                  src={lightbox.src}
                  alt={lightbox.alt}
                  width={1400}
                  height={1400}
                  className="max-h-[85vh] w-auto object-contain"
                  unoptimized={lightbox.src.startsWith("/uploads")}
                />
              </div>
              <p className="px-4 py-3 font-body text-lg text-ink/80">{lightbox.alt}</p>
              <button
                type="button"
                className="absolute right-3 top-3 rounded-full bg-parchment/90 px-3 py-1 text-maroon shadow focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-maroon"
                onClick={() => setLightbox(null)}
              >
                {t("gallery.close")}
              </button>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
