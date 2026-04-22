import { showNotification } from '../../../lib/notifications'
import { FaPen, FaPlus, FaTrashAlt } from 'react-icons/fa'
import { MaterialReactTable, useMaterialReactTable, type MRT_ColumnDef } from 'material-react-table'
import { CustomButton } from '../../../components/Button'

type UsuarioRow = {
  nombre: string
  correo: string
  rol: 'Cliente' | 'Barbero' | 'Admin'
  telefono: string
  estado: 'Activo' | 'Inactivo'
}

const usuarioRows: UsuarioRow[] = [
  { nombre: 'Ana Perez', correo: 'ana.perez@barberia.com', rol: 'Cliente', telefono: '099 111 2233', estado: 'Activo' },
  { nombre: 'Luis Herrera', correo: 'luis.herrera@barberia.com', rol: 'Barbero', telefono: '098 212 3344', estado: 'Activo' },
  { nombre: 'Sofia Mora', correo: 'sofia.mora@barberia.com', rol: 'Cliente', telefono: '097 303 4455', estado: 'Inactivo' },
  { nombre: 'Carlos Admin', correo: 'admin@barberia.com', rol: 'Admin', telefono: '096 454 5566', estado: 'Activo' },
]

export function AdminUsuariosTable() {
  const activeCount = usuarioRows.filter((row) => String(row.estado).toLowerCase() === 'activo').length
  const inactiveCount = usuarioRows.length - activeCount
  const columns: MRT_ColumnDef<UsuarioRow>[] = [
    { accessorKey: 'nombre', header: 'Nombre' },
    { accessorKey: 'correo', header: 'Correo' },
    { accessorKey: 'rol', header: 'Rol' },
    { accessorKey: 'telefono', header: 'Telefono' },
    { accessorKey: 'estado', header: 'Estado' },
  ]
  const table = useMaterialReactTable({
    columns,
    data: usuarioRows,
    enableRowActions: true,
    enableColumnActions: false,
    enableColumnFilters: true,
    enableGlobalFilter: true,
    positionActionsColumn: 'last',
    initialState: { showColumnFilters: true, showGlobalFilter: true, pagination: { pageIndex: 0, pageSize: 5 } },
    paginationDisplayMode: 'pages',
    renderTopToolbarCustomActions: () => (
      <CustomButton type="button" variant="primary" leftIcon={<FaPlus className="h-3.5 w-3.5" />} className="rounded-xl" onClick={() => showNotification({ title: 'Usuarios', message: 'Abrir formulario para agregar usuario.', variant: 'info' })}>
        Agregar usuario
      </CustomButton>
    ),
    renderRowActions: ({ row }) => (
      <div className="inline-flex gap-2">
        <CustomButton type="button" variant="ghost" iconOnly tooltip="Editar" aria-label="Editar" className="rounded-xl border border-blue-200 bg-blue-50/70 text-blue-700 shadow-sm hover:border-blue-300 hover:bg-blue-100" onClick={() => showNotification({ title: 'Usuarios', message: `Editar usuario: ${row.original.nombre}.`, variant: 'warning' })}><FaPen className="h-3.5 w-3.5" /></CustomButton>
        <CustomButton type="button" variant="danger" iconOnly tooltip="Eliminar" aria-label="Eliminar" className="rounded-xl border border-rose-200 bg-rose-50/80 text-rose-700 shadow-sm hover:border-rose-300 hover:bg-rose-100" onClick={() => showNotification({ title: 'Usuarios', message: `Eliminar usuario: ${row.original.nombre}.`, variant: 'error' })}><FaTrashAlt className="h-3.5 w-3.5" /></CustomButton>
      </div>
    ),
    muiPaginationProps: { rowsPerPageOptions: [5, 10, 20], showFirstButton: true, showLastButton: true },
  })
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">Usuarios registrados</h2>
        <p className="mt-1 text-xs text-slate-500 sm:text-sm">Administracion centralizada de cuentas de clientes, barberos y administradores.</p>
        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2"><p className="text-slate-500">Total</p><p className="text-base font-semibold text-slate-900">{usuarioRows.length}</p></article>
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
