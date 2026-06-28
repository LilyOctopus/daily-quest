'use client'

import { useState } from 'react'
import type { DayQuest, Task } from '../types'
import { getDayName, isToday } from '../utils'
import TaskItem from './TaskItem'
import TaskDetail from './TaskDetail'
import StudyTimer from './StudyTimer'

interface Props {
  day: DayQuest
  onToggleTask: (taskId: string) => void
  onCheckIn: () => void
  onAccumulateTime: (minutes: number) => void
}

export default function DayCard({ day, onToggleTask, onCheckIn, onAccumulateTime }: Props) {
  const [open, setOpen] = useState(isToday(new Date(day.date)))
  const [selectedTask, setSelectedTask] = useState<Task | null>(null)
  const parsed = new Date(day.date)
  const today = isToday(parsed)
  const dayName = getDayName(parsed)

  const doneTasks = day.tasks.filter(t => t.completed).length
  const totalTasks = day.tasks.length
  const totalEst = day.tasks.reduce((s, t) => s + t.estMinutes, 0)

  function handleSelectTask(task: Task) {
    setSelectedTask(task)
  }

  function handleToggleFromDetail() {
    if (selectedTask) {
      onToggleTask(selectedTask.id)
    }
  }

  return (
    <>
      <div
        className={`
          flex-shrink-0 w-[85vw] max-w-sm snap-center
          rounded-2xl p-4 shadow-md border
          ${today ? 'border-indigo-400 bg-indigo-50/60' : 'border-gray-200 bg-white'}
          transition-all
        `}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-3" onClick={() => setOpen(!open)}>
          <div>
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg">{day.date.slice(5)}</span>
              <span className="text-sm text-gray-500">{dayName}</span>
              {today && <span className="text-xs bg-indigo-600 text-white px-2 py-0.5 rounded-full">Today</span>}
            </div>
            <div className="flex items-center gap-2 mt-1">
              <span className="text-xs text-gray-400">
                {doneTasks}/{totalTasks} tasks · {day.studyMinutes}/{totalEst}min
              </span>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <div className="relative w-10 h-10">
              <svg className="w-10 h-10 -rotate-90" viewBox="0 0 36 36">
                <circle cx="18" cy="18" r="16" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                <circle
                  cx="18" cy="18" r="16"
                  fill="none" stroke={totalTasks === 0 ? '#e5e7eb' : '#6366f1'}
                  strokeWidth="3"
                  strokeDasharray={`${totalTasks > 0 ? (doneTasks / totalTasks) * 100 : 0} 100`}
                  strokeLinecap="round"
                />
              </svg>
              <span className="absolute inset-0 flex items-center justify-center text-xs font-bold text-gray-600">
                {totalTasks > 0 ? Math.round((doneTasks / totalTasks) * 100) : 0}%
              </span>
            </div>
            <button
              onClick={(e) => { e.stopPropagation(); onCheckIn() }}
              className={`text-2xl p-1 rounded-full transition ${day.checkIn ? 'bg-green-100' : 'hover:bg-gray-100'}`}
            >
              {day.checkIn ? '✅' : '⭕'}
            </button>
          </div>
        </div>

        {/* Body */}
        {open && (
          <div className="border-t border-gray-200 pt-3 space-y-1">
            {day.tasks.length === 0 && (
              <p className="text-sm text-gray-400 py-4 text-center">Rest day 🎉</p>
            )}
            {day.tasks.map(task => (
              <TaskItem key={task.id} task={task} onToggle={onToggleTask} onSelect={handleSelectTask} />
            ))}

            <div className="flex items-center justify-between pt-3 mt-2 border-t border-dashed border-gray-200">
              <StudyTimer onAccumulate={onAccumulateTime} />
              <span className="text-xs text-gray-400">{day.studyMinutes} min</span>
            </div>
          </div>
        )}
      </div>

      {/* Detail modal */}
      {selectedTask && (
        <TaskDetail
          task={selectedTask}
          onClose={() => setSelectedTask(null)}
          onToggle={handleToggleFromDetail}
        />
      )}
    </>
  )
}
