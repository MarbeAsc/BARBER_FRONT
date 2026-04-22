import { createBrowserRouter, Navigate } from 'react-router-dom'
import { AppShell } from './components/AppShell'
import { ProtectedRoute } from './components/ProtectedRoute'
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
                path: 'tareas',
                lazy: async () => {
                  const { SimpleSectionPage } = await import('./pages/SimpleSectionPage')
                  return {
                    Component: () => (
                      <SimpleSectionPage
                        title="Tareas"
                        description="Aquí irá el listado y la gestión de tareas cuando conectes tu backend."
                      />
                    ),
                  }
                },
              },
              {
                path: 'equipo',
                lazy: async () => {
                  const { SimpleSectionPage } = await import('./pages/SimpleSectionPage')
                  return {
                    Component: () => (
                      <SimpleSectionPage
                        title="Equipo"
                        description="Miembros, roles y permisos del equipo. Sección en preparación."
                      />
                    ),
                  }
                },
              },
              {
                path: 'informes',
                lazy: async () => {
                  const { SimpleSectionPage } = await import('./pages/SimpleSectionPage')
                  return {
                    Component: () => (
                      <SimpleSectionPage
                        title="Informes"
                        description="Exportaciones y métricas avanzadas. Sección en preparación."
                      />
                    ),
                  }
                },
              },
              {
                path: 'ajustes',
                lazy: async () => {
                  const { SimpleSectionPage } = await import('./pages/SimpleSectionPage')
                  return {
                    Component: () => (
                      <SimpleSectionPage
                        title="Ajustes"
                        description="Preferencias de cuenta y de la aplicación. Sección en preparación."
                      />
                    ),
                  }
                },
              },
            ],
          },
        ],
      },
      { path: '*', element: <Navigate to="/" replace /> },
    ],
  },
])
