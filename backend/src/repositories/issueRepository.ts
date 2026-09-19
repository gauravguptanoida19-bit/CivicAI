import { v4 as uuidv4 } from 'uuid'
import type {
  CivicIssue,
  Department,
  User,
  IssueFilters,
  PaginatedResponse,
  IssueType,
  IssueCategory,
  IssueSeverity,
  IssueStatus,
  AIAnalysisResult,
  UserRole,
} from '../types'
import { NotFoundError } from '../utils/errors'

// Wards in demo city
export const DEMO_WARDS = [
  'Ward 1 - Connaught Place',
  'Ward 2 - Karol Bagh',
  'Ward 3 - Lajpat Nagar',
  'Ward 4 - Dwarka',
  'Ward 5 - Rohini',
  'Ward 6 - Janakpuri',
  'Ward 7 - Saket',
  'Ward 8 - Nehru Place',
  'Ward 9 - Preet Vihar',
  'Ward 10 - Pitampura',
]

const ISSUE_TYPES: IssueType[] = [
  'POTHOLE',
  'GARBAGE',
  'BROKEN_STREETLIGHT',
  'ROAD_DAMAGE',
  'WATER_LEAKAGE',
  'OPEN_MANHOLE',
  'FALLEN_TREE',
  'DAMAGED_TRAFFIC_SIGN',
  'ILLEGAL_DUMPING',
  'DRAINAGE_PROBLEM',
]

const CATEGORY_MAP: Record<IssueType, IssueCategory> = {
  POTHOLE: 'ROAD',
  ROAD_DAMAGE: 'ROAD',
  GARBAGE: 'WASTE',
  ILLEGAL_DUMPING: 'WASTE',
  BROKEN_STREETLIGHT: 'LIGHTING',
  WATER_LEAKAGE: 'WATER',
  DRAINAGE_PROBLEM: 'WATER',
  OPEN_MANHOLE: 'SAFETY',
  DAMAGED_TRAFFIC_SIGN: 'TRAFFIC',
  FALLEN_TREE: 'ENVIRONMENT',
  OTHER: 'OTHER',
}

const DEPT_MAP: Record<IssueType, string> = {
  POTHOLE: 'Road Maintenance',
  ROAD_DAMAGE: 'Road Maintenance',
  GARBAGE: 'Sanitation',
  ILLEGAL_DUMPING: 'Sanitation',
  BROKEN_STREETLIGHT: 'Electrical',
  WATER_LEAKAGE: 'Water Department',
  DRAINAGE_PROBLEM: 'Water Department',
  OPEN_MANHOLE: 'Public Works',
  DAMAGED_TRAFFIC_SIGN: 'Traffic Department',
  FALLEN_TREE: 'Parks & Environment',
  OTHER: 'General Services',
}

class IssueRepository {
  private users: User[] = []
  private departments: Department[] = []
  private issues: CivicIssue[] = []
  private initialized = false

  constructor() {
    this.initDemoData()
  }

