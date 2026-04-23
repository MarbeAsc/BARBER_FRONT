import { useState } from 'react'
import { showNotification } from '../../../lib/notifications'
import { FaPen, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'
import { ConfirmacionEliminacion } from '@/components/ConfirmacionEliminacion'
import { useDeleteUsuarioMutation, useEditUsuarioMutation, useUsuariosListQuery } from '@/hooks/useUsuarios'
import { mensajeRespuestaUsuario } from '@/lib/respuesta-api'
import type { UsuarioDTO, UsuarioEdicionDTO } from '@/services/usuarioService'

/** Solo cambio de estatus desde tabla; `Contrasena` vacía si el API interpreta “sin cambio de contraseña”. */
function usuarioEdicionMismoDatos(row: UsuarioDTO, estatus: number): UsuarioEdicionDTO {
  return {
    Id: row.Id,
    Username: row.Username,
    Correo: row.Correo,
    Contrasena: '',
    Estatus: estatus,
  }
}

function EstatusSwitch({
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
        aria-label={active ? 'Activo, pulsar para desactivar' : 'Inactivo, pulsar para activar'}
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
      <span className={`min-w-13 text-xs font-bold tracking-wide ${active ? 'text-emerald-700' : 'text-slate-600'}`}>
        {active ? 'Activo' : 'Inactivo'}
      </span>
    </div>
  )
}

function formatFechaCreacion(value: Date | string) {
  const d = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(d.getTime())) return '—'
  return d.toLocaleString('es-MX', { dateStyle: 'short', timeStyle: 'short' })
}

type AdminUsuariosTableProps = {
  onEditUsuario?: (usuario: UsuarioDTO) => void
}

export function AdminUsuariosTable({ onEditUsuario }: AdminUsuariosTableProps) {
  const { data = [], isPending, isError, error, refetch } = useUsuariosListQuery()
  const editUsuario = useEditUsuarioMutation()
  const deleteUsuario = useDeleteUsuarioMutation()
  const [deleteTarget, setDeleteTarget] = useState<UsuarioDTO | null>(null)

  const activosCount = data.filter((u) => u.Estatus === 1).length
  const otrosCount = data.length - activosCount

  const handleEstatusChange = (row: UsuarioDTO, checked: boolean) => {
    const next = checked ? 1 : 0
    if (row.Estatus === next) return
    editUsuario.mutate(usuarioEdicionMismoDatos(row, next), {
      onSuccess: (res) => {
        const { ok, mensaje } = mensajeRespuestaUsuario(res)
        if (ok) {
          showNotification({
            title: 'Usuarios',
            message: mensaje,
            variant: 'success',
          })
        } else {
          showNotification({
            title: 'Usuarios',
            message: mensaje || 'No se pudo actualizar el estatus.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Usuarios',
          message: e instanceof Error ? e.message : 'Error al actualizar el estatus.',
          variant: 'error',
        })
      },
    })
  }

  const handleDeleteConfirm = () => {
    if (!deleteTarget) return
    const id = deleteTarget.Id
    deleteUsuario.mutate(id, {
      onSuccess: (res) => {
        const { ok, mensaje } = mensajeRespuestaUsuario(res)
        if (ok) {
          showNotification({
            title: 'Usuarios',
            message: mensaje || 'Usuario eliminado.',
            variant: 'success',
          })
        } else {
          showNotification({
            title: 'Usuarios',
            message: mensaje || 'No se pudo eliminar el usuario.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Usuarios',
          message: e instanceof Error ? e.message : 'Error al eliminar.',
          variant: 'error',
        })
      },
      onSettled: () => setDeleteTarget(null),
    })
  }

  const columns: MRT_ColumnDef<UsuarioDTO>[] = [
    { accessorKey: 'Username', header: 'Usuario' },
    { accessorKey: 'Correo', header: 'Correo' },
    {
      accessorKey: 'HoraCreacion',
      header: 'Registro',
      Cell: ({ row }) => <span>{formatFechaCreacion(row.original.HoraCreacion)}</span>,
    },
    {
      id: 'Estatus',
      accessorFn: (row) => (row.Estatus === 1 ? 'Activo' : 'Inactivo'),
      header: 'Estatus',
      filterVariant: 'select',
      filterSelectOptions: ['Activo', 'Inactivo'],
      size: 168,
      Cell: ({ row }) => {
        const active = row.original.Estatus === 1
        return (
          <EstatusSwitch
            active={active}
            disabled={editUsuario.isPending}
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
        Datos desde obtenerListadoUsuarios
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
            onEditUsuario
              ? onEditUsuario(row.original)
              : showNotification({
                  title: 'Usuarios',
                  message: `Editar usuario: ${row.original.Username} (Id ${row.original.Id}).`,
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
          disabled={deleteUsuario.isPending}
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
      sx: { border: '1px solid #dbe4f0', borderRadius: '0.9rem', overflow: 'hidden' },
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
      placeholder: 'Buscar por id, usuario, correo o estatus...',
      size: 'small',
      sx: {
        minWidth: '300px',
        '& .MuiOutlinedInput-root': { borderRadius: '12px', backgroundColor: '#ffffff' },
      },
    },
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Usuarios del sistema</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">
          Listado según UsuarioDTO (el hash de contraseña no se muestra en tabla).
        </p>
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
              style={{ width: `${data.length ? (activosCount / data.length) * 100 : 0}%` }}
            />
          </div>
          <div className="mt-2 flex flex-wrap gap-2 text-xs font-medium">
            <span className="rounded-full bg-emerald-50 px-2.5 py-1 text-emerald-700">Estatus 1: {activosCount}</span>
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
              ¿Eliminar al usuario <span className="font-semibold text-slate-900">«{deleteTarget.Username}»</span>? Esta
              acción no se puede deshacer.
            </>
          ) : (
            ''
          )
        }
        onCancel={() => setDeleteTarget(null)}
        onConfirm={handleDeleteConfirm}
        confirmText="Eliminar"
        cancelText="Cancelar"
        requireTextMatch={deleteTarget?.Username ?? ''}
        textMatchLabel={`Escribe el nombre de usuario «${deleteTarget?.Username ?? ''}» para confirmar la eliminación`}
        loading={deleteUsuario.isPending}
      />
    </section>
  )
}
