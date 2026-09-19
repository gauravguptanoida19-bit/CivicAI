import type { Request } from 'express'

export type UserRole = 'CITIZEN' | 'OFFICER' | 'SUPERVISOR' | 'ADMIN'

export type IssueType =
  | 'POTHOLE'
  | 'GARBAGE'
  | 'BROKEN_STREETLIGHT'
  | 'ROAD_DAMAGE'
  | 'WATER_LEAKAGE'
  | 'OPEN_MANHOLE'
  | 'FALLEN_TREE'
  | 'DAMAGED_TRAFFIC_SIGN'
  | 'ILLEGAL_DUMPING'
  | 'DRAINAGE_PROBLEM'
  | 'OTHER'

export type IssueCategory =
  | 'ROAD'
  | 'WASTE'
  | 'WATER'
  | 'LIGHTING'
  | 'SAFETY'
  | 'TRAFFIC'
  | 'ENVIRONMENT'
  | 'OTHER'

export type IssueSeverity = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'

export type IssueStatus =
  | 'REPORTED'
  | 'AI_ANALYZED'
  | 'VERIFIED'
  | 'ASSIGNED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
  | 'CLOSED'
  | 'DUPLICATE'

export interface Location {
  latitude: number
  longitude: number
  address?: string
  ward?: string
  zone?: string
  city?: string
}

export interface BoundingBox {
  x: number
  y: number
  width: number
  height: number
}

export interface SeverityFactor {
  factor: string
  score: number
  description: string
}

export interface AIAnalysisResult {
  issueType: IssueType
  confidence: number
  boundingBox?: BoundingBox
  severityScore: number
  severity: IssueSeverity
  category: IssueCategory
  description: string
  potentialImpact: string
  recommendedDepartment: string
  severityFactors: SeverityFactor[]
  isDemoMode?: boolean
}

export interface IssueTimelineEvent {
  id: string
  event: string
  description: string
  performedBy?: {
    id: string
    name: string
    role: UserRole
  }
  timestamp: string
  type: 'REPORTED' | 'AI_ANALYZED' | 'VERIFIED' | 'ASSIGNED' | 'UPDATE' | 'RESOLVED' | 'NOTE'
}

export interface User {
  id: string
  name: string
  email: string
  role: UserRole
  avatar?: string
  wardId?: string
  departmentId?: string
  reputationScore?: number
  totalReports?: number
  verifiedReports?: number
  createdAt: string
  updatedAt: string
}

export interface Department {
  id: string
  name: string
  code: string
  description: string
  issueTypes: IssueType[]
  officerCount: number
  activeIssues: number
  resolvedIssues: number
  averageResolutionHours: number
}

export interface CivicIssue {
  id: string
  issueNumber: string
  type: IssueType
  category: IssueCategory
  title: string
  description: string
  location: Location
  severity: IssueSeverity
  severityScore: number
  status: IssueStatus
  imageUrl?: string
  videoUrl?: string
  aiAnalysis?: AIAnalysisResult
  reportedBy: User
  assignedTo?: User
  department?: Department
  duplicateOf?: string
  duplicateCount: number
  reportCount: number
  timeline: IssueTimelineEvent[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  isDemoData?: boolean
}

export interface IssueFilters {
  type?: IssueType
  severity?: IssueSeverity
  status?: IssueStatus
  ward?: string
  departmentId?: string
  search?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface ReportSubmission {
  issueType?: IssueType
  description?: string
  location: Location
  imageFile?: unknown
  videoFile?: unknown
  aiAnalysis?: AIAnalysisResult
}

export interface AuthenticatedRequest extends Request {
  user?: {
    id: string
    email: string
    role: UserRole
    name: string
  }
}

export interface ApiResponse<T = unknown> {
  success: boolean
  data?: T
  message?: string
  error?: string
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface JwtPayload {
  id: string
  email: string
  role: UserRole
  name: string
  iat?: number
  exp?: number
}

export interface CopilotSource {
  issueId: string
  issueNumber: string
  relevance: number
  snippet: string
}
