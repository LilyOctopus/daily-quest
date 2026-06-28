'use client'

import type { Task, Category } from '../types'
import { CATEGORY_META } from '../types'

interface Props {
  task: Task
  onToggle: (id: string) => void
  onSelect: (task: Task) => void
}

export default function TaskItem({ task, onToggle, onSelect }: Props) {
  const meta = CATEGORY_META[task.category as Category] ?? { label: '', color: 'text-gray-500', bg: 'bg-gray-100' }
  return (
    <div className="flex items-center gap-3 py-2 px-1 cursor-pointer group" onClick={() => onSelect(task)}>
      <div onClick={(e) => { e.stopPropagation(); onToggle(task.id) }}>
        <input
          type="checkbox"
          checked={task.completed}
          readOnly
          className="w-5 h-5 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500 cursor-pointer pointer-events-none"
        />
      </div>
      <span className={`flex-1 text-sm ${task.completed ? 'line-through text-gray-400' : 'text-gray-800'}`}>
        {task.label}
        {task.detail && <span className="ml-1 text-indigo-300 text-xs">ⓘ</span>}
      </span>
      <span className={`text-xs px-2 py-0.5 rounded-full ${meta.bg} ${task.completed ? 'opacity-40' : meta.color}`}>
        {meta.label}
      </span>
      <span className="text-xs text-gray-400 w-8 text-right">{task.estMinutes}m</span>
    </div>
  )
}
