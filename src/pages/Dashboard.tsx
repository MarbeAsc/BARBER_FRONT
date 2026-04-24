import { useAuth } from '@/hooks/useAuthContext'
import { useBarberosListQuery } from '@/hooks/useBarberos'
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
  const { username } = useAuth()
  const navigate = useNavigate()
  const selectedRole = useMemo(
    () => username?.role ?? inferRoleFromEmail(username?.email ?? ''),
    [username?.role, username?.email],
  )
  const isAdmin = selectedRole === 'Administrador'
  const isCliente = selectedRole === 'Cliente'
  const { data: promociones = [] } = usePromocionesListQuery({ enabled: isCliente || isAdmin })
  const { data: servicios = [] } = useServiciosQuery({ enabled: isAdmin })
  const { data: barberos = [] } = useBarberosListQuery({ enabled: isAdmin })
  const { data: usuarios = [] } = useUsuariosListQuery({ enabled: isAdmin })

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
        label: 'Administrar perfumes y extras',
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
      { label: 'Mis citas hoy', value: '8', delta: '2 en curso' },
      { label: 'Por atender', value: '3', delta: 'Próxima: 11:45' },
      { label: 'Atendidas', value: '5', delta: 'Buen ritmo de trabajo' },
      { label: 'Disponibilidad', value: '2 hrs', delta: 'Huecos entre 14:00 y 16:00' },
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
      {
        hour: '10:30',
        client: 'Luis Herrera',
        service: 'Corte skin fade',
        barber: username?.username ?? 'Tú',
        status: 'Confirmada',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
      {
        hour: '11:45',
        client: 'David Perea',
        service: 'Arreglo de barba',
        barber: username?.username ?? 'Tú',
        status: 'Pendiente',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '13:00',
        client: 'Marco Solis',
        service: 'Corte + cejas',
        barber: username?.username ?? 'Tú',
        status: 'Pendiente',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '15:00',
        client: 'Javier Ochoa',
        service: 'Corte clásico',
        barber: username?.username ?? 'Tú',
        status: 'Confirmada',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
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
                {selectedRole === 'Barbero' && '4 citas asignadas'}
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
                {appointmentsByRole[selectedRole].map((item) => (
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
                ))}
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
                {selectedRole === 'Barbero' && '5/8'}
                {selectedRole === 'Cliente' && '2'}
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
                    {selectedRole === 'Barbero' && '42 min'}
                    {selectedRole === 'Cliente' && '3'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100/80 p-2.5 text-slate-600">
                  <p>
                    {selectedRole === 'Barbero' ? 'Siguiente hueco' : selectedRole === 'Cliente' ? 'Ultimo corte' : 'Promos por vencer'}
                  </p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedRole === 'Administrador' && `${promocionesPorVencer}`}
                    {selectedRole === 'Barbero' && '14:00'}
                    {selectedRole === 'Cliente' && 'Hace 12 dias'}
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
