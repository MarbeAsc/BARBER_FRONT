export type UserRole = 'Administrador' | 'Barbero' | 'Cliente'

export function normalizeRole(value?: string | null): UserRole | undefined {
  if (!value) return undefined
  const normalized = value.toLowerCase().trim()
  if (normalized === 'administrador' || normalized === 'admin') return 'Administrador'
  if (normalized === 'barbero' || normalized === 'barber') return 'Barbero'
  if (normalized === 'cliente' || normalized === 'client') return 'Cliente'
  return undefined
}

export function inferRoleFromEmail(email?: string): UserRole {
  const source = (email ?? '').toLowerCase().trim()
  const localPart = source.split('@')[0] ?? ''
  const tokens = localPart.split(/[^a-z0-9]+/).filter(Boolean)

  if (tokens.includes('administrador')) return 'Administrador'  
  if (tokens.includes('barbero') || tokens.includes('barber')) return 'Barbero'
  if (tokens.includes('cliente')) return 'Cliente'
  return 'Cliente'
}

export function roleLabel(role: UserRole) {
  if (role === 'Administrador') return 'Administrador'
  if (role === 'Barbero') return 'Barbero'
  return 'Cliente'
}
