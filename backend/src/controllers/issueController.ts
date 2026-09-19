import type { Request, Response } from 'express'
import { issueRepository } from '../repositories/issueRepository'
import { mlService } from '../services/mlService'
import { socketService } from '../services/socketService'
import { sendSuccess, sendCreated, sendPaginated } from '../utils/response'
import { ValidationError } from '../utils/errors'
import type {
  AuthenticatedRequest,
  IssueFilters,
  IssueType,
  IssueStatus,
  IssueSeverity,
  AIAnalysisResult,
} from '../types'

export async function getIssues(req: Request, res: Response): Promise<void> {
  const filters: IssueFilters = {
    type: req.query.type as IssueType,
    severity: req.query.severity as IssueSeverity,
    status: req.query.status as IssueStatus,
    ward: req.query.ward as string,
    departmentId: req.query.departmentId as string,
    search: req.query.search as string,
    page: req.query.page ? Number(req.query.page) : 1,
    limit: req.query.limit ? Number(req.query.limit) : 20,
  }

  const result = await issueRepository.getIssues(filters)
  sendPaginated(res, result)
}

export async function getIssueById(req: Request, res: Response): Promise<void> {
  const issue = await issueRepository.getIssueById(req.params.id)
  sendSuccess(res, issue)
}

export async function createIssue(req: AuthenticatedRequest, res: Response): Promise<void> {
  let location = { latitude: 28.6139, longitude: 77.2090, address: 'Main Road', ward: 'Ward 1 - Connaught Place' }
  if (req.body.location) {
    try {
      location = typeof req.body.location === 'string' ? JSON.parse(req.body.location) : req.body.location
    } catch {
      // Default fallback
    }
  }

  const description = req.body.description || ''
  const issueTypeHint = req.body.issueType as IssueType | undefined

  let imageUrl: string | undefined
  let aiAnalysis: AIAnalysisResult | undefined

  if (req.file) {
    imageUrl = `/uploads/${req.file.filename}`
    try {
      aiAnalysis = await mlService.analyzeImage(req.file.path, issueTypeHint)
    } catch {
      // Fallback
    }
  }

  if (!aiAnalysis) {
    aiAnalysis = await mlService.analyzeImage('', issueTypeHint)
  }

  const user = req.user ? await issueRepository.getUserById(req.user.id) : undefined

  const newIssue = await issueRepository.createIssue(
    {
      issueType: issueTypeHint || aiAnalysis.issueType,
      description,
      location,
      imageUrl,
      aiAnalysis,
    },
    user
  )

  // Broadcast real-time event via WebSocket
  socketService.emitNewIssue(newIssue)

  sendCreated(res, newIssue, 'Issue reported successfully')
}

export async function analyzeImage(req: Request, res: Response): Promise<void> {
  const imagePath = req.file ? req.file.path : ''
  const hint = (req.body.hint || req.query.hint) as string | undefined

  const analysis = await mlService.analyzeImage(imagePath, hint)
  sendSuccess(res, analysis, 'Image analysis complete')
}

export async function updateIssueStatus(req: AuthenticatedRequest, res: Response): Promise<void> {
  const { status, notes } = req.body
  if (!status) {
    throw new ValidationError('Status is required')
  }

  const user = req.user ? { id: req.user.id, name: req.user.name, role: req.user.role } : undefined
  const updated = await issueRepository.updateIssueStatus(req.params.id, status as IssueStatus, notes, user)

  socketService.emitStatusChanged(updated)
  socketService.emitIssueUpdated(updated)

  sendSuccess(res, updated, 'Issue status updated')
}

export async function assignIssue(req: Request, res: Response): Promise<void> {
  const { departmentId, officerId } = req.body
  if (!departmentId) {
    throw new ValidationError('departmentId is required')
  }

  const assigned = await issueRepository.assignIssue(req.params.id, departmentId, officerId)
  socketService.emitIssueUpdated(assigned)

  sendSuccess(res, assigned, 'Issue assigned to department')
}

export async function getNearby(req: Request, res: Response): Promise<void> {
  const lat = Number(req.query.lat) || 28.6139
  const lng = Number(req.query.lng) || 77.2090
  const radius = Number(req.query.radius) || 5

  const nearby = await issueRepository.getNearbyIssues(lat, lng, radius)
  sendSuccess(res, nearby)
}

export async function getMyIssues(req: AuthenticatedRequest, res: Response): Promise<void> {
  const userId = req.user?.id || 'user-001'
  const issues = await issueRepository.getMyIssues(userId)
  sendSuccess(res, issues)
}
