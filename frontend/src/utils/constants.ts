import type { IssueType, IssueCategory, IssueSeverity, IssueStatus } from '@/types'

// Issue type display config
export const ISSUE_TYPE_CONFIG: Record<IssueType, {
  label: string
  emoji: string
  category: IssueCategory
  color: string
  department: string
}> = {
  POTHOLE: { label: 'Pothole', emoji: '🕳️', category: 'ROAD', color: 'orange', department: 'Road Maintenance' },
  GARBAGE: { label: 'Garbage Accumulation', emoji: '🗑️', category: 'WASTE', color: 'yellow', department: 'Sanitation' },
  BROKEN_STREETLIGHT: { label: 'Broken Streetlight', emoji: '💡', category: 'LIGHTING', color: 'amber', department: 'Electrical' },
  ROAD_DAMAGE: { label: 'Road Damage', emoji: '🚧', category: 'ROAD', color: 'red', department: 'Road Maintenance' },
  WATER_LEAKAGE: { label: 'Water Leakage', emoji: '💧', category: 'WATER', color: 'blue', department: 'Water Department' },
  OPEN_MANHOLE: { label: 'Open Manhole', emoji: '⚠️', category: 'SAFETY', color: 'red', department: 'Public Works' },
  FALLEN_TREE: { label: 'Fallen Tree', emoji: '🌳', category: 'ENVIRONMENT', color: 'green', department: 'Parks & Environment' },
  DAMAGED_TRAFFIC_SIGN: { label: 'Damaged Traffic Sign', emoji: '🚦', category: 'TRAFFIC', color: 'yellow', department: 'Traffic Department' },
  ILLEGAL_DUMPING: { label: 'Illegal Dumping', emoji: '🚮', category: 'WASTE', color: 'brown', department: 'Sanitation' },
  DRAINAGE_PROBLEM: { label: 'Drainage Problem', emoji: '🌊', category: 'WATER', color: 'cyan', department: 'Water Department' },
  OTHER: { label: 'Other', emoji: '❓', category: 'OTHER', color: 'gray', department: 'General Services' },
}

// Severity config
export const SEVERITY_CONFIG: Record<IssueSeverity, {
  label: string
  color: string
  bgColor: string
  textColor: string
  borderColor: string
  scoreRange: string
}> = {
  LOW: {
    label: 'Low',
    color: 'green',
    bgColor: 'bg-green-50',
    textColor: 'text-green-700',
    borderColor: 'border-green-200',
    scoreRange: '0-25',
  },
  MEDIUM: {
    label: 'Medium',
    color: 'yellow',
    bgColor: 'bg-yellow-50',
    textColor: 'text-yellow-700',
    borderColor: 'border-yellow-200',
    scoreRange: '26-50',
  },
  HIGH: {
    label: 'High',
    color: 'orange',
    bgColor: 'bg-orange-50',
    textColor: 'text-orange-700',
    borderColor: 'border-orange-200',
    scoreRange: '51-75',
  },
  CRITICAL: {
    label: 'Critical',
    color: 'red',
    bgColor: 'bg-red-50',
    textColor: 'text-red-700',
    borderColor: 'border-red-200',
    scoreRange: '76-100',
  },
}

// Status config
export const STATUS_CONFIG: Record<IssueStatus, {
  label: string
  description: string
  color: string
  step: number
}> = {
  REPORTED: { label: 'Reported', description: 'Issue submitted by citizen', color: 'blue', step: 1 },
  AI_ANALYZED: { label: 'AI Analyzed', description: 'Processed by AI engine', color: 'purple', step: 2 },
  VERIFIED: { label: 'Verified', description: 'Confirmed by system/officer', color: 'indigo', step: 3 },
  ASSIGNED: { label: 'Assigned', description: 'Department assigned', color: 'cyan', step: 4 },
  IN_PROGRESS: { label: 'In Progress', description: 'Work has begun', color: 'amber', step: 5 },
  RESOLVED: { label: 'Resolved', description: 'Issue fixed', color: 'green', step: 6 },
  CLOSED: { label: 'Closed', description: 'Verified and closed', color: 'gray', step: 7 },
  DUPLICATE: { label: 'Duplicate', description: 'Linked to master issue', color: 'slate', step: 0 },
}

export const WARDS = [
  'Ward 1', 'Ward 2', 'Ward 3', 'Ward 4', 'Ward 5',
  'Ward 6', 'Ward 7', 'Ward 8', 'Ward 9', 'Ward 10',
]

export const DEMO_CITY_CENTER = { lat: 28.6139, lng: 77.2090 } // New Delhi
