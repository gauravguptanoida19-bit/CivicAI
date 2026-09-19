import type { Request, Response } from 'express'
import { loginUser, registerUser, signToken, verifyToken } from '../services/authService'
import { sendSuccess } from '../utils/response'
import { ValidationError, UnauthorizedError } from '../utils/errors'
import type { AuthenticatedRequest, UserRole } from '../types'
import { issueRepository } from '../repositories/issueRepository'

export async function login(req: Request, res: Response): Promise<void> {
  const { email, password } = req.body
  if (!email || !password) {
    throw new ValidationError('Email and password are required')
  }

  const result = await loginUser(email, password)
  sendSuccess(res, result, 'Login successful')
}

export async function register(req: Request, res: Response): Promise<void> {
  const { name, email, password, role } = req.body
  if (!name || !email || !password) {
    throw new ValidationError('Name, email, and password are required')
  }

  const validRole: UserRole = ['CITIZEN', 'OFFICER', 'SUPERVISOR', 'ADMIN'].includes(role)
    ? role
    : 'CITIZEN'

  const result = await registerUser(name, email, password, validRole)
  sendSuccess(res, result, 'Registration successful', 201)
}

export async function logout(_req: Request, res: Response): Promise<void> {
  sendSuccess(res, { message: 'Logged out successfully' }, 'Logged out')
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const { refreshToken } = req.body
  if (!refreshToken) {
    throw new ValidationError('Refresh token required')
  }

  try {
    const payload = verifyToken(refreshToken)
    const token = signToken({
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    })
    sendSuccess(res, { token }, 'Token refreshed')
  } catch {
    throw new UnauthorizedError('Invalid or expired refresh token')
  }
}

export async function getMe(req: AuthenticatedRequest, res: Response): Promise<void> {
  if (!req.user) {
    throw new UnauthorizedError()
  }

  const user = await issueRepository.getUserById(req.user.id)
  if (!user) {
    sendSuccess(res, req.user)
    return
  }

  sendSuccess(res, user)
}
