'use client'

import { useRef, useEffect } from 'react'
import type { DayQuest } from '../types'
import DayCard from './DayCard'

interface Props {
  days: DayQuest[]
  weekKey: string
  isCurrentWeek: boolean
  onPrevWeek: () => void
  onNextWeek: () => void
  onGoCurrentWeek: () => void
  onToggleTask: (dateKey: string, taskId: string) => void
  onCheckIn: (dateKey: string) => void
  onAccumulateTime: (dateKey: string, minutes: number) => void
}

function formatDateLabel(d: Date): string {
  return `${d.getMonth() + 1}/${d.getDate()}`
}

export default function WeekView({
  days,
  weekKey,
  isCurrentWeek,
  onPrevWeek,
  onNextWeek,
  onGoCurrentWeek,
  onToggleTask,
  onCheckIn,
  onAccumulateTime,
}: Props) {
  const scrollRef = useRef<HTMLDivElement>(null)
  const todayRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to today's card on mount / days change
  useEffect(() => {
    if (todayRef.current && scrollRef.current) {
      const container = scrollRef.current
      const card = todayRef.current
      const scrollLeft = card.offsetLeft - container.offsetLeft - 16 // 16px padding
      container.scrollTo({ left: scrollLeft, behavior: 'smooth' })
    }
  }, [days])

  const todayStr = new Date().toISOString().slice(0, 10)
  const start = days.length > 0 ? new Date(days[0].date) : new Date()
  const end = days.length > 0 ? new Date(days[days.length - 1].date) : new Date()

  return (
    <div>
      {/* Week nav */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={onPrevWeek} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 text-sm">
          ← Prev
        </button>
        <div className="flex items-center gap-2">
          <span className="font-semibold text-gray-700 text-sm">{formatDateLabel(start)} - {formatDateLabel(end)}</span>
          <span className="text-xs text-indigo-500 bg-indigo-50 px-2 py-0.5 rounded-full">
            Today {formatDateLabel(new Date())}
          </span>
          {!isCurrentWeek && (
            <button
              onClick={onGoCurrentWeek}
              className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full font-medium"
            >
              Back
            </button>
          )}
        </div>
        <button
          onClick={onNextWeek}
          className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 text-sm disabled:opacity-30"
          disabled={isCurrentWeek}
        >
          Next →
        </button>
      </div>

      {/* Day cards — horizontal scroll */}
      <div
        ref={scrollRef}
        className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-thin"
      >
        {days.map(day => (
          <div
            key={day.date}
            ref={day.date === todayStr ? todayRef : undefined}
            className="flex-shrink-0 snap-center"
          >
            <DayCard
              day={day}
              onToggleTask={(taskId) => onToggleTask(day.date, taskId)}
              onCheckIn={() => onCheckIn(day.date)}
              onAccumulateTime={(mins) => onAccumulateTime(day.date, mins)}
            />
          </div>
        ))}
      </div>

      {/* Summary */}
      <div className="mt-2 px-1 text-sm text-gray-400 flex gap-4 flex-wrap">
        <span>Tasks: {days.reduce((s, d) => s + d.tasks.filter(t => t.completed).length, 0)}/{days.reduce((s, d) => s + d.tasks.length, 0)}</span>
        <span>Study: {days.reduce((s, d) => s + d.studyMinutes, 0)}min</span>
        <span>✅ {days.filter(d => d.checkIn).length}/7</span>
      </div>
    </div>
  )
}
