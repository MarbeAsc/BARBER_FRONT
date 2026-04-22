import { AdminServiciosTable } from '../../features/tables/admin/AdminServiciosTable'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminServiciosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de servicios"
      description="Administra el catálogo principal de servicios de la barbería, incluyendo duración, precio y estado."
    >
      <AdminServiciosTable />
    </AdminSectionFrame>
  )
}
