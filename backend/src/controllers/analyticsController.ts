import type { Request, Response } from 'express'
import { issueRepository } from '../repositories/issueRepository'
import { sendSuccess } from '../utils/response'

export async function getSummary(_req: Request, res: Response): Promise<void> {
  const summary = await issueRepository.getAnalyticsSummary()
  sendSuccess(res, summary)
}

export async function getTrends(_req: Request, res: Response): Promise<void> {
  const trends = await issueRepository.getAnalyticsTrends()
  sendSuccess(res, trends)
}

export async function getWardStats(_req: Request, res: Response): Promise<void> {
  const wardStats = await issueRepository.getWardStats()
  sendSuccess(res, wardStats)
}
