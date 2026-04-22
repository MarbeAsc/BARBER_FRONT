import { AdminCatalogTable } from '../../features/tables/admin/AdminCatalogTable'
import { AdminCatalogFiltersForm } from '../../features/forms/admin/AdminCatalogFiltersForm'
import { AdminSectionFrame } from './AdminSectionFrame'

type ServicioRow = {
  servicio: string
  categoria: string
  duracion: string
  precio: string
  estado: 'Activo' | 'Inactivo'
}

const servicioRows: ServicioRow[] = [
  { servicio: 'Corte clásico', categoria: 'Cabello', duracion: '30 min', precio: '$12', estado: 'Activo' },
  { servicio: 'Skin fade', categoria: 'Cabello', duracion: '45 min', precio: '$18', estado: 'Activo' },
  { servicio: 'Arreglo de barba', categoria: 'Barba', duracion: '25 min', precio: '$10', estado: 'Activo' },
  { servicio: 'Corte + barba premium', categoria: 'Combo', duracion: '60 min', precio: '$25', estado: 'Inactivo' },
]

export function AdminServiciosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de servicios"
      description="Administra el catálogo principal de servicios de la barbería, incluyendo duración, precio y estado."
    >
      <AdminCatalogFiltersForm entityLabel="servicio" />
      <AdminCatalogTable<ServicioRow>
        title="Servicios registrados"
        description="Catálogo base de servicios disponibles para agendar citas."
        addActionLabel="Agregar servicio"
        columns={[
          { key: 'servicio', label: 'Servicio' },
          { key: 'categoria', label: 'Categoría' },
          { key: 'duracion', label: 'Duración' },
          { key: 'precio', label: 'Precio' },
          { key: 'estado', label: 'Estado' },
        ]}
        rows={servicioRows}
      />
    </AdminSectionFrame>
  )
}
