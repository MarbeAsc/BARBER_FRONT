import { createContext } from 'react'
import type { AuthUser } from '@/lib/auth-store'

export type AuthContextValue = {
  username: AuthUser | null
  user: AuthUser | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
  login: (session: { username: AuthUser; token?: string | null }) => void
  logout: () => void
}

export const AuthContext = createContext<AuthContextValue | null>(null)
