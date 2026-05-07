import { prisma } from "@/lib/db";
import { normalizeSlotTime } from "@/lib/slot-time";
import { ensureWeeklyTemplatesExist } from "@/lib/booking-bootstrap";

export type SlotAvailability = {
  time: string;
  capacity: number;
  booked: number;
  available: number;
  isBlocked: boolean;
};

export type DayAvailabilityStatus = "available" | "fully-booked" | "blocked" | "unavailable";

export type DayAvailability = {
  date: string;
  status: DayAvailabilityStatus;
  totalSlots: number;
  openSlots: number;
};

function parseMonth(month: string): { year: number; monthIndex: number } | null {
  const m = /^(\d{4})-(\d{2})$/.exec(month);
  if (!m) return null;
  const year = Number(m[1]);
  const monthIndex = Number(m[2]) - 1;
  if (monthIndex < 0 || monthIndex > 11) return null;
  return { year, monthIndex };
}

async function buildSlotInventoryForDate(date: string): Promise<{
  blockedByDate: boolean;
  slots: SlotAvailability[];
}> {
  try {
    await ensureWeeklyTemplatesExist();
  } catch {
    /* ignore — prisma may be unavailable */
  }

  const blocked = await prisma.dateBlock.findUnique({ where: { date } });
  if (blocked) return { blockedByDate: true, slots: [] };

  const dow = new Date(`${date}T12:00:00`).getDay();
  const explicit = await prisma.availabilitySlot.findMany({
    where: { date },
    orderBy: { time: "asc" },
  });
  const templates = await prisma.weeklyTemplate.findMany({
    where: { dayOfWeek: dow },
    orderBy: { time: "asc" },
  });

  const base =
    explicit.length > 0
      ? explicit.map((s) => ({
          time: normalizeSlotTime(s.time),
          capacity: s.capacity,
          isBlocked: s.isBlocked,
        }))
      : templates.map((t) => ({
          time: normalizeSlotTime(t.time),
          capacity: t.capacity,
          isBlocked: false,
        }));

  const slots = await Promise.all(
    base.map(async (slot) => {
      if (slot.isBlocked) {
        return {
          time: slot.time,
          capacity: slot.capacity,
          booked: 0,
          available: 0,
          isBlocked: true,
        };
      }
      const timeKeys = Array.from(new Set([slot.time, normalizeSlotTime(slot.time)].filter(Boolean)));
      const booked = await prisma.booking.count({
        where: {
          date,
          time: { in: timeKeys },
          status: { not: "Cancelled" },
        },
      });
      const available = Math.max(0, slot.capacity - booked);
      return {
        time: slot.time,
        capacity: slot.capacity,
        booked,
        available,
        isBlocked: false,
      };
    }),
  );

  return { blockedByDate: false, slots };
}

export async function getSlotsForDate(date: string): Promise<
  { time: string; capacity: number; booked: number; available: number }[]
> {
  try {
    const { slots } = await buildSlotInventoryForDate(date);
    return slots
      .filter((s) => !s.isBlocked && s.available > 0)
      .map(({ isBlocked: _isBlocked, ...rest }) => rest)
      .sort((a, b) => a.time.localeCompare(b.time));
  } catch {
    return [];
  }
}

export async function getDayAvailability(date: string): Promise<DayAvailability> {
  try {
    const { blockedByDate, slots } = await buildSlotInventoryForDate(date);
    if (blockedByDate) {
      return { date, status: "blocked", totalSlots: 0, openSlots: 0 };
    }
    if (slots.length === 0) {
      return { date, status: "unavailable", totalSlots: 0, openSlots: 0 };
    }
    const openSlots = slots.filter((s) => !s.isBlocked && s.available > 0).length;
    if (openSlots > 0) {
      return { date, status: "available", totalSlots: slots.length, openSlots };
    }
    const allBlocked = slots.every((s) => s.isBlocked);
    return {
      date,
      status: allBlocked ? "blocked" : "fully-booked",
      totalSlots: slots.length,
      openSlots: 0,
    };
  } catch {
    return { date, status: "unavailable", totalSlots: 0, openSlots: 0 };
  }
}

export async function getMonthAvailability(month: string): Promise<DayAvailability[]> {
  const parsed = parseMonth(month);
  if (!parsed) return [];
  const { year, monthIndex } = parsed;
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();

  const dates = Array.from({ length: daysInMonth }, (_, i) => {
    const d = String(i + 1).padStart(2, "0");
    return `${year}-${String(monthIndex + 1).padStart(2, "0")}-${d}`;
  });
  return Promise.all(dates.map((date) => getDayAvailability(date)));
}

export async function assertSlotBookable(
  date: string,
  time: string,
  unavailableMessage: string,
): Promise<void> {
  const normalized = normalizeSlotTime(time);
  const slots = await getSlotsForDate(date);
  const match = slots.find((s) => normalizeSlotTime(s.time) === normalized);
  if (!match || match.available < 1) {
    throw new Error(unavailableMessage);
  }
}
