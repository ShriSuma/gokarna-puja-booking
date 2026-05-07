import { prisma } from "@/lib/db";
import { pujasData } from "@/content/pujas.data";
import { syncPujaTranslationsForSlug } from "@/lib/puja-translations-sync";

const defaultTimes = ["06:30", "09:00", "11:30", "15:00", "17:30"];

/** Ensures weekly slots exist so /api/availability and booking never see an empty template. */
export async function ensureWeeklyTemplatesExist(): Promise<void> {
  const count = await prisma.weeklyTemplate.count();
  if (count > 0) return;
  for (let d = 0; d < 7; d++) {
    for (const t of defaultTimes) {
      await prisma.weeklyTemplate.upsert({
        where: { dayOfWeek_time: { dayOfWeek: d, time: t } },
        create: { dayOfWeek: d, time: t, capacity: 2 },
        update: {},
      });
    }
  }
}

/**
 * Resolves a bookable PujaType id. If the DB was never seeded, upserts from catalog so
 * booking matches what users see in the puja list (static or DB-backed).
 */
export async function ensurePujaTypeForBooking(slug: string): Promise<string | null> {
  const catalog = pujasData.find((p) => p.slug === slug);
  if (!catalog) return null;

  await ensureWeeklyTemplatesExist();

  const puja = await prisma.pujaType.upsert({
    where: { slug },
    create: {
      slug: catalog.slug,
      name: catalog.name,
      shortDescription: catalog.shortDescription,
      longDescriptionMarkdown: catalog.longDescriptionMarkdown,
      category: catalog.category,
      price: catalog.price,
      durationMinutes: catalog.durationMinutes,
      isActive: true,
    },
    update: {
      isActive: true,
    },
  });

  await syncPujaTranslationsForSlug(puja.id, slug);

  return puja.id;
}
