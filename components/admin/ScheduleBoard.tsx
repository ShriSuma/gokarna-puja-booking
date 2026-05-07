"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import type { AvailabilitySlot, DateBlock, WeeklyTemplate } from "@prisma/client";
import {
  deleteAvailabilitySlot,
  deleteWeeklyTemplate,
  removeDateBlock,
  setDateBlockedByDrag,
  setSlotBlocked,
  upsertAvailabilitySlot,
  upsertDateBlock,
  upsertWeeklyTemplate,
} from "@/app/admin/actions";
import { useI18n } from "@/lib/i18n";

const intlLocaleMap: Record<string, string> = {
  en: "en-IN",
  hi: "hi-IN",
  te: "te-IN",
  ta: "ta-IN",
  kn: "kn-IN",
};

function shortWeekdayLabel(locale: string, dayOfWeek: number): string {
  const intlLc = intlLocaleMap[locale] ?? "en-IN";
  const base = new Date(Date.UTC(2026, 0, 4 + dayOfWeek));
  return new Intl.DateTimeFormat(intlLc, { weekday: "short", timeZone: "UTC" }).format(base);
}

type BookedCount = { date: string; time: string; count: number };

export function ScheduleBoard({
  weekly,
  blocks,
  overrides,
  booked,
}: {
  weekly: WeeklyTemplate[];
  blocks: DateBlock[];
  overrides: AvailabilitySlot[];
  booked: BookedCount[];
}) {
  const router = useRouter();
  const { t, locale } = useI18n();
  const [drag, setDrag] = useState<{ day: number; time: string } | null>(null);

  const byDay = useMemo(() => {
    const map = new Map<number, WeeklyTemplate[]>();
    for (let d = 0; d < 7; d++) map.set(d, []);
    weekly.forEach((t) => map.get(t.dayOfWeek)?.push(t));
    map.forEach((arr) => arr.sort((a, b) => a.time.localeCompare(b.time)));
    return map;
  }, [weekly]);

  const bookedMap = useMemo(() => {
    const m = new Map<string, number>();
    booked.forEach((b) => m.set(`${b.date}|${b.time}`, b.count));
    return m;
  }, [booked]);

  async function moveSlot(fromDay: number, time: string, toDay: number) {
    if (fromDay === toDay) return;
    try {
      await upsertWeeklyTemplate({ dayOfWeek: toDay, time, capacity: weekly.find((w) => w.dayOfWeek === fromDay && w.time === time)?.capacity ?? 2 });
      await deleteWeeklyTemplate(fromDay, time);
      toast.success(t("adminAvailability.toastSlotMoved"));
      router.refresh();
    } catch {
      toast.error(t("adminAvailability.toastSlotMoveFail"));
    }
  }

  async function addSlot(day: number) {
    const time = window.prompt(t("adminAvailability.promptTime"), "09:00");
    if (!time || !/^\d{2}:\d{2}$/.test(time)) return;
    const capStr = window.prompt(t("adminAvailability.promptCap"), "2");
    const capacity = Number(capStr);
    if (!Number.isFinite(capacity) || capacity < 1) return toast.error(t("adminAvailability.toastInvalidCap"));
    try {
      await upsertWeeklyTemplate({ dayOfWeek: day, time, capacity });
      toast.success(t("adminAvailability.toastSlotAdded"));
      router.refresh();
    } catch {
      toast.error(t("adminAvailability.toastSlotAddFail"));
    }
  }

  return (
    <div className="space-y-8">
      <section className="rounded-xl border border-maroon/10 bg-white p-4 shadow-sm">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h2 className="font-display text-2xl text-maroon">{t("adminAvailability.weeklyTitle")}</h2>
            <p className="text-sm text-ink/70">{t("adminAvailability.weeklyHint")}</p>
          </div>
        </div>
        <div className="mt-4 grid gap-3 md:grid-cols-7">
          {[0, 1, 2, 3, 4, 5, 6].map((day) => (
            <div
              key={day}
              className="rounded-lg border border-maroon/10 bg-sandstone-50/60 p-2"
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => {
                if (!drag) return;
                void moveSlot(drag.day, drag.time, day);
                setDrag(null);
              }}
            >
              <div className="flex items-center justify-between gap-2">
                <p className="font-semibold text-maroon">{shortWeekdayLabel(locale, day)}</p>
                <button
                  type="button"
                  className="text-sm text-maroon underline"
                  aria-label={t("adminAvailability.addSlot")}
                  onClick={() => void addSlot(day)}
                >
                  +
                </button>
              </div>
              <div className="mt-2 space-y-2">
                {(byDay.get(day) ?? []).map((slot) => (
                  <div
                    key={slot.id}
                    draggable
                    onDragStart={() => setDrag({ day, time: slot.time })}
                    className="rounded-md border border-maroon/15 bg-white px-2 py-2 text-sm shadow-sm"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="font-mono">{slot.time}</span>
                      <button
                        type="button"
                        className="text-xs text-maroon underline"
                        onClick={() =>
                          void (async () => {
                            await deleteWeeklyTemplate(day, slot.time);
                            toast.success(t("adminAvailability.toastRemoved"));
                            router.refresh();
                          })()
                        }
                      >
                        {t("adminAvailability.del")}
                      </button>
                    </div>
                    <label className="mt-1 flex items-center gap-2 text-xs text-ink/70">
                      {t("adminAvailability.capShort")}
                      <input
                        type="number"
                        min={1}
                        className="w-16 rounded border px-1"
                        defaultValue={slot.capacity}
                        onBlur={(e) =>
                          void (async () => {
                            const next = Number(e.target.value);
                            if (!Number.isFinite(next) || next < 1) return;
                            await upsertWeeklyTemplate({ dayOfWeek: day, time: slot.time, capacity: next });
                            router.refresh();
                          })()
                        }
                      />
                    </label>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-xl border border-maroon/10 bg-white p-4 shadow-sm">
        <h2 className="font-display text-2xl text-maroon">{t("adminAvailability.blockedDates")}</h2>
        <div className="mt-3 flex flex-wrap gap-2">
          {blocks.map((b) => (
            <span key={b.id} className="inline-flex items-center gap-2 rounded-full bg-maroon/10 px-3 py-1 text-sm">
              {b.date}
              <button
                type="button"
                className="text-maroon underline"
                onClick={() =>
                  void (async () => {
                    await removeDateBlock(b.date);
                    toast.success(t("adminAvailability.toastUnblocked"));
                    router.refresh();
                  })()
                }
              >
                {t("adminAvailability.removeRow")}
              </button>
            </span>
          ))}
        </div>
        <form
          className="mt-4 flex flex-wrap items-end gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void (async () => {
              try {
                await upsertDateBlock({ date: String(fd.get("date")), note: String(fd.get("note") || "") || undefined });
                toast.success(t("adminAvailability.toastBlocked"));
                router.refresh();
                e.currentTarget.reset();
              } catch {
                toast.error(t("adminAvailability.toastBlockFail"));
              }
            })();
          }}
        >
          <label className="text-sm text-maroon">
            {t("adminAvailability.dateLabel")}
            <input name="date" type="date" className="mt-1 block rounded border px-2 py-1" required />
          </label>
          <label className="text-sm text-maroon">
            {t("adminAvailability.noteLabel")}
            <input name="note" className="mt-1 block rounded border px-2 py-1" />
          </label>
          <button className="rounded-md bg-maroon px-3 py-2 text-parchment" type="submit">
            {t("adminAvailability.blockDay")}
          </button>
        </form>
      </section>

      <section className="rounded-xl border border-maroon/10 bg-white p-4 shadow-sm">
        <h2 className="font-display text-2xl text-maroon">{t("adminAvailability.overridesTitle")}</h2>
        <p className="text-sm text-ink/70">{t("adminAvailability.overridesHint")}</p>
        <div className="mt-4 overflow-auto">
          <table className="min-w-full text-left text-sm">
            <thead>
              <tr className="border-b border-maroon/10 text-maroon">
                <th className="py-2 pr-4">{t("adminAvailability.thDate")}</th>
                <th className="py-2 pr-4">{t("adminAvailability.thTime")}</th>
                <th className="py-2 pr-4">{t("adminAvailability.thCapacity")}</th>
                <th className="py-2 pr-4">{t("adminAvailability.thBooked")}</th>
                <th className="py-2 pr-4">{t("adminAvailability.thBlocked")}</th>
                <th className="py-2 pr-4">{t("adminAvailability.thDayBlock")}</th>
                <th className="py-2 pr-4">{t("adminAvailability.thActions")}</th>
              </tr>
            </thead>
            <tbody>
              {overrides
                .slice()
                .sort((a, b) => a.date.localeCompare(b.date) || a.time.localeCompare(b.time))
                .map((s) => {
                  const bookedCount = bookedMap.get(`${s.date}|${s.time}`) ?? 0;
                  const dayBlocked = blocks.some((b) => b.date === s.date);
                  return (
                    <tr key={s.id} className="border-b border-maroon/5">
                      <td className="py-2 pr-4 font-mono">{s.date}</td>
                      <td className="py-2 pr-4 font-mono">{s.time}</td>
                      <td className="py-2 pr-4">
                        <input
                          type="number"
                          min={1}
                          className="w-20 rounded border px-1"
                          defaultValue={s.capacity}
                          onBlur={(e) =>
                            void (async () => {
                              const next = Number(e.target.value);
                              if (!Number.isFinite(next) || next < 1) return;
                              await upsertAvailabilitySlot({ date: s.date, time: s.time, capacity: next, isBlocked: s.isBlocked });
                              router.refresh();
                            })()
                          }
                        />
                      </td>
                      <td className="py-2 pr-4">{bookedCount}</td>
                      <td className="py-2 pr-4">
                        <input
                          type="checkbox"
                          defaultChecked={s.isBlocked}
                          onChange={(e) =>
                            void (async () => {
                              await setSlotBlocked({ date: s.date, time: s.time, isBlocked: e.target.checked });
                              router.refresh();
                            })()
                          }
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <input
                          type="checkbox"
                          checked={dayBlocked}
                          onChange={(e) =>
                            void (async () => {
                              await setDateBlockedByDrag({ date: s.date, blocked: e.target.checked });
                              router.refresh();
                            })()
                          }
                        />
                      </td>
                      <td className="py-2 pr-4">
                        <button
                          type="button"
                          className="text-maroon underline"
                          onClick={() =>
                            void (async () => {
                              await deleteAvailabilitySlot(s.date, s.time);
                              router.refresh();
                            })()
                          }
                        >
                          {t("adminAvailability.removeRow")}
                        </button>
                      </td>
                    </tr>
                  );
                })}
            </tbody>
          </table>
        </div>

        <form
          className="mt-4 grid gap-2 md:grid-cols-6"
          onSubmit={(e) => {
            e.preventDefault();
            const fd = new FormData(e.currentTarget);
            void (async () => {
              try {
                await upsertAvailabilitySlot({
                  date: String(fd.get("date")),
                  time: String(fd.get("time")),
                  capacity: Number(fd.get("capacity")),
                  isBlocked: fd.get("blocked") === "on",
                });
                toast.success(t("adminAvailability.toastOverrideSaved"));
                router.refresh();
                e.currentTarget.reset();
              } catch {
                toast.error(t("adminAvailability.toastOverrideFail"));
              }
            })();
          }}
        >
          <input name="date" type="date" className="rounded border px-2 py-1" required />
          <input name="time" type="time" className="rounded border px-2 py-1" required />
          <input name="capacity" type="number" min={1} defaultValue={2} className="rounded border px-2 py-1" />
          <label className="flex items-center gap-2 text-sm">
            <input name="blocked" type="checkbox" />
            {t("adminAvailability.blockToggle")}
          </label>
          <button className="rounded-md bg-maroon px-3 py-2 text-parchment md:col-span-2" type="submit">
            {t("adminAvailability.addOverride")}
          </button>
        </form>
      </section>
    </div>
  );
}
