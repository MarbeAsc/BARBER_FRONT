import { useAuth } from '../context/AuthContext'
import { useMemo } from 'react'
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

export function Dashboard() {
  const { user } = useAuth()
  const navigate = useNavigate()
  const selectedRole = useMemo(() => inferRoleFromEmail(user?.email), [user?.email])

  const quickActionsByRole: Record<
    UserRole,
    Array<{ label: string; variant?: 'primary' | 'secondary'; onClick: () => void }>
  > = {
    admin: [
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
    barbero: [
      {
        label: 'Iniciar siguiente cita',
        variant: 'primary',
        onClick: () => navigate('/mis-citas'),
      },
      {
        label: 'Ver servicios asignados',
        variant: 'secondary',
        onClick: () =>
          showNotification({
            title: 'Módulo en preparación',
            message: 'La vista de servicios asignados estará disponible pronto.',
            variant: 'info',
          }),
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
    cliente: [
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
      {
        label: 'Reprogramar cita',
        variant: 'secondary',
        onClick: () =>
          showNotification({
            title: 'Acción pendiente',
            message: 'La reprogramación estará disponible en el próximo módulo.',
            variant: 'warning',
          }),
      },
    ],
  }

  const kpisByRole: Record<UserRole, Kpi[]> = {
    admin: [
      { label: 'Servicios activos', value: '18', delta: '3 con extras nuevos' },
      { label: 'Barberos registrados', value: '6', delta: '1 disponible hoy' },
      { label: 'Citas del dia', value: '32', delta: '+14% vs. ayer' },
      { label: 'Ingresos estimados', value: '$1,280', delta: 'Ticket prom. $41' },
    ],
    barbero: [
      { label: 'Mis citas hoy', value: '8', delta: '2 en curso' },
      { label: 'Por atender', value: '3', delta: 'Próxima: 11:45' },
      { label: 'Atendidas', value: '5', delta: 'Buen ritmo de trabajo' },
      { label: 'Disponibilidad', value: '2 hrs', delta: 'Huecos entre 14:00 y 16:00' },
    ],
    cliente: [
      { label: 'Mis reservas', value: '2', delta: '1 para esta semana' },
      { label: 'Servicios favoritos', value: '3', delta: 'Corte clasico top' },
      { label: 'Barberos sugeridos', value: '4', delta: 'Segun tu historial' },
      { label: 'Disponibilidad', value: 'Hoy', delta: 'Slots desde 15:30' },
    ],
  }

  const appointmentsByRole: Record<UserRole, Appointment[]> = {
    admin: [
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
    barbero: [
      {
        hour: '10:30',
        client: 'Luis Herrera',
        service: 'Corte skin fade',
        barber: user?.name ?? 'Tú',
        status: 'Confirmada',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
      {
        hour: '11:45',
        client: 'David Perea',
        service: 'Arreglo de barba',
        barber: user?.name ?? 'Tú',
        status: 'Pendiente',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '13:00',
        client: 'Marco Solis',
        service: 'Corte + cejas',
        barber: user?.name ?? 'Tú',
        status: 'Pendiente',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '15:00',
        client: 'Javier Ochoa',
        service: 'Corte clásico',
        barber: user?.name ?? 'Tú',
        status: 'Confirmada',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
    ],
    cliente: [
      {
        hour: '15:30',
        client: user?.name ?? 'Tu reserva',
        service: 'Corte clasico',
        barber: 'Luis',
        status: 'Disponible',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
      {
        hour: '16:15',
        client: user?.name ?? 'Tu reserva',
        service: 'Corte + barba',
        barber: 'Jorge',
        status: 'Pocas plazas',
        statusClass: 'bg-blue-100 text-blue-700',
      },
      {
        hour: '17:00',
        client: user?.name ?? 'Tu reserva',
        service: 'Perfilado',
        barber: 'Dario',
        status: 'Disponible',
        statusClass: 'bg-emerald-100 text-emerald-700',
      },
    ],
  }

  return (
    <div className="w-full min-w-0 bg-white">
      <main className="mx-auto px-4 py-8 text-slate-700 sm:px-6 lg:px-8 lg:py-10">
        <section className="mb-8 overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
          <div className="group relative">
            <img
              src="/logo+.jpg"
              alt="Barbería en acción"
              className="h-56 w-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03] sm:h-72 lg:h-80"
            />
            <div className="pointer-events-none absolute inset-0 bg-linear-to-t from-slate-900/45 via-slate-900/10 to-transparent" />
            <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6">
              <p className="inline-flex rounded-full bg-white/90 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-700">
                Estado del sistema
              </p>
              <h2 className="mt-2 text-xl font-semibold text-white sm:text-2xl">
                {selectedRole === 'admin' && 'Control central de operación'}
                {selectedRole === 'barbero' && 'Agenda operativa del barbero'}
                {selectedRole === 'cliente' && 'Gestión de reservas del cliente'}
              </h2>
              <p className="mt-1 max-w-2xl text-sm text-blue-100/95">
                {selectedRole === 'admin' &&
                  'Monitorea servicios, usuarios y desempeño diario desde un único panel de administración.'}
                {selectedRole === 'barbero' &&
                  'Revisa tus citas asignadas, controla tu disponibilidad y da seguimiento al estado de atención.'}
                {selectedRole === 'cliente' &&
                  'Consulta servicios disponibles, selecciona barbero y agenda fecha/hora para tu próxima cita.'}
              </p>
            </div>
          </div>
        </section>

        <div className="mb-8 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50/70 to-white px-6 py-5">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">
            Resumen del día
          </p>
          <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">
            Buen día, {user?.name}
          </h1>
          <p className="mt-2 text-sm text-slate-500">{user?.email}</p>
          <p className="mt-1 text-xs font-medium text-blue-700/90">
            Vista activa: {roleLabel(selectedRole)}
          </p>
        </div>
        <section className="mb-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {kpisByRole[selectedRole].map((card) => (
            <article
              key={card.label}
              className="group rounded-xl border border-slate-200 bg-white p-4 shadow-sm transition-[transform,box-shadow,border-color] duration-200 hover:-translate-y-0.5 hover:border-blue-200 hover:shadow-md"
            >
              <span className="mb-3 inline-flex h-1.5 w-9 rounded-full bg-blue-400/80" />
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">
                {card.label}
              </p>
              <p className="mt-2 text-2xl font-semibold tabular-nums text-slate-900">
                {card.value}
              </p>
              <p className="mt-1 text-xs text-slate-500">{card.delta}</p>
            </article>
          ))}
        </section>

        <div className="mx-auto grid gap-6 lg:grid-cols-3">
          <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm lg:col-span-2">
            <div className="mb-4 flex items-center justify-between gap-2">
              <h2 className="text-base font-semibold text-slate-900">
                {selectedRole === 'admin' && 'Citas globales de hoy'}
                {selectedRole === 'barbero' && 'Tus citas programadas'}
                {selectedRole === 'cliente' && 'Horarios recomendados'}
              </h2>
              <span className="rounded-full bg-blue-50 px-3 py-1 text-xs font-semibold text-blue-700">
                {selectedRole === 'admin' && '32 citas programadas'}
                {selectedRole === 'barbero' && '4 citas asignadas'}
                {selectedRole === 'cliente' && 'Slots disponibles hoy'}
              </span>
            </div>

            <div className="space-y-3">
              {appointmentsByRole[selectedRole].map((item) => (
                <article
                  key={`${item.hour}-${item.client}`}
                  className="rounded-xl border border-slate-200 bg-slate-50/80 p-4 transition-colors hover:border-blue-200 hover:bg-white"
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
          </section>

          <aside className="space-y-4">
            <section className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
              <h3 className="text-sm font-semibold text-slate-900">
                {selectedRole === 'admin' && 'Panel administrativo'}
                {selectedRole === 'barbero' && 'Resumen operativo'}
                {selectedRole === 'cliente' && 'Tu cuenta'}
              </h3>
              <p className="mt-3 text-3xl font-bold tracking-tight text-slate-900">
                {selectedRole === 'admin' && '$1,280'}
                {selectedRole === 'barbero' && '5/8'}
                {selectedRole === 'cliente' && '2'}
              </p>
              <p className="mt-1 text-xs text-emerald-600">
                {selectedRole === 'admin' && '+8% comparado con ayer'}
                {selectedRole === 'barbero' && 'Citas atendidas hoy'}
                {selectedRole === 'cliente' && 'Reservas activas'}
              </p>
              <div className="mt-4 grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <p>{selectedRole === 'barbero' ? 'Tiempo promedio' : selectedRole === 'cliente' ? 'Favoritos' : 'Indicador A'}</p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedRole === 'admin' && '31'}
                    {selectedRole === 'barbero' && '42 min'}
                    {selectedRole === 'cliente' && '3'}
                  </p>
                </div>
                <div className="rounded-lg bg-slate-100 p-2.5 text-slate-600">
                  <p>{selectedRole === 'barbero' ? 'Siguiente hueco' : selectedRole === 'cliente' ? 'Ultimo corte' : 'Indicador B'}</p>
                  <p className="text-base font-semibold text-slate-900">
                    {selectedRole === 'admin' && '$41'}
                    {selectedRole === 'barbero' && '14:00'}
                    {selectedRole === 'cliente' && 'Hace 12 dias'}
                  </p>
                </div>
              </div>
            </section>

            <section className="rounded-2xl border border-blue-200 bg-linear-to-br from-blue-50 to-white p-5 shadow-sm">
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
