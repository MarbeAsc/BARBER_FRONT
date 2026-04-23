import { useState } from 'react'
import { showNotification } from '../../../lib/notifications'
import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'
import { ConfirmacionEliminacion } from '@/components/ConfirmacionEliminacion'
import { useAnadidosServiciosQuery, useDeleteAnadidoServicioMutation } from '@/hooks/useAnadidosServicios'
import type { AnadidoServicioDTO } from '@/services/añadidosService'

type AdminAnadidosTableProps = {
  servicioId: number
  onEditAnadido?: (anadido: AnadidoServicioDTO) => void
}

function formatPrecio(value: number) {
  return new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(value)
}

export function AdminAnadidosTable({ servicioId, onEditAnadido }: AdminAnadidosTableProps) {
  const { data = [], isPending, isError, error, refetch } = useAnadidosServiciosQuery(servicioId)
  const deleteAnadido = useDeleteAnadidoServicioMutation()
  const [deleteTarget, setDeleteTarget] = useState<AnadidoServicioDTO | null>(null)

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    deleteAnadido.mutate(id, {
      onSuccess: (res) => {
        if (res.estatus) {
          showNotification({
            title: 'Anadidos',
            message: res.descripcion || 'Añadido eliminado.',
            variant: 'success',
          })
        } else {
          showNotification({
            title: 'Anadidos',
            message: res.descripcion || 'No se pudo eliminar el añadido.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Anadidos',
          message: e instanceof Error ? e.message : 'Error al eliminar.',
          variant: 'error',
        })
      },
      onSettled: () => setDeleteTarget(null),
    })
  }

  const columns: MRT_ColumnDef<AnadidoServicioDTO>[] = [
    { accessorKey: 'id', header: 'ID', size: 72 },
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'descripcion', header: 'Descripción',
      Cell: ({ row }) => (
        <span className="line-clamp-2 max-w-md">{row.original.descripcion?.trim() ? row.original.descripcion : '—'}</span>
      ),
    },
    {
      accessorKey: 'idPerteneciente',
      header: 'ID servicio base',
      Cell: ({ row }) => <span>{row.original.idPerteneciente ?? '—'}</span>,
    },
    {
      accessorKey: 'precio',
      header: 'Precio extra',
      Cell: ({ row }) => <span>{formatPrecio(row.original.precio)}</span>,
    },
  ]
  const table = useMaterialReactTable({
    columns,
    data,
    state: { isLoading: isPending, showProgressBars: isPending },
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
        Datos desde obtenerAnadidosServicios (servicio {servicioId})
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
            onEditAnadido
              ? onEditAnadido(row.original)
              : showNotification({
                  title: 'Anadidos',
                  message: `Editar añadido: ${row.original.nombre} (id ${row.original.id}).`,
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
          disabled={deleteAnadido.isPending}
          className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100"
          onClick={() => setDeleteTarget(row.original)}
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
    muiTableHeadCellProps: { sx: { backgroundColor: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: '0.74rem', borderBottom: '1px solid #e2e8f0' } },
    muiTableBodyRowProps: ({ row }) => ({ sx: { backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f8fafc', '&:hover td': { backgroundColor: '#eff6ff' } } }),
    muiTableBodyCellProps: { sx: { borderBottom: '1px solid #e2e8f0', fontSize: '0.835rem' } },
    muiSearchTextFieldProps: {
      placeholder: 'Buscar por id, nombre o descripción...',
      size: 'small',
      sx: { minWidth: '300px', '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#ffffff' } },
    },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Anadidos por servicio</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Listado según AnadidoServicioDTO para el servicio base indicado.</p>
        {servicioId <= 0 ? (
          <p className="mt-3 rounded-xl border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-900">
            Indica un ID de servicio base válido en el campo de arriba para cargar los añadidos.
          </p>
        ) : null}
        {isError ? (
          <div className="mt-3 rounded-xl border border-rose-200 bg-rose-50 px-3 py-2 text-sm text-rose-800">
            <p>{error instanceof Error ? error.message : 'No se pudo cargar el listado.'}</p>
            <CustomButton type="button" variant="secondary" size="sm" className="mt-2 rounded-lg" onClick={() => void refetch()}>
              Reintentar
            </CustomButton>
          </div>
        ) : null}
        <div className="mt-4 rounded-xl border border-slate-200 bg-white p-3">
          <div className="mb-2 flex items-center justify-between text-[11px] font-semibold uppercase tracking-wide">
            <span className="text-slate-500">Resumen</span>
            <span className="text-slate-700">{data.length} registros</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-slate-100">
            <div className="h-full rounded-full bg-emerald-500" style={{ width: data.length ? '100%' : '0%' }} />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Servicio base ID: {servicioId > 0 ? servicioId : '—'}</span>
          </div>
        </div>
      </div>
      <div className="p-4">
        <MaterialReactTable table={table} />
      </div>

      <ConfirmacionEliminacion
        open={deleteTarget !== null}
        title="Confirmar eliminación"
        message={
          deleteTarget ? (
            <>
              ¿Eliminar el añadido <span className="font-semibold text-slate-900">«{deleteTarget.nombre}»</span>? Esta acción
              no se puede deshacer.
            </>
          ) : (
            ''
          )
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        requireTextMatch={deleteTarget?.nombre ?? ''}
        textMatchLabel={`Escribe el nombre exacto «${deleteTarget?.nombre ?? ''}» para confirmar la eliminación`}
        loading={deleteAnadido.isPending}
      />
    </section>
  )
}
