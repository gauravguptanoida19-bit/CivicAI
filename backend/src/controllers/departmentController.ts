import type { Request, Response } from 'express'
import { issueRepository } from '../repositories/issueRepository'
import { sendSuccess } from '../utils/response'

export async function getDepartments(_req: Request, res: Response): Promise<void> {
  const depts = await issueRepository.getDepartments()
  sendSuccess(res, depts)
}

export async function getDepartmentById(req: Request, res: Response): Promise<void> {
  const dept = await issueRepository.getDepartmentById(req.params.id)
  sendSuccess(res, dept)
}
