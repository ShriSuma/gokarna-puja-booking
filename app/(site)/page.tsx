import Link from "next/link";
import { TempleBackdrop } from "@/components/TempleBackdrop";
import { ButtonLink } from "@/components/ButtonLink";
import { PujaCard } from "@/components/PujaCard";
import { OwnerPortrait } from "@/components/OwnerPortrait";
import { HomeHero } from "@/components/home/HomeHero";
import { TestimonialGrid } from "@/components/home/TestimonialGrid";
import { ScrollReveal } from "@/components/ui/ScrollReveal";
import { siteConfig } from "@/content/site.config";
import { listActivePujas } from "@/lib/pujas";
import { getServerI18n } from "@/lib/i18n/server";

export default async function HomePage() {
  const { t, locale } = await getServerI18n();
  const pujas = await listActivePujas(locale);
  const featured = pujas.slice(0, 4);

  return (
    <div className="relative">
      <TempleBackdrop />
      <HomeHero />

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <ScrollReveal>
          <h2 className="font-display text-4xl text-maroon">{t("home.why")}</h2>
        </ScrollReveal>
        <div className="mt-8 grid gap-8 md:grid-cols-3 font-body text-lg leading-relaxed text-ink/85">
          <ScrollReveal delay={0.04}>
            <p>
              Gokarna’s shoreline has carried prayers for centuries. The air itself seems slower here—made for
              remembrance rather than hurry.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.1}>
            <p>
              We honour both scripture and the living family before us: clear instructions, gentle pacing, and space for
              tears if they come.
            </p>
          </ScrollReveal>
          <ScrollReveal delay={0.16}>
            <p>
              Whether you arrive for piṇḍa, tarpana, or a guided remedial rite, you are welcomed as kin—not as a
              transaction.
            </p>
          </ScrollReveal>
        </div>
      </section>

      <section className="border-y border-maroon/10 bg-sandstone-50/80 py-16 md:py-20">
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex flex-col items-start justify-between gap-4 md:flex-row md:items-end">
            <ScrollReveal>
              <div>
                <h2 className="font-display text-4xl text-maroon">{t("home.featured")}</h2>
                <p className="mt-2 max-w-2xl font-body text-lg text-ink/80">
                  Begin with what calls you—each listing includes guidance, duration, and what to expect.
                </p>
              </div>
            </ScrollReveal>
            <div>
              <Link href="/pujas" className="font-body text-maroon underline-offset-4 hover:underline">
                {t("home.viewAll")} →
              </Link>
            </div>
          </div>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            {featured.map((p, i) => (
              <PujaCard key={p.slug} puja={p} index={i} />
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-4 py-16 md:py-20">
        <ScrollReveal>
          <h2 className="font-display text-4xl text-maroon">{t("home.testimonials")}</h2>
        </ScrollReveal>
        <TestimonialGrid items={siteConfig.testimonials} />
      </section>

      <section className="border-t border-maroon/10 bg-white/60 py-16 md:py-20">
        <div className="mx-auto flex max-w-6xl flex-col items-center gap-10 px-4 md:flex-row">
          <OwnerPortrait alt={`${siteConfig.ownerName}, ${siteConfig.ownerTitle}`} />
          <ScrollReveal>
            <div className="flex-1">
              <h2 className="font-display text-4xl text-maroon">
                {t("home.meet")} {siteConfig.ownerName}
              </h2>
              <p className="mt-2 font-body text-xl text-brass">{siteConfig.ownerTitle}</p>
              <p className="mt-4 font-body text-lg leading-relaxed text-ink/85">{siteConfig.ownerBio}</p>
              <div className="mt-6 flex flex-wrap gap-3">
                <ButtonLink href="/book">Book a conversation</ButtonLink>
                <ButtonLink href="/contact" variant="secondary">
                  Contact
                </ButtonLink>
              </div>
            </div>
          </ScrollReveal>
        </div>
      </section>
    </div>
  );
}
