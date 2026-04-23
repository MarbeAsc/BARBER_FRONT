type JwtPayloadBase = {
  sub?: string
  email?: string
  Correo?: string
  name?: string
  nombre?: string
  role?: string
  rol?: string
}

function normalizeBase64Url(input: string) {
  const base64 = input.replace(/-/g, '+').replace(/_/g, '/')
  const padding = base64.length % 4
  if (padding === 0) return base64
  return `${base64}${'='.repeat(4 - padding)}`
}

function safeParseBase64Json<T>(input: string): T | null {
  try {
    const decoded = atob(normalizeBase64Url(input))
    return JSON.parse(decoded) as T
  } catch {
    return null
  }
}

export function isValidJwtToken(token?: string | null): token is string {
  if (!token) return false
  const trimmed = token.trim()
  if (!trimmed) return false

  const knownErrorMessages = new Set([
    'NoToken',
    'Usuario no encontrado',
    'Contraseña incorrecta',
    'Error al iniciar sesión',
    'Sin llave',
  ])
  if (knownErrorMessages.has(trimmed)) return false

  const parts = trimmed.split('.')
  if (parts.length !== 3) return false
  const header = safeParseBase64Json<{ typ?: string }>(parts[0] ?? '')
  if (!header || typeof header !== 'object') return false
  if (header.typ && String(header.typ).toUpperCase() !== 'JWT') return false
  return true
}

export function decodeJwtPayload<T extends JwtPayloadBase = JwtPayloadBase>(token: string): T | null {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    return safeParseBase64Json<T>(parts[1] ?? '')
  } catch {
    return null
  }
}
