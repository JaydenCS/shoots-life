import { CalendarDay } from '@/types'

// Safe date construction — avoids UTC midnight parse issue
export function localDate(dateStr: string): Date {
  const [y, m, d] = dateStr.split('-').map(Number)
  return new Date(y, m - 1, d)
}

export function toDateStr(date: Date): string {
  const y = date.getFullYear()
  const m = String(date.getMonth() + 1).padStart(2, '0')
  const d = String(date.getDate()).padStart(2, '0')
  return `${y}-${m}-${d}`
}

export function todayStr(): string {
  return toDateStr(new Date())
}

export function isToday(dateStr: string): boolean {
  return dateStr === todayStr()
}

export function formatDisplayDate(dateStr: string): string {
  const date = localDate(dateStr)
  return new Intl.DateTimeFormat('en-GB', {
    day: 'numeric',
    month: 'long',
    year: 'numeric',
  }).format(date)
}

export function formatMonthYear(year: number, month: number): string {
  return new Intl.DateTimeFormat('en-GB', { month: 'long', year: 'numeric' }).format(
    new Date(year, month - 1, 1)
  )
}

// Returns all CalendarDay objects for a given year/month grid (always 35 or 42 cells)
export function buildCalendarDays(year: number, month: number): CalendarDay[] {
  const today = todayStr()
  const firstOfMonth = new Date(year, month - 1, 1)
  const lastOfMonth = new Date(year, month, 0)

  // Start grid on Monday (0 = Mon ... 6 = Sun)
  const startDow = (firstOfMonth.getDay() + 6) % 7
  const totalCells = Math.ceil((startDow + lastOfMonth.getDate()) / 7) * 7

  const days: CalendarDay[] = []

  for (let i = 0; i < totalCells; i++) {
    const d = new Date(year, month - 1, 1 - startDow + i)
    const dateStr = toDateStr(d)
    days.push({
      date: dateStr,
      isCurrentMonth: d.getMonth() === month - 1,
      isToday: dateStr === today,
    })
  }

  return days
}

// Build a flat list of all months from a start date up to today
export function buildMonthRange(startYear: number, startMonth: number): { year: number; month: number }[] {
  const now = new Date()
  const months: { year: number; month: number }[] = []
  let y = startYear
  let m = startMonth
  while (y < now.getFullYear() || (y === now.getFullYear() && m <= now.getMonth() + 1)) {
    months.push({ year: y, month: m })
    m++
    if (m > 12) { m = 1; y++ }
  }
  return months
}
