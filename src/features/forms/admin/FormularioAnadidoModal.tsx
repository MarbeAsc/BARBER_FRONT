import { Fragment, useState, type FormEvent } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '@/components/Button'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'
import { useCreateAnadidoServicioMutation, useEditAnadidoServicioMutation } from '@/hooks/useAnadidosServicios'
import { showNotification } from '@/lib/notifications'
import type { AnadidoServicioDTO } from '@/services/añadidosService'

export type FormularioAnadidoModalProps = {
  onClose: () => void
  onSuccess?: () => void
  modoEdicion: boolean
  anadido: AnadidoServicioDTO | null
  servicioBaseId: number
}

function emptyForm(servicioBaseId: number): AnadidoServicioDTO {
  return {
    id: 0,
    nombre: '',
    descripcion: null,
    idPerteneciente: servicioBaseId > 0 ? servicioBaseId : null,
    precio: 0,
  }
}

function dtoFromRow(row: AnadidoServicioDTO): AnadidoServicioDTO {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    idPerteneciente: row.idPerteneciente,
    precio: row.precio,
  }
}

function initialForm(
  modoEdicion: boolean,
  anadido: AnadidoServicioDTO | null,
  servicioBaseId: number,
): AnadidoServicioDTO {
  return modoEdicion && anadido ? dtoFromRow(anadido) : emptyForm(servicioBaseId)
}

export function FormularioAnadidoModal({
  onClose,
  onSuccess,
  modoEdicion,
  anadido,
  servicioBaseId,
}: FormularioAnadidoModalProps) {
  const [form, setForm] = useState(() => initialForm(modoEdicion, anadido, servicioBaseId))
  const [confirmGuardarOpen, setConfirmGuardarOpen] = useState(false)
  const [pendingAnadido, setPendingAnadido] = useState<AnadidoServicioDTO | null>(null)

  const createMutation = useCreateAnadidoServicioMutation()
  const editMutation = useEditAnadidoServicioMutation()
  const isPending = createMutation.isPending || editMutation.isPending

  const handleClose = () => {
    setConfirmGuardarOpen(false)
    setPendingAnadido(null)
    onClose()
  }

  const handleCancelConfirmacion = () => {
    setConfirmGuardarOpen(false)
    setPendingAnadido(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nombre.trim()) {
      showNotification({
        title: 'Añadidos',
        message: 'El nombre es obligatorio.',
        variant: 'warning',
      })
      return
    }
    if (!modoEdicion && servicioBaseId <= 0) {
      showNotification({
        title: 'Añadidos',
        message: 'Indica un ID de servicio base válido antes de crear un añadido.',
        variant: 'warning',
      })
      return
    }

    const payload: AnadidoServicioDTO = {
      ...form,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() ? form.descripcion.trim() : null,
      idPerteneciente: modoEdicion ? form.idPerteneciente : servicioBaseId > 0 ? servicioBaseId : form.idPerteneciente,
    }
    setPendingAnadido(payload)
    setConfirmGuardarOpen(true)
  }

  const handleConfirmGuardar = () => {
    if (!pendingAnadido) return
    const mutation = modoEdicion ? editMutation : createMutation
    mutation.mutate(pendingAnadido, {
      onSuccess: (res) => {
        if (res.estatus) {
          showNotification({
            title: modoEdicion ? 'Añadido actualizado' : 'Añadido creado',
            message: res.descripcion || 'Operación correcta.',
            variant: 'success',
          })
          onSuccess?.()
          handleCancelConfirmacion()
          handleClose()
        } else {
          showNotification({
            title: 'Añadidos',
            message: res.descripcion || 'La operación no se completó.',
            variant: 'warning',
          })
        }
      },
      onError: (e) => {
        showNotification({
          title: 'Añadidos',
          message: e instanceof Error ? e.message : 'Error al guardar.',
          variant: 'error',
        })
      },
    })
  }

  return (
    <Fragment>
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Administrador</p>
            <h2 className="text-lg font-semibold text-slate-900">{modoEdicion ? 'Editar añadido' : 'Nuevo añadido'}</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={handleClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <form className="space-y-4 p-5" onSubmit={handleSubmit}>
          <p className="text-xs text-slate-500">
            Servicio base: <span className="font-semibold text-slate-800">{servicioBaseId > 0 ? servicioBaseId : '—'}</span>
          </p>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Nombre
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Descripción
            <textarea
              value={form.descripcion ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value || null }))}
              rows={3}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            />
          </label>

          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Precio extra (MXN)
            <input
              type="number"
              required
              min={0}
              step={0.01}
              value={form.precio}
              onChange={(e) => setForm((f) => ({ ...f, precio: Number(e.target.value) }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            />
          </label>

          <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
            <CustomButton type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
              Cancelar
            </CustomButton>
            <CustomButton type="submit" variant="primary" disabled={isPending || confirmGuardarOpen}>
              {modoEdicion ? 'Actualizar' : 'Guardar'}
            </CustomButton>
          </div>
        </form>
      </section>
    </div>

      <ConfirmacionDialog
        open={confirmGuardarOpen}
        onClose={handleCancelConfirmacion}
        onConfirm={handleConfirmGuardar}
        title="Confirmar acción"
        subtitle="Verifica los detalles antes de continuar"
        message={
          <>
            ¿Confirmas que deseas{' '}
            <span className="font-semibold text-slate-900">
              {modoEdicion ? 'guardar los cambios del' : 'registrar el'}
            </span>{' '}
            añadido al servicio?
          </>
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isPending}
        additionalInfo={
          pendingAnadido ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre:</span>
                <span className="text-sm font-medium text-slate-900">{pendingAnadido.nombre}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Precio extra:</span>
                <span className="text-sm font-medium text-slate-900">
                  {new Intl.NumberFormat('es-MX', { style: 'currency', currency: 'MXN' }).format(
                    pendingAnadido.precio,
                  )}
                </span>
              </div>
            </div>
          ) : null
        }
      />
    </Fragment>
  )
}
