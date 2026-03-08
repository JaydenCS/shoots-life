'use client'

import { useCallback } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import DayCell from './DayCell'
import MonthLabel from './MonthLabel'
import ImageViewer from './ImageViewer'
import UploadFlow from './UploadFlow'
import { useShots } from '@/hooks/useShots'
import { buildCalendarDays, buildMonthRange, todayStr } from '@/lib/dates'
import { Shot } from '@/types'

interface CalendarGridProps {
  userId: string
  initialShots: Shot[]
  startYear: number
  startMonth: number
}

const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export default function CalendarGrid({ userId, initialShots, startYear, startMonth }: CalendarGridProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const selectedDate = searchParams.get('selected')

  const { shotMap, shotUrls, addOrReplaceShot } = useShots(userId, initialShots)

  const months = buildMonthRange(startYear, startMonth)
  const today = todayStr()
  const hasToday = !!shotMap[today]

  const selectedShot = selectedDate ? shotMap[selectedDate] ?? null : null
  const selectedSignedUrl = selectedDate ? shotUrls[selectedDate]?.signedUrl ?? null : null

  const handleSelect = useCallback((date: string) => {
    const params = new URLSearchParams(searchParams.toString())
    params.set('selected', date)
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  const handleClose = useCallback(() => {
    const params = new URLSearchParams(searchParams.toString())
    params.delete('selected')
    router.push(`?${params.toString()}`, { scroll: false })
  }, [router, searchParams])

  return (
    <div className="relative">
      <div className="overflow-y-auto">
        {months.map(({ year, month }) => {
          const days = buildCalendarDays(year, month)

          return (
            <section key={`${year}-${month}`}>
              <MonthLabel year={year} month={month} />

              <div className="grid grid-cols-7 px-4 mb-1">
                {DAY_LABELS.map(label => (
                  <div key={label} className="text-center">
                    <span className="font-sans text-[10px] text-ink/30 uppercase tracking-widest">
                      {label}
                    </span>
                  </div>
                ))}
              </div>

              <div className="grid grid-cols-7 gap-1 px-4 pb-8">
                {days.map((day) => (
                  <DayCell
                    key={day.date}
                    day={{ ...day, shot: shotMap[day.date] }}
                    thumbUrl={shotUrls[day.date]?.thumbUrl}
                    onSelect={handleSelect}
                  />
                ))}
              </div>
            </section>
          )
        })}
      </div>

      <ImageViewer
        shot={selectedShot}
        signedUrl={selectedSignedUrl}
        onClose={handleClose}
      />

      <UploadFlow
        userId={userId}
        hasToday={hasToday}
        onSuccess={addOrReplaceShot}
      />
    </div>
  )
}
