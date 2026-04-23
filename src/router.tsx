import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { PublicFlowRoute } from './components/PublicFlowRoute'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { RootLayout } from './layouts/RootLayout'
import { ContactPage } from './pages/ContactPage'
import { ForgotPassword } from './pages/ForgotPassword'
import { Login } from './pages/Login'
import { Register } from './pages/Register'
import { RouteErrorPage } from './pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: 'login', element: <Login /> },
      {
        element: <PublicFlowRoute />,
        children: [
          { path: 'forgot-password', element: <ForgotPassword /> },
          { path: 'register', element: <Register /> },
          { path: 'contacto', element: <ContactPage /> },
        ],
      },
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
                element: <RoleRoute allow={['Administrador']} />,
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
                    path: 'Barberos',
                    lazy: async () => {
                      const { AdminBarberosPage } = await import('./pages/admin/AdminBarberosPage')
                      return { Component: AdminBarberosPage }
                    },
                  },
                ],
              },
              {
                element: <RoleRoute allow={['Barbero']} />,
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
                element: <RoleRoute allow={['Cliente']} />,
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
