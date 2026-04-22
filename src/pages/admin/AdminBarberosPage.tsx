import { AdminCatalogTable } from '../../features/tables/admin/AdminCatalogTable'
import { AdminCatalogFiltersForm } from '../../features/forms/admin/AdminCatalogFiltersForm'
import { AdminSectionFrame } from './AdminSectionFrame'

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
    especialidad: 'Fade y diseño',
    serviciosAsignados: 'Skin fade, Corte clásico',
    experiencia: '5 años',
    estado: 'Activo',
  },
  {
    barbero: 'Jorge Paredes',
    especialidad: 'Barba premium',
    serviciosAsignados: 'Arreglo de barba, Corte + barba premium',
    experiencia: '7 años',
    estado: 'Activo',
  },
  {
    barbero: 'Darío Campos',
    especialidad: 'Corte clásico',
    serviciosAsignados: 'Corte clásico',
    experiencia: '3 años',
    estado: 'Inactivo',
  },
  {
    barbero: 'Marco Solís',
    especialidad: 'Estilo urbano',
    serviciosAsignados: 'Skin fade, Arreglo de barba',
    experiencia: '4 años',
    estado: 'Activo',
  },
]

export function AdminBarberosPage() {
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de barberos"
      description="Registra barberos y relaciona cada perfil con los servicios que sabe realizar."
    >
      <AdminCatalogFiltersForm entityLabel="barbero" />
      <AdminCatalogTable<BarberoRow>
        title="Barberos y servicios"
        description="Asignación entre barberos y catálogo de servicios habilitados."
        addActionLabel="Agregar barbero"
        columns={[
          { key: 'barbero', label: 'Barbero' },
          { key: 'especialidad', label: 'Especialidad' },
          { key: 'serviciosAsignados', label: 'Servicios asignados', className: 'min-w-56' },
          { key: 'experiencia', label: 'Experiencia' },
          { key: 'estado', label: 'Estado' },
        ]}
        rows={barberoRows}
      />
    </AdminSectionFrame>
  )
}
