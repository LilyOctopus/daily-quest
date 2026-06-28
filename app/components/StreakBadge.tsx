'use client'

interface Props {
  streak: number
}

function getBadge(streak: number): { icon: string; label: string; color: string } {
  if (streak === 0) return { icon: '💤', label: 'Start your quest', color: 'text-gray-400' }
  if (streak < 3) return { icon: '🔥', label: `${streak}-day streak`, color: 'text-orange-500' }
  if (streak < 7) return { icon: '🔥🔥', label: 'Rising! ' + streak + ' days', color: 'text-orange-600' }
  return { icon: '🏆', label: `${streak}-day champion!`, color: 'text-amber-500' }
}

export default function StreakBadge({ streak }: Props) {
  if (streak < 0) return null
  const badge = getBadge(streak)
  return (
    <div className={`flex items-center gap-2 px-4 py-2 rounded-xl bg-white/80 shadow-sm ${badge.color}`}>
      <span className="text-2xl">{badge.icon}</span>
      <span className="font-semibold text-sm">{badge.label}</span>
    </div>
  )
}
