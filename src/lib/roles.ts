export type UserRole = 'admin' | 'barbero' | 'cliente'

export function inferRoleFromEmail(email?: string): UserRole {
  const source = (email ?? '').toLowerCase().trim()
  const localPart = source.split('@')[0] ?? ''
  const tokens = localPart.split(/[^a-z0-9]+/).filter(Boolean)

  if (tokens.includes('admin')) return 'admin'
  if (tokens.includes('barbero') || tokens.includes('barber')) return 'barbero'
  if (tokens.includes('cliente')) return 'cliente'
  return 'cliente'
}

export function roleLabel(role: UserRole) {
  if (role === 'admin') return 'Administrador'
  if (role === 'barbero') return 'Barbero'
  return 'Cliente'
}
