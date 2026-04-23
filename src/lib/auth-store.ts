import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { UserRole } from './roles'

export const AUTH_STORAGE_KEY = 'auth-storage'

export type AuthUser = {
  email: string
  username: string
  role?: UserRole
}

type AuthStore = {
  username: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (session: { username: AuthUser; token?: string | null }) => void
  logout: () => void
  setLoading: (value: boolean) => void
  setError: (value: string | null) => void
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      username: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,
      error: null,
      login: (session) =>
        set({
          username: session.username,
          token: session.token ?? null,
          isAuthenticated: true,
          isLoading: false,
          error: null,
        }),
      logout: () =>
        set({
          username: null,
          token: null,
          isAuthenticated: false,
          isLoading: false,
          error: null,
        }),
      setLoading: (value) => set({ isLoading: value }),
      setError: (value) => set({ error: value }),
    }),
    {
      name: AUTH_STORAGE_KEY,
      partialize: (state) => ({
        username: state.username,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
    },
  ),
)

export function getStoredToken() {
  return useAuthStore.getState().token
}
