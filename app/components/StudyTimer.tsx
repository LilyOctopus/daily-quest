'use client'

import { useState, useRef, useCallback, useEffect } from 'react'

interface Props {
  onAccumulate: (minutes: number) => void
}

export default function StudyTimer({ onAccumulate }: Props) {
  const [running, setRunning] = useState(false)
  const [elapsed, setElapsed] = useState(0) // seconds
  const startRef = useRef<number>(0)
  const intervalRef = useRef<ReturnType<typeof setInterval>>()

  useEffect(() => {
    return () => { if (intervalRef.current) clearInterval(intervalRef.current) }
  }, [])

  const start = useCallback(() => {
    startRef.current = Date.now()
    setRunning(true)
    intervalRef.current = setInterval(() => {
      setElapsed(prev => prev + 1)
    }, 1000)
  }, [])

  const stop = useCallback(() => {
    if (!running) return
    setRunning(false)
    if (intervalRef.current) clearInterval(intervalRef.current)
    const mins = Math.round(elapsed / 60)
    if (mins > 0) {
      onAccumulate(mins)
      setElapsed(0)
    }
  }, [running, elapsed, onAccumulate])

  const format = (s: number) => {
    const m = Math.floor(s / 60)
    const sec = s % 60
    return `${String(m).padStart(2, '0')}:${String(sec).padStart(2, '0')}`
  }

  return (
    <div className="flex items-center gap-3">
      <span className="font-mono text-lg tabular-nums min-w-[4rem]">{format(elapsed)}</span>
      {running ? (
        <button
          onClick={stop}
          className="bg-red-500 text-white px-4 py-1.5 rounded-xl text-sm font-medium active:scale-95 transition"
        >
          ■ Stop
        </button>
      ) : (
        <button
          onClick={start}
          className="bg-indigo-600 text-white px-4 py-1.5 rounded-xl text-sm font-medium active:scale-95 transition"
        >
          ▶ Start
        </button>
      )}
    </div>
  )
}
