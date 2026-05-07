import Link from "next/link";
import { notFound } from "next/navigation";
import { AdminLayout } from "@/components/AdminLayout";
import { PujaEditor } from "@/components/admin/PujaEditor";
import { PujaTranslationsEditor } from "@/components/admin/PujaTranslationsEditor";
import { PujaMediaManager } from "@/components/admin/PujaMediaManager";
import { prisma } from "@/lib/db";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ id: string }> };

export default async function AdminPujaEditPage(props: Props) {
  const { t } = await getServerI18n();
  const { id } = await props.params;
  const puja = await prisma.pujaType
    .findUnique({
      where: { id },
      include: {
        translations: true,
        media: {
          where: { kind: "PUJA" },
          orderBy: [{ isCover: "desc" }, { sortOrder: "asc" }, { createdAt: "asc" }],
        },
      },
    })
    .catch(() => null);
  if (!puja) notFound();

  return (
    <AdminLayout>
      <Link href="/admin/pujas" className="font-body text-maroon hover:underline">
        ← {t("adminPuja.listTitle")}
      </Link>
      <h1 className="mt-4 font-display text-4xl text-maroon">
        {t("adminPuja.editTitle")}: {puja.name}
      </h1>
      <p className="mt-2 font-body text-lg text-ink/75">{t("adminPuja.translationHint")}</p>
      <div className="mt-8 grid gap-8 lg:grid-cols-2">
        <div className="rounded-xl border border-maroon/10 bg-white p-6 shadow-sm">
          <PujaEditor puja={puja} />
        </div>
        <PujaTranslationsEditor pujaTypeId={puja.id} translations={puja.translations} />
      </div>
      <div className="mt-8 rounded-xl border border-maroon/15 bg-sandstone-50/90 p-5 font-body text-base text-ink/85 shadow-sm">
        {t("admin.mediaPujaEditReminder")}
      </div>
      <div className="mt-4">
        <PujaMediaManager pujaTypeId={puja.id} slug={puja.slug} assets={puja.media} />
      </div>
    </AdminLayout>
  );
}
