import { cn } from '@/utils/helpers'
import type { IssueSeverity } from '@/types'

interface Props {
  severity: IssueSeverity
  size?: 'sm' | 'md' | 'lg'
  showScore?: boolean
  score?: number
}

const config: Record<IssueSeverity, { label: string; classes: string; dot: string }> = {
  LOW: {
    label: 'Low',
    classes: 'bg-green-50 text-green-700 border-green-200',
    dot: 'bg-green-500',
  },
  MEDIUM: {
    label: 'Medium',
    classes: 'bg-yellow-50 text-yellow-700 border-yellow-200',
    dot: 'bg-yellow-500',
  },
  HIGH: {
    label: 'High',
    classes: 'bg-orange-50 text-orange-700 border-orange-200',
    dot: 'bg-orange-500',
  },
  CRITICAL: {
    label: 'Critical',
    classes: 'bg-red-50 text-red-700 border-red-200',
    dot: 'bg-red-500',
  },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function SeverityBadge({ severity, size = 'md', showScore, score }: Props) {
  const c = config[severity]
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full border font-medium',
        c.classes,
        sizeClasses[size]
      )}
    >
      <span className={cn('h-1.5 w-1.5 rounded-full', c.dot)} />
      {c.label}
      {showScore && score !== undefined && (
        <span className="opacity-70">({score})</span>
      )}
    </span>
  )
}
