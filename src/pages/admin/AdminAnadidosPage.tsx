import { AdminCatalogTable } from '../../features/tables/admin/AdminCatalogTable'
import { AdminCatalogFiltersForm } from '../../features/forms/admin/AdminCatalogFiltersForm'
import { AdminSectionFrame } from './AdminSectionFrame'

type AnadidoRow = {
  anadido: string
  servicioBase: string
  tiempoExtra: string
  precioExtra: string
  estado: 'Activo' | 'Inactivo'
}

const anadidoRows: AnadidoRow[] = [
  { anadido: 'Lavado premium', servicioBase: 'Corte clásico', tiempoExtra: '10 min', precioExtra: '$4', estado: 'Activo' },
  { anadido: 'Perfilado de ceja', servicioBase: 'Skin fade', tiempoExtra: '8 min', precioExtra: '$3', estado: 'Activo' },
  { anadido: 'Mascarilla facial', servicioBase: 'Arreglo de barba', tiempoExtra: '12 min', precioExtra: '$6', estado: 'Inactivo' },
  { anadido: 'Toalla caliente', servicioBase: 'Corte + barba premium', tiempoExtra: '6 min', precioExtra: '$3', estado: 'Activo' },
]

export function AdminAnadidosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de añadidos"
      description="Configura los añadidos opcionales de cada servicio para ampliar la oferta y ajustar tiempos/precios."
    >
      <AdminCatalogFiltersForm entityLabel="añadido" />
      <AdminCatalogTable<AnadidoRow>
        title="Añadidos por servicio"
        description="Control de extras que se pueden sumar a los servicios base."
        addActionLabel="Agregar añadido"
        columns={[
          { key: 'anadido', label: 'Añadido' },
          { key: 'servicioBase', label: 'Servicio base' },
          { key: 'tiempoExtra', label: 'Tiempo extra' },
          { key: 'precioExtra', label: 'Precio extra' },
          { key: 'estado', label: 'Estado' },
        ]}
        rows={anadidoRows}
      />
    </AdminSectionFrame>
  )
}
