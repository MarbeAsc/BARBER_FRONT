import { Fragment, useState, type ChangeEvent, type FormEvent } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '@/components/Button'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'
import { useCreatePerfumeMutation, useEditPerfumeMutation } from '@/hooks/usePerfumes'
import { mensajePrimeraRespuestaLista } from '@/lib/respuesta-api'
import { showNotification } from '@/lib/notifications'
import type { PerfumeConArchivoDTO, PerfumeDTO } from '@/services/perfumesService'

export type FormularioPerfumeModalProps = {
  onClose: () => void
  onSuccess?: () => void
  modoEdicion: boolean
  perfume: PerfumeDTO | null
}

type PerfumeFormFields = Omit<PerfumeConArchivoDTO, 'disponible'>

function emptyForm(): PerfumeFormFields {
  return {
    id: 0,
    nombre: '',
    descripcion: null,
    base64: null,
    archivo: null,
  }
}

function dtoFromRow(row: PerfumeDTO): PerfumeFormFields {
  return {
    id: row.id,
    nombre: row.nombre,
    descripcion: row.descripcion,
    base64: row.base64,
    archivo: null,
  }
}

function initialForm(modoEdicion: boolean, perfume: PerfumeDTO | null): PerfumeFormFields {
  return modoEdicion && perfume ? dtoFromRow(perfume) : emptyForm()
}

function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '')
    reader.onerror = () => reject(reader.error)
    reader.readAsDataURL(file)
  })
}

export function FormularioPerfumeModal({
  onClose,
  onSuccess,
  modoEdicion,
  perfume,
}: FormularioPerfumeModalProps) {
  const [form, setForm] = useState(() => initialForm(modoEdicion, perfume))
  const [archivoPreview, setArchivoPreview] = useState<File | null>(null)
  const [archivoPreviewDataUrl, setArchivoPreviewDataUrl] = useState<string | null>(null)
  const [confirmGuardarOpen, setConfirmGuardarOpen] = useState(false)
  const [pendingPerfume, setPendingPerfume] = useState<PerfumeConArchivoDTO | null>(null)

  const createMutation = useCreatePerfumeMutation()
  const editMutation = useEditPerfumeMutation()
  const isPending = createMutation.isPending || editMutation.isPending

  const handleArchivoChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null
    setArchivoPreview(file)
    if (!file) {
      setArchivoPreviewDataUrl(null)
      return
    }
    const reader = new FileReader()
    reader.onload = () => {
      setArchivoPreviewDataUrl(typeof reader.result === 'string' ? reader.result : null)
    }
    reader.readAsDataURL(file)
  }

  const handleClose = () => {
    setConfirmGuardarOpen(false)
    setPendingPerfume(null)
    onClose()
  }

  const handleCancelConfirmacion = () => {
    setConfirmGuardarOpen(false)
    setPendingPerfume(null)
  }

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nombre.trim()) {
      showNotification({
        title: 'Perfumes',
        message: 'El nombre es obligatorio.',
        variant: 'warning',
      })
      return
    }

    let base64 = form.base64
    if (archivoPreview) {
      try {
        base64 = await fileToBase64(archivoPreview)
      } catch {
        showNotification({
          title: 'Perfumes',
          message: 'No se pudo leer la imagen seleccionada.',
          variant: 'error',
        })
        return
      }
    }

    const payload: PerfumeConArchivoDTO = {
      ...form,
      nombre: form.nombre.trim(),
      descripcion: form.descripcion?.trim() ? form.descripcion.trim() : null,
      base64,
      archivo: null,
      disponible: modoEdicion && perfume ? perfume.disponible : true,
    }
    setPendingPerfume(payload)
    setConfirmGuardarOpen(true)
  }

  const handleConfirmGuardar = async () => {
    if (!pendingPerfume) return
    const mutation = modoEdicion ? editMutation : createMutation
    try {
      const res = await mutation.mutateAsync(pendingPerfume)
      const { ok, mensaje } = mensajePrimeraRespuestaLista(res)
      if (ok) {
        showNotification({
          title: modoEdicion ? 'Perfume actualizado' : 'Perfume creado',
          message: mensaje || 'Operación correcta.',
          variant: 'success',
        })
        onSuccess?.()
        handleCancelConfirmacion()
        handleClose()
      } else {
        showNotification({
          title: 'Perfumes',
          message: mensaje || 'La operación no se completó.',
          variant: 'warning',
        })
      }
    } catch (e) {
      showNotification({
        title: 'Perfumes',
        message: e instanceof Error ? e.message : 'Error al guardar.',
        variant: 'error',
      })
    }
  }

  const previewSrc =
    archivoPreviewDataUrl ??
    (form.base64?.trim()
      ? form.base64.startsWith('data:')
        ? form.base64
        : `data:image/jpeg;base64,${form.base64}`
      : null)

  return (
    <Fragment>
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/60 p-4 backdrop-blur-sm">
      <section className="max-h-[92vh] w-full max-w-2xl overflow-y-auto rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20">
        <header className="sticky top-0 z-10 flex items-center justify-between border-b border-indigo-100 bg-linear-to-r from-indigo-50/95 via-white to-blue-50/90 px-6 py-5 backdrop-blur">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Administrador</p>
            <h2 className="text-xl font-semibold text-slate-900">{modoEdicion ? 'Editar perfume' : 'Nuevo perfume'}</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={handleClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <form className="space-y-5 p-6" onSubmit={(e) => void handleSubmit(e)}>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Nombre
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(e) => setForm((f) => ({ ...f, nombre: e.target.value }))}
              placeholder="Ej. Aqua Intense"
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Descripción
            <textarea
              value={form.descripcion ?? ''}
              onChange={(e) => setForm((f) => ({ ...f, descripcion: e.target.value || null }))}
              rows={3}
              placeholder="Notas o detalles del perfume"
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition placeholder:text-slate-400 focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Imagen (opcional)
            <div className="rounded-xl border border-dashed border-indigo-200 bg-indigo-50/50 px-3.5 py-3">
              <input
                type="file"
                accept="image/*"
                onChange={handleArchivoChange}
                className="w-full text-sm text-slate-600 file:mr-3 file:rounded-lg file:border-0 file:bg-indigo-100 file:px-3.5 file:py-2 file:text-sm file:font-semibold file:text-indigo-700"
              />
              <p className="mt-2 text-xs font-medium text-slate-500">Arrastra o selecciona una imagen para este perfume.</p>
            </div>
          </label>
          {previewSrc ? (
            <div className="flex items-center gap-3 rounded-xl border border-slate-200 bg-slate-50 p-3">
              <img src={previewSrc} alt="" className="h-16 w-16 rounded-lg border border-slate-200 object-cover" />
              <p className="text-xs text-slate-500">Vista previa</p>
            </div>
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
              {modoEdicion ? 'guardar los cambios del' : 'registrar el'}
            </span>{' '}
            perfume?
          </>
        }
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isPending}
        additionalInfo={
          pendingPerfume ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre:</span>
                <span className="text-sm font-medium text-slate-900">{pendingPerfume.nombre}</span>
              </div>
            </div>
          ) : null
        }
      />
    </Fragment>
  )
}
