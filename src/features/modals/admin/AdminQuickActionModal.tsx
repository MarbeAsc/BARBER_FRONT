import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '../../../components/Button'

type AdminQuickActionModalProps = {
  open: boolean
  entity: string
  onClose: () => void
  onConfirm: (value: string) => void
}

export function AdminQuickActionModal({
  open,
  entity,
  onClose,
  onConfirm,
}: AdminQuickActionModalProps) {
  const [value, setValue] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Administrador</p>
            <h2 className="text-lg font-semibold text-slate-900">Accion rapida de {entity}</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={onClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <form
          className="space-y-4 p-5"
          onSubmit={(event) => {
            event.preventDefault()
            if (!value.trim()) return
            onConfirm(value.trim())
            setValue('')
            onClose()
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Nombre del nuevo registro
            <input
              type="text"
              required
              value={value}
              onChange={(event) => setValue(event.target.value)}
              placeholder={`Ej: Nuevo ${entity}`}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm text-slate-700 outline-none transition focus:border-blue-500"
            />
          </label>
          <div className="flex justify-end gap-2">
            <CustomButton type="button" variant="secondary" onClick={onClose}>
              Cancelar
            </CustomButton>
            <CustomButton type="submit" variant="primary">
              Guardar
            </CustomButton>
          </div>
        </form>
      </section>
    </div>
  )
}
