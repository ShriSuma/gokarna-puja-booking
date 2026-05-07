import type { Language } from "@prisma/client";
import { prisma } from "@/lib/db";
import { getPujaBySlug } from "@/content/pujas.data";
import { PUJA_TRANSLATIONS, type PujaLangPack } from "@/content/puja-translations-data";
import type { NonEnLang } from "@/content/puja-translations-types";

const LANGS: NonEnLang[] = ["hi", "te", "ta", "kn"];

function mergePackWithEnglish(slug: string, partial: Partial<PujaLangPack>) {
  const en = getPujaBySlug(slug);
  if (!en) return null;
  const name = partial.name ?? en.name;
  const short = partial.shortDescription ?? en.shortDescription;
  return {
    name,
    shortDescription: short,
    longDescriptionMarkdown: partial.longDescriptionMarkdown ?? `## ${name}\n\n${short}`,
    requirements: partial.requirements ?? `${en.preparation}\n${en.included.join("\n")}`,
    benefits: partial.benefits ?? en.significance.slice(0, 400),
    significance: partial.significance ?? en.significance,
    whoShouldDo: partial.whoShouldDo ?? en.whoShouldDo,
    included: partial.included ?? en.included.join("\n"),
    preparation: partial.preparation ?? en.preparation,
    story: partial.story ?? en.story,
  };
}

/** Upserts non-English rows from the static catalogue so Admin / DB stay aligned after bootstrap. */
export async function syncPujaTranslationsForSlug(pujaTypeId: string, slug: string): Promise<void> {
  for (const lang of LANGS) {
    const pack = PUJA_TRANSLATIONS[slug]?.[lang];
    if (!pack) continue;
    const row = mergePackWithEnglish(slug, pack);
    if (!row) continue;
    await prisma.pujaTranslation.upsert({
      where: { pujaTypeId_language: { pujaTypeId, language: lang } },
      create: { pujaTypeId, language: lang, ...row },
      update: { ...row },
    });
  }
}
