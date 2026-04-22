import { AdminPerfumesTable } from '../../features/tables/admin/AdminPerfumesTable'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminPerfumesPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de perfumes"
      description="Administra perfumes disponibles para cerrar la experiencia de cada servicio en barbería."
    >
      <AdminPerfumesTable />
    </AdminSectionFrame>
  )
}
