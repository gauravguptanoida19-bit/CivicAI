import type { Request, Response, NextFunction } from 'express'
import { AppError } from '../utils/errors'
import { logger } from '../utils/logger'

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    logger.warn(`Operational error: ${err.message} [Status: ${err.statusCode}]`)
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      error: err.name,
    })
    return
  }

  logger.error('Unhandled system error:', err)
  res.status(500).json({
    success: false,
    message: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
    error: 'InternalServerError',
  })
}
