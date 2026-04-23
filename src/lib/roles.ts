export type UserRole = 'Administrador' | 'Barbero' | 'Cliente'

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
