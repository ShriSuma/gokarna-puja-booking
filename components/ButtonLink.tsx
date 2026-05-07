"use client";

import Link from "next/link";
import type { ComponentProps } from "react";
import { motion } from "framer-motion";

type Props = ComponentProps<typeof Link> & {
  variant?: "primary" | "secondary" | "ghost";
  className?: string;
};

const base =
  "inline-flex items-center justify-center rounded-md px-5 py-2.5 text-base font-semibold tracking-wide transition-transform duration-200 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2";

const variants: Record<NonNullable<Props["variant"]>, string> = {
  primary:
    "btn-shine btn-ripple bg-maroon text-parchment shadow-md hover:-translate-y-0.5 hover:shadow-lg focus-visible:outline-maroon",
  secondary:
    "btn-shine btn-ripple border border-maroon/40 bg-sandstone-100 text-maroon hover:-translate-y-0.5 hover:bg-sandstone-200 focus-visible:outline-maroon",
  ghost: "text-maroon underline-offset-4 hover:underline focus-visible:outline-maroon",
};

export function ButtonLink({ variant = "primary", className = "", ...props }: Props) {
  return (
    <motion.div whileTap={{ scale: 0.97 }}>
      <Link className={`${base} ${variants[variant]} ${className}`} {...props} />
    </motion.div>
  );
}
