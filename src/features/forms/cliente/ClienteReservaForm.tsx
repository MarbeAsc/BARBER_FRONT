import { useMemo, useState, type FormEvent } from 'react'

type ServicioOption = {
  nombre: string
  barberos: string[]
}

type ClienteReservaFormValues = {
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
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="mb-4 rounded-xl border border-slate-200 bg-slate-50/80 p-3">
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
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Servicio
          <select
            name="servicio"
            value={servicioSeleccionado}
            onChange={(event) => setServicioSeleccionado(event.target.value)}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
          >
            {servicios.map((servicio) => (
              <option key={servicio.nombre} value={servicio.nombre}>
                {servicio.nombre}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Barbero
          <select
            key={servicioSeleccionado}
            name="barbero"
            defaultValue={barberosDisponibles[0] ?? ''}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
          >
            {barberosDisponibles.map((barbero) => (
              <option key={`${servicioSeleccionado}-${barbero}`} value={barbero}>
                {barbero}
              </option>
            ))}
          </select>
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Fecha
          <input
            name="fecha"
            type="date"
            required
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Hora
          <select
            name="hora"
            required
            defaultValue={defaultHora}
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
          >
            {horasDisponibles.map((hora) => (
              <option key={hora} value={hora}>
                {hora}
              </option>
            ))}
          </select>
        </label>
        <div className="flex items-end">
          <button
            type="submit"
            className="w-full rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Confirmar cita
          </button>
        </div>
      </form>
    </section>
  )
}
