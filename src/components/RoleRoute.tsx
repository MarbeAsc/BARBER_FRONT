import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { inferRoleFromEmail, type UserRole } from '../lib/roles'

type RoleRouteProps = {
  allow: UserRole[]
}

export function RoleRoute({ allow }: RoleRouteProps) {
  const { username } = useAuth()
  const role = username?.role ?? inferRoleFromEmail(username?.email)

  if (!allow.includes(role)) {
    return <Navigate to="/" replace />
  }

  return <Outlet />
}
