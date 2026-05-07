import type { MetadataRoute } from "next";
import { prisma } from "@/lib/db";
import { pujasData } from "@/content/pujas.data";

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  let dbPujas: { slug: string }[] = [];
  try {
    dbPujas = await prisma.pujaType.findMany({ select: { slug: true } });
  } catch {
    dbPujas = [];
  }
  const slugs = dbPujas.length ? dbPujas.map((p) => p.slug) : pujasData.map((p) => p.slug);
  const last = new Date();

  const staticPaths: MetadataRoute.Sitemap = [
    { url: siteUrl, lastModified: last, changeFrequency: "weekly", priority: 1 },
    { url: `${siteUrl}/book`, lastModified: last, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/pujas`, lastModified: last, changeFrequency: "weekly", priority: 0.9 },
    { url: `${siteUrl}/gallery`, lastModified: last, changeFrequency: "monthly", priority: 0.6 },
    { url: `${siteUrl}/contact`, lastModified: last, changeFrequency: "yearly", priority: 0.5 },
  ];

  const pujaPaths: MetadataRoute.Sitemap = slugs.map((slug) => ({
    url: `${siteUrl}/pujas/${slug}`,
    lastModified: last,
    changeFrequency: "monthly" as const,
    priority: 0.8,
  }));

  return [...staticPaths, ...pujaPaths];
}
