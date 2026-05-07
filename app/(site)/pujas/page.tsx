import Link from "next/link";
import { TempleBackdrop } from "@/components/TempleBackdrop";
import { listActivePujas } from "@/lib/pujas";
import { getServerI18n } from "@/lib/i18n/server";
import { PujaCatalogClient } from "@/components/pujas/PujaCatalogClient";
import { PujaCategory } from "@/lib/puja-category";

export const metadata = {
  title: "Pujas",
  description: "Pitru daan, piṇḍa pradhan, Narayana Bali, tarpana, and more in Gokarna.",
};

export default async function PujasPage() {
  const { t, locale } = await getServerI18n();
  const pujas = await listActivePujas(locale);
  const pitri = pujas.filter((p) => p.category === PujaCategory.PITRI_KARYA);
  const pujaKarya = pujas.filter((p) => p.category === PujaCategory.PUJA_KARYA);

  return (
    <div className="relative">
      <TempleBackdrop />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-maroon/70">{t("pujas.rituals")}</p>
        <h1 className="mt-2 font-display text-4xl text-maroon md:text-5xl">{t("pujas.title")}</h1>
        <p className="mt-4 max-w-2xl font-body text-xl text-ink/80">
          {t("pujas.intro")}{" "}
          <Link href="/book" className="text-maroon underline-offset-4 hover:underline">
            {t("pujas.bookDate")}
          </Link>
          .
        </p>
        <PujaCatalogClient pitri={pitri} puja={pujaKarya} />
      </section>
    </div>
  );
}
