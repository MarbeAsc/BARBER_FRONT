import { showNotification } from '../../../lib/notifications'
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

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

function statusBadge(value: unknown) {
  const source = String(value ?? '').toLowerCase()
  const active = source === 'activo' || source === 'true'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700'
      }`}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

export function AdminServiciosTable() {
  const activeCount = servicioRows.filter((row) => String(row.estado).toLowerCase() === 'activo').length
  const inactiveCount = servicioRows.length - activeCount

  const columns: MRT_ColumnDef<ServicioRow>[] = [
    { accessorKey: 'servicio', header: 'Servicio' },
    { accessorKey: 'categoria', header: 'Categoria' },
    { accessorKey: 'duracion', header: 'Duracion' },
    { accessorKey: 'precio', header: 'Precio' },
    {
      accessorKey: 'estado',
      header: 'Estado',
      Cell: ({ row }) => statusBadge(row.original.estado),
    },
  ]

  const table = useMaterialReactTable({
    columns,
    data: servicioRows,
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
      <div className="flex flex-wrap items-center gap-2">
        <CustomButton
          type="button"
          variant="primary"
          leftIcon={<FaPlus className="h-3.5 w-3.5" />}
          tooltip="Agregar servicio"
          className="rounded-xl"
          onClick={() =>
            showNotification({
              title: 'Servicios',
              message: 'Abrir formulario para agregar servicio.',
              variant: 'info',
            })
          }
        >
          Agregar servicio
        </CustomButton>
        <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
          Tip: usa filtros para encontrar rapido
        </span>
      </div>
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
          onClick={() =>
            showNotification({
              title: 'Servicios',
              message: `Editar servicio: ${row.original.servicio}.`,
              variant: 'warning',
            })
          }
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
          onClick={() =>
            showNotification({
              title: 'Servicios',
              message: `Eliminar servicio: ${row.original.servicio}.`,
              variant: 'error',
            })
          }
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
      placeholder: 'Buscar por nombre, categoria o estado...',
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
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Servicios registrados</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">
              Catalogo base de servicios disponibles para agendar citas.
            </p>
          </div>
        </div>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Total</p>
            <p className="text-base font-semibold text-slate-900">{servicioRows.length}</p>
          </article>
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2">
            <p className="text-emerald-700">Activos</p>
            <p className="text-base font-semibold text-emerald-800">{activeCount}</p>
          </article>
          <article className="rounded-lg border border-blue-200 bg-blue-50/70 px-3 py-2">
            <p className="text-blue-700">Inactivos</p>
            <p className="text-base font-semibold text-blue-800">{inactiveCount}</p>
          </article>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>
    </section>
  )
}
