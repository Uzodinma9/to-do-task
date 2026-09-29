const MS_PER_DAY = 86_400_000

/** Local-time day difference: negative = overdue, 0 = today. */
export function daysUntil(isoDate: string): number {
  const due = new Date(`${isoDate}T00:00:00`)
  const today = new Date()
  today.setHours(0, 0, 0, 0)
  return Math.round((due.getTime() - today.getTime()) / MS_PER_DAY)
}

export function isOverdue(isoDate: string): boolean {
  return daysUntil(isoDate) < 0
}

export function isToday(isoDate: string): boolean {
  return daysUntil(isoDate) === 0
}

export function isDueSoon(isoDate: string): boolean {
  const d = daysUntil(isoDate)
  return d >= 0 && d <= 2
}

export function todayIso(): string {
  return toIso(new Date())
}

/** Date -> local YYYY-MM-DD (avoids UTC off-by-one from toISOString). */
export function toIso(d: Date): string {
  const off = d.getTimezoneOffset()
  return new Date(d.getTime() - off * 60_000).toISOString().slice(0, 10)
}

export function formatDue(isoDate: string): string {
  const d = daysUntil(isoDate)
  if (d === 0) return 'Today'
  if (d === 1) return 'Tomorrow'
  if (d === -1) return 'Yesterday'
  return new Date(`${isoDate}T00:00:00`).toLocaleDateString(undefined, {
    month: 'short',
    day: 'numeric',
    year: d < -1 || d > 300 ? 'numeric' : undefined,
  })
}
