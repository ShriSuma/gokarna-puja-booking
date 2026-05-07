import { AdminLayout } from "@/components/AdminLayout";
import { ScheduleBoard } from "@/components/admin/ScheduleBoard";
import { prisma } from "@/lib/db";
import { getServerI18n } from "@/lib/i18n/server";

export const dynamic = "force-dynamic";

export default async function AdminAvailabilityPage() {
  const { t } = await getServerI18n();
  const [weekly, blocks, overrides, bookingRows] = await Promise.all([
    prisma.weeklyTemplate.findMany({ orderBy: [{ dayOfWeek: "asc" }, { time: "asc" }] }),
    prisma.dateBlock.findMany({ orderBy: { date: "asc" } }),
    prisma.availabilitySlot.findMany({ orderBy: [{ date: "asc" }, { time: "asc" }] }),
    prisma.booking.findMany({
      where: { status: { not: "Cancelled" } },
      select: { date: true, time: true },
    }),
  ]);

  const bookedMap = new Map<string, number>();
  for (const b of bookingRows) {
    const k = `${b.date}|${b.time}`;
    bookedMap.set(k, (bookedMap.get(k) ?? 0) + 1);
  }
  const booked = Array.from(bookedMap.entries()).map(([key, count]) => {
    const [date, time] = key.split("|");
    return { date, time, count };
  });

  return (
    <AdminLayout>
      <h1 className="font-display text-4xl text-maroon">{t("admin.availabilityPageTitle")}</h1>
      <p className="mt-2 font-body text-lg text-ink/75">{t("admin.availabilityPageHint")}</p>
      <div className="mt-8">
        <ScheduleBoard weekly={weekly} blocks={blocks} overrides={overrides} booked={booked} />
      </div>
    </AdminLayout>
  );
}
