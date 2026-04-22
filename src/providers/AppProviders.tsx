import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '../context/AuthContext'
import { NotificationsProvider } from '../context/NotificationsContext'
import { router } from '../router'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 60 * 1000,
      retry: 1,
    },
  },
})

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <NotificationsProvider>
          <RouterProvider router={router} />
        </NotificationsProvider>
      </AuthProvider>
    </QueryClientProvider>
  )
}
