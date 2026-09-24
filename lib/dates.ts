const MONTHS = [
  "January",
  "February",
  "March",
  "April",
  "May",
  "June",
  "July",
  "August",
  "September",
  "October",
  "November",
  "December",
];

/** "YYYY-MM" for the month we're currently in. */
export function currentMonth(now: Date = new Date()): string {
  return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;
}

/** "YYYY-MM" for the month before `month`. */
export function previousMonth(month: string): string {
  const [y, m] = month.split("-").map(Number);
  return m === 1
    ? `${y - 1}-12`
    : `${y}-${String(m - 1).padStart(2, "0")}`;
}

/** "2026-09" -> "September 2026". Falls back to the raw value. */
export function monthLabel(month: string): string {
  const [y, m] = month.split("-").map(Number);
  if (!y || !m || m < 1 || m > 12) return month;
  return `${MONTHS[m - 1]} ${y}`;
}

/** "2026-09" -> "September". */
export function monthName(month: string): string {
  const [, m] = month.split("-").map(Number);
  return m >= 1 && m <= 12 ? MONTHS[m - 1] : month;
}

/** The last N months, newest first, as "YYYY-MM". */
export function recentMonths(count: number, now: Date = new Date()): string[] {
  const out: string[] = [];
  let month = currentMonth(now);
  for (let i = 0; i < count; i++) {
    out.push(month);
    month = previousMonth(month);
  }
  return out;
}

/** "Sep 23, 2026 · 10:42 AM" for an ISO timestamp. */
export function formatDateTime(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
    hour: "numeric",
    minute: "2-digit",
  });
}

/** "Sep 23, 2026" for an ISO timestamp. */
export function formatDate(iso: string | null): string {
  if (!iso) return "—";
  return new Date(iso).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

/** Coarse relative time for feed meta lines. */
export function relativeTime(iso: string | null, now: Date = new Date()): string {
  if (!iso) return "just now";
  const then = new Date(iso);
  const mins = Math.round((now.getTime() - then.getTime()) / 60000);
  if (mins < 1) return "just now";
  if (mins < 60) return `${mins}m ago`;
  const hours = Math.round(mins / 60);
  if (hours < 24) return `${hours}h ago`;
  const days = Math.round(hours / 24);
  if (days < 30) return `${days}d ago`;
  return formatDate(iso);
}
