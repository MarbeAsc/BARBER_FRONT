import { showNotification } from '../../../lib/notifications'
import { AdminCatalogTable } from './AdminCatalogTable'

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

export function AdminServiciosTable() {
  return (
    <AdminCatalogTable<ServicioRow>
      title="Servicios registrados"
      description="Catalogo base de servicios disponibles para agendar citas."
      addActionLabel="Agregar servicio"
      columns={[
        { key: 'servicio', label: 'Servicio' },
        { key: 'categoria', label: 'Categoria' },
        { key: 'duracion', label: 'Duracion' },
        { key: 'precio', label: 'Precio' },
        { key: 'estado', label: 'Estado' },
      ]}
      rows={servicioRows}
      onAdd={() =>
        showNotification({
          title: 'Servicios',
          message: 'Abrir formulario para agregar servicio.',
          variant: 'info',
        })
      }
      onEdit={(row) =>
        showNotification({
          title: 'Servicios',
          message: `Editar servicio: ${row.servicio}.`,
          variant: 'warning',
        })
      }
      onDelete={(row) =>
        showNotification({
          title: 'Servicios',
          message: `Eliminar servicio: ${row.servicio}.`,
          variant: 'error',
        })
      }
    />
  )
}
