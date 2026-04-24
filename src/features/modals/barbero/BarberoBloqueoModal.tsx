import { useState } from 'react'
import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '../../../components/Button'

type BarberoBloqueoModalProps = {
  open: boolean
  onClose: () => void
  onSave: (payload: { fecha: string; hora: string; motivo: string }) => void
}

export function BarberoBloqueoModal({ open, onClose, onSave }: BarberoBloqueoModalProps) {
  const [fecha, setFecha] = useState('')
  const [hora, setHora] = useState('')
  const [motivo, setMotivo] = useState('')

  if (!open) return null

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-xl rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20">
        <header className="flex items-center justify-between border-b border-indigo-100 bg-linear-to-r from-indigo-50/95 via-white to-blue-50/90 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Barbero</p>
            <h2 className="text-xl font-semibold text-slate-900">Bloquear horario</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={onClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <form
          className="grid gap-4 p-6"
          onSubmit={(event) => {
            event.preventDefault()
            if (!fecha || !hora || !motivo.trim()) return
            onSave({ fecha, hora, motivo })
            onClose()
            setFecha('')
            setHora('')
            setMotivo('')
          }}
        >
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Fecha
            <input
              type="date"
              required
              value={fecha}
              onChange={(event) => setFecha(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Hora
            <input
              type="time"
              required
              value={hora}
              onChange={(event) => setHora(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <label className="flex flex-col gap-1.5 text-sm font-semibold text-slate-700">
            Motivo
            <textarea
              required
              value={motivo}
              onChange={(event) => setMotivo(event.target.value)}
              rows={3}
              placeholder="Ej: Pausa de almuerzo o mantenimiento de silla"
              className="rounded-xl border border-slate-300 bg-white px-3.5 py-2.5 text-sm text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <div className="flex justify-end gap-2 border-t border-indigo-100/80 pt-5">
            <CustomButton type="button" variant="ghost" onClick={onClose}>
              Cancelar
            </CustomButton>
            <CustomButton type="submit" variant="primary">
              Guardar bloqueo
            </CustomButton>
          </div>
        </form>
      </section>
    </div>
  )
}
