import { NextResponse } from "next/server";
import { getMonthAvailability, getSlotsForDate } from "@/lib/availability";

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url);
  const month = searchParams.get("month");
  if (month) {
    if (!/^\d{4}-\d{2}$/.test(month)) {
      return NextResponse.json({ error: "Invalid month" }, { status: 400 });
    }
    const days = await getMonthAvailability(month);
    return NextResponse.json({ month, days });
  }

  const date = searchParams.get("date");
  if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Invalid date" }, { status: 400 });
  }
  const slots = await getSlotsForDate(date);
  return NextResponse.json({ slots });
}
