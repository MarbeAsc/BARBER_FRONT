import { Fragment, useState, type FormEvent } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '@/components/Button'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'
import { useCreateBarberMutation, useEditBarberMutation } from '@/hooks/useBarberos'
import { useUsuariosListQuery } from '@/hooks/useUsuarios'
import { mensajePrimeraRespuestaLista } from '@/lib/respuesta-api'
import { showNotification } from '@/lib/notifications'
import type { BarberoDTO, BarberoListadoDTO } from '@/services/barberosService'

export type FormularioBarberoModalProps = {
  onClose: () => void
  onSuccess?: () => void
  modoEdicion: boolean
  barbero: BarberoListadoDTO | null
}

type BarberoFormFields = Pick<BarberoDTO, 'id' | 'nombre' | 'idUsuario'>

function emptyForm(): BarberoFormFields {
  return { id: 0, nombre: '', idUsuario: 0 }
}

function fieldsFromRow(row: BarberoListadoDTO): BarberoFormFields {
  return { id: row.id, nombre: row.nombre, idUsuario: row.idUsuario }
}

function initialForm(modoEdicion: boolean, barbero: BarberoListadoDTO | null): BarberoFormFields {
  return modoEdicion && barbero ? fieldsFromRow(barbero) : emptyForm()
}

export function FormularioBarberoModal({
  onClose,
  onSuccess,
  modoEdicion,
  barbero,
}: FormularioBarberoModalProps) {
  const [form, setForm] = useState(() => initialForm(modoEdicion, barbero))
  const [confirmGuardarOpen, setConfirmGuardarOpen] = useState(false)
  const [pendingBarbero, setPendingBarbero] = useState<BarberoDTO | null>(null)

  const createMutation = useCreateBarberMutation()
  const editMutation = useEditBarberMutation()
  const isPending = createMutation.isPending || editMutation.isPending

  const {
    data: usuarios = [],
    isLoading: usuariosLoading,
    isError: usuariosError,
  } = useUsuariosListQuery({ enabled: true })

  const handleClose = () => {
    setConfirmGuardarOpen(false)
    setPendingBarbero(null)
    onClose()
  }

  const handleCancelConfirmacion = () => {
    setConfirmGuardarOpen(false)
    setPendingBarbero(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nombre.trim()) {
      showNotification({
        title: 'Barberos',
        message: 'El nombre es obligatorio.',
        variant: 'warning',
      })
      return
    }
    if (!form.idUsuario || form.idUsuario <= 0) {
      showNotification({
        title: 'Barberos',
        message: 'Selecciona un usuario.',
        variant: 'warning',
      })
      return
    }

    const payload: BarberoDTO = {
      ...form,
      nombre: form.nombre.trim(),
      estatus: modoEdicion && barbero ? barbero.estatus : 1,
    }
    setPendingBarbero(payload)
    setConfirmGuardarOpen(true)
  }

  const handleConfirmGuardar = async () => {
    if (!pendingBarbero) return
    const mutation = modoEdicion ? editMutation : createMutation
    try {
      const res = await mutation.mutateAsync(pendingBarbero)
      const { ok, mensaje } = mensajePrimeraRespuestaLista(res)
      if (ok) {
        showNotification({
          title: modoEdicion ? 'Barbero actualizado' : 'Barbero creado',
          message: mensaje || 'Operación correcta.',
          variant: 'success',
        })
        onSuccess?.()
        handleCancelConfirmacion()
        handleClose()
      } else {
        showNotification({
          title: 'Barberos',
          message: mensaje || 'La operación no se completó.',
          variant: 'warning',
        })
      }
    } catch (e) {
      showNotification({
        title: 'Barberos',
        message: e instanceof Error ? e.message : 'Error al guardar.',
        variant: 'error',
      })
    }
  }

  return (
    <Fragment>
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100 bg-linear-to-r from-indigo-50/95 via-white to-blue-50/90 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Administrador</p>
            <h2 className="text-xl font-semibold text-slate-900">{modoEdicion ? 'Editar barbero' : 'Nuevo barbero'}</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={handleClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <form className="space-y-5 p-6" onSubmit={handleSubmit}>
          {modoEdicion && barbero ? (
            <p className="text-xs text-slate-500">
              Usuario asociado: <span className="font-semibold text-slate-800">{barbero.nombreUsuario}</span>
            </p>
          ) : null}

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Nombre
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej. Juan Pérez"
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Usuario
            <select
              required
              value={form.idUsuario > 0 ? String(form.idUsuario) : ''}
              onChange={(e) =>
                setForm((f) => ({ ...f, idUsuario: e.target.value ? Number(e.target.value) : 0 }))
              }
              disabled={modoEdicion || usuariosLoading}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:cursor-not-allowed disabled:bg-slate-100"
            >
              <option value="">
                {usuariosLoading ? 'Cargando usuarios…' : 'Selecciona un usuario…'}
              </option>
              {modoEdicion &&
              barbero &&
              !usuarios.some((u) => u.Id === form.idUsuario) ? (
                <option value={form.idUsuario}>
                  {barbero.nombreUsuario} (ID {form.idUsuario})
                </option>
              ) : null}
              {usuarios.map((u) => (
                <option key={u.Id} value={u.Id}>
                  {u.Username} — {u.Correo}
                </option>
              ))}
            </select>
            {usuariosError ? (
              <span className="text-[11px] font-normal text-red-600">
                No se pudo cargar el listado de usuarios.
              </span>
            ) : null}
            {!usuariosLoading && !usuariosError && usuarios.length === 0 && !modoEdicion ? (
              <span className="text-[11px] font-normal text-amber-700">No hay usuarios disponibles.</span>
            ) : null}
          </label>
          {modoEdicion ? (
            <p className="text-[11px] text-slate-500">El usuario asociado no se modifica desde este formulario.</p>
          ) : null}

          <div className="flex justify-end gap-2 border-t border-indigo-100/80 pt-5">
            <CustomButton type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
              Cancelar
            </CustomButton>
            <CustomButton
              type="submit"
              variant="primary"
              className="bg-blue-600 text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
              disabled={
                isPending ||
                confirmGuardarOpen ||
                (!modoEdicion &&
                  (usuariosLoading ||
                    usuariosError ||
                    (!usuariosLoading && usuarios.length === 0)))
              }
            >
              {modoEdicion ? 'Actualizar' : 'Guardar'}
            </CustomButton>
          </div>
        </form>
      </section>
    </div>

      <ConfirmacionDialog
        open={confirmGuardarOpen}
        onClose={handleCancelConfirmacion}
        onConfirm={() => void handleConfirmGuardar()}
        title="Confirmar acción"
        subtitle="Verifica los detalles antes de continuar"
        message={
          <>
            ¿Confirmas que deseas{' '}
            <span className="font-semibold text-slate-900">
              {modoEdicion ? 'guardar los cambios del' : 'registrar el'}
            </span>{' '}
            barbero?
          </>
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isPending}
        additionalInfo={
          pendingBarbero ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre:</span>
                <span className="text-sm font-medium text-slate-900">{pendingBarbero.nombre}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">ID usuario:</span>
                <span className="text-sm font-medium text-slate-900">{pendingBarbero.idUsuario}</span>
              </div>
            </div>
          ) : null
        }
      />
    </Fragment>
  )
}
