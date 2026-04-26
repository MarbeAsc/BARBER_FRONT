
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'
import { useCitasByUserQuery } from '@/hooks/useCitas'
import type { CitaDetalladaDTO, ServicioCitaDetalladoDTO } from '@/services/citaService'
import { useMemo } from 'react'

type BookingRow = {
  nombreCliente: string
  nombrebarbero: string
  fechaiInicio: string
  fechaTermino: string
  servicios: string
  estatusDescripcion: string
}

type ClienteBookingsTableProps = {
  idUser: number
  onEdit?: (row: BookingRow) => void
  onDelete?: (row: BookingRow) => void
}

function badgeClass(status: BookingRow['estatusDescripcion']) {
  if (status === 'Confirmada') return 'bg-emerald-100 text-emerald-700'
  if (status === 'Reprogramada') return 'bg-blue-100 text-blue-700'
  return 'bg-blue-100 text-blue-700'
}

function formatDate(value?: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date)
}



function mapEstado(estatusDescripcion?: string): BookingRow['estatusDescripcion'] {
  const normalized = estatusDescripcion?.trim().toLowerCase() ?? ''
  if (normalized.includes('confirm')) return 'Confirmada'
  if (normalized.includes('reprogram')) return 'Reprogramada'
  return 'Pendiente'
}
function normalizeRows(payload?: CitaDetalladaDTO[] | null): BookingRow[] {
  if (!payload || payload.length === 0) return []

  return payload.flatMap((cita) => {
    const servicios = cita.servicios ?? []

    if (servicios.length === 0) {
      return [
        {
          nombreCliente: cita.nombreCliente?.trim() || 'Sin cliente',
          nombrebarbero: 'Sin barbero',
          fechaiInicio: formatDate(cita.fechaInicio),
          fechaTermino: formatDate(cita.fechaTermino),
          servicios: 'Sin servicio',
          estatusDescripcion: cita.estatusDescripcion?.trim() || 'Sin estado',
        },
      ]
    }

    return servicios.map((servicio: ServicioCitaDetalladoDTO) => ({
      nombreCliente: cita.nombreCliente?.trim() || 'Sin cliente',
      nombrebarbero: servicio.nombreBarbero?.trim() || 'Sin barbero',
      fechaiInicio: formatDate(cita.fechaInicio),
      fechaTermino: formatDate(cita.fechaTermino),
      servicios: servicio.nombreServicio?.trim() || 'Sin servicio',
      estatusDescripcion: cita.estatusDescripcion?.trim() || 'Sin estado',
    }))
  })
}
export function ClienteBookingsTable({ idUser }: ClienteBookingsTableProps) {
  const { data, isPending, isError, error, refetch } = useCitasByUserQuery(idUser, {
    enabled: Number.isFinite(idUser) && idUser > 0,
  })
  const rows = useMemo(() => normalizeRows(data as CitaDetalladaDTO[]), [data])

  const columns: MRT_ColumnDef<BookingRow>[] = [
    { accessorKey: 'nombreCliente', header: 'Cliente' },
    { accessorKey: 'nombrebarbero', header: 'Barbero' },
    { accessorKey: 'fechaiInicio', header: 'Fecha inicio' },
    { accessorKey: 'fechaTermino', header: 'Fecha fin' },
    { accessorKey: 'servicios', header: 'Servicio' },
    {
      accessorKey: 'estatusDescripcion',
      header: 'Estado',
      Cell: ({ row }) => (
        <span
          className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(
            mapEstado(row.original.estatusDescripcion)
          )}`}
        >
          {row.original.estatusDescripcion}
        </span>
      ),
    },
  ]

  const table = useMaterialReactTable({
    columns,
    data: rows,
    state: { isLoading: isPending, showProgressBars: isPending },
    enableColumnActions: false,
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableGlobalFilter: true,
    enableRowActions: false,
    enableRowSelection: false,
    positionActionsColumn: 'last',
    initialState: {
      showColumnFilters: false,
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
      <span className="rounded-full border border-indigo-200 bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
        Tip: usa filtros para encontrar
      </span>
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
        borderRadius: '1rem',
        overflow: 'hidden',
        boxShadow: '0 16px 35px -28px rgba(59, 130, 246, 0.45)',
      },
    },
    muiTopToolbarProps: {
      sx: {
        background: 'linear-gradient(90deg, rgba(238,242,255,0.88) 0%, rgba(255,255,255,0.95) 60%, rgba(241,245,249,0.9) 100%)',
        borderBottom: '1px solid #e2e8f0',
        px: '0.9rem',
        py: '0.4rem',
        minHeight: '3.2rem',
      },
    },
    muiTableHeadCellProps: {
      sx: {
        backgroundColor: '#eef2ff',
        color: '#1e293b',
        fontWeight: 700,
        fontSize: '0.75rem',
        borderBottom: '1px solid #e2e8f0',
        position: 'sticky',
        top: 0,
        zIndex: 2,
      },
    },
    muiTableBodyRowProps: ({ row }) => ({
      sx: {
        backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f8fafc',
        transition: 'all .18s ease',
        '&:hover td': { backgroundColor: '#e9efff' },
        '&:hover': { transform: 'translateY(-1px)', boxShadow: '0 8px 18px -16px rgba(79,70,229,.8)' },
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
          borderRadius: '999px',
          backgroundColor: '#ffffff',
          border: '1px solid #e2e8f0',
          boxShadow: '0 1px 0 rgba(15,23,42,.02)',
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
    <section className="rounded-3xl border border-slate-200/80 bg-linear-to-br from-white via-white to-indigo-50/20 shadow-sm shadow-blue-100/40">
      <div className="border-b border-slate-200 bg-linear-to-r from-slate-50 via-white to-indigo-50/50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Mis reservas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Consulta y da seguimiento a tus citas agendadas.
        </p>
        {isError ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            <p>{error instanceof Error ? error.message : 'No se pudo cargar el listado de citas.'}</p>
            <CustomButton type="button" variant="secondary" size="sm" className="mt-2 rounded-lg" onClick={() => void refetch()}>
              Reintentar
            </CustomButton>
          </div>
        ) : null}
        <div className="mt-4 rounded-2xl border border-slate-200 bg-white/90 p-3 shadow-sm">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="text-slate-500">Resumen de reservas</span>
            <span className="text-slate-700">{rows.length} citas</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-blue-600"
              style={{ width: `${rows.length ? (rows.filter((row) => row.estatusDescripcion === 'Confirmada').length / rows.length) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-blue-50/80 px-2.5 py-1 text-blue-600">
              Confirmadas: {rows.filter((row) => row.estatusDescripcion === 'Confirmada').length}
            </span>
            <span className="rounded-full bg-indigo-50/80 px-2.5 py-1 text-indigo-600">
              Pendientes/Reprogramadas: {rows.filter((row) => row.estatusDescripcion === 'Pendiente' || row.estatusDescripcion === 'Reprogramada').length}
            </span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>
    </section>
  )
}
