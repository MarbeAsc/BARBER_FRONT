import { Navigate, Outlet, useLocation } from 'react-router-dom'

type PublicFlowState = {
  allowPublicFlow?: boolean
}

export function PublicFlowRoute() {
  const location = useLocation()
  const state = location.state as PublicFlowState | null

  if (!state?.allowPublicFlow) {
    return <Navigate to="/login" replace />
  }

  return <Outlet />
}
