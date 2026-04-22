import { showNotification } from '../../../lib/notifications'
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

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
  const activeCount = barberoRows.filter((row) => String(row.estado).toLowerCase() === 'activo').length
  const inactiveCount = barberoRows.length - activeCount
  const columns: MRT_ColumnDef<BarberoRow>[] = [
    { accessorKey: 'barbero', header: 'Barbero' },
    { accessorKey: 'especialidad', header: 'Especialidad' },
    { accessorKey: 'serviciosAsignados', header: 'Servicios asignados' },
    { accessorKey: 'experiencia', header: 'Experiencia' },
    { accessorKey: 'estado', header: 'Estado' },
  ]
  const table = useMaterialReactTable({
    columns,
    data: barberoRows,
    enableRowActions: true,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    positionActionsColumn: 'last',
    initialState: { showColumnFilters: true, showGlobalFilter: true, pagination: { pageIndex: 0, pageSize: 5 } },
    paginationDisplayMode: 'pages',
    renderTopToolbarCustomActions: () => (
      <CustomButton type="button" variant="primary" leftIcon={<FaPlus className="h-3.5 w-3.5" />} className="rounded-xl" onClick={() => showNotification({ title: 'Barberos', message: 'Abrir formulario para agregar barbero.', variant: 'info' })}>
        Agregar barbero
      </CustomButton>
    ),
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton type="button" variant="ghost" iconOnly tooltip="Editar" aria-label="Editar" className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100" onClick={() => showNotification({ title: 'Barberos', message: `Editar barbero: ${row.original.barbero}.`, variant: 'warning' })}><FaPen className="h-3.5 w-3.5" /></CustomButton>
        <CustomButton type="button" variant="danger" iconOnly tooltip="Eliminar" aria-label="Eliminar" className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100" onClick={() => showNotification({ title: 'Barberos', message: `Eliminar barbero: ${row.original.barbero}.`, variant: 'error' })}><FaTrashAlt className="h-3.5 w-3.5" /></CustomButton>
      </div>
    ),
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Barberos y servicios</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Asignacion entre barberos y catalogo de servicios habilitados.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-slate-500">Total</p><p className="text-base font-semibold text-slate-900">{barberoRows.length}</p></article>
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2"><p className="text-emerald-700">Activos</p><p className="text-base font-semibold text-emerald-800">{activeCount}</p></article>
          <article className="rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2"><p className="text-blue-700">Inactivos</p><p className="text-base font-semibold text-blue-800">{inactiveCount}</p></article>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>
    </section>
  )
}
