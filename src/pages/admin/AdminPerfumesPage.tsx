import { AdminCatalogTable } from '../../features/tables/admin/AdminCatalogTable'
import { AdminCatalogFiltersForm } from '../../features/forms/admin/AdminCatalogFiltersForm'
import { AdminSectionFrame } from './AdminSectionFrame'

type PerfumeRow = {
  perfume: string
  marca: string
  aroma: string
  stock: string
  estado: 'Activo' | 'Inactivo'
}

const perfumeRows: PerfumeRow[] = [
  { perfume: 'Gold Oud', marca: 'Barber House', aroma: 'Amaderado', stock: '14 uds', estado: 'Activo' },
  { perfume: 'Fresh Line', marca: 'Studio 91', aroma: 'Cítrico', stock: '8 uds', estado: 'Activo' },
  { perfume: 'Dark Spirit', marca: 'North Blend', aroma: 'Especiado', stock: '3 uds', estado: 'Inactivo' },
  { perfume: 'Ocean Mist', marca: 'Barber House', aroma: 'Acuático', stock: '11 uds', estado: 'Activo' },
]

export function AdminPerfumesPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de perfumes"
      description="Administra perfumes disponibles para cerrar la experiencia de cada servicio en barbería."
    >
      <AdminCatalogFiltersForm entityLabel="perfume" />
      <AdminCatalogTable<PerfumeRow>
        title="Perfumes registrados"
        description="Inventario de perfumes por marca, aroma y disponibilidad."
        addActionLabel="Agregar perfume"
        columns={[
          { key: 'perfume', label: 'Perfume' },
          { key: 'marca', label: 'Marca' },
          { key: 'aroma', label: 'Aroma' },
          { key: 'stock', label: 'Stock' },
          { key: 'estado', label: 'Estado' },
        ]}
        rows={perfumeRows}
      />
    </AdminSectionFrame>
  )
}
