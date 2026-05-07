import { PrismaClient, type Language } from "@prisma/client";
import { pujasData } from "../content/pujas.data";
import { locales } from "../lib/i18n/messages";

const localePrefixes: Record<Exclude<Language, "en">, string> = {
  hi: "हिंदी भावार्थ: ",
  te: "తెలుగు భావం: ",
  ta: "தமிழ் விளக்கம்: ",
  kn: "ಕನ್ನಡ ಭಾವಾರ್ಥ: ",
};

function localizedCopy(locale: Language, value: string) {
  if (locale === "en") return value;
  return `${localePrefixes[locale]}${value}`;
}

const prisma = new PrismaClient();

async function main() {
  for (const p of pujasData) {
    const puja = await prisma.pujaType.upsert({
      where: { slug: p.slug },
      create: {
        slug: p.slug,
        name: p.name,
        shortDescription: p.shortDescription,
        longDescriptionMarkdown: p.longDescriptionMarkdown,
        category: p.category,
        price: p.price,
        durationMinutes: p.durationMinutes,
        isActive: true,
      },
      update: {
        name: p.name,
        shortDescription: p.shortDescription,
        longDescriptionMarkdown: p.longDescriptionMarkdown,
        category: p.category,
        price: p.price,
        durationMinutes: p.durationMinutes,
      },
    });

    for (const locale of locales as readonly Language[]) {
      await prisma.pujaTranslation.upsert({
        where: {
          pujaTypeId_language: {
            pujaTypeId: puja.id,
            language: locale,
          },
        },
        create: {
          pujaTypeId: puja.id,
          language: locale,
          name: localizedCopy(locale, p.name),
          shortDescription: localizedCopy(locale, p.shortDescription),
          longDescriptionMarkdown: localizedCopy(locale, p.longDescriptionMarkdown),
          requirements: localizedCopy(locale, [p.preparation, ...p.included].join("\n")),
          benefits: localizedCopy(locale, p.significance),
          significance: localizedCopy(locale, p.significance),
          whoShouldDo: localizedCopy(locale, p.whoShouldDo),
          included: localizedCopy(locale, p.included.join("\n")),
          preparation: localizedCopy(locale, p.preparation),
          story: localizedCopy(locale, p.story),
        },
        update: {
          name: localizedCopy(locale, p.name),
          shortDescription: localizedCopy(locale, p.shortDescription),
          longDescriptionMarkdown: localizedCopy(locale, p.longDescriptionMarkdown),
          requirements: localizedCopy(locale, [p.preparation, ...p.included].join("\n")),
          benefits: localizedCopy(locale, p.significance),
          significance: localizedCopy(locale, p.significance),
          whoShouldDo: localizedCopy(locale, p.whoShouldDo),
          included: localizedCopy(locale, p.included.join("\n")),
          preparation: localizedCopy(locale, p.preparation),
          story: localizedCopy(locale, p.story),
        },
      });
    }
  }

  const defaultTimes = ["06:30", "09:00", "11:30", "15:00", "17:30"];
  for (let d = 0; d < 7; d++) {
    for (const t of defaultTimes) {
      await prisma.weeklyTemplate.upsert({
        where: { dayOfWeek_time: { dayOfWeek: d, time: t } },
        create: { dayOfWeek: d, time: t, capacity: 2 },
        update: {},
      });
    }
  }

  console.log("Seed complete: pujas + weekly templates.");
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
