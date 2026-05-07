"use client";

import { motion } from "framer-motion";

export function TestimonialGrid({
  items,
}: {
  items: readonly { quote: string; name: string }[];
}) {
  return (
    <div className="mt-8 grid gap-6 md:grid-cols-3">
      {items.map((t, i) => (
        <motion.blockquote
          key={i}
          initial={{ opacity: 0, y: 14 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ delay: i * 0.08 }}
          className="temple-frame rounded-xl bg-white/80 p-6 font-body text-lg italic text-ink/85"
        >
          “{t.quote}”
          <footer className="mt-4 text-base not-italic text-maroon">— {t.name}</footer>
        </motion.blockquote>
      ))}
    </div>
  );
}
