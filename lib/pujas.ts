import { prisma } from "@/lib/db";
import { getPujaBySlug, pujasData, type PujaContent } from "@/content/pujas.data";
import { getPujaPack } from "@/content/puja-translations-data";
import type { Language, PujaTranslation, PujaType } from "@prisma/client";
import type { PujaCategory } from "@/lib/puja-category";
import type { Locale } from "@/lib/i18n/messages";
import { translate } from "@/lib/i18n/translate";

export type PujaListItem = {
  id: string;
  slug: string;
  category: PujaCategory;
  name: string;
  shortDescription: string;
  price: number;
  durationMinutes: number;
  coverImageSrc?: string | null;
  popupEmotional?: string;
  popupRequirements?: string;
  popupBenefits?: string;
};

function toLanguage(locale?: Locale): Language {
  if (!locale) return "en";
  return locale as Language;
}

export async function listActivePujas(locale?: Locale): Promise<PujaListItem[]> {
  const language = toLanguage(locale);
  try {
    const rows = await prisma.pujaType.findMany({
      where: { isActive: true },
      orderBy: { name: "asc" },
      include: {
        translations: {
          where: { language },
          take: 1,
        },
        media: {
          where: { kind: "PUJA" },
          orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
          take: 1,
        },
      },
    });
    if (rows.length > 0) {
      return rows.map((r) => {
        const tr0 = r.translations[0];
        const pack = getPujaPack(r.slug, language);
        const prefer = language !== "en" && pack;
        return {
          id: r.id,
          slug: r.slug,
          category: r.category,
          name: prefer && pack?.name ? pack.name : (tr0?.name || pack?.name || r.name),
          shortDescription: prefer && pack?.shortDescription
            ? pack.shortDescription
            : (tr0?.shortDescription || pack?.shortDescription || r.shortDescription),
          price: r.price,
          durationMinutes: r.durationMinutes,
          coverImageSrc: r.media[0]?.path ?? null,
          popupEmotional: prefer && pack?.story ? pack.story : (tr0?.story || pack?.story || undefined),
          popupRequirements: prefer && pack?.requirements
            ? pack.requirements
            : (tr0?.requirements || pack?.requirements || undefined),
          popupBenefits: prefer && pack?.benefits ? pack.benefits : (tr0?.benefits || pack?.benefits || undefined),
        };
      });
    }
  } catch {
    /* database may be unavailable during CI/build */
  }
  return pujasData.map((p, i) => {
    const pack = getPujaPack(p.slug, language);
    const prefer = language !== "en" && pack;
    return {
      id: `local-${p.slug}-${i}`,
      slug: p.slug,
      category: p.category,
      name: prefer && pack?.name ? pack.name : p.name,
      shortDescription: prefer && pack?.shortDescription ? pack.shortDescription : p.shortDescription,
      price: p.price,
      durationMinutes: p.durationMinutes,
      popupEmotional: prefer && pack?.story ? pack.story : p.story,
      popupRequirements: prefer && pack?.requirements ? pack.requirements : p.preparation,
      popupBenefits: prefer && pack?.benefits ? pack.benefits : p.significance.slice(0, 280),
    };
  });
}

export type PujaDetail = PujaContent & {
  id?: string;
  db?: PujaType | null;
  requirements?: string;
  benefits?: string;
};

