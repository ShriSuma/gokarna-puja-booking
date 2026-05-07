import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import ReactMarkdown from "react-markdown";
import { TempleBackdrop } from "@/components/TempleBackdrop";
import { ButtonLink } from "@/components/ButtonLink";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getPujaDetailBySlug } from "@/lib/pujas";
import { getPujaGalleryImages } from "@/lib/gallery";
import { getServerI18n } from "@/lib/i18n/server";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata(props: Props): Promise<Metadata> {
  const { slug } = await props.params;
  const { locale } = await getServerI18n();
  const puja = await getPujaDetailBySlug(slug, locale);
  if (!puja) return {};
  return {
    title: puja.name,
    description: puja.shortDescription,
    openGraph: { title: puja.name, description: puja.shortDescription },
  };
}

export default async function PujaDetailPage(props: Props) {
  const { t, locale } = await getServerI18n();
  const { slug } = await props.params;
  const puja = await getPujaDetailBySlug(slug, locale);
  if (!puja) notFound();

  const gallery = await getPujaGalleryImages(slug);
  const price = new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
    maximumFractionDigits: 0,
  }).format(puja.price);

  return (
    <div className="relative">
      <TempleBackdrop />
      <article className="mx-auto max-w-4xl px-4 py-12 md:py-16">
        <p className="font-display text-sm uppercase tracking-[0.2em] text-maroon/70">
          <Link href="/pujas" className="hover:underline">
            {t("pujas.all")}
          </Link>
        </p>
        <h1 className="mt-3 font-display text-4xl text-maroon md:text-5xl">{puja.name}</h1>
        <p className="mt-4 font-body text-xl text-ink/85">{puja.shortDescription}</p>
        <div className="mt-6 flex flex-wrap gap-4 font-body text-lg text-ink/75">
          <span>{price}</span>
          <span aria-hidden>·</span>
          <span>
            {puja.durationMinutes} {t("pujaDetail.minutesShort")}
          </span>
        </div>
        <div className="mt-10 flex flex-wrap gap-3">
          <ButtonLink href={`/book?puja=${encodeURIComponent(puja.slug)}`}>{t("cta.bookPuja")}</ButtonLink>
          <ButtonLink href="/contact" variant="secondary">
            {t("cta.askQuestion")}
          </ButtonLink>
        </div>

        <section className="mt-14 space-y-6 font-body text-lg leading-relaxed text-ink/85">
          <h2 className="font-display text-3xl text-maroon">{t("pujaDetail.significance")}</h2>
          <p>{puja.significance}</p>
          <h2 className="font-display text-3xl text-maroon">{t("pujaDetail.who")}</h2>
          <p>{puja.whoShouldDo}</p>
          <h2 className="font-display text-3xl text-maroon">{t("pujaDetail.included")}</h2>
          <ul className="list-disc space-y-2 pl-6">
            {puja.included.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
          <h2 className="font-display text-3xl text-maroon">{t("pujaDetail.prep")}</h2>
          <p>{puja.preparation}</p>
        </section>

        <section className="mt-14 rounded-2xl border border-maroon/10 bg-white/70 p-8 backdrop-blur">
          <h2 className="font-display text-3xl text-maroon">{t("pujaDetail.note")}</h2>
          <p className="mt-4 font-body text-xl leading-relaxed text-ink/85">{puja.story}</p>
        </section>

        <section className="markdown mt-14 font-body text-lg text-ink/90">
          <ReactMarkdown>{puja.longDescriptionMarkdown}</ReactMarkdown>
        </section>

        <section className="mt-16">
          <h2 className="font-display text-3xl text-maroon">{t("pujaDetail.gallery")}</h2>
          <p className="mt-2 font-body text-lg text-ink/75">
            {t("pujaDetail.moments")}
          </p>
          <div className="mt-6">
            <GalleryGrid
              items={gallery}
              emptyMessage={t("pujaDetail.galleryEmpty")}
              placeholderLabel={t("gallery.emptyGrid")}
            />
          </div>
        </section>
      </article>
    </div>
  );
}
