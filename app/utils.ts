import { type DayQuest, type Task } from './types'

/* ─── Date utilities ─── */

export function getWeekKey(date: Date): string {
  const d = new Date(date)
  d.setHours(0, 0, 0, 0)
  d.setDate(d.getDate() + 3 - ((d.getDay() + 6) % 7)) // Thursday anchor
  const year = d.getFullYear()
  const week = Math.floor(
    ((d.getTime() - new Date(year, 0, 4).getTime()) / 86400000 + (new Date(year, 0, 4).getDay() + 6) % 7 + 7) / 7
  )
  return `${year}-W${String(week).padStart(2, '0')}`
}

export function getWeekDays(date: Date): Date[] {
  const d = new Date(date)
  const day = d.getDay()
  const diff = d.getDate() - day + (day === 0 ? -6 : 1) // Monday start
  const monday = new Date(d.setDate(diff))
  return Array.from({ length: 7 }, (_, i) => {
    const day = new Date(monday)
    day.setDate(monday.getDate() + i)
    return day
  })
}

export function formatDate(d: Date): string {
  const y = d.getFullYear()
  const m = String(d.getMonth() + 1).padStart(2, '0')
  const day = String(d.getDate()).padStart(2, '0')
  return `${y}-${m}-${day}`
}

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']

export function getDayName(d: Date): string {
  return DAY_NAMES[(d.getDay() + 6) % 7]
}

export function isToday(date: Date): boolean {
  const today = new Date()
  return date.getFullYear() === today.getFullYear()
    && date.getMonth() === today.getMonth()
    && date.getDate() === today.getDate()
}

/* ─── Seed data ─── */

const TASKS_BY_DAY: Record<number, Task[]> = {
  // Monday (prev week) — seed data rotates per week
  0: [
    { id: 'mon-algo', label: 'Valid Parentheses', category: 'algorithm', completed: false, estMinutes: 15 },
    { id: 'mon-en', label: 'BQ: conflict resolution (STAR)', category: 'english', completed: false, estMinutes: 25 },
    { id: 'mon-fe', label: 'Promise microtasks quiz', category: 'frontend', completed: false, estMinutes: 15 },
    { id: 'mon-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10 },
  ],
  // Tuesday
  1: [
    { id: 'tue-algo', label: 'Reverse Linked List', category: 'algorithm', completed: false, estMinutes: 20 },
    { id: 'tue-en', label: 'BQ: failure experience (STAR)', category: 'english', completed: false, estMinutes: 25 },
    { id: 'tue-fe', label: 'Browser rendering quiz', category: 'frontend', completed: false, estMinutes: 10 },
    { id: 'tue-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10 },
  ],
  // Wednesday
  2: [
    { id: 'wed-algo', label: 'Binary Tree Inorder', category: 'algorithm', completed: false, estMinutes: 20 },
    { id: 'wed-en', label: 'BQ: cross-team collab (STAR)', category: 'english', completed: false, estMinutes: 25 },
    { id: 'wed-fe', label: 'HTTP cache quiz (Anki)', category: 'frontend', completed: false, estMinutes: 15 },
    { id: 'wed-anki', label: 'Review cards', category: 'anki', completed: false, estMinutes: 10 },
  ],
  // Thursday
  3: [
    { id: 'thu-algo', label: 'Climbing Stairs (DP)', category: 'algorithm', completed: false, estMinutes: 25 },
    { id: 'thu-en', label: 'BQ: why rspack not vite', category: 'english', completed: false, estMinutes: 20 },
    { id: 'thu-fe', label: 'CSS layout quiz', category: 'frontend', completed: false, estMinutes: 10 },
    { id: 'thu-anki', label: 'Review cards + new 5', category: 'anki', completed: false, estMinutes: 10 },
  ],
  // Friday
  4: [
    { id: 'fri-algo', label: 'Review week\'s algo problems', category: 'algorithm', completed: false, estMinutes: 20 },
    { id: 'fri-en', label: 'Full mock: introduce yourself (2min)', category: 'english', completed: false, estMinutes: 30 },
    { id: 'fri-fe', label: 'WeakMap / closure quiz', category: 'frontend', completed: false, estMinutes: 10 },
    { id: 'fri-anki', label: 'Review all week cards', category: 'anki', completed: false, estMinutes: 15 },
  ],
  // Saturday
  5: [
    { id: 'sat-algo', label: 'Weak algo review + 1 new Medium', category: 'algorithm', completed: false, estMinutes: 20 },
    { id: 'sat-en', label: 'Weekend mock: full BQ practice', category: 'english', completed: false, estMinutes: 25 },
    { id: 'sat-anki', label: 'Catch up on missed cards', category: 'anki', completed: false, estMinutes: 15 },
  ],
  // Sunday
  6: [
    { id: 'sun-algo', label: 'Two Sum (双指针)', category: 'algorithm', completed: false, estMinutes: 15 },
    { id: 'sun-en', label: 'Recite rspack migration story', category: 'english', completed: false, estMinutes: 20 },
    { id: 'sun-fe', label: 'EventLoop quiz (Anki)', category: 'frontend', completed: false, estMinutes: 15 },
    { id: 'sun-anki', label: 'Review today\'s cards', category: 'anki', completed: false, estMinutes: 10 },
  ],
}

export function buildWeekDays(date: Date): DayQuest[] {
  const days = getWeekDays(date)
  return days.map((d, i) => ({
    date: formatDate(d),
    checkIn: false,
    tasks: TASKS_BY_DAY[i]?.map(t => ({ ...t })) ?? [],
    studyMinutes: 0,
    notes: '',
  }))
}
