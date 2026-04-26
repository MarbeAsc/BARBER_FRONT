import { useAuth } from '@/hooks/useAuthContext'
import { useBarberosListQuery } from '@/hooks/useBarberos'
import { useCitasByBarberoQuery, useCitasByUserQuery } from '@/hooks/useCitas'
import { decodeJwtPayload, isValidJwtToken } from '@/lib/jwt'
import type { CitaDTO } from '@/services/citaService'
import { useMemo } from 'react'
import { usePromocionesListQuery } from '@/hooks/usePromociones'
import { useServiciosQuery } from '@/hooks/useServicios'
import { useUsuariosListQuery } from '@/hooks/useUsuarios'
import { FaArrowRight, FaBullhorn, FaRegCalendarCheck } from 'react-icons/fa'
import { useNavigate } from 'react-router-dom'
import { CustomButton } from '../components/Button'
import { inferRoleFromEmail, roleLabel, type UserRole } from '../lib/roles'
import { showNotification } from '../lib/notifications'

type Kpi = {
  label: string
  value: string
  delta: string
}

type Appointment = {
  hour: string
  client: string
  service: string
  barber: string
  status: string
  statusClass: string
}

function resolveUserIdFromToken(token?: string | null): number | null {
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

function normalizeCitasPayload(payload: CitaDTO | CitaDTO[] | null | undefined): CitaDTO[] {
  if (!payload) return []
  return Array.isArray(payload) ? payload : [payload]
}

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatDate(value: string | Date): string {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function daysUntil(value: string | Date): number {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY
  const diff = date.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

function parseMetricValue(value: string): number {
  const parsed = Number.parseFloat(value.replace(',', '.'))
  return Number.isFinite(parsed) ? parsed : 0
}

export function Dashboard() {
  const { username, token } = useAuth()
  const navigate = useNavigate()
  const selectedRole = useMemo(
    () => username?.role ?? inferRoleFromEmail(username?.email ?? ''),
    [username?.role, username?.email],
  )
  const isAdmin = selectedRole === 'Administrador'
  const isCliente = selectedRole === 'Cliente'
  const isBarbero = selectedRole === 'Barbero'
  const currentUserId = useMemo(() => resolveUserIdFromToken(token), [token])
  const { data: promociones = [] } = usePromocionesListQuery({ enabled: isCliente || isAdmin })
  const { data: servicios = [] } = useServiciosQuery({ enabled: isAdmin })
  const { data: barberos = [] } = useBarberosListQuery({ enabled: isAdmin })
  const { data: usuarios = [] } = useUsuariosListQuery({ enabled: isAdmin })
  const { data: citasBarberoResponse } = useCitasByBarberoQuery(currentUserId ?? 0, {
    enabled: isBarbero && Boolean(currentUserId),
  })
  const { data: citasClienteResponse } = useCitasByUserQuery(currentUserId ?? 0, {
    enabled: isCliente && Boolean(currentUserId),
  })
  const citasBarbero = useMemo(() => normalizeCitasPayload(citasBarberoResponse), [citasBarberoResponse])
  const citasClienteActivas = useMemo(() => (citasClienteResponse ? 1 : 0), [citasClienteResponse])
  const clienteFavoritos = useMemo(() => citasClienteResponse?.servicios?.length ?? 0, [citasClienteResponse])
  const clienteUltimoCorte = useMemo(() => {
    const fecha = citasClienteResponse?.fechaInicio
    if (!fecha) return 'Sin historial'
    const date = toDate(fecha)
    if (Number.isNaN(date.getTime())) return 'Sin historial'
    const diffMs = Date.now() - date.getTime()
    if (diffMs < 0) return 'Pendiente'
    const days = Math.floor(diffMs / (1000 * 60 * 60 * 24))
    if (days === 0) return 'Hoy'
    if (days === 1) return 'Hace 1 dia'
    return `Hace ${days} dias`
  }, [citasClienteResponse])
  const barberoTotalCitas = citasBarbero.length
  const barberoAtendidas = useMemo(
    () => citasBarbero.filter((cita) => Number(cita.estatus) === 3).length,
    [citasBarbero],
  )
  const barberoTiempoPromedio = useMemo(() => {
    const durations = citasBarbero
      .map((cita) => {
        const inicio = toDate(cita.fechaInicio)
        const fin = toDate(cita.fechaTermino)
        if (Number.isNaN(inicio.getTime()) || Number.isNaN(fin.getTime())) return null
        const minutes = Math.round((fin.getTime() - inicio.getTime()) / 60000)
        return minutes > 0 ? minutes : null
      })
      .filter((value): value is number => value !== null)

    if (durations.length === 0) return 'N/D'
    const avg = Math.round(durations.reduce((acc, value) => acc + value, 0) / durations.length)
    return `${avg} min`
  }, [citasBarbero])
  const barberoSiguienteCita = useMemo(() => {
    const now = Date.now()
    const nextDate = citasBarbero
      .map((cita) => toDate(cita.fechaInicio))
      .filter((date) => !Number.isNaN(date.getTime()) && date.getTime() >= now)
      .sort((a, b) => a.getTime() - b.getTime())[0]

    if (!nextDate) return 'Sin citas'
    return nextDate.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false })
  }, [citasBarbero])
  const barberoAppointments = useMemo<Appointment[]>(
    () =>
      citasBarbero.map((cita, index) => ({
        hour: toDate(cita.fechaInicio).toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: false }),
        client: cita.idCliente ? `Cliente #${cita.idCliente}` : 'Cliente por confirmar',
        service: 'Servicio asignado',
        barber: username?.username ?? 'Tú',
        status: Number(cita.estatus) === 1 ? 'Confirmada' : 'Pendiente',
        statusClass: Number(cita.estatus) === 1 ? 'bg-emerald-100 text-emerald-700' : 'bg-blue-100 text-blue-700',
      })),
    [citasBarbero, username?.username],
  )

  const promocionesVigentesAll = useMemo(() => {
    const now = new Date()
    return promociones.filter((promo) => {
      const inicio = toDate(promo.fechaInicio)
      const fin = toDate(promo.fechaFin)
      return !Number.isNaN(inicio.getTime()) && !Number.isNaN(fin.getTime()) && now >= inicio && now <= fin
    })
  }, [promociones])

  const promocionesVigentes = useMemo(() => promocionesVigentesAll.slice(0, 4), [promocionesVigentesAll])
  const promocionesPorVencer = useMemo(
    () => promocionesVigentesAll.filter((promo) => daysUntil(promo.fechaFin) <= 3).length,
    [promocionesVigentesAll],
  )
  const promocionesNuevas = useMemo(
    () => promocionesVigentesAll.filter((promo) => daysUntil(promo.fechaInicio) >= -2).length,
    [promocionesVigentesAll],
  )
  const terminaHoy = useMemo(
    () => promocionesVigentesAll.filter((promo) => daysUntil(promo.fechaFin) <= 0).length,
    [promocionesVigentesAll],
  )
  const serviciosActivos = useMemo(() => servicios.filter((servicio) => Number(servicio.estatus) === 1).length, [servicios])
  const barberosActivos = useMemo(() => barberos.filter((barbero) => Number(barbero.estatus) === 1).length, [barberos])
  const usuariosActivos = useMemo(() => usuarios.filter((usuario) => Number(usuario.Estatus) === 1).length, [usuarios])

  const quickActionsByRole: Record<
    UserRole,
    Array<{ label: string; variant?: 'primary' | 'secondary'; onClick: () => void }>
  > = {
    Administrador: [
      {
        label: 'Gestionar servicios',
        variant: 'primary',
        onClick: () => navigate('/servicios'),
      },
      {
        label: 'Asignar barbero',
        variant: 'secondary',
        onClick: () => navigate('/barberos'),
      },
      {
        label: 'Administrar perfumes ',
        variant: 'secondary',
        onClick: () => navigate('/perfumes'),
      },
    ],
    Barbero: [
      {
        label: 'Iniciar siguiente cita',
        variant: 'primary',
        onClick: () => navigate('/mis-citas'),
      },
      {
        label: 'Ver promociones',
        variant: 'secondary',
        onClick: () => navigate('/promociones-barbero'),
      },
      {
        label: 'Historial del día',
        variant: 'secondary',
        onClick: () =>
          showNotification({
            title: 'Módulo en preparación',
            message: 'El historial detallado del día estará disponible pronto.',
            variant: 'info',
          }),
      },
    ],
    Cliente: [
      {
        label: 'Reservar cita',
        variant: 'primary',
        onClick: () => navigate('/mis-reservas'),
      },
      {
        label: 'Ver barberos disponibles',
        variant: 'secondary',
        onClick: () => navigate('/mis-reservas'),
      },
      
    ],
  }

  const kpisByRole: Record<UserRole, Kpi[]> = {
    Administrador: [
      { label: 'Servicios activos', value: String(serviciosActivos), delta: `${servicios.length} registrados` },
      { label: 'Barberos activos', value: String(barberosActivos), delta: `${barberos.length} registrados` },
      { label: 'Usuarios activos', value: String(usuariosActivos), delta: `${usuarios.length} en total` },
      { label: 'Promociones vigentes', value: String(promocionesVigentesAll.length), delta: `${promocionesPorVencer} por vencer` },
    ],
    Barbero: [
      { label: 'Mis citas hoy', value: String(citasBarbero.length), delta: 'Citas asignadas' },
      { label: 'Por atender', value: String(citasBarbero.length), delta: 'Agenda actual' },
      { label: 'Atendidas', value: '0', delta: 'Pendiente de seguimiento' },
      { label: 'Disponibilidad', value: 'N/D', delta: 'Consulta agenda detallada' },
    ],
    Cliente: [
      { label: 'Promociones activas', value: String(promocionesVigentesAll.length), delta: 'Disponibles ahora' },
      { label: 'Por vencer', value: String(promocionesPorVencer), delta: 'Terminan en menos de 3 días' },
      { label: 'Nuevas', value: String(promocionesNuevas), delta: 'Publicadas recientemente' },
      { label: 'Terminan hoy', value: String(terminaHoy), delta: 'Aprovéchalas hoy' },
    ],
  }

  const kpiActionsByRole: Record<UserRole, Array<() => void>> = {
    Administrador: [
      () => navigate('/servicios'),
      () => navigate('/barberos'),
      () => navigate('/usuarios'),
      () => navigate('/promociones'),
    ],
    Barbero: [
      () => navigate('/mis-citas'),
      () => navigate('/mis-citas'),
      () => navigate('/mis-citas'),
      () => navigate('/mis-citas'),
    ],
    Cliente: [
      () => navigate('/promociones-cliente'),
      () => navigate('/promociones-cliente'),
      () => navigate('/promociones-cliente'),
      () => navigate('/mis-reservas'),
    ],
  }

  const kpisForRole = kpisByRole[selectedRole]
  const kpiMaxValue = Math.max(1, ...kpisForRole.map((kpi) => parseMetricValue(kpi.value)))

  const appointmentsByRole: Record<UserRole, Appointment[]> = {
    Administrador: [
      {
        hour: '09:30',
        client: 'Carlos Mendoza',
        service: 'Corte + barba',
        barber: 'Luis',
        status: 'En curso',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '10:15',
        client: 'Miguel Torres',
        service: 'Fade premium',
        barber: 'Jorge',
        status: 'Confirmada',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
      {
        hour: '11:00',
        client: 'Andres Rivas',
        service: 'Corte clasico',
        barber: 'Dario',
        status: 'Pendiente',
        statusClass: 'bg-blue-100 text-blue-700',
      },
    ],
    Barbero: [
      ...barberoAppointments,
    ],
    Cliente: [
      {
        hour: '15:30',
        client: username?.username ?? 'Tu reserva',
        service: 'Corte clasico',
        barber: 'Luis',
        status: 'Disponible',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
      {
        hour: '16:15',
        client: username?.username ?? 'Tu reserva',
        service: 'Corte + barba',
        barber: 'Jorge',
        status: 'Pocas plazas',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '17:00',
        client: username?.username ?? 'Tu reserva',
        service: 'Perfilado',
        barber: 'Dario',
        status: 'Disponible',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
    ],
  }

  return (
    <div className="w-full min-w-0 bg-linear-to-b from-slate-100 via-slate-50 to-slate-100">
      <main className="mx-auto max-w-7xl px-4 py-8 text-slate-700 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-8 overflow-hidden rounded-3xl border border-slate-200/90 bg-white/95 shadow-sm shadow-slate-200/70 backdrop-blur">
          <div className="group relative">
            <img
              src="/logo+.jpg"
              alt="Barbería en acción"
              className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] sm:h-72 lg:h-80"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/55 via-indigo-900/20 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700 shadow-sm">
                Estado del sistema
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {selectedRole === 'Administrador' && 'Control central de operación'}
                {selectedRole === 'Barbero' && 'Agenda operativa del barbero'}
                {selectedRole === 'Cliente' && 'Gestión de reservas del cliente'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-blue-100/95">
                {selectedRole === 'Administrador' &&
                  'Monitorea servicios, usuarios y desempeño diario desde un único panel de administración.'}
                {selectedRole === 'Barbero' &&
                  'Revisa tus citas asignadas, controla tu disponibilidad y da seguimiento al estado de atención.'}
                {selectedRole === 'Cliente' &&
                  'Consulta servicios disponibles, selecciona barbero y agenda fecha/hora para tu próxima cita.'}
              </p>
            </div>
          </div>
        </section>

        <div className="mb-8 rounded-3xl border border-slate-200/90 bg-linear-to-r from-[#f3f7ff] via-[#eef4ff] to-[#f8fbff] px-6 py-5 shadow-sm shadow-slate-200/70">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">
            Resumen del día
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Buen día, {username?.username}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{username?.email}</p>
          <p className="mt-1 text-xs font-medium text-blue-700/90">
            Vista activa: {roleLabel(selectedRole)}
          </p>
        </div>
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpisForRole.map((card, index) => (
            <button
              key={card.label}
              type="button"
              onClick={kpiActionsByRole[selectedRole][index]}
              className="group rounded-2xl border border-slate-200/90 bg-linear-to-br from-white via-[#f9fbff] to-[#edf3ff] p-4 text-left shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-md hover:shadow-blue-100/60 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-blue-300"
            >
              <div className="mb-3 flex items-center justify-between gap-2">
                <span className="inline-flex h-1.5 w-9 rounded-full bg-linear-to-r from-sky-400 to-indigo-500" />
                <FaArrowRight className="h-3.5 w-3.5 text-slate-300 transition group-hover:translate-x-0.5 group-hover:text-indigo-600" />
              </div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500 transition group-hover:text-slate-600">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900 transition group-hover:text-indigo-700">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{card.delta}</p>
              <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100/90">
                <div
                  className="h-full rounded-full bg-linear-to-r from-sky-500 to-indigo-600 transition-all duration-500"
                  style={{ width: `${Math.max(12, Math.min(100, (parseMetricValue(card.value) / kpiMaxValue) * 100))}%` }}
                />
              </div>
            </button>
          ))}
        </section>

        <div className="mx-auto grid gap-6 lg:grid-cols-3">
          <section className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-sm shadow-slate-200/70 lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                {selectedRole === 'Administrador' && 'Estado operativo del sistema'}
                {selectedRole === 'Barbero' && 'Tus citas programadas'}
                {selectedRole === 'Cliente' && 'Promociones vigentes'}
              </h2>
              <span className="rounded-full bg-indigo-50 px-3 py-1 text-xs font-semibold text-indigo-700">
                {selectedRole === 'Administrador' && `${usuariosActivos} usuarios activos`}
                {selectedRole === 'Barbero' && `${citasBarbero.length} citas asignadas`}
                {selectedRole === 'Cliente' && `${promocionesVigentes.length} activas`}
              </span>
            </div>

            {selectedRole === 'Cliente' ? (
              promocionesVigentes.length > 0 ? (
                <div className="space-y-3">
                  {promocionesVigentes.map((promo) => {
                    const diasRestantes = daysUntil(promo.fechaFin)
                    const estadoClass =
                      diasRestantes <= 1
                        ? 'bg-rose-100 text-rose-700'
                        : diasRestantes <= 3
                          ? 'bg-amber-100 text-amber-700'
                          : 'bg-emerald-100 text-emerald-700'
                    const progreso = Math.max(8, Math.min(100, (7 - Math.max(diasRestantes, 0)) * 14))
                    return (
                      <article
                        key={promo.id}
                        className="group rounded-2xl border border-slate-200/80 bg-linear-to-br from-white via-white to-slate-50 p-4 shadow-sm transition-all duration-200 hover:-translate-y-0.5 hover:border-indigo-200 hover:shadow-md"
                      >
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div>
                            <span className="inline-flex items-center gap-1.5 rounded-full bg-indigo-50 px-2.5 py-1 text-[11px] font-semibold text-indigo-700">
                              <FaBullhorn className="h-3 w-3" />
                              Oferta activa
                            </span>
                            <p className="mt-2 text-sm font-semibold uppercase tracking-wide text-slate-900">
                              {promo.descripcion?.trim() || 'Promoción especial'}
                            </p>
                            <p className="mt-1 inline-flex items-center gap-1.5 text-xs text-slate-500">
                              <FaRegCalendarCheck className="h-3 w-3 text-blue-600" />
                              Inicio: {formatDate(promo.fechaInicio)}
                            </p>
                            <p className="text-xs text-slate-500">Fin: {formatDate(promo.fechaFin)}</p>
                          </div>
                          <div className="text-right">
                            <p className="text-xs text-slate-500">Disponibilidad</p>
                            <span className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${estadoClass}`}>
                              {diasRestantes <= 0 ? 'Termina hoy' : `Termina en ${diasRestantes} día(s)`}
                            </span>
                          </div>
                        </div>
                        <div className="mt-3 h-1.5 overflow-hidden rounded-full bg-slate-100">
                          <div
                            className={`h-full rounded-full transition-all duration-500 ${diasRestantes <= 1 ? 'bg-rose-500' : diasRestantes <= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                            style={{ width: `${progreso}%` }}
                          />
                        </div>
                        <div className="mt-3 flex justify-end">
                          <CustomButton
                            type="button"
                            size="sm"
                            variant="ghost"
                            className="group/btn"
                            onClick={() => navigate('/promociones-cliente')}
                          >
                            <span className="inline-flex items-center gap-2">
                              Ver promociones
                              <FaArrowRight className="h-3 w-3 transition-transform group-hover/btn:translate-x-0.5" />
                            </span>
                          </CustomButton>
                        </div>
                      </article>
                    )
                  })}
                </div>
              ) : (
                <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                  No hay promociones vigentes en este momento.
                </article>
              )
            ) : selectedRole === 'Administrador' ? (
              <div className="grid gap-3 sm:grid-cols-2">
                <article className="rounded-xl border border-blue-100/80 bg-blue-50/45 p-4 transition-colors hover:border-blue-200 hover:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Servicios</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{serviciosActivos}</p>
                  <p className="text-xs text-slate-500">Activos de {servicios.length} registrados</p>
                </article>
                <article className="rounded-xl border border-blue-100/80 bg-blue-50/45 p-4 transition-colors hover:border-blue-200 hover:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Barberos</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{barberosActivos}</p>
                  <p className="text-xs text-slate-500">Activos de {barberos.length} registrados</p>
                </article>
                <article className="rounded-xl border border-blue-100/80 bg-blue-50/45 p-4 transition-colors hover:border-blue-200 hover:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Usuarios</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{usuariosActivos}</p>
                  <p className="text-xs text-slate-500">Activos de {usuarios.length} en total</p>
                </article>
                <article className="rounded-xl border border-blue-100/80 bg-blue-50/45 p-4 transition-colors hover:border-blue-200 hover:bg-white">
                  <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Promociones</p>
                  <p className="mt-1 text-2xl font-semibold text-slate-900">{promocionesVigentesAll.length}</p>
                  <p className="text-xs text-slate-500">{promocionesPorVencer} por vencer en 3 días</p>
                </article>
              </div>
            ) : (
              <div className="space-y-3">
                {selectedRole === 'Barbero' && appointmentsByRole[selectedRole].length === 0 ? (
                  <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 text-sm text-slate-600">
                    No hay citas asignadas para mostrar en este momento.
                  </article>
                ) : (
                  appointmentsByRole[selectedRole].map((item) => (
                    <article
                      key={`${item.hour}-${item.client}`}
                      className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:border-indigo-200 hover:bg-white"
                    >
                      <div className="flex flex-wrap items-start justify-between gap-3">
                        <div>
                          <p className="text-lg font-semibold tracking-tight text-slate-900">
                            {item.hour}
                          </p>
                          <p className="text-sm font-medium text-slate-700">
                            {item.client}
                          </p>
                          <p className="text-xs text-slate-500">{item.service}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-slate-500">Barbero asignado</p>
                          <p className="text-sm font-semibold text-slate-800">
                            {item.barber}
                          </p>
                          <span
                            className={`mt-1 inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${item.statusClass}`}
                          >
                            {item.status}
                          </span>
                        </div>
                      </div>
                    </article>
                  ))
                )}
              </div>
            )}
          </section>

          <aside className="space-y-4">
            <section className="rounded-3xl border border-slate-200/90 bg-white/95 p-5 shadow-sm shadow-slate-200/70">
              <h3 className="text-sm font-semibold text-slate-900">
                {selectedRole === 'Administrador' && 'Panel administrativo'}
                {selectedRole === 'Barbero' && 'Resumen operativo'}
                {selectedRole === 'Cliente' && 'Tu cuenta'}
              </h3>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {selectedRole === 'Administrador' && `${usuariosActivos}/${usuarios.length}`}
                {selectedRole === 'Barbero' && `${barberoAtendidas}/${barberoTotalCitas}`}
                {selectedRole === 'Cliente' && `${citasClienteActivas}`}
              </p>
              <p className={`mt-1 text-xs ${selectedRole === 'Administrador' ? 'text-slate-600' : 'text-emerald-600'}`}>
                {selectedRole === 'Administrador' && 'Usuarios activos / total del sistema'}
                {selectedRole === 'Barbero' && 'Citas atendidas hoy'}
                {selectedRole === 'Cliente' && 'Reservas activas'}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-100/80 p-2.5 text-slate-600">
                  <p>
                    {selectedRole === 'Barbero' ? 'Tiempo promedio' : selectedRole === 'Cliente' ? 'Favoritos' : 'Servicios activos'}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedRole === 'Administrador' && `${serviciosActivos}`}
                    {selectedRole === 'Barbero' && barberoTiempoPromedio}
                    {selectedRole === 'Cliente' && `${clienteFavoritos}`}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100/80 p-2.5 text-slate-600">
                  <p>
                    {selectedRole === 'Barbero' ? 'Siguiente hueco' : selectedRole === 'Cliente' ? 'Ultimo corte' : 'Promos por vencer'}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedRole === 'Administrador' && `${promocionesPorVencer}`}
                    {selectedRole === 'Barbero' && barberoSiguienteCita}
                    {selectedRole === 'Cliente' && clienteUltimoCorte}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-3xl border border-blue-200/80 bg-linear-to-br from-[#eef4ff] via-[#f3f7ff] to-white p-5 shadow-sm shadow-blue-100/50">
              <h3 className="text-sm font-semibold text-slate-900">
                Acciones rapidas
              </h3>
              <div className="mt-3 space-y-2">
                {quickActionsByRole[selectedRole].map((action) => (
                  <CustomButton
                    key={action.label}
                    type="button"
                    variant={action.variant ?? 'secondary'}
                    size="lg"
                    className="w-full rounded-lg"
                    onClick={action.onClick}
                  >
                    {action.label}
                  </CustomButton>
                ))}
              </div>
            </section>
          </aside>
        </div>
      </main>
    </div>
  )
}
