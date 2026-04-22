# Sistema de Gestion para Barberia

Aplicacion web para administrar una barberia con tres perfiles de uso: `admin`, `barbero` y `cliente`.

## Objetivo del sistema

Centralizar en una sola plataforma:

- Administracion de servicios, anadidos, perfumes y barberos.
- Visualizacion de citas para el barbero.
- Reserva de citas para el cliente por servicio, barbero, fecha y hora.

## Flujo principal

1. El usuario inicia sesion.
2. El sistema valida autenticacion.
3. El sistema infiere rol por email.
4. Se habilitan solo las rutas correspondientes a ese rol.

## Roles y responsabilidades

### Admin

- Gestion de servicios.
- Gestion de anadidos.
- Gestion de perfumes.
- Gestion de barberos.

### Barbero

- Visualiza sus citas asignadas.
- Gestiona disponibilidad/bloqueos segun flujo actual.

### Cliente

- Consulta servicios disponibles.
- Selecciona barbero por servicio.
- Agenda reservas por fecha y hora.

## Estructura del proyecto

Estructura principal por capas:

```txt
src/
  components/         # Layouts, UI reutilizable, guards de ruta
  context/            # Estado global (auth)
  features/           # Formularios, tablas y modales por dominio/rol
    forms/
    tables/
    modals/
  layouts/            # Estructuras base de paginas
  lib/                # Utilidades (roles, registro SW)
  pages/              # Vistas por modulo y rol
    admin/
    barbero/
    cliente/
  providers/          # Providers de app (router/query/auth)
  router.tsx          # Mapa central de rutas y protecciones
public/
  manifest.webmanifest
  sw.js
```

## Enrutado y proteccion de rutas

La app usa proteccion por autenticacion y por rol:

- `src/components/ProtectedRoute.tsx`
  - Si no hay sesion, redirige a `/login`.
- `src/components/RoleRoute.tsx`
  - Restringe rutas por rol permitido (`allow`).
- `src/router.tsx`
  - Rutas publicas: `login`, `register`, `forgot-password`, `contacto`.
  - Rutas privadas bajo `ProtectedRoute`.
  - Rutas por rol:
    - `admin`: `/servicios`, `/anadidos`, `/perfumes`, `/barberos`
    - `barbero`: `/mis-citas`
    - `cliente`: `/mis-reservas`

## Implementacion PWA (nuevas mejoras)

Se agrego soporte PWA con funcionamiento offline basico:

- `index.html`
  - `manifest`, `theme-color` y metadatos para instalacion en moviles.
- `public/manifest.webmanifest`
  - Configuracion de instalacion (`name`, `short_name`, `display`, `scope`, `start_url`, colores, icono).
- `src/lib/registerServiceWorker.ts`
  - Registro del service worker.
- `public/sw.js`
  - Cache de app shell.
  - Estrategia para navegacion SPA con fallback offline a `index.html`.
  - Cache dinamico de recursos GET del mismo origen.
  - Manejo especial para modulos en desarrollo (`/src` y `/@fs`) para evitar fallos por query params dinamicos.

### Consideraciones offline

- La app debe abrirse al menos una vez con conexion para poblar cache.
- Si no hay internet, la navegacion entre rutas ya cacheadas sigue funcionando.
- En `npm run dev`, los errores de WebSocket de Vite HMR en offline son esperados y no representan fallo funcional de la PWA.
- La validacion real de PWA se recomienda con `build + preview`.

## Stack tecnico

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- MUI / Material React Table
- Recharts

## Scripts

```bash
npm install
npm run dev
```

Scripts adicionales:

- `npm run build`: genera build de produccion.
- `npm run preview`: sirve build de produccion local.
- `npm run lint`: ejecuta ESLint.
