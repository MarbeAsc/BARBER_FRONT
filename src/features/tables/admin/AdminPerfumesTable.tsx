import { showNotification } from '../../../lib/notifications'
import { AdminCatalogTable } from './AdminCatalogTable'

type PerfumeRow = {
  perfume: string
  marca: string
  aroma: string
  stock: string
  estado: 'Activo' | 'Inactivo'
}

const perfumeRows: PerfumeRow[] = [
  { perfume: 'Gold Oud', marca: 'Barber House', aroma: 'Amaderado', stock: '14 uds', estado: 'Activo' },
  { perfume: 'Fresh Line', marca: 'Studio 91', aroma: 'Citrico', stock: '8 uds', estado: 'Activo' },
  { perfume: 'Dark Spirit', marca: 'North Blend', aroma: 'Especiado', stock: '3 uds', estado: 'Inactivo' },
  { perfume: 'Ocean Mist', marca: 'Barber House', aroma: 'Acuatico', stock: '11 uds', estado: 'Activo' },
]

export function AdminPerfumesTable() {
  return (
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
      onAdd={() =>
        showNotification({
          title: 'Perfumes',
          message: 'Abrir formulario para agregar perfume.',
          variant: 'info',
        })
      }
      onEdit={(row) =>
        showNotification({
          title: 'Perfumes',
          message: `Editar perfume: ${row.perfume}.`,
          variant: 'warning',
        })
      }
      onDelete={(row) =>
        showNotification({
          title: 'Perfumes',
          message: `Eliminar perfume: ${row.perfume}.`,
          variant: 'error',
        })
      }
    />
  )
}
