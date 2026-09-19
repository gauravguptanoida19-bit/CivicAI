import { io, Socket } from 'socket.io-client'
import type { SocketIssueEvent } from '@/types'
import { useNotificationStore } from '@/store/notificationStore'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:3001'
const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

class SocketService {
  private socket: Socket | null = null
  private demoInterval: ReturnType<typeof setInterval> | null = null

  connect(token: string): void {
    if (DEMO_MODE) {
      this.startDemoSimulation()
      return
    }

    if (this.socket?.connected) return

    this.socket = io(SOCKET_URL, {
      auth: { token },
      transports: ['websocket', 'polling'],
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    })

    this.socket.on('connect', () => {
      console.log('[Socket] Connected to CivicAI server')
    })

    this.socket.on('issue:new', (event: SocketIssueEvent) => {
      const store = useNotificationStore.getState()
      store.addNotification({
        id: `socket-${Date.now()}`,
        type: event.issue.severity === 'CRITICAL' ? 'CRITICAL' : 'INFO',
        title: 'New Civic Issue Detected',
        message: `${event.issue.type.replace(/_/g, ' ')} reported in ${event.issue.location.ward}`,
        isRead: false,
        issueId: event.issue.id,
        createdAt: event.timestamp,
      })
    })

    this.socket.on('issue:updated', (event: SocketIssueEvent) => {
      const store = useNotificationStore.getState()
      store.addNotification({
        id: `socket-upd-${Date.now()}`,
        type: 'INFO',
        title: 'Issue Status Updated',
        message: `${event.issue.issueNumber}: ${event.issue.status.replace(/_/g, ' ')}`,
        isRead: false,
        issueId: event.issue.id,
        createdAt: event.timestamp,
      })
    })

    this.socket.on('disconnect', () => {
      console.log('[Socket] Disconnected')
    })
  }

  disconnect(): void {
    if (this.demoInterval) {
      clearInterval(this.demoInterval)
      this.demoInterval = null
    }
    if (this.socket) {
      this.socket.disconnect()
      this.socket = null
    }
  }

  private startDemoSimulation(): void {
    if (this.demoInterval) return

    const events = [
      { type: 'CRITICAL', title: '🚨 Critical Issue Detected', message: 'Open manhole in Ward 5 — immediate action needed' },
      { type: 'INFO', title: '🚧 New Issue Reported', message: 'Pothole detected in Ward 4 — HIGH severity' },
      { type: 'SUCCESS', title: '✅ Issue Resolved', message: 'Garbage accumulation in Ward 7 cleared by Sanitation' },
      { type: 'INFO', title: '💡 New Issue Reported', message: 'Broken streetlight in Ward 2 — MEDIUM severity' },
      { type: 'WARNING', title: '⚠️ Duplicate Detected', message: '3 reports merged for pothole at Ward 4, Main Rd' },
      { type: 'INFO', title: '💧 New Issue Reported', message: 'Water leakage in Ward 1 — HIGH severity' },
    ]

    let idx = 0
    // First demo event after 10 seconds
    const firstTimeout = setTimeout(() => {
      const ev = events[idx % events.length]
      useNotificationStore.getState().addNotification({
        id: `demo-socket-${Date.now()}`,
        type: ev.type as 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL',
        title: ev.title,
        message: ev.message,
        isRead: false,
        createdAt: new Date().toISOString(),
      })
      idx++

      // Then every 25-45 seconds
      this.demoInterval = setInterval(() => {
        const e = events[idx % events.length]
        useNotificationStore.getState().addNotification({
          id: `demo-socket-${Date.now()}`,
          type: e.type as 'INFO' | 'SUCCESS' | 'WARNING' | 'CRITICAL',
          title: e.title,
          message: e.message,
          isRead: false,
          createdAt: new Date().toISOString(),
        })
        idx++
      }, 30000 + Math.random() * 15000)
    }, 10000)

    // Store timeout for cleanup
    ;(this as unknown as { _firstTimeout: ReturnType<typeof setTimeout> })._firstTimeout = firstTimeout
  }

  emit(event: string, data: unknown): void {
    if (this.socket?.connected) {
      this.socket.emit(event, data)
    }
  }

  on(event: string, callback: (data: unknown) => void): void {
    if (this.socket) {
      this.socket.on(event, callback)
    }
  }

  off(event: string): void {
    if (this.socket) {
      this.socket.off(event)
    }
  }
}

export const socketService = new SocketService()
