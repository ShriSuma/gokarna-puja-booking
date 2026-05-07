"use client";

import { useEffect, useMemo, useState } from "react";

type DayStatus = "available" | "fully-booked" | "blocked" | "unavailable";
type ApiDay = {
  date: string;
  status: DayStatus;
  totalSlots: number;
  openSlots: number;
};

const weekdayLabels = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

function monthIdFromDate(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

function toDateString(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function compareDateOnly(a: string, b: string): number {
  return a.localeCompare(b);
}

function statusClass(status: DayStatus): string {
  switch (status) {
    case "available":
      return "border-emerald-300 bg-emerald-50 text-emerald-900 hover:bg-emerald-100";
    case "fully-booked":
      return "border-amber-300 bg-amber-50 text-amber-900";
    case "blocked":
      return "border-rose-300 bg-rose-50 text-rose-900";
    default:
      return "border-sandstone-200 bg-sandstone-100 text-ink/45";
  }
}

export function AvailabilityCalendar({
  selectedDate,
  onSelectDate,
}: {
  selectedDate?: string;
  onSelectDate: (date: string) => void;
}) {
  const today = useMemo(() => {
    const d = new Date();
    d.setHours(0, 0, 0, 0);
    return d;
  }, []);
  const [visibleMonth, setVisibleMonth] = useState<Date>(() => {
    const initial = selectedDate ? new Date(`${selectedDate}T00:00:00`) : new Date();
    initial.setDate(1);
    initial.setHours(0, 0, 0, 0);
    return initial;
  });
  const [days, setDays] = useState<Record<string, ApiDay>>({});
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const month = monthIdFromDate(visibleMonth);
    let cancelled = false;
    setLoading(true);
    (async () => {
      try {
        const res = await fetch(`/api/availability?month=${encodeURIComponent(month)}`);
        const data = await res.json();
        if (cancelled) return;
        const mapped: Record<string, ApiDay> = {};
        for (const d of (data.days ?? []) as ApiDay[]) mapped[d.date] = d;
        setDays(mapped);
      } catch {
        if (!cancelled) setDays({});
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [visibleMonth]);

  const gridDates = useMemo(() => {
    const year = visibleMonth.getFullYear();
    const monthIndex = visibleMonth.getMonth();
    const first = new Date(year, monthIndex, 1);
    const last = new Date(year, monthIndex + 1, 0);
    const startWeekday = first.getDay();
    const daysInMonth = last.getDate();

    const entries: Array<{ iso: string; inMonth: boolean; day: number }> = [];
    for (let i = 0; i < startWeekday; i++) {
      const d = new Date(year, monthIndex, i - startWeekday + 1);
      entries.push({ iso: toDateString(d), inMonth: false, day: d.getDate() });
    }
    for (let day = 1; day <= daysInMonth; day++) {
      const d = new Date(year, monthIndex, day);
      entries.push({ iso: toDateString(d), inMonth: true, day });
    }
    while (entries.length % 7 !== 0) {
      const d = new Date(year, monthIndex + 1, entries.length - (startWeekday + daysInMonth) + 1);
      entries.push({ iso: toDateString(d), inMonth: false, day: d.getDate() });
    }
    return entries;
  }, [visibleMonth]);

  const minMonthId = monthIdFromDate(new Date(today.getFullYear(), today.getMonth(), 1));
  const isPrevDisabled = monthIdFromDate(visibleMonth) <= minMonthId;

  return (
    <div className="rounded-xl border border-maroon/15 bg-white/70 p-4 md:p-5">
      <div className="flex items-center justify-between gap-3">
        <button
          type="button"
          disabled={isPrevDisabled}
          className="rounded-md border border-maroon/20 px-3 py-1.5 text-sm text-maroon disabled:opacity-40"
          onClick={() =>
            setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() - 1, 1))
          }
        >
          Previous
        </button>
        <p className="font-display text-2xl text-maroon">
          {visibleMonth.toLocaleString("en-IN", { month: "long", year: "numeric" })}
        </p>
        <button
          type="button"
          className="rounded-md border border-maroon/20 px-3 py-1.5 text-sm text-maroon"
          onClick={() =>
            setVisibleMonth((m) => new Date(m.getFullYear(), m.getMonth() + 1, 1))
          }
        >
          Next
        </button>
      </div>

      <div className="mt-4 grid grid-cols-7 gap-2 text-center text-xs font-semibold uppercase tracking-wide text-ink/60">
        {weekdayLabels.map((w) => (
          <div key={w}>{w}</div>
        ))}
      </div>

      {loading ? (
        <div className="mt-3 grid grid-cols-7 gap-2">
          {Array.from({ length: 35 }).map((_, i) => (
            <div key={i} className="h-12 animate-pulse rounded-md bg-sandstone-100" />
          ))}
        </div>
      ) : (
        <div className="mt-3 grid grid-cols-7 gap-2">
          {gridDates.map((entry) => {
            const dayData = days[entry.iso];
            const status: DayStatus = dayData?.status ?? "unavailable";
            const isPast = compareDateOnly(entry.iso, toDateString(today)) < 0;
            const disabled =
              !entry.inMonth || isPast || status === "unavailable" || status === "blocked" || status === "fully-booked";
            const isSelected = selectedDate === entry.iso;
            return (
              <button
                key={entry.iso}
                type="button"
                disabled={disabled}
                onClick={() => onSelectDate(entry.iso)}
                className={`relative h-12 rounded-md border text-sm transition ${statusClass(status)} ${
                  !entry.inMonth ? "opacity-40" : ""
                } ${isSelected ? "ring-2 ring-maroon ring-offset-1" : ""} disabled:cursor-not-allowed`}
                aria-label={`${entry.iso} ${status}`}
              >
                {entry.day}
                {entry.inMonth && dayData?.openSlots ? (
                  <span className="absolute bottom-1 right-1 text-[10px]">{dayData.openSlots}</span>
                ) : null}
              </button>
            );
          })}
        </div>
      )}

      <div className="mt-4 flex flex-wrap gap-2 text-xs text-ink/70">
        <span className="rounded-full border border-emerald-300 bg-emerald-50 px-2 py-0.5">Available</span>
        <span className="rounded-full border border-amber-300 bg-amber-50 px-2 py-0.5">Fully booked</span>
        <span className="rounded-full border border-rose-300 bg-rose-50 px-2 py-0.5">Blocked</span>
        <span className="rounded-full border border-sandstone-200 bg-sandstone-100 px-2 py-0.5">Unavailable</span>
      </div>
    </div>
  );
}

