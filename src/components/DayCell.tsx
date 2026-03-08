'use client'

import { motion } from 'motion/react'
import haptics from '@/lib/haptics'
import { CalendarDay } from '@/types'

interface DayCellProps {
  day: CalendarDay
  thumbUrl?: string
  onSelect: (date: string) => void
}

export default function DayCell({ day, thumbUrl, onSelect }: DayCellProps) {
  const { date, isCurrentMonth, isToday, shot } = day
  const dayNum = Number(date.split('-')[2])

  if (!isCurrentMonth) return <div className="aspect-square" />

  const hasSshot = !!shot && !!thumbUrl

  return (
    <motion.div
      className={`
        aspect-square rounded-xl overflow-hidden relative
        flex items-center justify-center
        ${!hasSshot ? 'bg-ink/[0.03]' : ''}
        ${isToday && !hasSshot ? 'ring-1 ring-amber/40' : ''}
        ${hasSshot ? 'cursor-pointer' : ''}
      `}
      whileTap={hasSshot ? { scale: 0.93 } : { scale: 0.97 }}
      transition={{ type: 'spring', stiffness: 500, damping: 30 }}
      onTapStart={() => hasSshot && haptics.nudge()}
      onClick={() => hasSshot && onSelect(date)}
    >
      {hasSshot ? (
        <img
          src={thumbUrl}
          alt={date}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="flex flex-col items-center gap-1">
          <span className={`font-sans text-xs tabular-nums ${isToday ? 'text-ink font-medium' : 'text-ink/40'}`}>
            {dayNum}
          </span>
          {isToday && <span className="block w-1.5 h-1.5 rounded-full bg-amber" />}
        </div>
      )}
    </motion.div>
  )
}
