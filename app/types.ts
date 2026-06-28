export type Category = 'algorithm' | 'english' | 'frontend' | 'anki'

export interface Task {
  id: string
  label: string
  category: Category
  completed: boolean
  estMinutes: number
}

export interface DayQuest {
  date: string // "2026-06-28"
  checkIn: boolean
  tasks: Task[]
  studyMinutes: number
  notes: string
}

export interface QuestStore {
  weeks: Record<string, DayQuest[]> // "2026-W26" → 7 DayQuest
}

export const CATEGORY_META: Record<Category, { label: string; color: string; bg: string }> = {
  algorithm: { label: '算法', color: 'text-blue-600', bg: 'bg-blue-100' },
  english: { label: '英文', color: 'text-emerald-600', bg: 'bg-emerald-100' },
  frontend: { label: '前端', color: 'text-purple-600', bg: 'bg-purple-100' },
  anki: { label: 'Anki', color: 'text-amber-600', bg: 'bg-amber-100' },
}