  private initDemoData() {
    if (this.initialized) return

    // 1. Users
    this.users = [
      {
        id: 'user-001',
        name: 'Aryan Sharma',
        email: 'citizen@demo.civicai',
        role: 'CITIZEN',
        reputationScore: 420,
        totalReports: 12,
        verifiedReports: 10,
        createdAt: '2026-01-15T08:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'user-002',
        name: 'Priya Nair',
        email: 'officer@demo.civicai',
        role: 'OFFICER',
        departmentId: 'dept-001',
        createdAt: '2025-08-01T08:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'user-003',
        name: 'Raj Verma',
        email: 'admin@demo.civicai',
        role: 'ADMIN',
        createdAt: '2025-06-01T08:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
      },
      {
        id: 'user-004',
        name: 'Sunita Rao',
        email: 'supervisor@demo.civicai',
        role: 'SUPERVISOR',
        departmentId: 'dept-002',
        createdAt: '2025-07-01T08:00:00Z',
        updatedAt: '2026-09-01T10:00:00Z',
      },
    ]

    // 2. Departments
    this.departments = [
      {
        id: 'dept-001',
        name: 'Road Maintenance',
        code: 'ROAD',
        description: 'Responsible for road repairs, potholes, and surface damage',
        issueTypes: ['POTHOLE', 'ROAD_DAMAGE'],
        officerCount: 12,
        activeIssues: 34,
        resolvedIssues: 187,
        averageResolutionHours: 48,
      },
      {
        id: 'dept-002',
        name: 'Sanitation',
        code: 'SAN',
        description: 'Waste collection, garbage accumulation, and illegal dumping',
        issueTypes: ['GARBAGE', 'ILLEGAL_DUMPING'],
        officerCount: 18,
        activeIssues: 22,
        resolvedIssues: 312,
        averageResolutionHours: 24,
      },
      {
        id: 'dept-003',
        name: 'Electrical',
        code: 'ELEC',
        description: 'Streetlights and electrical infrastructure',
        issueTypes: ['BROKEN_STREETLIGHT'],
        officerCount: 8,
        activeIssues: 15,
        resolvedIssues: 98,
        averageResolutionHours: 36,
      },
      {
        id: 'dept-004',
        name: 'Water Department',
        code: 'WATER',
        description: 'Water supply, leakages, and drainage',
        issueTypes: ['WATER_LEAKAGE', 'DRAINAGE_PROBLEM'],
        officerCount: 10,
        activeIssues: 19,
        resolvedIssues: 143,
        averageResolutionHours: 42,
      },
      {
        id: 'dept-005',
        name: 'Public Works',
        code: 'PWD',
        description: 'Open manholes, safety hazards, and infrastructure',
        issueTypes: ['OPEN_MANHOLE'],
        officerCount: 6,
        activeIssues: 8,
        resolvedIssues: 67,
        averageResolutionHours: 18,
      },
      {
        id: 'dept-006',
        name: 'Traffic Department',
        code: 'TRAFFIC',
        description: 'Traffic signals, signs, and road safety markers',
        issueTypes: ['DAMAGED_TRAFFIC_SIGN'],
        officerCount: 9,
        activeIssues: 11,
        resolvedIssues: 85,
        averageResolutionHours: 30,
      },
      {
        id: 'dept-007',
        name: 'Parks & Environment',
        code: 'PARKS',
        description: 'Green spaces, fallen trees, and urban environment',
        issueTypes: ['FALLEN_TREE'],
        officerCount: 7,
        activeIssues: 5,
        resolvedIssues: 54,
        averageResolutionHours: 12,
      },
      {
        id: 'dept-008',
        name: 'General Services',
        code: 'GEN',
        description: 'Miscellaneous civic services',
        issueTypes: ['OTHER'],
        officerCount: 5,
        activeIssues: 7,
        resolvedIssues: 41,
        averageResolutionHours: 40,
      },
    ]

    // 3. 100 Seed Issues
    const BASE_LAT = 28.6139
    const BASE_LNG = 77.209
    const severities: IssueSeverity[] = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL']
    const statuses: IssueStatus[] = [
      'REPORTED',
      'AI_ANALYZED',
      'VERIFIED',
      'ASSIGNED',
      'IN_PROGRESS',
      'RESOLVED',
    ]

    for (let i = 0; i < 100; i++) {
      const type = ISSUE_TYPES[i % ISSUE_TYPES.length]
      const severity = severities[i % severities.length]
      const status = statuses[i % statuses.length]
      const ward = DEMO_WARDS[i % DEMO_WARDS.length]
      const category = CATEGORY_MAP[type] || 'OTHER'
      const deptName = DEPT_MAP[type] || 'General Services'
      const dept = this.departments.find((d) => d.name === deptName)

      const lat = Number((BASE_LAT + (Math.sin(i * 1.5) * 0.08) + (Math.random() - 0.5) * 0.02).toFixed(6))
      const lng = Number((BASE_LNG + (Math.cos(i * 1.5) * 0.08) + (Math.random() - 0.5) * 0.02).toFixed(6))

      const severityScore =
        severity === 'CRITICAL' ? 80 + Math.floor(Math.random() * 18)
        : severity === 'HIGH' ? 55 + Math.floor(Math.random() * 22)
        : severity === 'MEDIUM' ? 30 + Math.floor(Math.random() * 20)
        : 12 + Math.floor(Math.random() * 12)

      const hoursAgo = Math.floor(Math.random() * 120) + 1
      const createdDate = new Date(Date.now() - hoursAgo * 3600000).toISOString()
      const updatedDate = new Date(Date.now() - Math.floor(hoursAgo * 0.5) * 3600000).toISOString()

      const issueNumber = `CIV-${String(1041 + i).padStart(4, '0')}`

      const issue: CivicIssue = {
        id: `iss-${String(i + 1).padStart(3, '0')}`,
        issueNumber,
        type,
        category,
        title: `${type.replace(/_/g, ' ')} detected near ${ward.split(' - ')[1]}`,
        description: `Automated AI telemetry and citizen report: ${type.toLowerCase().replace(/_/g, ' ')} located at Main Road, ${ward}. Immediate inspection requested.`,
        location: {
          latitude: lat,
          longitude: lng,
          address: `Sector ${((i * 3) % 18) + 1}, Main Avenue, ${ward}`,
          ward,
          city: 'New Delhi',
        },
        severity,
        severityScore,
        status,
        reportedBy: this.users[0],
        department: dept,
        assignedTo: status !== 'REPORTED' && status !== 'AI_ANALYZED' ? this.users[1] : undefined,
        duplicateCount: (i % 7 === 0) ? 2 : 0,
        reportCount: (i % 7 === 0) ? 3 : 1,
        aiAnalysis: {
          issueType: type,
          confidence: Number((0.85 + Math.random() * 0.12).toFixed(2)),
          boundingBox: {
            x: 100 + (i % 50),
            y: 120 + (i % 40),
            width: 250 + (i % 60),
            height: 180 + (i % 50),
          },
          severityScore,
          severity,
          category,
          description: `Identified ${type.replace(/_/g, ' ').toLowerCase()} with high confidence. Potential public hazard in active transit zone.`,
          potentialImpact: severity === 'CRITICAL' ? 'Immediate danger to life, safety, or severe traffic halt' : 'Moderate inconvenience and progressive infrastructure degradation',
          recommendedDepartment: deptName,
          severityFactors: [
            { factor: 'Issue Hazard', score: Math.round(severityScore * 0.4), description: `${type} category hazard rating` },
            { factor: 'Traffic Density', score: Math.round(severityScore * 0.35), description: 'Major transit corridor' },
            { factor: 'Proximity Hazard', score: Math.round(severityScore * 0.25), description: 'Near public amenities' },
          ],
          isDemoMode: true,
        },
        timeline: [
          {
            id: `tl-${i}-1`,
            event: 'Issue Reported',
            description: 'Incident submitted via CivicAI mobile app with photo verification',
            timestamp: createdDate,
            type: 'REPORTED',
            performedBy: { id: this.users[0].id, name: this.users[0].name, role: this.users[0].role },
          },
          {
            id: `tl-${i}-2`,
            event: 'AI Vision Analysis',
            description: `Computer Vision model classified as ${type} with ${(0.88 * 100).toFixed(0)}% confidence`,
            timestamp: new Date(new Date(createdDate).getTime() + 120000).toISOString(),
            type: 'AI_ANALYZED',
          },
        ],
        createdAt: createdDate,
        updatedAt: updatedDate,
        isDemoData: true,
      }

      if (status === 'ASSIGNED' || status === 'IN_PROGRESS' || status === 'RESOLVED') {
        issue.timeline.push({
          id: `tl-${i}-3`,
          event: 'Assigned to Department',
          description: `Dispatched to ${deptName} Field Operations Unit`,
          timestamp: new Date(new Date(createdDate).getTime() + 600000).toISOString(),
          type: 'ASSIGNED',
        })
      }

      if (status === 'RESOLVED') {
        issue.resolvedAt = updatedDate
        issue.timeline.push({
          id: `tl-${i}-4`,
          event: 'Issue Resolved',
          description: 'Field repair completed and verified by supervisory officer',
          timestamp: updatedDate,
          type: 'RESOLVED',
          performedBy: { id: this.users[1].id, name: this.users[1].name, role: this.users[1].role },
        })
      }

      this.issues.push(issue)
    }

    this.initialized = true
  }

