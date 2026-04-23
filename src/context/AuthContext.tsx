import { useMemo, type ReactNode } from 'react'
import { useAuthStore } from '../lib/auth-store'
import { AuthContext, type AuthContextValue } from './auth-context'

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
