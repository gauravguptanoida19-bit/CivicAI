// =============================================================
// CivicAI - Core TypeScript Types
// =============================================================

// ---- Auth & Users ----

export type UserRole = 'CITIZEN' | 'OFFICER' | 'SUPERVISOR' | 'ADMIN'

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

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
  role?: UserRole
}

export interface AuthResponse {
  user: User
  token: string
  refreshToken: string
}

// ---- Issues ----

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

export interface AIAnalysis {
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

export interface SeverityFactor {
  factor: string
  score: number
  description: string
}

export interface CivicIssue {
  id: string
  issueNumber: string // CIV-XXXX
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
  aiAnalysis?: AIAnalysis
  reportedBy: User
  assignedTo?: User
  department?: Department
  duplicateOf?: string // master issue ID
  duplicateCount: number
  reportCount: number
  timeline: IssueTimelineEvent[]
  createdAt: string
  updatedAt: string
  resolvedAt?: string
  isDemoData?: boolean
}

export interface IssueTimelineEvent {
  id: string
  event: string
  description: string
  performedBy?: User
  timestamp: string
  type: 'REPORTED' | 'AI_ANALYZED' | 'VERIFIED' | 'ASSIGNED' | 'UPDATE' | 'RESOLVED' | 'NOTE'
}

// ---- Departments ----

export interface Department {
  id: string
  name: string
  code: string
  description: string
  issueTypes: IssueType[]
  headOfficer?: User
  officerCount: number
  activeIssues: number
  resolvedIssues: number
  averageResolutionHours: number
}

// ---- Notifications ----

export type NotificationType = 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL'

export interface Notification {
  id: string
  type: NotificationType
  title: string
  message: string
  isRead: boolean
  issueId?: string
  createdAt: string
}

// ---- Analytics ----

export interface AnalyticsSummary {
  totalReports: number
  openIssues: number
  criticalIssues: number
  resolvedToday: number
  averageResolutionHours: number
  aiDetectionAccuracy: number
  duplicateDetectionRate: number
  wardCount: number
}

export interface ChartDataPoint {
  name: string
  value?: number
  [key: string]: string | number | undefined
}

export interface HeatmapPoint {
  lat: number
  lng: number
  intensity: number
  issueType: IssueType
}

// ---- API ----

export interface ApiResponse<T> {
  data: T
  message?: string
  success: boolean
}

export interface PaginatedResponse<T> {
  data: T[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export interface IssueFilters {
  type?: IssueType
  category?: IssueCategory
  severity?: IssueSeverity
  status?: IssueStatus
  ward?: string
  departmentId?: string
  search?: string
  startDate?: string
  endDate?: string
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

// ---- AI Copilot ----

export interface CopilotMessage {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: CopilotSource[]
  timestamp: string
  isLoading?: boolean
}

export interface CopilotSource {
  issueId: string
  issueNumber: string
  relevance: number
  snippet: string
}

// ---- Report Submission ----

export interface ReportSubmission {
  imageFile?: File
  videoFile?: File
  location: Location
  description?: string
  issueType?: IssueType
  aiAnalysis?: AIAnalysis
}

// ---- Socket Events ----

export interface SocketIssueEvent {
  type: 'NEW_ISSUE' | 'ISSUE_UPDATED' | 'ISSUE_RESOLVED' | 'DUPLICATE_DETECTED'
  issue: CivicIssue
  timestamp: string
}

// ---- Ward ----

export interface Ward {
  id: string
  name: string
  code: string
  city: string
  boundaries?: GeoJSON.Polygon
  issueCount: number
  criticalCount: number
}
