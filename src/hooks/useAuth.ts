import { useMutation } from '@tanstack/react-query'
import { useAuth } from '@/hooks/useAuthContext'
import { useAuthStore, type AuthUser } from '../lib/auth-store'
import { showNotification } from '../lib/notifications'
import { decodeJwtPayload, isValidJwtToken } from '../lib/jwt'
import { inferRoleFromEmail, normalizeRole } from '../lib/roles'
import {
  loginUsuarioService,
  type CredencialesUsuarioDTO,
} from '../services/usuarioService'

type LoginCredentials = {
  username: string
  contrasena: string
}

type LoginApiResponse = {
  Estatus?: boolean
  estatus?: boolean
  Token?: string
  token?: string
}

type JwtPayload = {
  email?: string
  username?: string
  Correo?: string
  sub?: string
  role?: string
  rol?: string
  Role?: string
  Rol?: string
}

function deriveNameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'Usuario'
  const cleaned = local.replace(/[._-]+/g, ' ').trim()
  if (!cleaned) return 'Usuario'
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase())
}

export function useLogin() {
  const { login } = useAuth()

  return useMutation({
    mutationFn: async (credentials: LoginCredentials) => {
      const payload: CredencialesUsuarioDTO = {
        Email: credentials.username.trim(),
        Contrasena: credentials.contrasena,
      }
      const response = (await loginUsuarioService(payload)) as LoginApiResponse
      const estatus = response?.Estatus ?? response?.estatus ?? false
      const rawToken = response?.Token ?? response?.token ?? ''
      const normalizedToken = rawToken.replace(/^Bearer\s+/i, '').trim()

      if (!estatus || !normalizedToken || !isValidJwtToken(normalizedToken)) {
        throw new Error('No fue posible iniciar sesión. Verifica tus credenciales.')
      }

      const jwtPayload = decodeJwtPayload<JwtPayload>(normalizedToken) ?? {}
      const email =
        jwtPayload.email ??
        jwtPayload.Correo ??
        jwtPayload.username ??
        jwtPayload.sub ??
        credentials.username
      const roleFromToken =
        normalizeRole(jwtPayload.role) ??
        normalizeRole(jwtPayload.rol) ??
        normalizeRole(jwtPayload.Role) ??
        normalizeRole(jwtPayload.Rol)

      return {
        token: normalizedToken,
        email,
        name: deriveNameFromEmail(email),
        role: roleFromToken ?? inferRoleFromEmail(email),
      }
    },
    onMutate: () => {
      useAuthStore.getState().setLoading(true)
      useAuthStore.getState().setError(null)
    },
    onSuccess: (session) => {
      login({
        username: {
          email: session.email,
          username: session.name,
          role: session.role,
        } as AuthUser,
        token: session.token,
      })
    },
    onError: (error) => {
      const message =
        error instanceof Error
          ? error.message
          : 'No fue posible iniciar sesión con el API. Verifica credenciales o conexión.'
      useAuthStore.getState().setLoading(false)
      useAuthStore.getState().setError(message)
      showNotification({
        title: 'Inicio de sesión',
        message,
        variant: 'error',
      })
    },
  })
}
