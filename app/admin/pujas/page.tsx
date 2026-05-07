import Link from "next/link";
import { AdminLayout } from "@/components/AdminLayout";
import { AddPujaForm } from "@/components/admin/AddPujaForm";
import { prisma } from "@/lib/db";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminPujasPage() {
  const { t } = await getServerI18n();
  const pujas = await prisma.pujaType.findMany({ orderBy: { name: "asc" } }).catch(() => []);

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl text-maroon">{t("adminPuja.listTitle")}</h1>
      <p className="mt-2 font-body text-lg text-ink/75">{t("adminPuja.listHint")}</p>
      <div className="mt-6">
        <AddPujaForm />
      </div>
      <ul className="mt-8 divide-y divide-maroon/10 rounded-xl border border-maroon/10 bg-white font-body text-lg">
        {pujas.map((p) => (
          <li key={p.id} className="flex flex-wrap items-center justify-between gap-3 px-4 py-4">
            <div>
              <p className="font-display text-xl text-maroon">{p.name}</p>
              <p className="text-sm text-ink/60">{p.slug}</p>
            </div>
            <div className="flex items-center gap-4">
              <span
                className={`rounded-full px-2 py-0.5 text-xs ${
                  p.isActive ? "bg-emerald-100 text-emerald-800" : "bg-sandstone-100 text-ink/60"
                }`}
              >
                {p.isActive ? t("adminPuja.enabled") : t("adminPuja.disabled")}
              </span>
              <span className="text-ink/70">
                {new Intl.NumberFormat("en-IN", { style: "currency", currency: "INR", maximumFractionDigits: 0 }).format(p.price)}
              </span>
              <Link className="rounded-md bg-maroon px-3 py-1 text-parchment" href={`/admin/pujas/${p.id}`}>
                {t("adminPuja.edit")}
              </Link>
            </div>
          </li>
        ))}
      </ul>
    </AdminLayout>
  );
}
