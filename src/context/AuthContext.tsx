import {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
  type ReactNode,
} from 'react'

const SESSION_KEY = 'taskmgmt_session'
const PERSIST_KEY = 'taskmgmt_session_persist'

export type AuthUser = {
  email: string
  name: string
}

type AuthContextValue = {
  user: AuthUser | null
  isAuthenticated: boolean
  login: (user: AuthUser, options?: { remember?: boolean }) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextValue | null>(null)

function readStoredUser(): AuthUser | null {
  try {
    const raw = localStorage.getItem(PERSIST_KEY) ?? sessionStorage.getItem(SESSION_KEY)
    if (!raw) return null
    const parsed = JSON.parse(raw) as unknown
    if (
      parsed &&
      typeof parsed === 'object' &&
      'email' in parsed &&
      'name' in parsed &&
      typeof (parsed as AuthUser).email === 'string' &&
      typeof (parsed as AuthUser).name === 'string'
    ) {
      return { email: (parsed as AuthUser).email, name: (parsed as AuthUser).name }
    }
    return null
  } catch {
    return null
  }
}

type AuthProviderProps = {
  children: ReactNode
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<AuthUser | null>(() => readStoredUser())

  const login = useCallback((next: AuthUser, options?: { remember?: boolean }) => {
    const remember = options?.remember ?? true
    const payload = JSON.stringify(next)
    if (remember) {
      localStorage.setItem(PERSIST_KEY, payload)
      sessionStorage.removeItem(SESSION_KEY)
    } else {
      sessionStorage.setItem(SESSION_KEY, payload)
      localStorage.removeItem(PERSIST_KEY)
    }
    setUser(next)
  }, [])

  const logout = useCallback(() => {
    sessionStorage.removeItem(SESSION_KEY)
    localStorage.removeItem(PERSIST_KEY)
    setUser(null)
  }, [])

  const value = useMemo<AuthContextValue>(
    () => ({
      user,
      isAuthenticated: user !== null,
      login,
      logout,
    }),
    [user, login, logout],
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

// Hook co-ubicado con el provider para mantener el módulo simple.
// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  const ctx = useContext(AuthContext)
  if (!ctx) {
    throw new Error('useAuth debe usarse dentro de AuthProvider')
  }
  return ctx
}
