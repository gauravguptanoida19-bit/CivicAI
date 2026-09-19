import { cn } from '@/utils/helpers'
import type { IssueStatus } from '@/types'

interface Props {
  status: IssueStatus
  size?: 'sm' | 'md' | 'lg'
}

const config: Record<IssueStatus, { label: string; classes: string }> = {
  REPORTED: { label: 'Reported', classes: 'bg-blue-50 text-blue-700 border-blue-200' },
  AI_ANALYZED: { label: 'AI Analyzed', classes: 'bg-purple-50 text-purple-700 border-purple-200' },
  VERIFIED: { label: 'Verified', classes: 'bg-indigo-50 text-indigo-700 border-indigo-200' },
  ASSIGNED: { label: 'Assigned', classes: 'bg-cyan-50 text-cyan-700 border-cyan-200' },
  IN_PROGRESS: { label: 'In Progress', classes: 'bg-amber-50 text-amber-700 border-amber-200' },
  RESOLVED: { label: 'Resolved', classes: 'bg-green-50 text-green-700 border-green-200' },
  CLOSED: { label: 'Closed', classes: 'bg-gray-50 text-gray-700 border-gray-200' },
  DUPLICATE: { label: 'Duplicate', classes: 'bg-slate-50 text-slate-600 border-slate-200' },
}

const sizeClasses = {
  sm: 'px-2 py-0.5 text-xs',
  md: 'px-2.5 py-1 text-xs',
  lg: 'px-3 py-1.5 text-sm',
}

export function StatusBadge({ status, size = 'md' }: Props) {
  const c = config[status] || config.REPORTED
  return (
    <span
      className={cn(
        'inline-flex items-center rounded-full border font-medium',
        c.classes,
        sizeClasses[size]
      )}
    >
      {c.label}
    </span>
  )
}
