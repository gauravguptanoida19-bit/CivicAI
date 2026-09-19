import type { Response, NextFunction } from 'express'
import { verifyToken } from '../services/authService'
import { UnauthorizedError, ForbiddenError } from '../utils/errors'
import type { AuthenticatedRequest, UserRole } from '../types'

export function authenticateJWT(req: AuthenticatedRequest, _res: Response, next: NextFunction): void {
  const authHeader = req.headers.authorization

  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    throw new UnauthorizedError('Authentication required. Bearer token missing.')
  }

  const token = authHeader.split(' ')[1]
  try {
    const payload = verifyToken(token)
    req.user = {
      id: payload.id,
      email: payload.email,
      role: payload.role,
      name: payload.name,
    }
    next()
  } catch (err) {
    throw new UnauthorizedError('Invalid or expired token')
  }
}

export function requireRole(...allowedRoles: UserRole[]) {
  return (req: AuthenticatedRequest, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required')
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ForbiddenError(`Access denied. Requires one of: ${allowedRoles.join(', ')}`)
    }

    next()
  }
}
