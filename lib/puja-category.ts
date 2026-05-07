import { z } from "zod";

/**
 * Runtime-safe mirror of Prisma `PujaCategory`.
 * Prefer this for UI/runtime comparisons when `prisma generate` may be stale
 * (e.g. Windows EPERM while the dev server holds the query engine DLL).
 */
export const PujaCategory = {
  PITRI_KARYA: "PITRI_KARYA",
  PUJA_KARYA: "PUJA_KARYA",
} as const;

export type PujaCategory = (typeof PujaCategory)[keyof typeof PujaCategory];

export const pujaCategorySchema = z.enum(["PITRI_KARYA", "PUJA_KARYA"]);
