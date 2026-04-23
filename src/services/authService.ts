import axios from 'axios'
import { api } from '../lib/api'
import { API_CONFIG } from '../lib/api-config'
import { decodeJwtPayload, isValidJwtToken } from '../lib/jwt'
import type { UserRole } from '../lib/roles'

export type LoginCredentials = {
  user: string
  password: string
}

type LoginResponse =
  | {
      Token: string
      NombreCompleto?: string
      Rol?: UserRole | string
    }
  | {
      token: string
      user?: { email?: string; name?: string; role?: UserRole }
    }
  | {
      accessToken: string
      user?: { email?: string; name?: string; role?: UserRole }
    }

type JwtAuthPayload = {
  sub?: string
  email?: string
  Correo?: string
  name?: string
  nombre?: string
  role?: string
  rol?: string
}

export type LoginResult = {
  token: string
  email: string
  name: string
  role?: UserRole
}

function mapRole(rawRole?: string): UserRole | undefined {
  if (!rawRole) return undefined
  const normalized = rawRole.toLowerCase().trim()
  if (normalized === 'administrador' || normalized === 'admin') return 'Administrador'
  if (normalized === 'barbero' || normalized === 'barber') return 'Barbero'
  if (normalized === 'cliente' || normalized === 'client') return 'Cliente'
  return undefined
}

function deriveNameFromEmail(email: string) {
  const local = email.split('@')[0] ?? 'Usuario'
  const cleaned = local.replace(/[._-]+/g, ' ').trim()
  if (!cleaned) return 'Usuario'
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase())
}

function normalizeErrorText(value: unknown): string {
  if (typeof value === 'string') return value.trim()
  return ''
}

function mapBackendErrorToMessage(rawMessage: string) {
  const normalized = rawMessage.toLowerCase()
  if (
    normalized.includes('usuario no existe') ||
    normalized.includes('usuario no encontrado') ||
    normalized.includes('user not found') ||
    normalized.includes('invalid user')
  ) {
    return 'El usuario no existe. Verifica que el usuario sea correcto.'
  }
  if (
    normalized.includes('contraseña incorrecta') ||
    normalized.includes('password incorrect') ||
    normalized.includes('contraseña inválida') ||
    normalized.includes('invalid password') ||
    normalized.includes('wrong password')
  ) {
    return 'La contraseña es incorrecta. Verifica tu contraseña.'
  }
  if (normalized.includes('sin llave')) {
    return 'Error de configuración del servidor. Contacta al administrador del sistema.'
  }
  return rawMessage || 'No fue posible iniciar sesión. Verifica credenciales o conexión.'
}

export async function loginRequest(credentials: LoginCredentials): Promise<LoginResult> {
  try {
    const { data } = await api.post<LoginResponse>(API_CONFIG.AUTH_LOGIN_PATH, credentials)
    const token =
      'Token' in data
        ? data.Token
        : 'token' in data
          ? data.token
          : data.accessToken

    if (!isValidJwtToken(token)) {
      const backendError = mapBackendErrorToMessage(normalizeErrorText(token))
      throw new Error(backendError || 'Token inválido recibido del servidor.')
    }

    const payload = decodeJwtPayload<JwtAuthPayload>(token) ?? {}
    const normalizedEmail =
      ('user' in data ? data.user?.email : undefined) ??
      payload.email ??
      payload.Correo ??
      payload.sub ??
      credentials.user
    const role =
      ('Rol' in data ? mapRole(typeof data.Rol === 'string' ? data.Rol : undefined) : undefined) ??
      ('user' in data ? data.user?.role : undefined) ??
      mapRole(payload.role ?? payload.rol)
    const name =
      ('NombreCompleto' in data ? data.NombreCompleto : undefined) ??
      ('user' in data ? data.user?.name : undefined) ??
      payload.name ??
      payload.nombre ??
      deriveNameFromEmail(normalizedEmail)

    return { token, email: normalizedEmail, name, role }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const responseData = error.response?.data as { message?: string; Message?: string } | string | undefined
      const serverMessage =
        normalizeErrorText(responseData) ||
        normalizeErrorText(responseData && typeof responseData === 'object' ? responseData.message : undefined) ||
        normalizeErrorText(responseData && typeof responseData === 'object' ? responseData.Message : undefined)

      if (serverMessage) throw new Error(mapBackendErrorToMessage(serverMessage))
      if (!error.response) throw new Error('Error de conexión con el servidor. Verifica tu red o la API.')
      throw new Error(`Error al iniciar sesión (${error.response.status}).`)
    }
    if (error instanceof Error) throw error
    throw new Error('No fue posible iniciar sesión. Verifica credenciales o conexión.')
  }
}