export async function getPujaDetailBySlug(slug: string, locale?: Locale): Promise<PujaDetail | null> {
  const language = toLanguage(locale);
  const staticPuja = getPujaBySlug(slug);
  let db: PujaType | null = null;
  let translation: PujaTranslation | null = null;
  try {
    const row = await prisma.pujaType.findUnique({
      where: { slug },
      include: {
        translations: {
          where: { language },
          take: 1,
        },
      },
    });
    db = row;
    translation = row?.translations[0] ?? null;
  } catch {
    db = null;
  }
  if (!db && staticPuja) {
    try {
      const row = await prisma.pujaType.findUnique({
        where: { slug },
        include: {
          translations: {
            where: { language },
            take: 1,
          },
        },
      });
      translation = row?.translations[0] ?? null;
    } catch {
      translation = null;
    }
  }
  if (!staticPuja && !db) return null;
  const L = language as Locale;
  const base = staticPuja ?? {
    slug: db!.slug,
    category: db!.category,
    name: db!.name,
    shortDescription: db!.shortDescription,
    price: db!.price,
    durationMinutes: db!.durationMinutes,
    significance: db!.shortDescription,
    whoShouldDo: translate(L, "pujaDetail.dbOnlyWho"),
    included: [translate(L, "pujaDetail.dbOnlyIncluded")],
    preparation: translate(L, "pujaDetail.dbOnlyPrep"),
    story: translate(L, "pujaDetail.dbOnlyStory"),
    longDescriptionMarkdown: db!.longDescriptionMarkdown,
  };

  const pack = getPujaPack(slug, language);
  const preferPack = language !== "en" && pack;

  function pickStr(packV: string | undefined, trV: string | undefined, fallback: string): string {
    if (preferPack && packV && packV.trim()) return packV;
    return trV || fallback;
  }

  function pickIncluded(packV: string | undefined, trV: string | undefined, fallback: string[]): string[] {
    if (preferPack && packV && packV.trim()) return packV.split("\n").map((s) => s.trim()).filter(Boolean);
    if (trV && trV.trim()) return trV.split("\n").map((s) => s.trim()).filter(Boolean);
    return fallback;
  }

  if (!db) {
    return {
      ...base,
      db: null,
      name: pickStr(pack?.name, translation?.name, base.name),
      shortDescription: pickStr(pack?.shortDescription, translation?.shortDescription, base.shortDescription),
      significance: pickStr(pack?.significance, translation?.significance, base.significance),
      whoShouldDo: pickStr(pack?.whoShouldDo, translation?.whoShouldDo, base.whoShouldDo),
      included: pickIncluded(pack?.included, translation?.included, base.included),
      preparation: pickStr(pack?.preparation, translation?.preparation, base.preparation),
      story: pickStr(pack?.story, translation?.story, base.story),
      longDescriptionMarkdown: pickStr(
        pack?.longDescriptionMarkdown,
        translation?.longDescriptionMarkdown,
        base.longDescriptionMarkdown,
      ),
      requirements: pickStr(pack?.requirements, translation?.requirements, base.requirements ?? ""),
      benefits: pickStr(pack?.benefits, translation?.benefits, base.benefits ?? ""),
    };
  }
  return {
    ...base,
    id: db.id,
    name: pickStr(pack?.name, translation?.name, db.name),
    shortDescription: pickStr(pack?.shortDescription, translation?.shortDescription, db.shortDescription),
    price: db.price,
    durationMinutes: db.durationMinutes,
    significance: pickStr(pack?.significance, translation?.significance, base.significance),
    whoShouldDo: pickStr(pack?.whoShouldDo, translation?.whoShouldDo, base.whoShouldDo),
    included: pickIncluded(pack?.included, translation?.included, base.included),
    preparation: pickStr(pack?.preparation, translation?.preparation, base.preparation),
    story: pickStr(pack?.story, translation?.story, base.story),
    longDescriptionMarkdown: pickStr(
      pack?.longDescriptionMarkdown,
      translation?.longDescriptionMarkdown,
      db.longDescriptionMarkdown || base.longDescriptionMarkdown,
    ),
    requirements: pickStr(pack?.requirements, translation?.requirements, base.requirements ?? ""),
    benefits: pickStr(pack?.benefits, translation?.benefits, base.benefits ?? ""),
    db,
  };
}

export async function resolvePujaTypeIdForBooking(slug: string): Promise<string | null> {
  try {
    const row = await prisma.pujaType.findUnique({ where: { slug }, select: { id: true, isActive: true } });
    if (row?.isActive) return row.id;
  } catch {
    return null;
  }
  return null;
}
