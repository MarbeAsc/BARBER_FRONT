import { AdminCatalogFiltersForm } from '../../features/forms/admin/AdminCatalogFiltersForm'
import { AdminCatalogTable } from '../../features/tables/admin/AdminCatalogTable'
import { AdminSectionFrame } from './AdminSectionFrame'

type UsuarioRow = {
  nombre: string
  correo: string
  rol: 'Cliente' | 'Barbero' | 'Admin'
  telefono: string
  estado: 'Activo' | 'Inactivo'
}

const usuarioRows: UsuarioRow[] = [
  { nombre: 'Ana Pérez', correo: 'ana.perez@barberia.com', rol: 'Cliente', telefono: '099 111 2233', estado: 'Activo' },
  { nombre: 'Luis Herrera', correo: 'luis.herrera@barberia.com', rol: 'Barbero', telefono: '098 212 3344', estado: 'Activo' },
  { nombre: 'Sofía Mora', correo: 'sofia.mora@barberia.com', rol: 'Cliente', telefono: '097 303 4455', estado: 'Inactivo' },
  { nombre: 'Carlos Admin', correo: 'admin@barberia.com', rol: 'Admin', telefono: '096 454 5566', estado: 'Activo' },
]

export function AdminUsuariosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de usuarios"
      description="Crea, edita o elimina usuarios del sistema y controla su estado de acceso."
    >
      <AdminCatalogFiltersForm entityLabel="usuario" />
      <AdminCatalogTable<UsuarioRow>
        title="Usuarios registrados"
        description="Administración centralizada de cuentas de clientes, barberos y administradores."
        addActionLabel="Agregar usuario"
        columns={[
          { key: 'nombre', label: 'Nombre' },
          { key: 'correo', label: 'Correo', className: 'min-w-56' },
          { key: 'rol', label: 'Rol' },
          { key: 'telefono', label: 'Teléfono' },
          { key: 'estado', label: 'Estado' },
        ]}
        rows={usuarioRows}
      />
    </AdminSectionFrame>
  )
}
