import { showNotification } from '../../../lib/notifications'
import { AdminCatalogTable } from './AdminCatalogTable'

type BarberoRow = {
  barbero: string
  especialidad: string
  serviciosAsignados: string
  experiencia: string
  estado: 'Activo' | 'Inactivo'
}

const barberoRows: BarberoRow[] = [
  {
    barbero: 'Luis Herrera',
    especialidad: 'Fade y diseno',
    serviciosAsignados: 'Skin fade, Corte clasico',
    experiencia: '5 anos',
    estado: 'Activo',
  },
  {
    barbero: 'Jorge Paredes',
    especialidad: 'Barba premium',
    serviciosAsignados: 'Arreglo de barba, Corte + barba premium',
    experiencia: '7 anos',
    estado: 'Activo',
  },
  {
    barbero: 'Dario Campos',
    especialidad: 'Corte clasico',
    serviciosAsignados: 'Corte clasico',
    experiencia: '3 anos',
    estado: 'Inactivo',
  },
  {
    barbero: 'Marco Solis',
    especialidad: 'Estilo urbano',
    serviciosAsignados: 'Skin fade, Arreglo de barba',
    experiencia: '4 anos',
    estado: 'Activo',
  },
]

export function AdminBarberosTable() {
  return (
    <AdminCatalogTable<BarberoRow>
      title="Barberos y servicios"
      description="Asignacion entre barberos y catalogo de servicios habilitados."
      addActionLabel="Agregar barbero"
      columns={[
        { key: 'barbero', label: 'Barbero' },
        { key: 'especialidad', label: 'Especialidad' },
        { key: 'serviciosAsignados', label: 'Servicios asignados', className: 'min-w-56' },
        { key: 'experiencia', label: 'Experiencia' },
        { key: 'estado', label: 'Estado' },
      ]}
      rows={barberoRows}
      onAdd={() =>
        showNotification({
          title: 'Barberos',
          message: 'Abrir formulario para agregar barbero.',
          variant: 'info',
        })
      }
      onEdit={(row) =>
        showNotification({
          title: 'Barberos',
          message: `Editar barbero: ${row.barbero}.`,
          variant: 'warning',
        })
      }
      onDelete={(row) =>
        showNotification({
          title: 'Barberos',
          message: `Eliminar barbero: ${row.barbero}.`,
          variant: 'error',
        })
      }
    />
  )
}
