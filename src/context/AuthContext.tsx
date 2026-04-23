import { createContext, useMemo, type ReactNode } from 'react'
import { useAuthStore, type AuthUser } from '../lib/auth-store'

type AuthContextValue = {
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

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const { username, token, isAuthenticated, isLoading, error, login, logout } = useAuthStore()  

  const value = useMemo<AuthContextValue>(
    () => ({
      username,
      user: username,
      token,
      isAuthenticated,
      isLoading,
      error,
      login,
      logout,
    }),
    [username, token, isAuthenticated, isLoading, error, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
