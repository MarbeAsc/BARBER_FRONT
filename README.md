# Sistema de gestión para barbería

Aplicación web para administrar una barbería con tres perfiles: **Administrador**, **Barbero** y **Cliente**.

## Objetivo del sistema

Centralizar en una sola plataforma:

- Administración de servicios, añadidos, perfumes, barberos, promociones y usuarios.
- Visualización de citas para el barbero y gestión de bloqueos según el flujo actual.
- Reserva de citas para el cliente (servicio, barbero, fecha y hora) y consulta de promociones.

## Flujo principal

1. El usuario inicia sesión en `/login` mediante `useLogin` → `usuarioService` contra el API configurado.
2. El backend devuelve un JWT; el cliente valida el token y extrae correo y rol desde claims (`role`, `rol`, `Rol`, etc.).
3. Si el token no trae rol reconocible, se usa `inferRoleFromEmail` como respaldo (`src/lib/roles.ts`).
4. `ProtectedRoute` exige sesión; `RoleRoute` limita rutas hijas al rol permitido; la barra de navegación muestra enlaces según rol.

## Roles y responsabilidades

### Administrador

- Gestión de servicios, añadidos, perfumes, barberos, promociones y usuarios.

### Barbero

- Panel, mis citas y promociones (ruta dedicada en barbero).

### Cliente

- Panel, promociones y reserva de citas (`/mis-reservas`).

## Estructura del proyecto

```txt
src/
  components/     # UI reutilizable, shell, guards de ruta
  context/        # Auth y notificaciones
  features/       # Formularios, tablas y modales por dominio
    forms/
    tables/
    modals/
  hooks/          # TanStack Query y mutaciones por recurso (useBarberos, useServicios, …)
  layouts/        # Layout raíz
  lib/            # api-config, api-client, roles, JWT, notificaciones
  pages/          # Vistas por módulo y rol (admin, barbero, cliente)
  providers/      # QueryClient, MUI, Auth, Router
  services/       # Llamadas HTTP tipadas al backend
  router.tsx      # Mapa de rutas y code-splitting lazy
```

## Rutas relevantes

| Ruta | Acceso | Descripción |
|------|--------|-------------|
| `/login` | Público | Inicio de sesión |
| `/register`, `/forgot-password`, `/contacto` | Público condicional | Solo accesibles si la navegación previa envía `state: { allowPublicFlow: true }` (`PublicFlowRoute`) |
| `/` | Autenticado | Panel (`Dashboard`) |
| `/servicios`, `/anadidos`, `/perfumes`, `/promociones`, `/barberos`, `/usuarios` | Administrador | CRUD / gestión admin |
| `/mis-citas`, `/promociones-barbero` | Barbero | Agenda y promociones |
| `/mis-reservas`, `/promociones-cliente` | Cliente | Reservas y promociones |
| `*` | — | Redirección a `/` |

## Enrutado y protección de rutas

- `src/components/ProtectedRoute.tsx`: sin sesión → `/login`.
- `src/components/RoleRoute.tsx`: prop `allow` con roles permitidos (`UserRole`).
- `src/components/PublicFlowRoute.tsx`: exige `location.state.allowPublicFlow` para hijos (registro, recuperación, contacto).
- `src/router.tsx`: `errorElement` en raíz, rutas admin/barbero/cliente anidadas bajo `AppShell`.

## Datos y API

- **Cliente HTTP:** `src/lib/api-client.ts` (`apiSSO`): adjunta `Bearer` desde Zustand (`auth-store`), añade `_t` a los params para evitar caché agresivo del navegador, y hace `logout` en 401.
- **Configuración de URL:** `src/lib/api-config.ts` lee variables `VITE_*` (ver siguiente sección).
- **Re-export:** `src/lib/api.ts` exporta `api` como alias de `apiSSO`.
- **Servicios:** `src/services/*.ts` agrupan endpoints por dominio; los hooks en `src/hooks/` encapsulan `useQuery` / `useMutation` de TanStack Query.
- **Login en UI:** `src/hooks/useAuth.ts` (`useLogin`) → `usuarioService`; `authService.ts` existe para otro formato de login y comparte `API_CONFIG`.

## Variables de entorno

Copie `.env.example` a `.env` y ajuste según el entorno.

| Variable | Uso |
|----------|-----|
| `VITE_API_URL` | URL base del API (por ejemplo `http://localhost:5064/api`). |
| `VITE_API_URL_LOCAL` | Opcional; segunda opción si no está definida `VITE_API_URL`. |
| `VITE_AUTH_LOGIN_PATH` | Ruta relativa al login para `authService` (por defecto `/usuario/login`). |
| `VITE_ENABLE_SW_DEV` | Si vale `true`, registra el service worker también en modo desarrollo (`main.tsx`). |

En despliegue suele bastar con definir `VITE_API_URL` en el `.env` de build.

## Stack técnico

- React 19 + TypeScript
- Vite
- React Router 7
- TanStack Query
- Axios
- Tailwind CSS
- MUI / Material React Table
- Recharts
- Zustand (sesión persistida)

## Scripts

```bash
npm install
npm run dev
```

- `npm run build`: comprobación TypeScript y build de producción.
- `npm run preview`: sirve el artefacto de producción en local.
- `npm run lint`: ESLint.
