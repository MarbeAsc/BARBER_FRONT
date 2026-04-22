import { AdminAnadidosTable } from '../../features/tables/admin/AdminAnadidosTable'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminAnadidosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de añadidos"
      description="Configura los añadidos opcionales de cada servicio para ampliar la oferta y ajustar tiempos/precios."
    >
      <AdminAnadidosTable />
    </AdminSectionFrame>
  )
}
