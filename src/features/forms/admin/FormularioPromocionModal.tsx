import { Fragment, useMemo, useState, type FormEvent } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '@/components/Button'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'
import { useCreatePromocionMutation, useEditPromocionMutation } from '@/hooks/usePromociones'
import { showNotification } from '@/lib/notifications'
import type { PromocionDTO } from '@/services/promocionesSevice'

export type FormularioPromocionModalProps = {
  onClose: () => void
  onSuccess?: () => void
  modoEdicion: boolean
  promocion: PromocionDTO | null
}

type PromocionFormState = {
  id: number
  descripcion: string
  fechaInicio: string
  fechaFin: string
}

function toInputDateTime(value: Date | string | null | undefined): string {
  if (!value) return ''
  const date = value instanceof Date ? value : new Date(value)
  if (Number.isNaN(date.getTime())) return ''
  const pad = (n: number) => String(n).padStart(2, '0')
  return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
    date.getMinutes(),
  )}`
}

function initialForm(modoEdicion: boolean, promocion: PromocionDTO | null): PromocionFormState {
  if (!modoEdicion || !promocion) {
    return { id: 0, descripcion: '', fechaInicio: '', fechaFin: '' }
  }
  return {
    id: promocion.id,
    descripcion: promocion.descripcion ?? '',
    fechaInicio: toInputDateTime(promocion.fechaInicio),
    fechaFin: toInputDateTime(promocion.fechaFin),
  }
}

export function FormularioPromocionModal({ onClose, onSuccess, modoEdicion, promocion }: FormularioPromocionModalProps) {
  const [form, setForm] = useState<PromocionFormState>(() => initialForm(modoEdicion, promocion))
  const [confirmGuardarOpen, setConfirmGuardarOpen] = useState(false)
  const [pendingPromocion, setPendingPromocion] = useState<PromocionDTO | null>(null)

  const createMutation = useCreatePromocionMutation()
  const editMutation = useEditPromocionMutation()
  const isPending = createMutation.isPending || editMutation.isPending

  const fechasInvalidas = useMemo(() => {
    if (!form.fechaInicio || !form.fechaFin) return false
    return new Date(form.fechaInicio) > new Date(form.fechaFin)
  }, [form.fechaInicio, form.fechaFin])

  const handleClose = () => {
    setConfirmGuardarOpen(false)
    setPendingPromocion(null)
    onClose()
  }

  const handleCancelConfirmacion = () => {
    setConfirmGuardarOpen(false)
    setPendingPromocion(null)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.descripcion.trim()) {
      showNotification({ title: 'Promociones', message: 'La descripción es obligatoria.', variant: 'warning' })
      return
    }
    if (!form.fechaInicio || !form.fechaFin) {
      showNotification({ title: 'Promociones', message: 'Debes indicar fecha inicio y fecha fin.', variant: 'warning' })
      return
    }
    if (fechasInvalidas) {
      showNotification({
        title: 'Promociones',
        message: 'La fecha de inicio no puede ser mayor a la fecha fin.',
        variant: 'warning',
      })
      return
    }

    setPendingPromocion({
      id: modoEdicion && promocion ? promocion.id : 0,
      descripcion: form.descripcion.trim(),
      fechaInicio: new Date(form.fechaInicio),
      fechaFin: new Date(form.fechaFin),
    })
    setConfirmGuardarOpen(true)
  }

  const handleConfirmGuardar = async () => {
    if (!pendingPromocion) return
    const mutation = modoEdicion ? editMutation : createMutation
    try {
      const res = await mutation.mutateAsync(pendingPromocion)
      if (res.estatus) {
        showNotification({
          title: modoEdicion ? 'Promoción actualizada' : 'Promoción creada',
          message: res.descripcion || 'Operación correcta.',
          variant: 'success',
        })
        onSuccess?.()
        handleCancelConfirmacion()
        handleClose()
      } else {
        showNotification({
          title: 'Promociones',
          message: res.descripcion || 'La operación no se completó.',
          variant: 'warning',
        })
      }
    } catch (e) {
      showNotification({
        title: 'Promociones',
        message: e instanceof Error ? e.message : 'Error al guardar promoción.',
        variant: 'error',
      })
    }
  }

  return (
    <Fragment>
      <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
        <section className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-2xl border border-slate-200 bg-white shadow-2xl">
          <header className="sticky top-0 z-10 flex items-center justify-between border-b border-slate-200 bg-white px-5 py-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Administrador</p>
              <h2 className="text-lg font-semibold text-slate-900">
                {modoEdicion ? 'Editar promoción' : 'Nueva promoción'}
              </h2>
            </div>
            <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={handleClose} aria-label="Cerrar modal">
              <FaTimes className="h-4 w-4" />
            </CustomButton>
          </header>

          <form className="space-y-4 p-5" onSubmit={handleSubmit}>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Descripción
              <textarea
                value={form.descripcion}
                onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value }))}
                rows={4}
                required
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
              />
            </label>

            <div className="grid gap-4 sm:grid-cols-2">
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Fecha inicio
                <input
                  type="datetime-local"
                  required
                  value={form.fechaInicio}
                  onChange={(e) => setForm((f) => ({ ...f, fechaInicio: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                />
              </label>
              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Fecha fin
                <input
                  type="datetime-local"
                  required
                  value={form.fechaFin}
                  onChange={(e) => setForm((f) => ({ ...f, fechaFin: e.target.value }))}
                  className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
                />
              </label>
            </div>

            {fechasInvalidas ? (
              <p className="rounded-lg border border-amber-200 bg-amber-50 px-3 py-2 text-xs font-medium text-amber-900">
                Revisa las fechas: inicio no puede ser mayor que fin.
              </p>
            ) : null}

            <div className="flex justify-end gap-2 border-t border-slate-100 pt-4">
              <CustomButton type="button" variant="secondary" onClick={handleClose} disabled={isPending}>
                Cancelar
              </CustomButton>
              <CustomButton type="submit" variant="primary" disabled={isPending || confirmGuardarOpen || fechasInvalidas}>
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
            <span className="font-semibold text-slate-900">{modoEdicion ? 'guardar los cambios de la' : 'registrar la'}</span>{' '}
            promoción?
          </>
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isPending}
        additionalInfo={
          pendingPromocion ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Descripción:</span>
                <span className="text-sm font-medium text-slate-900">{pendingPromocion.descripcion}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Vigencia:</span>
                <span className="text-sm font-medium text-slate-900">
                  {toInputDateTime(pendingPromocion.fechaInicio)} - {toInputDateTime(pendingPromocion.fechaFin)}
                </span>
              </div>
            </div>
          ) : null
        }
      />
    </Fragment>
  )
}
