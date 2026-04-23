import { useState } from 'react'
import { showNotification } from '../../../lib/notifications'
import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'
import { ConfirmacionEliminacion } from '@/components/ConfirmacionEliminacion'
import { useDeletePerfumeMutation, useEditPerfumeMutation, usePerfumesListQuery } from '@/hooks/usePerfumes'
import { mensajePrimeraRespuestaLista } from '@/lib/respuesta-api'
import type { PerfumeConArchivoDTO, PerfumeDTO } from '@/services/perfumesService'

function perfumeToPayload(row: PerfumeDTO, disponible: boolean | null): PerfumeConArchivoDTO {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    base64: row.base64,
    disponible,
    archivo: null,
  }
}

function DisponibleSwitch({
  active,
  disabled,
  onToggle,
}: {
  active: boolean
  disabled?: boolean
  onToggle: (next: boolean) => void
}) {
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={active ? 'Disponible, pulsar para marcar como no disponible' : 'No disponible, pulsar para marcar como disponible'}
        disabled={disabled}
        onClick={() => onToggle(!active)}
        className={`inline-flex h-7 w-12 shrink-0 cursor-pointer items-center rounded-full border-2 px-0.5 transition focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-blue-500 disabled:cursor-not-allowed disabled:opacity-55 ${
          active
            ? 'justify-end border-emerald-400 bg-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
            : 'justify-start border-slate-300 bg-slate-200 shadow-inner'
        }`}
      >
        <span className="pointer-events-none block h-[1.1rem] w-[1.1rem] rounded-full bg-white shadow-md" />
      </button>
      <span className={`min-w-8 text-xs font-bold tracking-wide ${active ? 'text-emerald-700' : 'text-slate-600'}`}>
        {active ? 'Sí' : 'No'}
      </span>
    </div>
  )
}

function imagenCell(row: PerfumeDTO) {
  const b = row.base64?.trim()
  if (!b) return <span className="text-slate-400">—</span>
  const src = b.startsWith('data:') ? b : `data:image/jpeg;base64,${b}`
  return <img src={src} alt="" className="h-10 w-10 rounded-lg border border-slate-200 object-cover" loading="lazy" />
}

type AdminPerfumesTableProps = {
  onEditPerfume?: (perfume: PerfumeDTO) => void
}

