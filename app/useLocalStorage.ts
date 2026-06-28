'use client'

import { useState, useEffect, useCallback, useRef } from 'react'
import type { QuestStore, DayQuest } from './types'
import { getWeekKey, buildWeekDays } from './utils'

// v2 — bump key to reset localStorage (day mapping fix)
const STORAGE_KEY = 'daily-quest-data-v2'

function loadStore(): QuestStore {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (raw) return JSON.parse(raw) as QuestStore
  } catch { /* corrupt data — reset */ }
  return { weeks: {} }
}

export function useQuestStore() {
  const [store, setStore] = useState<QuestStore>({ weeks: {} })
  const [ready, setReady] = useState(false)
  const storeRef = useRef<QuestStore>({ weeks: {} })

  useEffect(() => {
    const saved = loadStore()
    storeRef.current = saved
    setStore(saved)
    setReady(true)
  }, [])

  useEffect(() => {
    if (!ready) return
    storeRef.current = store
    localStorage.setItem(STORAGE_KEY, JSON.stringify(store))
  }, [store, ready])

  const getWeek = useCallback((date: Date): DayQuest[] => {
    const key = getWeekKey(date)
    const current = storeRef.current
    if (!current.weeks[key]) {
      const newDays = buildWeekDays(date)
      setStore(prev => ({
        ...prev,
        weeks: { ...prev.weeks, [key]: newDays },
      }))
      return newDays
    }
    return current.weeks[key]
  }, []) // no deps — storeRef.current is always current

  const updateDay = useCallback((dateKey: string, updater: (day: DayQuest) => DayQuest) => {
    setStore(prev => {
      const weeks = { ...prev.weeks }
      for (const wk of Object.keys(weeks)) {
        const idx = weeks[wk].findIndex(d => d.date === dateKey)
        if (idx !== -1) {
          const days = [...weeks[wk]]
          days[idx] = updater(days[idx])
          weeks[wk] = days
          break
        }
      }
      return { ...prev, weeks }
    })
  }, [])

  return { store, ready, getWeek, updateDay }
}
