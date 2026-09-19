import type { Request, Response } from 'express'
import { issueRepository } from '../repositories/issueRepository'
import { sendSuccess } from '../utils/response'
import { ValidationError } from '../utils/errors'
import type { UserRole } from '../types'

export async function getUsers(_req: Request, res: Response): Promise<void> {
  const users = await issueRepository.getUsers()
  sendSuccess(res, users)
}

export async function updateUserRole(req: Request, res: Response): Promise<void> {
  const { role } = req.body
  if (!role || !['CITIZEN', 'OFFICER', 'SUPERVISOR', 'ADMIN'].includes(role)) {
    throw new ValidationError('Valid role is required (CITIZEN, OFFICER, SUPERVISOR, ADMIN)')
  }

  const updated = await issueRepository.updateUserRole(req.params.id, role as UserRole)
  sendSuccess(res, updated, 'User role updated')
}
