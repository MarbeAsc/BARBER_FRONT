import { AdminBarberosTable } from '../../features/tables/admin/AdminBarberosTable'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminBarberosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de barberos"
      description="Registra barberos y relaciona cada perfil con los servicios que sabe realizar."
    >
      <AdminBarberosTable />
    </AdminSectionFrame>
  )
}
