import { useMemo, useState, type FormEvent } from 'react'
import { CustomButton } from '../../../components/Button'

export type ServicioOption = {
  nombre: string
  barberos: string[]
}

export type ClienteReservaFormValues = {
  servicio: string
  barbero: string
  fecha: string
  hora: string
}

type ClienteReservaFormProps = {
  servicios: ServicioOption[]
  horasDisponibles: string[]
  onReservar: (values: ClienteReservaFormValues) => void
}

export function ClienteReservaForm({ servicios, horasDisponibles, onReservar }: ClienteReservaFormProps) {
  const firstServicio = servicios[0]?.nombre ?? ''
  const [servicioSeleccionado, setServicioSeleccionado] = useState(firstServicio)
  const barberosDisponibles = useMemo(() => {
    const servicio = servicios.find((item) => item.nombre === servicioSeleccionado)
    return servicio?.barberos ?? []
  }, [servicioSeleccionado, servicios])
  const defaultHora = horasDisponibles[0] ?? ''

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const servicio = String(formData.get('servicio') ?? '')
    const barbero = String(formData.get('barbero') ?? '')
    const fecha = String(formData.get('fecha') ?? '')
    const hora = String(formData.get('hora') ?? '')
    if (!servicio || !barbero || !fecha || !hora) return
    onReservar({ servicio, barbero, fecha, hora })
    event.currentTarget.reset()
  }

  return (
    <section className="mb-2 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="mb-4 rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50/65 via-white to-blue-50/55 p-3">
        <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Servicios disponibles</p>
        <div className="mt-2 flex flex-wrap gap-2">
          {servicios.map((servicio) => (
            <span
              key={servicio.nombre}
              className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
            >
              {servicio.nombre} ({servicio.barberos.length} barberos)
            </span>
          ))}
        </div>
      </div>

      <form className="grid gap-3 sm:grid-cols-5" onSubmit={handleSubmit}>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
          Servicio
          <select
            name="servicio"
            value={servicioSeleccionado}
            onChange={(event) => setServicioSeleccionado(event.target.value)}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {servicios.map((servicio) => (
              <option key={servicio.nombre} value={servicio.nombre}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
          Barbero
          <select
            key={servicioSeleccionado}
            name="barbero"
            defaultValue={barberosDisponibles[0] ?? ''}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {barberosDisponibles.map((barbero) => (
              <option key={`${servicioSeleccionado}-${barbero}`} value={barbero}>
                {barbero}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
          Fecha
          <input
            name="fecha"
            type="date"
            required
            className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
          Hora
          <select
            name="hora"
            required
            defaultValue={defaultHora}
            className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          >
            {horasDisponibles.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <CustomButton
            type="submit"
            variant="primary"
            size="lg"
            className="w-full rounded-lg"
          >
            Confirmar cita
          </CustomButton>
        </div>
      </form>
    </section>
  )
}
