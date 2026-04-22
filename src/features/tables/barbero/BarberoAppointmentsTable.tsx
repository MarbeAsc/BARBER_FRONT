import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

type AppointmentRow = {
  hora: string
  cliente: string
  servicio: string
  duracion: string
  estado: 'Pendiente' | 'Confirmada' | 'En curso' | 'Finalizada'
}

type BarberoAppointmentsTableProps = {
  rows: AppointmentRow[]
  onEdit?: (row: AppointmentRow) => void
  onDelete?: (row: AppointmentRow) => void
}

function badgeClass(status: AppointmentRow['estado']) {
  if (status === 'Finalizada') return 'bg-slate-200 text-slate-700'
  if (status === 'En curso') return 'bg-blue-100 text-blue-700'
  if (status === 'Confirmada') return 'bg-emerald-100 text-emerald-700'
  return 'bg-blue-100 text-blue-700'
}

export function BarberoAppointmentsTable({ rows, onEdit, onDelete }: BarberoAppointmentsTableProps) {
  const columns: MRT_ColumnDef<AppointmentRow>[] = [
    { accessorKey: 'hora', header: 'Hora' },
    { accessorKey: 'cliente', header: 'Cliente' },
    { accessorKey: 'servicio', header: 'Servicio' },
    { accessorKey: 'duracion', header: 'Duracion' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      Cell: ({ row }) => (
        <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(row.original.estado)}`}>
          {row.original.estado}
        </span>
      ),
    },
  ]

  const table = useMaterialReactTable({
    columns,
    data: rows,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableGlobalFilter: true,
    enableRowActions: true,
    enableRowSelection: false,
    positionActionsColumn: 'last',
    initialState: {
      showColumnFilters: true,
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    paginationDisplayMode: 'pages',
    displayColumnDefOptions: {
      'mrt-row-actions': {
        header: 'Acciones',
        size: 140,
      },
    },
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton
          type="button"
          variant="ghost"
          iconOnly
          tooltip="Editar"
          aria-label="Editar"
          className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100"
          onClick={() => onEdit?.(row.original)}
        >
          <FaPen className="h-3.5 w-3.5" />
        </CustomButton>
        <CustomButton
          type="button"
          variant="danger"
          iconOnly
          tooltip="Eliminar"
          aria-label="Eliminar"
          className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100"
          onClick={() => onDelete?.(row.original)}
        >
          <FaTrashAlt className="h-3.5 w-3.5" />
        </CustomButton>
      </div>
    ),
    localization: {
      actions: 'Acciones',
      noRecordsToDisplay: 'No hay registros para mostrar',
      noResultsFound: 'No se encontraron resultados',
      search: 'Buscar',
      showHideFilters: 'Mostrar/Ocultar filtros',
      rowsPerPage: 'Filas por pagina',
      of: 'de',
    },
    muiTablePaperProps: {
      elevation: 0,
      sx: {
        border: '1px solid #e2e8f0',
        borderRadius: '0.75rem',
        overflow: 'hidden',
      },
    },
    muiPaginationProps: {
      rowsPerPageOptions: [5, 10, 20],
      showFirstButton: true,
      showLastButton: true,
    },
  })

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Citas programadas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Solo se muestran citas relacionadas con tus servicios asignados.
        </p>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>
    </section>
  )
}
