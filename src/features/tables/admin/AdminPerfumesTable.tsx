import { showNotification } from '../../../lib/notifications'
import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

type PerfumeRow = {
  perfume: string
  marca: string
  aroma: string
  stock: string
  estado: 'Activo' | 'Inactivo'
}

const perfumeRows: PerfumeRow[] = [
  { perfume: 'Gold Oud', marca: 'Barber House', aroma: 'Amaderado', stock: '14 uds', estado: 'Activo' },
  { perfume: 'Fresh Line', marca: 'Studio 91', aroma: 'Citrico', stock: '8 uds', estado: 'Activo' },
  { perfume: 'Dark Spirit', marca: 'North Blend', aroma: 'Especiado', stock: '3 uds', estado: 'Inactivo' },
  { perfume: 'Ocean Mist', marca: 'Barber House', aroma: 'Acuatico', stock: '11 uds', estado: 'Activo' },
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

export function AdminPerfumesTable() {
  const activeCount = perfumeRows.filter((row) => String(row.estado).toLowerCase() === 'activo').length
  const inactiveCount = perfumeRows.length - activeCount

  const columns: MRT_ColumnDef<PerfumeRow>[] = [
    { accessorKey: 'perfume', header: 'Perfume' },
    { accessorKey: 'marca', header: 'Marca' },
    { accessorKey: 'aroma', header: 'Aroma' },
    { accessorKey: 'stock', header: 'Stock' },
    { accessorKey: 'estado', header: 'Estado', Cell: ({ row }) => statusBadge(row.original.estado) },
  ]

  const table = useMaterialReactTable({
    columns,
    data: perfumeRows,
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
    displayColumnDefOptions: { 'mrt-row-actions': { header: 'Acciones', size: 140 } },
    renderTopToolbarCustomActions: () => (
      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
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
          className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100"
          onClick={() =>
            showNotification({ title: 'Perfumes', message: `Editar perfume: ${row.original.perfume}.`, variant: 'warning' })
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
            showNotification({ title: 'Perfumes', message: `Eliminar perfume: ${row.original.perfume}.`, variant: 'error' })
          }
        >
          <FaTrashAlt className="h-3.5 w-3.5" />
        </CustomButton>
      </div>
    ),
    localization: { actions: 'Acciones', search: 'Buscar', rowsPerPage: 'Filas por pagina', of: 'de' },
    muiTablePaperProps: { elevation: 0, sx: { border: '1px solid #dbe4f0', borderRadius: '0.9rem', overflow: 'hidden' } },
    muiTopToolbarProps: { sx: { background: 'linear-gradient(90deg, rgba(239,246,255,0.7) 0%, rgba(248,250,252,0.7) 100%)', borderBottom: '1px solid #e2e8f0', px: '0.75rem' } },
    muiTableHeadCellProps: { sx: { backgroundColor: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: '0.74rem', borderBottom: '1px solid #e2e8f0' } },
    muiTableBodyRowProps: ({ row }) => ({ sx: { backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f8fafc', '&:hover td': { backgroundColor: '#eff6ff' } } }),
    muiTableBodyCellProps: { sx: { borderBottom: '1px solid #e2e8f0', fontSize: '0.835rem' } },
    muiSearchTextFieldProps: { placeholder: 'Buscar por nombre, marca o estado...', size: 'small', sx: { minWidth: '300px', '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#ffffff' } } },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Perfumes registrados</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Inventario de perfumes por marca, aroma y disponibilidad.</p>
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="text-slate-500">Resumen del inventario</span>
            <span className="text-slate-700">{perfumeRows.length} registros</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${perfumeRows.length ? (activeCount / perfumeRows.length) * 100 : 0}%` }}
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
