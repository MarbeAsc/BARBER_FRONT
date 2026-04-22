import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { RootLayout } from './layouts/RootLayout'
import { Login } from './pages/Login'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    children: [
      { path: 'login', element: <Login /> },
      {
        element: <ProtectedRoute />,
        children: [
          {
            element: <AppShell />,
            children: [
              {
                index: true,
                lazy: async () => {
                  const { Dashboard } = await import('./pages/Dashboard')
                  return { Component: Dashboard }
                },
              },
              {
                element: <RoleRoute allow={['admin']} />,
                children: [
                  {
                    path: 'servicios',
                    lazy: async () => {
                      const { AdminServiciosPage } = await import('./pages/admin/AdminServiciosPage')
                      return { Component: AdminServiciosPage }
                    },
                  },
                  {
                    path: 'anadidos',
                    lazy: async () => {
                      const { AdminAnadidosPage } = await import('./pages/admin/AdminAnadidosPage')
                      return { Component: AdminAnadidosPage }
                    },
                  },
                  {
                    path: 'perfumes',
                    lazy: async () => {
                      const { AdminPerfumesPage } = await import('./pages/admin/AdminPerfumesPage')
                      return { Component: AdminPerfumesPage }
                    },
                  },
                  {
                    path: 'barberos',
                    lazy: async () => {
                      const { AdminBarberosPage } = await import('./pages/admin/AdminBarberosPage')
                      return { Component: AdminBarberosPage }
                    },
                  },
                ],
              },
              {
                element: <RoleRoute allow={['barbero']} />,
                children: [
                  {
                    path: 'mis-citas',
                    lazy: async () => {
                      const { BarberoCitasPage } = await import('./pages/barbero/BarberoCitasPage')
                      return { Component: BarberoCitasPage }
                    },
                  },
                ],
              },
              {
                element: <RoleRoute allow={['cliente']} />,
                children: [
                  {
                    path: 'mis-reservas',
                    lazy: async () => {
                      const { ClienteReservasPage } = await import('./pages/cliente/ClienteReservasPage')
                      return { Component: ClienteReservasPage }
                    },
                  },
                ],
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
