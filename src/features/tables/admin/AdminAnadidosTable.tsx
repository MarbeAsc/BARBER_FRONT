import { showNotification } from '../../../lib/notifications'
import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

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
  const activeCount = anadidoRows.filter((row) => String(row.estado).toLowerCase() === 'activo').length
  const inactiveCount = anadidoRows.length - activeCount
  const columns: MRT_ColumnDef<AnadidoRow>[] = [
    { accessorKey: 'anadido', header: 'Anadido' },
    { accessorKey: 'servicioBase', header: 'Servicio base' },
    { accessorKey: 'tiempoExtra', header: 'Tiempo extra' },
    { accessorKey: 'precioExtra', header: 'Precio extra' },
    { accessorKey: 'estado', header: 'Estado' },
  ]
  const table = useMaterialReactTable({
    columns,
    data: anadidoRows,
    enableRowActions: true,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableDensityToggle: false,
    enableFullScreenToggle: false,
    enableHiding: false,
    enableGlobalFilter: true,
    enableRowSelection: false,
    positionActionsColumn: 'last',
    initialState: { showColumnFilters: true, showGlobalFilter: true, pagination: { pageIndex: 0, pageSize: 5 } },
    paginationDisplayMode: 'pages',
    displayColumnDefOptions: { 'mrt-row-actions': { header: 'Acciones', size: 140 } },
    renderTopToolbarCustomActions: () => (
      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
        Tip: usa filtros para encontrar
      </span>
    ),
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton type="button" variant="ghost" iconOnly tooltip="Editar" aria-label="Editar" className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100" onClick={() => showNotification({ title: 'Anadidos', message: `Editar anadido: ${row.original.anadido}.`, variant: 'warning' })}><FaPen className="h-3.5 w-3.5" /></CustomButton>
        <CustomButton type="button" variant="danger" iconOnly tooltip="Eliminar" aria-label="Eliminar" className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100" onClick={() => showNotification({ title: 'Anadidos', message: `Eliminar anadido: ${row.original.anadido}.`, variant: 'error' })}><FaTrashAlt className="h-3.5 w-3.5" /></CustomButton>
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
    muiTableHeadCellProps: { sx: { backgroundColor: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: '0.74rem', borderBottom: '1px solid #e2e8f0' } },
    muiTableBodyRowProps: ({ row }) => ({ sx: { backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f8fafc', '&:hover td': { backgroundColor: '#eff6ff' } } }),
    muiTableBodyCellProps: { sx: { borderBottom: '1px solid #e2e8f0', fontSize: '0.835rem' } },
    muiSearchTextFieldProps: {
      placeholder: 'Buscar por anadido o servicio base...',
      size: 'small',
      sx: { minWidth: '300px', '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#ffffff' } },
    },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Anadidos por servicio</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Control de extras que se pueden sumar a los servicios base.</p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="text-slate-500">Resumen de extras</span>
            <span className="text-slate-700">{anadidoRows.length} items</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${anadidoRows.length ? (activeCount / anadidoRows.length) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Activos: {activeCount}</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Inactivos: {inactiveCount}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>
    </section>
  )
}
