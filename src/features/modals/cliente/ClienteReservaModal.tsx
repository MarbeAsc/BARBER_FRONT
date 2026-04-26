import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '../../../components/Button'
import {
  FormularioReservaModal,
  type FormularioReservaModalValues,
} from '../../forms/cliente/FormularioReservaModal'

type ClienteReservaModalProps = {
  open: boolean
  onClose: () => void
  onReservar: (values: FormularioReservaModalValues) => void
}

export function ClienteReservaModal({
  open,
  onClose,
  onReservar,
}: ClienteReservaModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-5xl overflow-hidden rounded-3xl border border-slate-200/90 bg-white shadow-2xl shadow-slate-900/20">
        <header className="flex items-center justify-between rounded-t-3xl border-b border-indigo-100 bg-linear-to-r from-indigo-50/95 via-white to-blue-50/90 px-6 py-5">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Cliente</p>
            <h2 className="text-xl font-semibold text-slate-900">Nueva reserva interactiva</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={onClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <div className="max-h-[80vh] overflow-auto p-6">
          <FormularioReservaModal
            onReservar={(values) => {
              onReservar(values)
              onClose()
            }}
          />
        </div>
      </section>
    </div>
  )
}
