import { AdminUsuariosTable } from '../../features/tables/admin/AdminUsuariosTable'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminUsuariosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de usuarios"
      description="Crea, edita o elimina usuarios del sistema y controla su estado de acceso."
    >
      <AdminUsuariosTable />
    </AdminSectionFrame>
  )
}
