/**
 * Definición central de rutas: públicas, área autenticada (`AppShell`) y segmentos por rol.
 * Las páginas bajo rutas privadas se cargan con `lazy` para dividir el bundle.
 */
import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { PublicFlowRoute } from './components/PublicFlowRoute'
import { ProtectedRoute } from './components/ProtectedRoute'
import { RoleRoute } from './components/RoleRoute'
import { RootLayout } from './layouts/RootLayout'
import { ContactPage } from './pages/ContactPage'
import { ForgotPassword } from './pages/ForgotPassword'
import { Login } from './pages/Login'
import { ResetPassword } from './pages/ResetPassword'
import { Register } from './pages/Register'
import { RouteErrorPage } from './pages/RouteErrorPage'

export const router = createBrowserRouter([
  {
    element: <RootLayout />,
    errorElement: <RouteErrorPage />,
    children: [
      { path: 'login', element: <Login /> },
      { path: 'reset-password', element: <ResetPassword /> },
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
                    path: 'promociones',
                    lazy: async () => {
                      const { AdminPromocionesPage } = await import('./pages/admin/AdminPromocionesPage')
                      return { Component: AdminPromocionesPage }
                    },
                  },
                  {
                    path: 'barberos',
                    lazy: async () => {
                      const { AdminBarberosPage } = await import('./pages/admin/AdminBarberosPage')
                      return { Component: AdminBarberosPage }
                    },
                  },
                  {
                    path: 'usuarios',
                    lazy: async () => {
                      const { AdminUsuariosPage } = await import('./pages/admin/AdminUsuariosPage')
                      return { Component: AdminUsuariosPage }
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
                  {
                    path: 'promociones-barbero',
                    lazy: async () => {
                      const { ClientePromocionesPage } = await import('./pages/cliente/ClientePromocionesPage')
                      return { Component: ClientePromocionesPage }
                    },
                  },
                ],
              },
              {
                element: <RoleRoute allow={['Cliente']} />,
                children: [
                  {
                    path: 'promociones-cliente',
                    lazy: async () => {
                      const { ClientePromocionesPage } = await import('./pages/cliente/ClientePromocionesPage')
                      return { Component: ClientePromocionesPage }
                    },
                  },
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
