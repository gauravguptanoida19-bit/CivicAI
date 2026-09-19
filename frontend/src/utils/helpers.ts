import { formatDistanceToNow, format, parseISO } from 'date-fns'
import type { IssueSeverity, IssueStatus, IssueType } from '@/types'
import { SEVERITY_CONFIG, STATUS_CONFIG, ISSUE_TYPE_CONFIG } from './constants'

export function formatTimeAgo(dateStr: string): string {
  try {
    return formatDistanceToNow(parseISO(dateStr), { addSuffix: true })
  } catch {
    return dateStr
  }
}

export function formatDate(dateStr: string, fmt = 'MMM d, yyyy'): string {
  try {
    return format(parseISO(dateStr), fmt)
  } catch {
    return dateStr
  }
}

export function formatDateTime(dateStr: string): string {
  return formatDate(dateStr, 'MMM d, yyyy h:mm a')
}

export function getSeverityConfig(severity: IssueSeverity) {
  return SEVERITY_CONFIG[severity] ?? SEVERITY_CONFIG.MEDIUM
}

export function getStatusConfig(status: IssueStatus) {
  return STATUS_CONFIG[status] ?? STATUS_CONFIG.REPORTED
}

export function getIssueTypeConfig(type: IssueType) {
  return ISSUE_TYPE_CONFIG[type] ?? ISSUE_TYPE_CONFIG.OTHER
}

export function severityFromScore(score: number): IssueSeverity {
  if (score >= 76) return 'CRITICAL'
  if (score >= 51) return 'HIGH'
  if (score >= 26) return 'MEDIUM'
  return 'LOW'
}

export function generateIssueNumber(id: string): string {
  const numeric = id.replace(/\D/g, '').slice(0, 4).padStart(4, '0')
  return `CIV-${numeric || Math.floor(Math.random() * 9000 + 1000)}`
}

export function cn(...classes: (string | undefined | null | false)[]): string {
  return classes.filter(Boolean).join(' ')
}

export function truncate(str: string, length: number): string {
  if (str.length <= length) return str
  return str.slice(0, length) + '...'
}

export function capitalizeFirst(str: string): string {
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase()
}

export function issueTypeLabel(type: IssueType): string {
  return ISSUE_TYPE_CONFIG[type]?.label ?? type
}

export function distanceInMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 6371000
  const phi1 = (lat1 * Math.PI) / 180
  const phi2 = (lat2 * Math.PI) / 180
  const dPhi = ((lat2 - lat1) * Math.PI) / 180
  const dLambda = ((lng2 - lng1) * Math.PI) / 180
  const a =
    Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
    Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2)
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
  return R * c
}

export function formatDistance(meters: number): string {
  if (meters < 1000) return `${Math.round(meters)}m`
  return `${(meters / 1000).toFixed(1)}km`
}

export function getFileExtension(filename: string): string {
  return filename.split('.').pop()?.toLowerCase() ?? ''
}

export function isImageFile(filename: string): boolean {
  const ext = getFileExtension(filename)
  return ['jpg', 'jpeg', 'png', 'webp', 'gif'].includes(ext)
}

export function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}
