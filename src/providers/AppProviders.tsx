import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material'
import { RouterProvider } from 'react-router-dom'
import { AuthProvider } from '@/context/AuthContext'
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

const muiTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#2563eb',
    },
  },
  components: {
    MuiButtonBase: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
          '&.Mui-disabled': {
            cursor: 'not-allowed',
          },
        },
      },
    },
    MuiLink: {
      styleOverrides: {
        root: {
          cursor: 'pointer',
        },
      },
    },
  },
})

export function AppProviders() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <AuthProvider>
          <NotificationsProvider>
            <RouterProvider router={router} />
          </NotificationsProvider>
        </AuthProvider>
      </ThemeProvider>
    </QueryClientProvider>
  )
}