export function AdminPerfumesTable({ onEditPerfume }: AdminPerfumesTableProps) {
  const { data = [], isPending, isError, error, refetch } = usePerfumesListQuery()
  const editPerfume = useEditPerfumeMutation()
  const deletePerfume = useDeletePerfumeMutation()
  const [deleteTarget, setDeleteTarget] = useState<PerfumeDTO | null>(null)

  const disponiblesCount = data.filter((p) => p.disponible === true).length
  const otrosCount = data.length - disponiblesCount

  const handleDisponibleChange = (row: PerfumeDTO, checked: boolean) => {
    if (row.disponible === checked) return
    editPerfume.mutate(perfumeToPayload(row, checked), {
      onSuccess: (res) => {
        const { ok, mensaje } = mensajePrimeraRespuestaLista(res)
        if (ok) {
          showNotification({
            title: 'Perfumes',
            message: mensaje || (checked ? 'Marcado como disponible.' : 'Marcado como no disponible.'),
            variant: 'success',
          })
        } else {
          showNotification({
            title: 'Perfumes',
            message: mensaje || 'No se pudo actualizar la disponibilidad.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Perfumes',
          message: e instanceof Error ? e.message : 'Error al actualizar la disponibilidad.',
          variant: 'error',
        })
      },
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    const id = deleteTarget.id
    deletePerfume.mutate(id, {
      onSuccess: (res) => {
        const { ok, mensaje } = mensajePrimeraRespuestaLista(res)
        if (ok) {
          showNotification({
            title: 'Perfumes',
            message: mensaje || 'Perfume eliminado.',
            variant: 'success',
          })
        } else {
          showNotification({
            title: 'Perfumes',
            message: mensaje || 'No se pudo eliminar el perfume.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Perfumes',
          message: e instanceof Error ? e.message : 'Error al eliminar.',
          variant: 'error',
        })
      },
      onSettled: () => setDeleteTarget(null),
    })
  }

  const columns: MRT_ColumnDef<PerfumeDTO>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      Cell: ({ row }) => <span className="line-clamp-2 max-w-md">{row.original.descripcion?.trim() ? row.original.descripcion : '—'}</span>,
    },
    {
      id: 'base64',
      header: 'Imagen',
      enableColumnFilter: false,
      size: 88,
      Cell: ({ row }) => imagenCell(row.original),
    },
    {
      id: 'disponible',
      accessorFn: (row) => (row.disponible === true ? 'Sí' : row.disponible === false ? 'No' : 'Sin definir'),
      header: 'Disponible',
      filterVariant: 'select',
      filterSelectOptions: ['Sí', 'No', 'Sin definir'],
      size: 168,
      Cell: ({ row }) => {
        const active = row.original.disponible === true
        return (
          <DisponibleSwitch
            active={active}
            disabled={editPerfume.isPending}
            onToggle={(next) => handleDisponibleChange(row.original, next)}
          />
        )
      },
    },
  ]

  const table = useMaterialReactTable({
    columns,
    data,
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
      showColumnFilters: true,
      showGlobalFilter: true,
      pagination: { pageIndex: 0, pageSize: 5 },
    },
    paginationDisplayMode: 'pages',
    displayColumnDefOptions: { 'mrt-row-actions': { header: 'Acciones', size: 140 } },
    renderTopToolbarCustomActions: () => (
      <span className="rounded-full border border-blue-200 bg-blue-50 px-2.5 py-1 text-[11px] font-semibold text-blue-700">
        Datos desde obtenerPerfumes (PerfumeDTO)
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
            onEditPerfume
              ? onEditPerfume(row.original)
              : showNotification({
                  title: 'Perfumes',
                  message: `Editar perfume: ${row.original.nombre} (id ${row.original.id}).`,
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
          disabled={deletePerfume.isPending}
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
    muiTablePaperProps: { elevation: 0, sx: { border: '1px solid #dbe4f0', borderRadius: '0.9rem', overflow: 'hidden' } },
    muiTopToolbarProps: { sx: { background: 'linear-gradient(90deg, rgba(239,246,255,0.7) 0%, rgba(248,250,252,0.7) 100%)', borderBottom: '1px solid #e2e8f0', px: '0.75rem' } },
    muiTableHeadCellProps: { sx: { backgroundColor: '#f8fafc', color: '#334155', fontWeight: 700, fontSize: '0.74rem', borderBottom: '1px solid #e2e8f0' } },
    muiTableBodyRowProps: ({ row }) => ({ sx: { backgroundColor: row.index % 2 === 0 ? '#ffffff' : '#f8fafc', '&:hover td': { backgroundColor: '#eff6ff' } } }),
    muiTableBodyCellProps: { sx: { borderBottom: '1px solid #e2e8f0', fontSize: '0.835rem' } },
    muiSearchTextFieldProps: {
      placeholder: 'Buscar por id, nombre, descripción...',
      size: 'small',
      sx: { minWidth: '300px', '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#ffffff' } },
    },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Perfumes registrados</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Listado según PerfumeDTO: id, nombre, descripción, base64 e indicador disponible.</p>
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
            <div
              className="h-full rounded-full bg-emerald-500"
              style={{ width: `${data.length ? (disponiblesCount / data.length) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Disponible (true): {disponiblesCount}</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Otros: {otrosCount}</span>
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
              ¿Eliminar el perfume <span className="font-semibold text-slate-900">«{deleteTarget.nombre}»</span>? Esta acción
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
        loading={deletePerfume.isPending}
      />
    </section>
  )
}
