/**
 * Sanity check: DB has weekly templates, a puja row, slots for tomorrow, and a booking can be created.
 * Run: npx tsx scripts/smoke-booking.ts
 */
import { PrismaClient } from "@prisma/client";
import { ensurePujaTypeForBooking, ensureWeeklyTemplatesExist } from "../lib/booking-bootstrap";
import { assertSlotBookable, getSlotsForDate } from "../lib/availability";

function tomorrowISODate(): string {
  const d = new Date();
  d.setDate(d.getDate() + 1);
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, "0");
  const day = String(d.getDate()).padStart(2, "0");
  return `${y}-${m}-${day}`;
}

async function main() {
  const prisma = new PrismaClient();
  try {
    await ensureWeeklyTemplatesExist();
    const pujaId = await ensurePujaTypeForBooking("pitru-daan");
    if (!pujaId) throw new Error("ensurePujaTypeForBooking returned null");

    const date = tomorrowISODate();
    const slots = await getSlotsForDate(date);
    if (!slots.length) throw new Error(`No slots for ${date} — check WeeklyTemplate seed`);

    const time = slots[0].time;
    await assertSlotBookable(date, time, "slot check failed");

    const booking = await prisma.booking.create({
      data: {
        pujaTypeId: pujaId,
        date,
        time,
        customerName: "Smoke Test",
        phone: "9999999999",
        amount: 100,
        status: "Payment Pending",
        paymentStatus: "pending",
        paymentProvider: "manual",
      },
    });

    await prisma.booking.delete({ where: { id: booking.id } });
    console.log("smoke-booking: OK (created and deleted booking", booking.id, ")");
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((e) => {
  console.error("smoke-booking: FAIL", e);
  if (e && typeof e === "object" && "code" in e && (e as { code: string }).code === "P2022") {
    console.error(
      "Hint: database schema is out of date. From the project root run: npx prisma db push",
    );
  }
  process.exit(1);
});
