import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

type BookingRow = {
  servicio: string
  barbero: string
  fecha: string
  hora: string
  estado: 'Confirmada' | 'Pendiente' | 'Reprogramada'
}

type ClienteBookingsTableProps = {
  rows: BookingRow[]
  onEdit?: (row: BookingRow) => void
  onDelete?: (row: BookingRow) => void
}

function badgeClass(status: BookingRow['estado']) {
  if (status === 'Confirmada') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Reprogramada') return 'bg-blue-100 text-blue-700'
  return 'bg-blue-100 text-blue-700'
}

export function ClienteBookingsTable({ rows, onEdit, onDelete }: ClienteBookingsTableProps) {
  const confirmedCount = rows.filter((row) => row.estado === 'Confirmada').length
  const pendingCount = rows.filter((row) => row.estado === 'Pendiente').length
  const rescheduledCount = rows.filter((row) => row.estado === 'Reprogramada').length

  const columns: MRT_ColumnDef<BookingRow>[] = [
    { accessorKey: 'servicio', header: 'Servicio' },
    { accessorKey: 'barbero', header: 'Barbero' },
    { accessorKey: 'fecha', header: 'Fecha' },
    { accessorKey: 'hora', header: 'Hora' },
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
    renderTopToolbarCustomActions: () => (
      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
        Tip: revisa estado y fecha antes de editar
      </span>
    ),
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
        border: '1px solid #dbe4f0',
        borderRadius: '0.9rem',
        overflow: 'hidden',
        boxShadow: '0 8px 28px -20px rgba(37, 99, 235, 0.35)',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, rgba(239,246,255,0.7) 0%, rgba(248,250,252,0.7) 100%)',
        borderBottom: '1px solid #e2e8f0',
        px: '0.75rem',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#f8fafc',
        color: '#334155',
        fontWeight: 700,
        fontSize: '0.74rem',
        borderBottom: '1px solid #e2e8f0',
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f8fafc',
        '&:hover td': {
          backgroundColor: '#eff6ff',
        },
      },
    }),
    muiTableBodyCellProps: {
      sx: {
        borderBottom: '1px solid #e2e8f0',
        fontSize: '0.835rem',
      },
    },
    muiSearchTextFieldProps: {
      placeholder: 'Buscar por servicio, barbero o fecha...',
      size: 'small',
      sx: {
        minWidth: '300px',
        '& .MuiOutlinedInput-root': {
          borderRadius: '12px',
          backgroundColor: '#ffffff',
        },
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
        <h2 className="text-lg font-semibold text-slate-900">Mis reservas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Consulta y da seguimiento a tus citas agendadas.
        </p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Total</p>
            <p className="text-base font-semibold text-slate-900">{rows.length}</p>
          </article>
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2">
            <p className="text-emerald-700">Confirmadas</p>
            <p className="text-base font-semibold text-emerald-800">{confirmedCount}</p>
          </article>
          <article className="rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2">
            <p className="text-blue-700">Pendientes/Reprogramadas</p>
            <p className="text-base font-semibold text-blue-800">{pendingCount + rescheduledCount}</p>
          </article>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>
    </section>
  )
}