  // --- Issues Queries ---

  async getIssues(filters: IssueFilters = {}): Promise<PaginatedResponse<CivicIssue>> {
    let result = [...this.issues]

    if (filters.type) {
      result = result.filter((i) => i.type === filters.type)
    }
    if (filters.severity) {
      result = result.filter((i) => i.severity === filters.severity)
    }
    if (filters.status) {
      result = result.filter((i) => i.status === filters.status)
    }
    if (filters.ward) {
      result = result.filter((i) => i.location.ward?.toLowerCase().includes(filters.ward!.toLowerCase()))
    }
    if (filters.departmentId) {
      result = result.filter((i) => i.department?.id === filters.departmentId)
    }
    if (filters.search) {
      const q = filters.search.toLowerCase()
      result = result.filter(
        (i) =>
          i.issueNumber.toLowerCase().includes(q) ||
          i.title.toLowerCase().includes(q) ||
          i.description.toLowerCase().includes(q) ||
          i.location.address?.toLowerCase().includes(q)
      )
    }

    // Sorting
    result.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())

    const page = Number(filters.page) || 1
    const limit = Number(filters.limit) || 20
    const start = (page - 1) * limit
    const paginated = result.slice(start, start + limit)

    return {
      data: paginated,
      total: result.length,
      page,
      limit,
      totalPages: Math.ceil(result.length / limit) || 1,
    }
  }

  async getIssueById(id: string): Promise<CivicIssue> {
    const issue = this.issues.find((i) => i.id === id || i.issueNumber === id)
    if (!issue) throw new NotFoundError(`Civic issue '${id}'`)
    return issue
  }

  async createIssue(data: {
    issueType?: IssueType
    description?: string
    location: { latitude: number; longitude: number; address?: string; ward?: string }
    imageUrl?: string
    videoUrl?: string
    aiAnalysis?: AIAnalysisResult
  }, user?: User): Promise<CivicIssue> {
    const type: IssueType = data.issueType || data.aiAnalysis?.issueType || 'OTHER'
    const category: IssueCategory = data.aiAnalysis?.category || CATEGORY_MAP[type] || 'OTHER'
    const severity: IssueSeverity = data.aiAnalysis?.severity || 'MEDIUM'
    const severityScore: number = data.aiAnalysis?.severityScore || 50
    const deptName = data.aiAnalysis?.recommendedDepartment || DEPT_MAP[type] || 'General Services'
    const dept = this.departments.find((d) => d.name === deptName)

    const issueNumber = `CIV-${String(1041 + this.issues.length).padStart(4, '0')}`
    const now = new Date().toISOString()

    const newIssue: CivicIssue = {
      id: `iss-${uuidv4().slice(0, 8)}`,
      issueNumber,
      type,
      category,
      title: `${type.replace(/_/g, ' ')} at ${data.location.address || data.location.ward || 'Reported Location'}`,
      description: data.description || `Citizen reported ${type.toLowerCase().replace(/_/g, ' ')} via CivicAI platform.`,
      location: {
        latitude: data.location.latitude,
        longitude: data.location.longitude,
        address: data.location.address || 'Reported Location',
        ward: data.location.ward || DEMO_WARDS[0],
        city: 'New Delhi',
      },
      severity,
      severityScore,
      status: 'AI_ANALYZED',
      imageUrl: data.imageUrl,
      videoUrl: data.videoUrl,
      aiAnalysis: data.aiAnalysis,
      reportedBy: user || this.users[0],
      department: dept,
      duplicateCount: 0,
      reportCount: 1,
      timeline: [
        {
          id: `tl-${Date.now()}-1`,
          event: 'Issue Reported',
          description: 'Citizen report received with image proof',
          timestamp: now,
          type: 'REPORTED',
          performedBy: user ? { id: user.id, name: user.name, role: user.role } : undefined,
        },
        {
          id: `tl-${Date.now()}-2`,
          event: 'AI Intelligence Analysis Complete',
          description: `Classified as ${type} with severity ${severity} (Score: ${severityScore}/100)`,
          timestamp: new Date(Date.now() + 1000).toISOString(),
          type: 'AI_ANALYZED',
        },
      ],
      createdAt: now,
      updatedAt: now,
      isDemoData: true,
    }

    this.issues.unshift(newIssue)
    return newIssue
  }

  async updateIssueStatus(id: string, status: IssueStatus, notes?: string, user?: { id: string; name: string; role: UserRole }): Promise<CivicIssue> {
    const issue = await this.getIssueById(id)
    issue.status = status
    issue.updatedAt = new Date().toISOString()
    if (status === 'RESOLVED') {
      issue.resolvedAt = new Date().toISOString()
    }

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      event: `Status Updated to ${status}`,
      description: notes || `Operational status transitioned to ${status}`,
      timestamp: new Date().toISOString(),
      type: status === 'RESOLVED' ? 'RESOLVED' : 'UPDATE',
      performedBy: user,
    })

    return issue
  }

  async assignIssue(id: string, departmentId: string, officerId?: string): Promise<CivicIssue> {
    const issue = await this.getIssueById(id)
    const dept = this.departments.find((d) => d.id === departmentId)
    if (dept) issue.department = dept
    if (officerId) {
      const officer = this.users.find((u) => u.id === officerId)
      if (officer) issue.assignedTo = officer
    }
    issue.status = 'ASSIGNED'
    issue.updatedAt = new Date().toISOString()

    issue.timeline.push({
      id: `tl-${Date.now()}`,
      event: 'Dispatched to Department',
      description: `Assigned to ${dept?.name || 'Department'}${issue.assignedTo ? ` (Officer ${issue.assignedTo.name})` : ''}`,
      timestamp: new Date().toISOString(),
      type: 'ASSIGNED',
    })

    return issue
  }

  async getNearbyIssues(lat: number, lng: number, radiusKm = 5): Promise<CivicIssue[]> {
    // Haversine distance filter
    return this.issues.filter((issue) => {
      const d = this.calculateDistance(lat, lng, issue.location.latitude, issue.location.longitude)
      return d <= radiusKm
    }).slice(0, 30)
  }

  private calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
    const R = 6371 // Earth radius in km
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  async getMyIssues(userId: string): Promise<CivicIssue[]> {
    return this.issues.filter((i) => i.reportedBy.id === userId || i.assignedTo?.id === userId)
  }

  // --- Departments ---

  async getDepartments(): Promise<Department[]> {
    return this.departments
  }

  async getDepartmentById(id: string): Promise<Department> {
    const dept = this.departments.find((d) => d.id === id)
    if (!dept) throw new NotFoundError(`Department '${id}'`)
    return dept
  }

  // --- Users ---

  async getUsers(): Promise<User[]> {
    return this.users
  }

  async getUserById(id: string): Promise<User | undefined> {
    return this.users.find((u) => u.id === id)
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return this.users.find((u) => u.email.toLowerCase() === email.toLowerCase())
  }

  async updateUserRole(id: string, role: UserRole): Promise<User> {
    const user = this.users.find((u) => u.id === id)
    if (!user) throw new NotFoundError(`User '${id}'`)
    user.role = role
    user.updatedAt = new Date().toISOString()
    return user
  }

  // --- Analytics ---

  async getAnalyticsSummary() {
    const totalReports = this.issues.length
    const openIssues = this.issues.filter((i) => i.status !== 'RESOLVED' && i.status !== 'CLOSED').length
    const criticalIssues = this.issues.filter((i) => i.severity === 'CRITICAL' && i.status !== 'RESOLVED').length
    const resolvedToday = this.issues.filter((i) => i.status === 'RESOLVED').length

    return {
      totalReports,
      openIssues,
      criticalIssues,
      resolvedToday: Math.min(resolvedToday, 14),
      averageResolutionHours: 36,
      aiDetectionAccuracy: 91.4,
      duplicateDetectionRate: 18.7,
      wardCount: DEMO_WARDS.length,
    }
  }

  async getAnalyticsTrends() {
    // Return categorized distribution
    const categoryCounts: Record<string, number> = {}
    const severityCounts: Record<string, number> = {}
    const statusCounts: Record<string, number> = {}

    this.issues.forEach((i) => {
      categoryCounts[i.category] = (categoryCounts[i.category] || 0) + 1
      severityCounts[i.severity] = (severityCounts[i.severity] || 0) + 1
      statusCounts[i.status] = (statusCounts[i.status] || 0) + 1
    })

    const categories = Object.entries(categoryCounts).map(([name, count]) => ({ name, count }))
    const severities = Object.entries(severityCounts).map(([name, count]) => ({ name, count }))
    const statuses = Object.entries(statusCounts).map(([name, count]) => ({ name, count }))

    // 7-day velocity
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
    const velocity = days.map((day, idx) => ({
      day,
      reported: 12 + ((idx * 5) % 15),
      resolved: 8 + ((idx * 4) % 12),
    }))

    return { categories, severities, statuses, velocity }
  }

  async getWardStats() {
    const wardMap: Record<string, { total: number; critical: number; resolved: number }> = {}
    DEMO_WARDS.forEach((w) => {
      wardMap[w] = { total: 0, critical: 0, resolved: 0 }
    })

    this.issues.forEach((i) => {
      const w = i.location.ward || DEMO_WARDS[0]
      if (!wardMap[w]) wardMap[w] = { total: 0, critical: 0, resolved: 0 }
      wardMap[w].total++
      if (i.severity === 'CRITICAL') wardMap[w].critical++
      if (i.status === 'RESOLVED') wardMap[w].resolved++
    })

    return Object.entries(wardMap).map(([ward, stats]) => ({
      ward,
      ...stats,
    }))
  }
}

export const issueRepository = new IssueRepository()
