import { TempleBackdrop } from "@/components/TempleBackdrop";
import { GalleryGrid } from "@/components/GalleryGrid";
import { getGeneralGalleryImages, hasAnyGalleryImages } from "@/lib/gallery";
import { getServerI18n } from "@/lib/i18n/server";

export const metadata = {
  title: "Gallery",
  description: "Moments from rituals in Gokarna—images appear automatically when you add them.",
};

export default async function GalleryPage() {
  const { t } = await getServerI18n();
  const items = await getGeneralGalleryImages();
  const any = await hasAnyGalleryImages();

  return (
    <div className="relative">
      <TempleBackdrop />
      <section className="mx-auto max-w-6xl px-4 py-12 md:py-16">
        <h1 className="font-display text-4xl text-maroon md:text-5xl">{t("nav.gallery")}</h1>
        <p className="mt-4 max-w-2xl font-body text-xl text-ink/80">
          {any ? t("gallery.withPhotos") : t("gallery.emptyHint")}
        </p>
        <div className="mt-10">
          <GalleryGrid items={items} emptyMessage={t("gallery.emptyGrid")} placeholderLabel={t("gallery.emptyGrid")} />
        </div>
      </section>
    </div>
  );
}
