'use client'

import { useState, useMemo, useEffect, useCallback } from 'react'
import WeekView from './components/WeekView'
import StreakBadge from './components/StreakBadge'
import { useQuestStore } from './useLocalStorage'
import { getWeekKey, buildWeekDays, formatDate } from './utils'
import type { DayQuest } from './types'

// Monday of current week
function mondayOf(date: Date): Date {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1)
  d.setDate(diff)
  return d
}

export default function Home() {
  const { store, ready, getWeek, updateDay } = useQuestStore()
  const today = useMemo(() => new Date(), [])
  const [baseDate, setBaseDate] = useState(() => mondayOf(today))
  const [days, setDays] = useState<DayQuest[]>([])

  const weekKey = useMemo(() => getWeekKey(baseDate), [baseDate])
  const currentWeekKey = useMemo(() => getWeekKey(today), [today])

  // Load days when week changes or store updates
  useEffect(() => {
    if (!ready) return
    const loaded = getWeek(baseDate)
    setDays(loaded)
  }, [ready, baseDate]) // eslint-disable-line react-hooks/exhaustive-deps

  // Keep days in sync when store data changes (check-in, tasks, timer)
  useEffect(() => {
    if (!ready || days.length === 0) return
    const stored = store.weeks[weekKey]
    if (stored) setDays([...stored])
  }, [store.weeks, ready]) // eslint-disable-line react-hooks/exhaustive-deps

  // Streak
  const streak = useMemo(() => {
    if (!ready) return 0
    const allDays = Object.values(store.weeks).flat().sort((a, b) => a.date.localeCompare(b.date))
    const todayStr = formatDate(today)
    const yesterday = new Date(today)
    yesterday.setDate(yesterday.getDate() - 1)
    const startFrom = allDays.find(d => d.date === todayStr)?.checkIn ? todayStr : formatDate(yesterday)
    const dayMap = new Map(allDays.map(d => [d.date, d]))
    let count = 0
    const cursor = new Date(startFrom)
    while (true) {
      const entry = dayMap.get(formatDate(cursor))
      if (entry?.checkIn) { count++; cursor.setDate(cursor.getDate() - 1) }
      else break
    }
    return count
  }, [store.weeks, ready, today])

  const handleToggleTask = useCallback((dateKey: string, taskId: string) => {
    updateDay(dateKey, day => ({
      ...day,
      tasks: day.tasks.map(t => t.id === taskId ? { ...t, completed: !t.completed } : t),
    }))
  }, [updateDay])

  const handleCheckIn = useCallback((dateKey: string) => {
    updateDay(dateKey, day => ({ ...day, checkIn: !day.checkIn }))
  }, [updateDay])

  const handleAccumulateTime = useCallback((dateKey: string, minutes: number) => {
    updateDay(dateKey, day => ({ ...day, studyMinutes: day.studyMinutes + minutes }))
  }, [updateDay])

  if (!ready) {
    return <div className="flex items-center justify-center min-h-[60vh] text-gray-400">Loading...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Daily Quest</h1>
        <StreakBadge streak={streak} />
      </div>
      <p className="text-sm text-gray-400 -mt-3">
        {today.toLocaleDateString('zh-CN', { weekday: 'long', month: 'long', day: 'numeric' })}
      </p>

      <WeekView
        days={days}
        weekKey={weekKey}
        isCurrentWeek={weekKey === currentWeekKey}
        onPrevWeek={() => {
          const d = new Date(baseDate)
          d.setDate(d.getDate() - 7)
          setBaseDate(d)
        }}
        onNextWeek={() => {
          const d = new Date(baseDate)
          d.setDate(d.getDate() + 7)
          setBaseDate(d)
        }}
        onGoCurrentWeek={() => setBaseDate(mondayOf(today))}
        onToggleTask={handleToggleTask}
        onCheckIn={handleCheckIn}
        onAccumulateTime={handleAccumulateTime}
      />
    </div>
  )
}
