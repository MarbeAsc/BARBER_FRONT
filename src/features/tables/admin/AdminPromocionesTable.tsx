import { useMemo, useState } from 'react'
import { showNotification } from '../../../lib/notifications'
import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'
import { ConfirmacionEliminacion } from '@/components/ConfirmacionEliminacion'
import { useDeletePromocionMutation, useEditPromocionMutation, usePromocionesListQuery } from '@/hooks/usePromociones'
import type { PromocionDTO } from '@/services/promocionesSevice'

type AdminPromocionesTableProps = {
  onEditPromocion?: (promocion: PromocionDTO) => void
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatFecha(value: string | Date): string {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return '—'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function estadoPromocion(row: PromocionDTO): 'Vigente' | 'Programada' | 'Finalizada' {
  const now = new Date()
  const inicio = toDate(row.fechaInicio)
  const fin = toDate(row.fechaFin)
  switch (true) {
    case now < inicio:
      return 'Programada'
    case now > fin:
      return 'Finalizada'
    default:
      return 'Vigente'
  }
}

function EstadoPromocionSwitch({
  estado,
  disabled,
  onToggle,
}: {
  estado: 'Vigente' | 'Programada' | 'Finalizada'
  disabled?: boolean
  onToggle: (next: boolean) => void
}) {
  const active = estado === 'Vigente'
  return (
    <div className="flex items-center gap-2.5">
      <button
        type="button"
        role="switch"
        aria-checked={active}
        aria-label={`Estado de promoción: ${estado}`}
        disabled={disabled}
        onClick={() => onToggle(!active)}
        className={`inline-flex h-7 w-12 shrink-0 items-center rounded-full border-2 px-0.5 ${
          active
            ? 'justify-end border-emerald-400 bg-emerald-500 shadow-[inset_0_1px_0_rgba(255,255,255,0.2)]'
            : 'justify-start border-slate-300 bg-slate-200 shadow-inner'
        } disabled:cursor-not-allowed disabled:opacity-60`}
      >
        <span className="pointer-events-none block h-[1.1rem] w-[1.1rem] rounded-full bg-white shadow-md" />
      </button>
      <span className={`min-w-19 text-xs font-bold tracking-wide ${active ? 'text-emerald-700' : 'text-slate-600'}`}>
        {estado}
      </span>
    </div>
  )
}

export function AdminPromocionesTable({ onEditPromocion }: AdminPromocionesTableProps) {
  const { data = [], isPending, isError, error, refetch } = usePromocionesListQuery()
  const deletePromocion = useDeletePromocionMutation()
  const editPromocion = useEditPromocionMutation()
  const [deleteTarget, setDeleteTarget] = useState<PromocionDTO | null>(null)

  const stats = useMemo(() => {
    const summary = { vigentes: 0, programadas: 0, finalizadas: 0 }
    for (const row of data) {
      switch (estadoPromocion(row)) {
        case 'Vigente':
          summary.vigentes += 1
          break
        case 'Programada':
          summary.programadas += 1
          break
        case 'Finalizada':
          summary.finalizadas += 1
          break
      }
    }
    return summary
  }, [data])

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    deletePromocion.mutate(deleteTarget.id, {
      onSuccess: (res) => {
        if (res.estatus) {
          showNotification({ title: 'Promociones', message: res.descripcion || 'Promoción eliminada.', variant: 'success' })
        } else {
          showNotification({
            title: 'Promociones',
            message: res.descripcion || 'No se pudo eliminar la promoción.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Promociones',
          message: e instanceof Error ? e.message : 'Error al eliminar promoción.',
          variant: 'error',
        })
      },
      onSettled: () => setDeleteTarget(null),
    })
  }

  const handleEstatusChange = (row: PromocionDTO, checked: boolean) => {
    const estadoActual = estadoPromocion(row)
    if ((estadoActual === 'Vigente') === checked) return

    const now = new Date()
    const inicioActual = toDate(row.fechaInicio)
    const finActual = toDate(row.fechaFin)
    const nextInicio = new Date(inicioActual)
    const nextFin = new Date(finActual)

    if (checked) {
      // Si se activa, garantizamos que "ahora" quede dentro del rango
      // y que fechaFin quede en el futuro para evitar que se recalifique
      // como finalizada en el siguiente render.
      if (nextInicio > now) nextInicio.setTime(now.getTime())
      if (nextFin <= now) {
        const tomorrow = new Date(now)
        tomorrow.setDate(tomorrow.getDate() + 1)
        nextFin.setTime(tomorrow.getTime())
      }
    } else {
      // Si se desactiva desde vigente, la pasamos a finalizada.
      const yesterday = new Date(now)
      yesterday.setDate(yesterday.getDate() - 1)
      nextFin.setTime(yesterday.getTime())
      if (nextInicio > nextFin) nextInicio.setTime(nextFin.getTime())
    }

    editPromocion.mutate(
      {
        id: row.id,
        descripcion: row.descripcion,
        fechaInicio: nextInicio,
        fechaFin: nextFin,
      },
      {
        onSuccess: (res) => {
          if (res.estatus) {
            showNotification({
              title: 'Promociones',
              message: res.descripcion || (checked ? 'Promoción marcada como vigente.' : 'Promoción marcada como finalizada.'),
              variant: 'success',
            })
          } else {
            showNotification({
              title: 'Promociones',
              message: res.descripcion || 'No se pudo actualizar el estado.',
              variant: 'warning',
            })
          }
        },
        onError: (e) => {
          showNotification({
            title: 'Promociones',
            message: e instanceof Error ? e.message : 'Error al actualizar el estado.',
            variant: 'error',
          })
        },
      },
    )
  }

  const columns: MRT_ColumnDef<PromocionDTO>[] = [
    {
      accessorKey: 'descripcion',
      header: 'Descripción',
      Cell: ({ row }) => <span className="line-clamp-2 max-w-md">{row.original.descripcion?.trim() || '—'}</span>,
    },
    {
      id: 'fechaInicio',
      header: 'Inicio',
      accessorFn: (row) => formatFecha(row.fechaInicio),
    },
    {
      id: 'fechaFin',
      header: 'Fin',
      accessorFn: (row) => formatFecha(row.fechaFin),
    },
    {
      id: 'estado',
      header: 'Estado',
      accessorFn: (row) => estadoPromocion(row),
      filterVariant: 'select',
      filterSelectOptions: ['Vigente', 'Programada', 'Finalizada'],
      size: 188,
      Cell: ({ row }) => {
        const estado = estadoPromocion(row.original)
        return (
          <EstadoPromocionSwitch
            estado={estado}
            disabled={editPromocion.isPending}
            onToggle={(next) => handleEstatusChange(row.original, next)}
          />
        )
      },
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
            onEditPromocion
              ? onEditPromocion(row.original)
              : showNotification({
                  title: 'Promociones',
                  message: `Editar promoción ID ${row.original.id}.`,
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
          disabled={deletePromocion.isPending}
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
        '&:hover td': { backgroundColor: '#eff6ff' },
      },
    }),
    muiTableBodyCellProps: { sx: { borderBottom: '1px solid #e2e8f0', fontSize: '0.835rem' } },
    muiSearchTextFieldProps: {
      placeholder: 'Buscar por descripción o ID...',
      size: 'small',
      sx: { minWidth: '300px', '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#ffffff' } },
    },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Promociones registradas</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Listado general de promociones con su vigencia.</p>
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
              style={{ width: `${data.length ? (stats.vigentes / data.length) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Vigentes: {stats.vigentes}</span>
            <span className="rounded-full bg-blue-50 px-2.5 py-1 text-blue-700">Programadas: {stats.programadas}</span>
            <span className="rounded-full bg-slate-100 px-2.5 py-1 text-slate-700">Finalizadas: {stats.finalizadas}</span>
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
              ¿Eliminar la promoción <span className="font-semibold text-slate-900">{deleteTarget.descripcion}</span>? Esta acción no
              se puede deshacer.
            </>
          ) : (
            ''
          )
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        requireTextMatch={deleteTarget?.descripcion ? String(deleteTarget.descripcion) : ''}
        textMatchLabel={`Escribe la descripcion exacta «${deleteTarget?.descripcion ?? ''}» para confirmar la eliminación`}
        loading={deletePromocion.isPending}
      />
    </section>
  )
}
