import { get, post, put } from './api'
import type { CivicIssue, IssueFilters, PaginatedResponse, AIAnalysis, ReportSubmission } from '@/types'
import { DEMO_ISSUES, getDemoAIResult } from '@/utils/demoData'
import apiClient from './api'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

// Simulate delay
const delay = (ms: number) => new Promise((r) => setTimeout(r, ms))

export const issueService = {
  async getIssues(filters: IssueFilters = {}): Promise<PaginatedResponse<CivicIssue>> {
    if (DEMO_MODE) {
      await delay(500)
      let filtered = [...DEMO_ISSUES]

      if (filters.type) filtered = filtered.filter((i) => i.type === filters.type)
      if (filters.severity) filtered = filtered.filter((i) => i.severity === filters.severity)
      if (filters.status) filtered = filtered.filter((i) => i.status === filters.status)
      if (filters.ward) filtered = filtered.filter((i) => i.location.ward?.includes(filters.ward!))
      if (filters.search) {
        const q = filters.search.toLowerCase()
        filtered = filtered.filter(
          (i) =>
            i.issueNumber.toLowerCase().includes(q) ||
            i.title.toLowerCase().includes(q) ||
            i.description.toLowerCase().includes(q)
        )
      }

      const page = filters.page || 1
      const limit = filters.limit || 20
      const start = (page - 1) * limit
      const paginated = filtered.slice(start, start + limit)

      return {
        data: paginated,
        total: filtered.length,
        page,
        limit,
        totalPages: Math.ceil(filtered.length / limit),
      }
    }

    const params = new URLSearchParams()
    Object.entries(filters).forEach(([k, v]) => {
      if (v !== undefined) params.set(k, String(v))
    })
    return get<PaginatedResponse<CivicIssue>>(`/issues?${params}`)
  },

  async getIssue(id: string): Promise<CivicIssue> {
    if (DEMO_MODE) {
      await delay(300)
      const issue = DEMO_ISSUES.find((i) => i.id === id || i.issueNumber === id)
      if (!issue) throw new Error('Issue not found')
      return issue
    }
    return get<CivicIssue>(`/issues/${id}`)
  },

  async createIssue(submission: ReportSubmission): Promise<CivicIssue> {
    if (DEMO_MODE) {
      await delay(1500)
      const newIssue: CivicIssue = {
        id: `iss-demo-${Date.now()}`,
        issueNumber: `CIV-${String(Math.floor(Math.random() * 9000 + 1000))}`,
        type: submission.issueType || 'OTHER',
        category: 'ROAD',
        title: `${submission.issueType || 'Civic Issue'} at ${submission.location.address || 'Reported Location'}`,
        description: submission.description || 'Issue reported via CivicAI platform',
        location: submission.location,
        severity: submission.aiAnalysis?.severity || 'MEDIUM',
        severityScore: submission.aiAnalysis?.severityScore || 50,
        status: 'AI_ANALYZED',
        aiAnalysis: submission.aiAnalysis,
        reportedBy: {
          id: 'user-001',
          name: 'Demo Citizen',
          email: 'citizen@demo.civicai',
          role: 'CITIZEN',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
        duplicateCount: 0,
        reportCount: 1,
        timeline: [
          {
            id: `tl-new-1`,
            event: 'Issue Reported',
            description: 'Citizen submitted report with AI analysis',
            timestamp: new Date().toISOString(),
            type: 'REPORTED',
          },
          {
            id: `tl-new-2`,
            event: 'AI Analysis Complete',
            description: `Detected ${submission.issueType} with ${((submission.aiAnalysis?.confidence || 0.9) * 100).toFixed(0)}% confidence`,
            timestamp: new Date(Date.now() + 2000).toISOString(),
            type: 'AI_ANALYZED',
          },
        ],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        isDemoData: true,
      }
      // Add to demo issues
      DEMO_ISSUES.unshift(newIssue)
      return newIssue
    }

    const formData = new FormData()
    if (submission.imageFile) formData.append('image', submission.imageFile)
    if (submission.videoFile) formData.append('video', submission.videoFile)
    formData.append('location', JSON.stringify(submission.location))
    if (submission.description) formData.append('description', submission.description)
    if (submission.issueType) formData.append('issueType', submission.issueType)

    const res = await apiClient.post<{ data: CivicIssue }>('/issues', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async analyzeImage(imageFile: File): Promise<AIAnalysis> {
    if (DEMO_MODE) {
      // Simulate AI processing time
      await delay(2000)
      return getDemoAIResult() as AIAnalysis
    }

    const formData = new FormData()
    formData.append('image', imageFile)
    const res = await apiClient.post<{ data: AIAnalysis }>('/issues/analyze-image', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
    })
    return res.data.data
  },

  async updateIssueStatus(id: string, status: string, notes?: string): Promise<CivicIssue> {
    if (DEMO_MODE) {
      await delay(500)
      const issue = DEMO_ISSUES.find((i) => i.id === id)
      if (issue) {
        issue.status = status as CivicIssue['status']
        issue.updatedAt = new Date().toISOString()
        issue.timeline.push({
          id: `tl-${Date.now()}`,
          event: `Status Updated to ${status}`,
          description: notes || `Issue status changed to ${status}`,
          timestamp: new Date().toISOString(),
          type: status === 'RESOLVED' ? 'RESOLVED' : 'UPDATE',
        })
      }
      return issue!
    }
    return put<CivicIssue>(`/issues/${id}`, { status, notes })
  },

  async assignIssue(id: string, departmentId: string, officerId?: string): Promise<CivicIssue> {
    if (DEMO_MODE) {
      await delay(500)
      const issue = DEMO_ISSUES.find((i) => i.id === id)
      if (issue) {
        issue.status = 'ASSIGNED'
        issue.updatedAt = new Date().toISOString()
      }
      return issue!
    }
    return post<CivicIssue>(`/issues/${id}/assign`, { departmentId, officerId })
  },

  async getNearbyIssues(lat: number, lng: number, radiusKm = 5): Promise<CivicIssue[]> {
    if (DEMO_MODE) {
      await delay(300)
      return DEMO_ISSUES.slice(0, 15)
    }
    return get<CivicIssue[]>(`/issues/nearby?lat=${lat}&lng=${lng}&radius=${radiusKm}`)
  },

  async getMyIssues(): Promise<CivicIssue[]> {
    if (DEMO_MODE) {
      await delay(400)
      return DEMO_ISSUES.slice(0, 8)
    }
    return get<CivicIssue[]>('/issues/my')
  },
}
