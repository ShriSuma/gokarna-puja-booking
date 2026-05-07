import { prisma } from "@/lib/db";
import { AdminLayout } from "@/components/AdminLayout";
import { BookingsTable } from "@/components/admin/BookingsTable";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminDashboardPage() {
  const { t } = await getServerI18n();
  const bookings = await prisma.booking.findMany({
    orderBy: { createdAt: "desc" },
    include: { pujaType: true },
    take: 200,
  });

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl text-maroon">{t("admin.bookingsPageTitle")}</h1>
      <p className="mt-2 font-body text-lg text-ink/75">{t("admin.bookingsPageHint")}</p>
      <div className="mt-8">
        <BookingsTable bookings={bookings} />
      </div>
    </AdminLayout>
  );
}
