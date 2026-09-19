import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { User, UserRole } from '@/types'

interface AuthStore {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  demoMode: boolean

  setAuth: (user: User, token: string) => void
  logout: () => void
  setDemoMode: (enabled: boolean) => void
  updateUser: (updates: Partial<User>) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      demoMode: import.meta.env.VITE_DEMO_MODE === 'true',

      setAuth: (user, token) =>
        set({ user, token, isAuthenticated: true }),

      logout: () =>
        set({ user: null, token: null, isAuthenticated: false }),

      setDemoMode: (enabled) =>
        set({ demoMode: enabled }),

      updateUser: (updates) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updates } : null,
        })),
    }),
    {
      name: 'civicai-auth',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
)

// Convenience helpers
export const isAdmin = (role?: UserRole) => role === 'ADMIN'
export const isSupervisor = (role?: UserRole) => role === 'SUPERVISOR' || role === 'ADMIN'
export const isOfficer = (role?: UserRole) => role === 'OFFICER' || isSupervisor(role)
export const isCitizen = (role?: UserRole) => role === 'CITIZEN'
