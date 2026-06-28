'use client'

import type { Task, Category } from '../types'
import { CATEGORY_META } from '../types'

interface Props {
  task: Task
  onClose: () => void
  onToggle: () => void
}

// Simple markdown-like renderer (no deps needed)
function renderDetail(text: string): React.ReactNode[] {
  const lines = text.split('\n')
  const nodes: React.ReactNode[] = []
  let inCode = false
  let codeLines: string[] = []
  let codeLang = ''

  lines.forEach((line, i) => {
    if (line.startsWith('```')) {
      if (inCode) {
        nodes.push(
          <pre key={i} className="bg-gray-900 text-gray-100 text-xs rounded-lg p-3 my-2 overflow-x-auto leading-relaxed">
            <code>{codeLines.join('\n')}</code>
          </pre>
        )
        codeLines = []
        inCode = false
      } else {
        inCode = true
        codeLang = line.slice(3).trim()
      }
      return
    }

    if (inCode) {
      codeLines.push(line)
      return
    }

    if (line.startsWith('**') && line.endsWith('**')) {
      nodes.push(<p key={i} className="font-bold text-gray-800 mt-3 mb-1">{line.slice(2, -2)}</p>)
    } else if (line.startsWith('- **')) {
      const rest = line.slice(4)
      const [bold, ...restParts] = rest.split('**:')
      nodes.push(
        <li key={i} className="text-gray-700 text-sm ml-4 mb-1 list-disc">
          <span className="font-semibold">{bold}</span>{restParts.join(':')}
        </li>
      )
    } else if (line.startsWith('- ')) {
      nodes.push(<li key={i} className="text-gray-700 text-sm ml-4 mb-1 list-disc">{line.slice(2)}</li>)
    } else if (line.trim() === '') {
      nodes.push(<div key={i} className="h-2" />)
    } else {
      // Check for number bullets like "1. **Key** text"
      const numMatch = line.match(/^(\d+)\.\s\*\*(.+?)\*\*(.+)?$/)
      if (numMatch) {
        nodes.push(
          <p key={i} className="text-gray-700 text-sm ml-4 mb-1">
            <span className="font-semibold">{numMatch[1]}. {numMatch[2]}</span>{numMatch[3] || ''}
          </p>
        )
      } else {
        nodes.push(<p key={i} className="text-gray-700 text-sm leading-relaxed">{line}</p>)
      }
    }
  })

  return nodes
}

export default function TaskDetail({ task, onClose, onToggle }: Props) {
  const meta = CATEGORY_META[task.category as Category] ?? { label: '', color: 'text-gray-500', bg: 'bg-gray-100' }

  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center">
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/40" onClick={onClose} />

      {/* Sheet */}
      <div className="relative bg-white rounded-t-2xl sm:rounded-2xl w-full max-w-lg max-h-[85vh] flex flex-col shadow-xl
                      animate-slide-up">
        {/* Handle */}
        <div className="flex items-center justify-between px-5 pt-4 pb-2 border-b border-gray-100 shrink-0">
          <div className="flex items-center gap-2 min-w-0">
            <span className={`text-xs px-2 py-0.5 rounded-full ${meta.bg} ${meta.color} shrink-0`}>
              {meta.label}
            </span>
            <span className="font-semibold text-gray-800 text-sm truncate">{task.label}</span>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-gray-100 rounded-full shrink-0">
            <svg className="w-5 h-5 text-gray-400" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M18 6L6 18M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto px-5 py-4 flex-1">
          {task.detail ? renderDetail(task.detail) : <p className="text-gray-400 text-sm">No detail content yet.</p>}

          <div className="text-xs text-gray-300 mt-4 text-center">
            {task.estMinutes} min
          </div>
        </div>

        {/* Bottom action */}
        <div className="px-5 py-3 border-t border-gray-100 shrink-0">
          <button
            onClick={onToggle}
            className={`w-full py-2.5 rounded-xl text-sm font-medium transition active:scale-98
              ${task.completed
                ? 'bg-gray-100 text-gray-500'
                : 'bg-indigo-600 text-white'
              }`}
          >
            {task.completed ? '✅ Completed — mark as undone' : 'Mark as done'}
          </button>
        </div>
      </div>
    </div>
  )
}
