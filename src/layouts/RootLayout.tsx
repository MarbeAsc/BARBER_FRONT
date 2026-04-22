import { Outlet, useLocation } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { NavigationLoadingOverlay } from '../components/NavigationLoadingOverlay'

function QueryDevtoolsWhenNotLogin() {
  const { pathname } = useLocation()
  if (pathname === '/login') return null
  return (
    <ReactQueryDevtools
      initialIsOpen={false}
      buttonPosition="bottom-right"
      position="bottom"
    />
  )
}

export function RootLayout() {
  return (
    <>
      <NavigationLoadingOverlay />
      <Outlet />
      <QueryDevtoolsWhenNotLogin />
    </>
  )
}
