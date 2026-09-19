import type { Server, Socket } from 'socket.io'
import type { CivicIssue } from '../types'
import { logger } from '../utils/logger'

class SocketService {
  private io: Server | null = null

  init(io: Server): void {
    this.io = io

    this.io.on('connection', (socket: Socket) => {
      logger.info(`[Socket.IO] Client connected: ${socket.id}`)

      socket.on('subscribe:ward', (ward: string) => {
        socket.join(`ward:${ward}`)
        logger.info(`[Socket.IO] Socket ${socket.id} subscribed to ward:${ward}`)
      })

      socket.on('unsubscribe:ward', (ward: string) => {
        socket.leave(`ward:${ward}`)
      })

      socket.on('join:department', (deptCode: string) => {
        socket.join(`dept:${deptCode}`)
        logger.info(`[Socket.IO] Socket ${socket.id} joined dept:${deptCode}`)
      })

      socket.on('disconnect', () => {
        logger.info(`[Socket.IO] Client disconnected: ${socket.id}`)
      })
    })
  }

  emitNewIssue(issue: CivicIssue): void {
    if (!this.io) return
    this.io.emit('issue:created', issue)
    this.io.emit('issue:new', issue)

    if (issue.location.ward) {
      this.io.to(`ward:${issue.location.ward}`).emit('ward:issue:new', issue)
    }

    if (issue.department) {
      this.io.to(`dept:${issue.department.code}`).emit('dept:issue:new', issue)
    }

    if (issue.severity === 'CRITICAL') {
      this.io.emit('alert:critical', {
        id: issue.id,
        issueNumber: issue.issueNumber,
        title: issue.title,
        ward: issue.location.ward,
        severity: issue.severity,
        message: `CRITICAL ALERT: ${issue.title} reported in ${issue.location.ward || 'the city'}`,
        timestamp: new Date().toISOString(),
      })
    }
  }

  emitIssueUpdated(issue: CivicIssue): void {
    if (!this.io) return
    this.io.emit('issue:updated', issue)
    this.io.emit(`issue:${issue.id}:updated`, issue)
  }

  emitStatusChanged(issue: CivicIssue): void {
    if (!this.io) return
    this.io.emit('status:changed', {
      issueId: issue.id,
      issueNumber: issue.issueNumber,
      status: issue.status,
      timestamp: new Date().toISOString(),
      issue,
    })
  }
}

export const socketService = new SocketService()
