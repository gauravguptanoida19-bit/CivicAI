import { post } from './api'
import type { AuthResponse, LoginRequest, RegisterRequest, UserRole } from '@/types'
import { useAuthStore } from '@/store/authStore'
import { DEMO_USERS } from '@/utils/demoData'

const DEMO_MODE = import.meta.env.VITE_DEMO_MODE === 'true'

export const authService = {
  async login(credentials: LoginRequest): Promise<AuthResponse> {
    if (DEMO_MODE) {
      // Demo authentication — matches demo users
      await new Promise((r) => setTimeout(r, 800))
      const user = DEMO_USERS.find((u) => u.email === credentials.email)
      if (!user) {
        // Default to citizen for any email in demo mode
        const demoUser = { ...DEMO_USERS[0], email: credentials.email }
        const token = `demo-token-${Date.now()}`
        return { user: demoUser, token, refreshToken: 'demo-refresh' }
      }
      const token = `demo-token-${user.id}`
      return { user, token, refreshToken: 'demo-refresh' }
    }
    return post<AuthResponse>('/auth/login', credentials)
  },

  async register(data: RegisterRequest): Promise<AuthResponse> {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 1000))
      const newUser = {
        ...DEMO_USERS[0],
        id: `user-demo-${Date.now()}`,
        name: data.name,
        email: data.email,
        role: (data.role || 'CITIZEN') as UserRole,
      }
      return { user: newUser, token: `demo-token-${newUser.id}`, refreshToken: 'demo-refresh' }
    }
    return post<AuthResponse>('/auth/register', data)
  },

  async logout(): Promise<void> {
    if (DEMO_MODE) {
      await new Promise((r) => setTimeout(r, 300))
      return
    }
    try {
      await post('/auth/logout')
    } catch {
      // Ignore errors on logout
    }
  },

  async refreshToken(refreshToken: string): Promise<{ token: string }> {
    if (DEMO_MODE) {
      return { token: `demo-token-refreshed-${Date.now()}` }
    }
    return post('/auth/refresh', { refreshToken })
  },
}
