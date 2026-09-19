import type { Response } from 'express'
import type { ApiResponse, PaginatedResponse } from '../types'

export function sendSuccess<T>(res: Response, data: T, message?: string, statusCode = 200): void {
  const response: ApiResponse<T> = { success: true, data, message }
  res.status(statusCode).json(response)
}

export function sendCreated<T>(res: Response, data: T, message?: string): void {
  sendSuccess(res, data, message, 201)
}

export function sendError(res: Response, message: string, statusCode = 500, error?: string): void {
  const response: ApiResponse = { success: false, message, error }
  res.status(statusCode).json(response)
}

export function sendPaginated<T>(
  res: Response,
  result: PaginatedResponse<T>,
  message?: string
): void {
  res.status(200).json({
    success: true,
    ...result,
    message,
  })
}
