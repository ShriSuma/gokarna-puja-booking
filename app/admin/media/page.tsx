import { AdminLayout } from "@/components/AdminLayout";
import { MediaLibrary } from "@/components/admin/MediaLibrary";
import { prisma } from "@/lib/db";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminMediaPage() {
  const { t } = await getServerI18n();
  const assets = await prisma.mediaAsset
    .findMany({
      where: { kind: "GENERAL" },
      orderBy: [{ sortOrder: "asc" }, { createdAt: "asc" }],
    })
    .catch(() => []);

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl text-maroon">{t("admin.mediaPageTitle")}</h1>
      <p className="mt-2 font-body text-lg text-ink/75">{t("admin.mediaPageHint")}</p>
      <div className="mt-6 rounded-xl border border-maroon/15 bg-sandstone-50/90 p-5 shadow-sm">
        <p className="font-display text-lg text-maroon">{t("admin.mediaWhereTitle")}</p>
        <ul className="mt-3 list-disc space-y-2 pl-5 font-body text-base text-ink/85">
          <li>{t("admin.mediaBulletGallery")}</li>
          <li>{t("admin.mediaBulletPuja")}</li>
        </ul>
      </div>
      <div className="mt-8">
        <MediaLibrary assets={assets} />
      </div>
    </AdminLayout>
  );
}
