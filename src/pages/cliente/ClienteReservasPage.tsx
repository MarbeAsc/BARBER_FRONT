import { useState } from 'react'
import { FaCalendarPlus } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuthContext'
import { decodeJwtPayload, isValidJwtToken } from '@/lib/jwt'
import { CustomButton } from '../../components/Button'
import { ClienteBookingsTable } from '../../features/tables/cliente/ClienteBookingsTable'
import { ClienteReservaModal } from '../../features/modals/cliente/ClienteReservaModal'
import { showNotification } from '../../lib/notifications'

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

export function ClienteReservasPage() {
  const { user, token } = useAuth()
  const userId = resolveUserIdFromToken(token)
  const [reservaModalOpen, setReservaModalOpen] = useState(false)

  const handleReservar = ({
    servicio,
    barbero,
    fecha,
    hora,
  }: {
    servicio: string
    barbero: string
    fecha: string
    hora: string
  }) => {
    showNotification({
      title: 'Reserva registrada',
      message: `Tu cita de ${servicio} con ${barbero} fue creada para ${fecha} a las ${hora}.`,
      variant: 'success',
    })
  }

  return (
    <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50/70 to-white px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Cliente</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Mis citas y reservas</h1>
        <p className="mt-2 text-sm text-slate-500">
          Hola, {user?.username}. Elige un servicio, revisa los barberos disponibles y agenda fecha/hora para tu cita.
        </p>
      </header>

      <section className="mb-4 rounded-3xl border border-cyan-300/30 bg-[linear-gradient(130deg,#0b2346_0%,#123a75_52%,#0f4c81_100%)] p-px shadow-[0_10px_24px_-18px_rgba(2,6,23,0.5)]">
        <div className="rounded-[1.35rem] bg-[linear-gradient(140deg,rgba(10,27,54,0.95)_0%,rgba(17,52,102,0.9)_55%,rgba(11,39,77,0.94)_100%)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Agenda una nueva cita</p>
            <p className="text-xs text-slate-300">
              Abre el modal interactivo para elegir servicio, barbero, fecha y hora.
            </p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar reserva"
            leftIcon={<FaCalendarPlus className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => setReservaModalOpen(true)}
          >
            Nueva reserva
          </CustomButton>
        </div>
        </div>
      </section>

      <ClienteReservaModal
        open={reservaModalOpen}
        onClose={() => setReservaModalOpen(false)}
        onReservar={handleReservar}
      />
      <ClienteBookingsTable
        idUser={userId ?? 0}
        onEdit={(row) =>
          showNotification({
            title: 'Reservas',
            message: `Editar reserva de ${row.servicios} (${row.fechaiInicio} ${row.fechaTermino}).`,
            variant: 'warning',
          })
        }
        onDelete={(row) =>
          showNotification({
            title: 'Reservas',
            message: `Eliminar reserva de ${row.servicios} (${row.fechaiInicio} ${row.fechaTermino}).`,
            variant: 'error',
          })
        }
      />
    </main>
  )
}
