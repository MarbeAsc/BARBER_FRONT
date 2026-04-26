import { Fragment, useState, type FormEvent } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '@/components/Button'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'
import { useCreateUsuarioMutation, useEditUsuarioMutation } from '@/hooks/useUsuarios'
import { mensajeRespuestaUsuario } from '@/lib/respuesta-api'
import { showNotification } from '@/lib/notifications'
import type { UsuarioCreacionDTO, UsuarioDTO, UsuarioEdicionDTO } from '@/services/usuarioService'

export type FormularioUsuarioModalProps = {
  onClose: () => void
  onSuccess?: () => void
  modoEdicion: boolean
  usuario: UsuarioDTO | null
}

type UsuarioFormFields = {
  Id: number
  Username: string
  Correo: string
  Contrasena: string
}

type PendingUsuarioSave =
  | { mode: 'create'; payload: UsuarioCreacionDTO }
  | { mode: 'edit'; payload: UsuarioEdicionDTO }

function initialForm(modoEdicion: boolean, usuario: UsuarioDTO | null): UsuarioFormFields {
  if (modoEdicion && usuario) {
    return {
      Id: usuario.Id,
      Username: usuario.Username,
      Correo: usuario.Correo,
      Contrasena: '',
    }
  }
  return { Id: 0, Username: '', Correo: '', Contrasena: '' }
}

export function FormularioUsuarioModal({
  onClose,
  onSuccess,
  modoEdicion,
  usuario,
}: FormularioUsuarioModalProps) {
  const [form, setForm] = useState(() => initialForm(modoEdicion, usuario))
  const [confirmGuardarOpen, setConfirmGuardarOpen] = useState(false)
  const [pendingSave, setPendingSave] = useState<PendingUsuarioSave | null>(null)

  const createMutation = useCreateUsuarioMutation()
  const editMutation = useEditUsuarioMutation()
  const isPending = createMutation.isPending || editMutation.isPending

  const handleClose = () => {
    setConfirmGuardarOpen(false)
    setPendingSave(null)
    onClose()
  }

  const handleCancelConfirmacion = () => {
    setConfirmGuardarOpen(false)
    setPendingSave(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()

    if (!form.Username.trim() || !form.Correo.trim()) {
      showNotification({
        title: 'Usuarios',
        message: 'Usuario y correo son obligatorios.',
        variant: 'warning',
      })
      return
    }

    if (modoEdicion) {
      if (!usuario) {
        showNotification({
          title: 'Usuarios',
          message: 'No hay datos de usuario para actualizar.',
          variant: 'warning',
        })
        return
      }

      const payload: UsuarioEdicionDTO = {
        Id: form.Id,
        Username: form.Username.trim(),
        Correo: form.Correo.trim(),
        Contrasena: '',
        Estatus: usuario.Estatus,
      }
      setPendingSave({ mode: 'edit', payload })
      setConfirmGuardarOpen(true)
      return
    }

    if (!form.Contrasena.trim()) {
      showNotification({
        title: 'Usuarios',
        message: 'Completa usuario, correo y contraseña.',
        variant: 'warning',
      })
      return
    }

    const payload: UsuarioCreacionDTO = {
      Username: form.Username.trim(),
      Correo: form.Correo.trim(),
      Contrasena: form.Contrasena,
    }
    setPendingSave({ mode: 'create', payload })
    setConfirmGuardarOpen(true)
  }

  const handleConfirmGuardar = async () => {
    if (!pendingSave) return
    try {
      if (pendingSave.mode === 'edit') {
        const res = await editMutation.mutateAsync(pendingSave.payload)
        const { ok, mensaje } = mensajeRespuestaUsuario(res)
        if (ok) {
          showNotification({
            title: 'Usuario actualizado',
            message: mensaje || 'Operación correcta.',
            variant: 'success',
          })
          onSuccess?.()
          handleCancelConfirmacion()
          handleClose()
        } else {
          showNotification({
            title: 'Usuarios',
            message: mensaje || 'La operación no se completó.',
            variant: 'warning',
          })
        }
        return
      }

      const res = await createMutation.mutateAsync(pendingSave.payload)
      const { ok, mensaje } = mensajeRespuestaUsuario(res)
      if (ok) {
        showNotification({
          title: 'Usuario creado',
          message: mensaje || 'Operación correcta.',
          variant: 'success',
        })
        onSuccess?.()
        handleCancelConfirmacion()
        handleClose()
      } else {
        showNotification({
          title: 'Usuarios',
          message: mensaje || 'La operación no se completó.',
          variant: 'warning',
        })
      }
    } catch (e) {
      showNotification({
        title: 'Usuarios',
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
              <h2 className="text-xl font-semibold text-slate-900">{modoEdicion ? 'Editar usuario' : 'Nuevo usuario'}</h2>
            </div>
            <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={handleClose} aria-label="Cerrar modal">
              <FaTimes className="h-4 w-4" />
            </CustomButton>
          </header>

          <form className="space-y-5 p-6" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Usuario
              <input
                type="text"
                required
                value={form.Username}
                onChange={(e) => setForm((f) => ({ ...f, Username: e.target.value }))}
                placeholder="Ej. usuario_admin"
                className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              />
            </label>

            <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
              Correo
              <input
                type="email"
                required
                value={form.Correo}
                onChange={(e) => setForm((f) => ({ ...f, Correo: e.target.value }))}
                placeholder="ejemplo@correo.com"
                disabled={modoEdicion}
                className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100 disabled:bg-slate-100 disabled:text-slate-500 disabled:cursor-not-allowed"
              />
            </label>

            {!modoEdicion ? (
              <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
                Contraseña
                <input
                  type="password"
                  autoComplete="new-password"
                  required
                  value={form.Contrasena}
                  onChange={(e) => setForm((f) => ({ ...f, Contrasena: e.target.value }))}
                  className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
                />
              </label>
            ) : null}

            <div className="flex justify-end gap-2 border-t border-indigo-100/80 pt-5">
              <CustomButton type="button" variant="ghost" onClick={handleClose} disabled={isPending}>
                Cancelar
              </CustomButton>
              <CustomButton
                type="submit"
                variant="primary"
                className="bg-blue-600 text-white shadow-sm shadow-blue-200 transition hover:bg-blue-700"
                disabled={isPending || confirmGuardarOpen}
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
              {modoEdicion ? 'guardar los cambios de' : 'registrar'}
            </span>{' '}
            este usuario?
          </>
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isPending}
        additionalInfo={
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usuario:</span>
              <span className="text-sm font-medium text-slate-900">{form.Username.trim() || '—'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo:</span>
              <span className="text-sm font-medium text-slate-900">{form.Correo.trim() || '—'}</span>
            </div>
          </div>
        }
      />
    </Fragment>
  )
}
