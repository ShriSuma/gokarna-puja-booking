"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "sonner";
import type { AvailabilitySlot, DateBlock, WeeklyTemplate } from "@prisma/client";
import {
  deleteAvailabilitySlot,
  deleteWeeklyTemplate,
  removeDateBlock,
  upsertAvailabilitySlot,
  upsertDateBlock,
  upsertWeeklyTemplate,
} from "@/app/admin/actions";

const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export function AvailabilityManager({
  weekly,
  blocks,
  overrides,
}: {
  weekly: WeeklyTemplate[];
  blocks: DateBlock[];
  overrides: AvailabilitySlot[];
}) {
  const router = useRouter();
  const [wDay, setWDay] = useState(1);
  const [wTime, setWTime] = useState("09:00");
  const [wCap, setWCap] = useState(2);
  const [blockDate, setBlockDate] = useState("");
  const [blockNote, setBlockNote] = useState("");
  const [oDate, setODate] = useState("");
  const [oTime, setOTime] = useState("09:00");
  const [oCap, setOCap] = useState(2);
  const [oBlocked, setOBlocked] = useState(false);

  async function addWeekly(e: React.FormEvent) {
    e.preventDefault();
    try {
      await upsertWeeklyTemplate({ dayOfWeek: wDay, time: wTime, capacity: wCap });
      toast.success("Weekly slot saved");
      router.refresh();
    } catch {
      toast.error("Could not save");
    }
  }

  async function addBlock(e: React.FormEvent) {
    e.preventDefault();
    if (!blockDate) return toast.error("Pick a date");
    try {
      await upsertDateBlock({ date: blockDate, note: blockNote || undefined });
      toast.success("Date blocked");
      router.refresh();
    } catch {
      toast.error("Could not block");
    }
  }

  async function addOverride(e: React.FormEvent) {
    e.preventDefault();
    if (!oDate) return toast.error("Pick a date");
    try {
      await upsertAvailabilitySlot({
        date: oDate,
        time: oTime,
        capacity: oCap,
        isBlocked: oBlocked,
      });
      toast.success("Day override saved");
      router.refresh();
    } catch {
      toast.error("Could not save override");
    }
  }

  return (
    <div className="grid gap-10 font-body text-lg lg:grid-cols-2">
      <section className="rounded-xl border border-maroon/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-maroon">Weekly schedule</h2>
        <p className="mt-2 text-ink/75">Default slots for each weekday when no per-day overrides exist.</p>
        <form onSubmit={addWeekly} className="mt-4 grid gap-3 md:grid-cols-4">
          <label className="text-sm text-maroon">
            Day
            <select className="mt-1 w-full rounded-md border px-2 py-1" value={wDay} onChange={(e) => setWDay(Number(e.target.value))}>
              {days.map((d, i) => (
                <option key={d} value={i}>
                  {d}
                </option>
              ))}
            </select>
          </label>
          <label className="text-sm text-maroon">
            Time
            <input type="time" className="mt-1 w-full rounded-md border px-2 py-1" value={wTime} onChange={(e) => setWTime(e.target.value)} />
          </label>
          <label className="text-sm text-maroon">
            Capacity
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-md border px-2 py-1"
              value={wCap}
              onChange={(e) => setWCap(Number(e.target.value))}
            />
          </label>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-md bg-maroon py-2 text-parchment">
              Save
            </button>
          </div>
        </form>
        <ul className="mt-4 max-h-56 space-y-2 overflow-auto text-sm">
          {weekly.map((t) => (
            <li key={t.id} className="flex items-center justify-between rounded-md bg-sandstone-50 px-2 py-1">
              <span>
                {days[t.dayOfWeek]} · {t.time} · cap {t.capacity}
              </span>
              <button
                type="button"
                className="text-maroon underline"
                onClick={() =>
                  void (async () => {
                    await deleteWeeklyTemplate(t.dayOfWeek, t.time);
                    toast.success("Removed");
                    router.refresh();
                  })()
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-maroon/10 bg-white p-6 shadow-sm">
        <h2 className="font-display text-2xl text-maroon">Block entire dates</h2>
        <form onSubmit={addBlock} className="mt-4 grid gap-3 md:grid-cols-3">
          <label className="text-sm text-maroon md:col-span-1">
            Date
            <input type="date" className="mt-1 w-full rounded-md border px-2 py-1" value={blockDate} onChange={(e) => setBlockDate(e.target.value)} />
          </label>
          <label className="text-sm text-maroon md:col-span-1">
            Note (optional)
            <input className="mt-1 w-full rounded-md border px-2 py-1" value={blockNote} onChange={(e) => setBlockNote(e.target.value)} />
          </label>
          <div className="flex items-end">
            <button type="submit" className="w-full rounded-md bg-maroon py-2 text-parchment">
              Block
            </button>
          </div>
        </form>
        <ul className="mt-4 space-y-2 text-sm">
          {blocks.map((b) => (
            <li key={b.id} className="flex items-center justify-between rounded-md bg-sandstone-50 px-2 py-1">
              <span>
                {b.date} {b.note ? `— ${b.note}` : ""}
              </span>
              <button
                type="button"
                className="text-maroon underline"
                onClick={() =>
                  void (async () => {
                    await removeDateBlock(b.date);
                    toast.success("Unblocked");
                    router.refresh();
                  })()
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>

      <section className="rounded-xl border border-maroon/10 bg-white p-6 shadow-sm lg:col-span-2">
        <h2 className="font-display text-2xl text-maroon">Per-day overrides</h2>
        <p className="mt-2 text-ink/75">
          When at least one row exists for a date, only these rows are used (weekly template is ignored for that date).
        </p>
        <form onSubmit={addOverride} className="mt-4 grid gap-3 md:grid-cols-6">
          <label className="text-sm text-maroon">
            Date
            <input type="date" className="mt-1 w-full rounded-md border px-2 py-1" value={oDate} onChange={(e) => setODate(e.target.value)} />
          </label>
          <label className="text-sm text-maroon">
            Time
            <input type="time" className="mt-1 w-full rounded-md border px-2 py-1" value={oTime} onChange={(e) => setOTime(e.target.value)} />
          </label>
          <label className="text-sm text-maroon">
            Capacity
            <input
              type="number"
              min={1}
              className="mt-1 w-full rounded-md border px-2 py-1"
              value={oCap}
              onChange={(e) => setOCap(Number(e.target.value))}
            />
          </label>
          <label className="flex items-end gap-2 text-sm text-maroon">
            <input type="checkbox" checked={oBlocked} onChange={(e) => setOBlocked(e.target.checked)} />
            Block slot
          </label>
          <div className="flex items-end md:col-span-2">
            <button type="submit" className="w-full rounded-md bg-maroon py-2 text-parchment">
              Save override
            </button>
          </div>
        </form>
        <ul className="mt-4 max-h-64 space-y-2 overflow-auto text-sm">
          {overrides.map((s) => (
            <li key={s.id} className="flex items-center justify-between rounded-md bg-sandstone-50 px-2 py-1">
              <span>
                {s.date} {s.time} · cap {s.capacity} {s.isBlocked ? "(blocked)" : ""}
              </span>
              <button
                type="button"
                className="text-maroon underline"
                onClick={() =>
                  void (async () => {
                    await deleteAvailabilitySlot(s.date, s.time);
                    toast.success("Removed");
                    router.refresh();
                  })()
                }
              >
                Remove
              </button>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
