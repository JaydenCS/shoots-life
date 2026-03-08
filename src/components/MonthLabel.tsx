'use client'

import { formatMonthYear } from '@/lib/dates'

interface MonthLabelProps {
  year: number
  month: number
}

export default function MonthLabel({ year, month }: MonthLabelProps) {
  return (
    <div className="sticky top-0 z-10 px-4 py-3 backdrop-blur-sm bg-paper/80">
      <h2 className="font-serif text-base tracking-wide text-ink/60 uppercase text-sm">
        {formatMonthYear(year, month)}
      </h2>
    </div>
  )
}
