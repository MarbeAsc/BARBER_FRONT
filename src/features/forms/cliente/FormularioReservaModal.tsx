import { Fragment, useMemo, useState, type FormEvent } from 'react'
import { CustomButton } from '../../../components/Button'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'
import { useAuth } from '@/hooks/useAuthContext'
import { useBarberosListQuery } from '@/hooks/useBarberos'
import { useCreateCitaMutation } from '@/hooks/useCitas'
import { useServiciosQuery } from '@/hooks/useServicios'
import { decodeJwtPayload, isValidJwtToken } from '@/lib/jwt'
import { showNotification } from '@/lib/notifications'
import type { CitaCreacionDTO } from '@/services/citaService'

export type FormularioReservaModalValues = {
  servicio: string
  barbero: string
  fecha: string
  hora: string
}

type FormularioReservaModalProps = {
  onReservar: (values: FormularioReservaModalValues) => void
}

export function FormularioReservaModal({ onReservar }: FormularioReservaModalProps) {
  const { token } = useAuth()
  const { data: servicios = [], isLoading: serviciosLoading } = useServiciosQuery()
  const { data: barberos = [], isLoading: barberosLoading } = useBarberosListQuery()

  const [servicioSeleccionadoId, setServicioSeleccionadoId] = useState(0)
  const [barberoSeleccionadoId, setBarberoSeleccionadoId] = useState(0)
  const [confirmReservarOpen, setConfirmReservarOpen] = useState(false)
  const [pendingReserva, setPendingReserva] = useState<FormularioReservaModalValues | null>(null)
  const [pendingPayload, setPendingPayload] = useState<CitaCreacionDTO | null>(null)
  const createCitaMutation = useCreateCitaMutation()
  const barberosDisponibles = useMemo(
    () => barberos.filter((barbero) => Number(barbero.estatus) === 1),
    [barberos],
  )
  const servicioSeleccionado = useMemo(
    () => servicios.find((servicio) => servicio.id === servicioSeleccionadoId) ?? null,
    [servicioSeleccionadoId, servicios],
  )
  const [fechaHoraSeleccionada, setFechaHoraSeleccionada] = useState('')
  const isPending = createCitaMutation.isPending || serviciosLoading || barberosLoading

  const handleCancelConfirmacion = () => {
    setConfirmReservarOpen(false)
    setPendingReserva(null)
    setPendingPayload(null)
  }

  const pad2 = (value: number): string => String(value).padStart(2, '0')

  const formatLocalDateTime = (date: Date): string => {
    return `${date.getFullYear()}-${pad2(date.getMonth() + 1)}-${pad2(date.getDate())}T${pad2(date.getHours())}:${pad2(
      date.getMinutes(),
    )}:00`
  }

  const parseDateTimeLocal = (value: string): Date => {
    const [datePart = '', timePart = ''] = value.split('T')
    const [year = '0', month = '1', day = '1'] = datePart.split('-')
    const [hours = '0', minutes = '0'] = timePart.split(':')
    return new Date(Number(year), Number(month) - 1, Number(day), Number(hours), Number(minutes), 0, 0)
  }

  const addMinutesLocal = (value: string, minutes: number): string => {
    const date = parseDateTimeLocal(value)
    date.setMinutes(date.getMinutes() + minutes)
    return formatLocalDateTime(date)
  }

  const splitLocalDateTime = (value: string): { fecha: string; hora: string } => {
    const [fecha = '', time = ''] = value.split('T')
    const [hours = '', minutes = ''] = time.split(':')
    return { fecha, hora: `${hours}:${minutes}` }
  }

  const resolveClienteIdFromToken = (): number | null => {
    if (!isValidJwtToken(token)) return null
    const payload = decodeJwtPayload<Record<string, unknown>>(token) ?? {}
    const rawId =
      payload.id ??
      payload.userId ??
      payload.idUsuario ??
      payload.idusuario ??
      payload.IdUsuario ??
      payload.sub ??
      payload.nameid ??
      payload['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier']

    if (typeof rawId === 'number' && Number.isFinite(rawId) && rawId > 0) return rawId
    if (typeof rawId === 'string') {
      const parsed = Number(rawId)
      if (Number.isFinite(parsed) && parsed > 0) return parsed
    }
    return null
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    const formData = new FormData(event.currentTarget)
    const servicioId = Number(formData.get('servicio') ?? 0)
    const barberoId = Number(formData.get('barbero') ?? 0)
    const fechaHora = String(formData.get('fechaHora') ?? '')
    if (!servicioId || !barberoId || !fechaHora) return

    const servicio = servicios.find((item) => item.id === servicioId)
    const barbero = barberosDisponibles.find((item) => item.id === barberoId)

    if (!servicio || !barbero) {
      showNotification({
        title: 'Reservas',
        message: 'Selecciona un servicio y un barbero válidos.',
        variant: 'warning',
      })
      return
    }

    const fechaInicio = `${fechaHora}:00`
    const fechaTermino = addMinutesLocal(fechaHora, 60)
    const idCliente = resolveClienteIdFromToken()

    if (!idCliente) {
      showNotification({
        title: 'Reservas',
        message: 'No se pudo obtener el id del cliente desde el token. Inicia sesión de nuevo.',
        variant: 'error',
      })
      return
    }

    setPendingPayload({
      id: 0,
      fechaInicio,
      fechaTermino,
      idCliente,
      estatus: 1,
      servicios: [
        {
          id: 0,
          idCita: null,
          idBarbero: barbero.id,
          idServicio: servicio.id,
          precio: servicio.precioBase ?? 0,
        },
      ],
    })
    const { fecha, hora } = splitLocalDateTime(fechaHora)
    setPendingReserva({ servicio: servicio.nombre, barbero: barbero.nombreUsuario, fecha, hora })
    setConfirmReservarOpen(true)
  }

  const handleConfirmReservar = async () => {
    if (!pendingReserva || !pendingPayload) return

    try {
      const res = await createCitaMutation.mutateAsync(pendingPayload)
      if (res.estatus) {
        onReservar(pendingReserva)
        handleCancelConfirmacion()
        showNotification({
          title: 'Reserva registrada',
          message: res.descripcion || 'Tu cita fue creada correctamente.',
          variant: 'success',
        })
      } else {
        handleCancelConfirmacion()
        showNotification({
          title: 'Reservas',
          message: res.descripcion || 'No se pudo crear la cita.',
          variant: 'warning',
        })
      }
    } catch (error) {
      handleCancelConfirmacion()
      showNotification({
        title: 'Reservas',
        message: error instanceof Error ? error.message : 'Error al crear la cita.',
        variant: 'error',
      })
    }
  }

  return (
    <Fragment>
      <section className="mb-2 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/60">
        <div className="mb-4 rounded-xl border border-indigo-100 bg-linear-to-r from-indigo-50/65 via-white to-blue-50/55 p-3">
          <p className="text-xs font-semibold uppercase tracking-wide text-slate-600">Servicios disponibles</p>
          <div className="mt-2 flex flex-wrap gap-2">
            {servicios.map((servicio) => (
              <span
                key={servicio.nombre}
                className="inline-flex rounded-full border border-slate-300 bg-white px-3 py-1 text-xs font-semibold text-slate-700"
              >
                {servicio.nombre} (${servicio.precioBase})
              </span>
            ))}
          </div>
        </div>

        <form className="grid gap-3 sm:grid-cols-5" onSubmit={handleSubmit}>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
            Servicio
            <select
              name="servicio"
              value={servicioSeleccionadoId > 0 ? String(servicioSeleccionadoId) : ''}
              onChange={(event) => setServicioSeleccionadoId(Number(event.target.value))}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            >
              <option value="" disabled>
                {serviciosLoading ? 'Cargando servicios...' : 'Selecciona un servicio'}
              </option>
              {servicios.map((servicio) => (
                <option key={servicio.id} value={servicio.id}>
                  {servicio.nombre}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
            Barbero
            <select
              key={servicioSeleccionadoId}
              name="barbero"
              value={barberoSeleccionadoId > 0 ? String(barberoSeleccionadoId) : ''}
              onChange={(event) => setBarberoSeleccionadoId(Number(event.target.value))}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
              required
            >
              <option value="" disabled>
                {barberosLoading ? 'Cargando barberos...' : 'Selecciona un barbero'}
              </option>
              {barberosDisponibles.map((barbero) => (
                <option key={barbero.id} value={barbero.id}>
                  {barbero.nombreUsuario}
                </option>
              ))}
            </select>
          </label>
          <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700 sm:col-span-2">
            Fecha y hora de la cita
            <input
              name="fechaHora"
              type="datetime-local"
              required
              value={fechaHoraSeleccionada}
              onChange={(event) => setFechaHoraSeleccionada(event.target.value)}
              className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
            />
          </label>
          <div className="flex items-end">
            <CustomButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full rounded-lg"
              disabled={isPending || confirmReservarOpen}
            >
              Confirmar cita
            </CustomButton>
          </div>
        </form>
      </section>
      <ConfirmacionDialog
        open={confirmReservarOpen}
        onClose={handleCancelConfirmacion}
        onConfirm={() => void handleConfirmReservar()}
        title="Confirmar cita"
        subtitle="Verifica los datos antes de reservar"
        message="¿Deseas confirmar esta cita?"
        confirmText="Confirmar"
        cancelText="Cancelar"
        loading={isPending}
        additionalInfo={
          pendingReserva ? (
            <div className="space-y-2">
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Servicio:</span>
                <span className="text-sm font-medium text-slate-900">{pendingReserva.servicio}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Barbero:</span>
                <span className="text-sm font-medium text-slate-900">{pendingReserva.barbero}</span>
              </div>
              <div className="flex flex-wrap items-center gap-2">
                <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Fecha y hora:</span>
                <span className="text-sm font-medium text-slate-900">
                  {pendingReserva.fecha} {pendingReserva.hora}
                </span>
              </div>
              {servicioSeleccionado ? (
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Termina:</span>
                  <span className="text-sm font-medium text-slate-900">
                    {pendingPayload?.fechaTermino?.replace('T', ' ') ?? '—'}
                  </span>
                </div>
              ) : null}
            </div>
          ) : null
        }
      />
    </Fragment>
  )
}
