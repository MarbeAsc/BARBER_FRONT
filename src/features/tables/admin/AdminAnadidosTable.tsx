import { showNotification } from '../../../lib/notifications'
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa'
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
    enableGlobalFilter: true,
    positionActionsColumn: 'last',
    initialState: { showColumnFilters: true, showGlobalFilter: true, pagination: { pageIndex: 0, pageSize: 5 } },
    paginationDisplayMode: 'pages',
    renderTopToolbarCustomActions: () => (
      <CustomButton type="button" variant="primary" leftIcon={<FaPlus className="h-3.5 w-3.5" />} className="rounded-xl" onClick={() => showNotification({ title: 'Anadidos', message: 'Abrir formulario para agregar anadido.', variant: 'info' })}>
        Agregar anadido
      </CustomButton>
    ),
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton type="button" variant="ghost" iconOnly tooltip="Editar" aria-label="Editar" className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100" onClick={() => showNotification({ title: 'Anadidos', message: `Editar anadido: ${row.original.anadido}.`, variant: 'warning' })}><FaPen className="h-3.5 w-3.5" /></CustomButton>
        <CustomButton type="button" variant="danger" iconOnly tooltip="Eliminar" aria-label="Eliminar" className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100" onClick={() => showNotification({ title: 'Anadidos', message: `Eliminar anadido: ${row.original.anadido}.`, variant: 'error' })}><FaTrashAlt className="h-3.5 w-3.5" /></CustomButton>
      </div>
    ),
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Anadidos por servicio</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Control de extras que se pueden sumar a los servicios base.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-slate-500">Total</p><p className="text-base font-semibold text-slate-900">{anadidoRows.length}</p></article>
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
