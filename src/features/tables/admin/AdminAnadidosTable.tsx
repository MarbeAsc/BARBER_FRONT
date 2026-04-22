import { showNotification } from '../../../lib/notifications'
import { AdminCatalogTable } from './AdminCatalogTable'

type AnadidoRow = {
  anadido: string
  servicioBase: string
  tiempoExtra: string
  precioExtra: string
  estado: 'Activo' | 'Inactivo'
}

const anadidoRows: AnadidoRow[] = [
  { anadido: 'Lavado premium', servicioBase: 'Corte clasico', tiempoExtra: '10 min', precioExtra: '$4', estado: 'Activo' },
  { anadido: 'Perfilado de ceja', servicioBase: 'Skin fade', tiempoExtra: '8 min', precioExtra: '$3', estado: 'Activo' },
  { anadido: 'Mascarilla facial', servicioBase: 'Arreglo de barba', tiempoExtra: '12 min', precioExtra: '$6', estado: 'Inactivo' },
  { anadido: 'Toalla caliente', servicioBase: 'Corte + barba premium', tiempoExtra: '6 min', precioExtra: '$3', estado: 'Activo' },
]

export function AdminAnadidosTable() {
  return (
    <AdminCatalogTable<AnadidoRow>
      title="Anadidos por servicio"
      description="Control de extras que se pueden sumar a los servicios base."
      addActionLabel="Agregar anadido"
      columns={[
        { key: 'anadido', label: 'Anadido' },
        { key: 'servicioBase', label: 'Servicio base' },
        { key: 'tiempoExtra', label: 'Tiempo extra' },
        { key: 'precioExtra', label: 'Precio extra' },
        { key: 'estado', label: 'Estado' },
      ]}
      rows={anadidoRows}
      onAdd={() =>
        showNotification({
          title: 'Anadidos',
          message: 'Abrir formulario para agregar anadido.',
          variant: 'info',
        })
      }
      onEdit={(row) =>
        showNotification({
          title: 'Anadidos',
          message: `Editar anadido: ${row.anadido}.`,
          variant: 'warning',
        })
      }
      onDelete={(row) =>
        showNotification({
          title: 'Anadidos',
          message: `Eliminar anadido: ${row.anadido}.`,
          variant: 'error',
        })
      }
    />
  )
}
