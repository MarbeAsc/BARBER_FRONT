# Sistema de Gestion para Barberia

Aplicacion web para administrar servicios de barberia y agendar citas con control por roles fijos.

## Objetivo del sistema

Centralizar en una sola plataforma:

- La administracion de servicios, perfumes, barberos y relaciones entre ellos.
- La visualizacion de citas programadas para cada barbero.
- La reserva de citas por parte de clientes segun servicio, barbero, fecha y hora.

## Flujo principal del negocio

1. El usuario inicia sesion.
2. El sistema identifica su rol (administrador, barbero o cliente).
3. Se redirige al panel correspondiente.
4. Cada rol solo visualiza la informacion y acciones que le competen.

> Los roles son fijos e inalterables en esta fase del proyecto: `administrador`, `barbero` y `cliente`.

## Roles y responsabilidades

### Administrador

El administrador dispone de un panel para gestionar:

- Servicios.
- Anadidos de los servicios.
- Perfumes.
- Barberos.

Regla clave:

- Cada barbero debe estar relacionado con los servicios que sabe realizar.

### Barbero

El barbero visualiza:

- Sus citas programadas.
- Solo las citas que estan relacionadas con sus servicios asignados.

### Cliente

El cliente puede:

- Ver servicios disponibles.
- Ver que barberos ofrecen cada servicio.
- Elegir fecha y hora en calendario para agendar su cita.

## Modulos funcionales esperados

- **Autenticacion:** inicio de sesion y redireccion por rol.
- **Panel administrador:** CRUD de servicios, anadidos, perfumes y barberos.
- **Relacion barbero-servicio:** asignaciones para definir que puede atender cada barbero.
- **Agenda del barbero:** listado de citas programadas.
- **Reserva del cliente:** seleccion de servicio, barbero, fecha y hora.

## Alcance actual

El enfoque actual prioriza el flujo base por roles sobre un esquema avanzado de permisos.

- Roles fijos para simplificar la operacion inicial.
- Evolucion futura posible hacia permisos granulares por modulo.

## Stack tecnico

- React 19 + TypeScript
- Vite
- React Router
- TanStack Query
- Axios
- Tailwind CSS
- Recharts

## Scripts del proyecto

```bash
npm install
npm run dev
```

Otros scripts:

- `npm run build`: genera build de produccion.
- `npm run preview`: sirve la build localmente.
- `npm run lint`: ejecuta ESLint.

## Nota de producto

Este README documenta el flujo funcional objetivo acordado para la primera version operativa del sistema.
