import type { ReactNode } from 'react'
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa'
import {
  MaterialReactTable,
  useMaterialReactTable,
  type MRT_ColumnDef,
} from 'material-react-table'
import { CustomButton } from '../../../components/Button'

type Column<T> = {
  key: keyof T
  label: string
  className?: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

type AdminCatalogTableProps<T extends Record<string, unknown>> = {
  title: string
  description: string
  addActionLabel: string
  columns: Array<Column<T>>
  rows: T[]
  onAdd?: () => void
  onEdit?: (row: T) => void
  onDelete?: (row: T) => void
}

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

export function AdminCatalogTable<T extends Record<string, unknown>>({
  title,
  description,
  addActionLabel,
  columns,
  rows,
  onAdd,
  onEdit,
  onDelete,
}: AdminCatalogTableProps<T>) {
  const activeCount = rows.filter((row) => {
    const state = String(row.estado ?? row.activo ?? '').toLowerCase()
    return state === 'activo' || state === 'true'
  }).length
  const inactiveCount = rows.length - activeCount

  const mrtColumns: MRT_ColumnDef<T>[] = columns.map((column) => ({
    accessorKey: String(column.key),
    header: column.label,
    Cell: ({ row }) => {
      const value = row.original[column.key]
      const content = column.render ? column.render(value, row.original) : String(value ?? '-')
      return (
        <span className={column.className ?? ''}>
          {String(column.key).toLowerCase() === 'estado' ? statusBadge(value) : content}
        </span>
      )
    },
  }))

  const table = useMaterialReactTable({
    columns: mrtColumns,
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
      <CustomButton
        type="button"
        variant="primary"
        leftIcon={<FaPlus className="h-3.5 w-3.5" />}
        tooltip={addActionLabel}
        className="rounded-lg"
        onClick={onAdd}
      >
        {addActionLabel}
      </CustomButton>
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
      and: 'y',
      cancel: 'Cancelar',
      clearFilter: 'Limpiar filtro',
      clearSearch: 'Limpiar búsqueda',
      clearSort: 'Limpiar orden',
      filterByColumn: 'Filtrar por',
      filterMode: 'Modo de filtro',
      hideAll: 'Ocultar todo',
      noRecordsToDisplay: 'No hay registros para mostrar',
      noResultsFound: 'No se encontraron resultados',
      search: 'Buscar',
      showHideColumns: 'Mostrar/Ocultar columnas',
      showHideFilters: 'Mostrar/Ocultar filtros',
      sortByColumnAsc: 'Ordenar ascendente',
      sortByColumnDesc: 'Ordenar descendente',
      sortedByColumnAsc: 'Ordenado ascendente',
      sortedByColumnDesc: 'Ordenado descendente',
      thenBy: 'luego por',
      toggleDensity: 'Cambiar densidad',
      toggleFullScreen: 'Pantalla completa',
      toggleSelectAll: 'Seleccionar todo',
      toggleSelectRow: 'Seleccionar fila',
      rowsPerPage: 'Filas por página',
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
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>
          </div>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Total</p>
            <p className="text-base font-semibold text-slate-900">{rows.length}</p>
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
