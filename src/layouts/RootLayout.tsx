import { Outlet, useLocation } from 'react-router-dom'
import { ReactQueryDevtools } from '@tanstack/react-query-devtools'
import { Loader } from '../components/Loader'

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
      <Loader />
      <Outlet />
      <QueryDevtoolsWhenNotLogin />
    </>
  )
}
