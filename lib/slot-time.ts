/** Normalize time strings to HH:mm so booking, API, and DB slots always align. */
export function normalizeSlotTime(time: string): string {
  const m = /^(\d{1,2}):(\d{2})$/.exec(time.trim());
  if (!m) return time.trim();
  const h = Number(m[1]);
  const mm = m[2];
  if (!Number.isFinite(h) || h < 0 || h > 23) return time.trim();
  return `${String(h).padStart(2, "0")}:${mm}`;
}
