import { showNotification } from '../../../lib/notifications'
import { AdminCatalogTable } from './AdminCatalogTable'

type UsuarioRow = {
  nombre: string
  correo: string
  rol: 'Cliente' | 'Barbero' | 'Admin'
  telefono: string
  estado: 'Activo' | 'Inactivo'
}

const usuarioRows: UsuarioRow[] = [
  { nombre: 'Ana Perez', correo: 'ana.perez@barberia.com', rol: 'Cliente', telefono: '099 111 2233', estado: 'Activo' },
  { nombre: 'Luis Herrera', correo: 'luis.herrera@barberia.com', rol: 'Barbero', telefono: '098 212 3344', estado: 'Activo' },
  { nombre: 'Sofia Mora', correo: 'sofia.mora@barberia.com', rol: 'Cliente', telefono: '097 303 4455', estado: 'Inactivo' },
  { nombre: 'Carlos Admin', correo: 'admin@barberia.com', rol: 'Admin', telefono: '096 454 5566', estado: 'Activo' },
]

export function AdminUsuariosTable() {
  return (
    <AdminCatalogTable<UsuarioRow>
      title="Usuarios registrados"
      description="Administracion centralizada de cuentas de clientes, barberos y administradores."
      addActionLabel="Agregar usuario"
      columns={[
        { key: 'nombre', label: 'Nombre' },
        { key: 'correo', label: 'Correo', className: 'min-w-56' },
        { key: 'rol', label: 'Rol' },
        { key: 'telefono', label: 'Telefono' },
        { key: 'estado', label: 'Estado' },
      ]}
      rows={usuarioRows}
      onAdd={() =>
        showNotification({
          title: 'Usuarios',
          message: 'Abrir formulario para agregar usuario.',
          variant: 'info',
        })
      }
      onEdit={(row) =>
        showNotification({
          title: 'Usuarios',
          message: `Editar usuario: ${row.nombre}.`,
          variant: 'warning',
        })
      }
      onDelete={(row) =>
        showNotification({
          title: 'Usuarios',
          message: `Eliminar usuario: ${row.nombre}.`,
          variant: 'error',
        })
      }
    />
  )
}
