'use client'

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

function formatWeekLabel(days: DayQuest[]): string {
  if (days.length === 0) return ''
  const start = new Date(days[0].date)
  const end = new Date(days[days.length - 1].date)
  const fmt = (d: Date) => `${d.getMonth() + 1}/${d.getDate()}`
  return `${fmt(start)} - ${fmt(end)}`
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
  return (
    <div>
      {/* Week nav */}
      <div className="flex items-center justify-between mb-4 px-1">
        <button onClick={onPrevWeek} className="p-2 hover:bg-gray-100 rounded-xl text-gray-500 text-sm">
          ← Prev
        </button>
        <div className="flex items-center gap-3">
          <span className="font-semibold text-gray-700 text-sm">{formatWeekLabel(days)}</span>
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
      <div className="flex gap-3 overflow-x-auto snap-x snap-mandatory pb-4 -mx-4 px-4 scrollbar-thin">
        {days.map(day => (
          <DayCard
            key={day.date}
            day={day}
            onToggleTask={(taskId) => onToggleTask(day.date, taskId)}
            onCheckIn={() => onCheckIn(day.date)}
            onAccumulateTime={(mins) => onAccumulateTime(day.date, mins)}
          />
        ))}
      </div>

      {/* Summary */}
      <div className="mt-2 px-1 text-sm text-gray-400 flex gap-4">
        <span>Tasks: {days.reduce((s, d) => s + d.tasks.filter(t => t.completed).length, 0)}/{days.reduce((s, d) => s + d.tasks.length, 0)}</span>
        <span>Study: {days.reduce((s, d) => s + d.studyMinutes, 0)}min</span>
        <span>✅ {days.filter(d => d.checkIn).length}/7</span>
      </div>
    </div>
  )
}
