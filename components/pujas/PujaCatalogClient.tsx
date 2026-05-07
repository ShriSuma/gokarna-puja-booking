"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import type { PujaListItem } from "@/lib/pujas";
import { PujaCard } from "@/components/PujaCard";
import { useI18n } from "@/lib/i18n";

type Tab = "pitri" | "puja";

export function PujaCatalogClient({ pitri, puja }: { pitri: PujaListItem[]; puja: PujaListItem[] }) {
  const { t } = useI18n();
  const [tab, setTab] = useState<Tab>("pitri");

  const list = tab === "pitri" ? pitri : puja;

  return (
    <div className="mt-10">
      <div className="relative inline-flex rounded-full border border-maroon/15 bg-white/80 p-1 shadow-sm">
        {(["pitri", "puja"] as const).map((key) => (
          <button
            key={key}
            type="button"
            onClick={() => setTab(key)}
            className={`relative z-10 rounded-full px-4 py-2 text-sm font-semibold transition-colors duration-200 md:px-6 md:text-base ${
              tab === key ? "bg-maroon text-parchment shadow" : "text-maroon/80 hover:text-maroon"
            }`}
          >
            {key === "pitri" ? t("pujas.pitriTab") : t("pujas.pujaTab")}
          </button>
        ))}
      </div>
      <p className="mt-4 max-w-2xl font-body text-lg text-ink/75">
        {tab === "pitri" ? t("pujas.pitriLead") : t("pujas.pujaLead")}
      </p>

      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.28 }}
          className="mt-8 grid gap-6 md:grid-cols-2 [&:has(.puja-card:hover)_.puja-card:not(:hover)]:opacity-40 [&:has(.puja-card:hover)_.puja-card:not(:hover)]:blur-[0.4px]"
        >
          {list.map((p, i) => (
            <PujaCard key={p.slug} puja={p} index={i} />
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
