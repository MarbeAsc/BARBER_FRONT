import { FaTimes } from 'react-icons/fa'
import { CustomButton } from '../../../components/Button'
import {
  ClienteReservaForm,
  type ClienteReservaFormValues,
  type ServicioOption,
} from '../../forms/cliente/ClienteReservaForm'

type ClienteReservaModalProps = {
  open: boolean
  onClose: () => void
  servicios: ServicioOption[]
  horasDisponibles: string[]
  onReservar: (values: ClienteReservaFormValues) => void
}

export function ClienteReservaModal({
  open,
  onClose,
  servicios,
  horasDisponibles,
  onReservar,
}: ClienteReservaModalProps) {
  if (!open) return null

  return (
    <div className="fixed inset-0 z-1100 flex items-center justify-center bg-slate-950/55 p-4 backdrop-blur-sm">
      <section className="w-full max-w-5xl rounded-2xl border border-slate-200 bg-white shadow-2xl">
        <header className="flex items-center justify-between border-b border-slate-200 px-5 py-4">
          <div>
            <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Cliente</p>
            <h2 className="text-lg font-semibold text-slate-900">Nueva reserva interactiva</h2>
          </div>
          <CustomButton type="button" variant="ghost" iconOnly tooltip="Cerrar" onClick={onClose} aria-label="Cerrar modal">
            <FaTimes className="h-4 w-4" />
          </CustomButton>
        </header>

        <div className="max-h-[80vh] overflow-auto p-5">
          <ClienteReservaForm
            servicios={servicios}
            horasDisponibles={horasDisponibles}
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
