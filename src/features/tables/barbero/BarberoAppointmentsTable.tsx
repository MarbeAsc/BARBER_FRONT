import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'
import { useCitasByBarberoQuery } from '@/hooks/useCitas'
import type { CitaDTO } from '@/services/citaService'
import { useMemo } from 'react'


type AppointmentRow = {
  id: number
  hora: string
  fecha: string
  cliente: string
  servicio: string
  total: string
  estado: 'Pendiente' | 'Confirmada' | 'En curso' | 'Finalizada'
}

type BarberoAppointmentsTableProps = {
  idBarbero: number
  onEdit?: (row: AppointmentRow) => void
  onDelete?: (row: AppointmentRow) => void
}

function formatDate(value?: string) {
  if (!value) return 'Sin fecha'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium' }).format(date)
}

function formatHour(value?: string) {
  if (!value) return 'Sin hora'
  const date = new Date(value)
  if (Number.isNaN(date.getTime())) return 'Sin hora'
  return new Intl.DateTimeFormat('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }).format(date)
}

function formatCurrency(value?: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value ?? 0)
}

function mapEstatusByCode(estatus?: number | null): AppointmentRow['estado'] {
  if (estatus === 3) return 'Finalizada'
  if (estatus === 2) return 'En curso'
  if (estatus === 1) return 'Confirmada'
  return 'Pendiente'
}

function badgeClass(status: AppointmentRow['estado']) {
  if (status === 'Finalizada') return 'bg-slate-200 text-slate-700'
  if (status === 'En curso') return 'bg-blue-100 text-blue-700'
  if (status === 'Confirmada') return 'bg-emerald-100 text-emerald-700'
  return 'bg-blue-100 text-blue-700'
}

export function BarberoAppointmentsTable({ idBarbero, onEdit, onDelete }: BarberoAppointmentsTableProps) {
  const { data, isPending, isError, error, refetch } = useCitasByBarberoQuery(idBarbero, {
    enabled: Number.isFinite(idBarbero) && idBarbero > 0,
  })
  const rows = useMemo(() => {
    if (!data) return []

    const cita = data as CitaDTO
    return [
      {
        id: cita.id,
        hora: formatHour(cita.fechaInicio),
        fecha: formatDate(cita.fechaInicio),
        cliente: cita.idCliente ? `Cliente #${cita.idCliente}` : 'Sin cliente',
        servicio: 'Sin servicio',
        total: formatCurrency(0),
        estado: mapEstatusByCode(cita.estatus),
      },
    ]
  }, [data])

  const activeCount = rows.filter((row) => row.estado === 'Confirmada' || row.estado === 'En curso').length
  const pendingCount = rows.filter((row) => row.estado === 'Pendiente').length
  const completedCount = rows.filter((row) => row.estado === 'Finalizada').length

  const columns: MRT_ColumnDef<AppointmentRow>[] = [
    { accessorKey: 'fecha', header: 'Fecha' },
    { accessorKey: 'hora', header: 'Hora' },
    { accessorKey: 'cliente', header: 'Cliente' },
    { accessorKey: 'servicio', header: 'Servicio' },
    { accessorKey: 'total', header: 'Total' },
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
    state: { isLoading: isPending, showProgressBars: isPending },
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
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton
          type="button"
          variant="ghost"
          iconOnly
          tooltip="Editar"
          aria-label="Editar"
          className="h-8 w-8 rounded-md border border-transparent bg-slate-100/80 text-slate-500 transition hover:border-blue-200 hover:bg-blue-50/70 hover:text-blue-700"
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
          className="h-8 w-8 rounded-md border border-transparent bg-slate-100/80 text-slate-500 transition hover:border-rose-200 hover:bg-rose-50/70 hover:text-rose-700"
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
      placeholder: 'Buscar por cliente, servicio o estado...',
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
        <h2 className="text-lg font-semibold text-slate-900">Citas programadas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Solo se muestran citas relacionadas con tus servicios asignados.
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
            <span className="text-slate-500">Resumen de agenda</span>
            <span className="text-slate-700">{rows.length} citas</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 via-indigo-500 to-blue-600"
              style={{ width: `${rows.length ? (activeCount / rows.length) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-blue-50/80 px-2.5 py-1 text-blue-600">Activas: {activeCount}</span>
            <span className="rounded-full bg-indigo-50/80 px-2.5 py-1 text-indigo-600">
              Pendientes/Finalizadas: {pendingCount + completedCount}
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
