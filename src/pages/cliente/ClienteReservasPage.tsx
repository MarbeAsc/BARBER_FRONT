import { useState } from 'react'
import { FaCalendarPlus } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuthContext'
import { CustomButton } from '../../components/Button'
import { ClienteBookingsTable } from '../../features/tables/cliente/ClienteBookingsTable'
import { ClienteReservaModal } from '../../features/modals/cliente/ClienteReservaModal'
import { showNotification } from '../../lib/notifications'

const serviciosDisponibles = [
  { nombre: 'Corte clásico', barberos: ['Luis Herrera', 'Darío Campos'] },
  { nombre: 'Skin fade', barberos: ['Marco Solís', 'Luis Herrera'] },
  { nombre: 'Arreglo de barba', barberos: ['Jorge Paredes', 'Marco Solís'] },
  { nombre: 'Corte + barba', barberos: ['Jorge Paredes'] },
]

const horasDisponibles = ['09:00', '10:00', '11:30', '13:00', '15:30', '17:00']

const initialRows = [
  { servicio: 'Corte clásico', barbero: 'Luis Herrera', fecha: '2026-04-24', hora: '15:30', estado: 'Confirmada' as const },
  { servicio: 'Corte + barba', barbero: 'Jorge Paredes', fecha: '2026-04-27', hora: '16:00', estado: 'Pendiente' as const },
  { servicio: 'Skin fade', barbero: 'Marco Solís', fecha: '2026-05-02', hora: '11:00', estado: 'Reprogramada' as const },
]

export function ClienteReservasPage() {
  const { user } = useAuth()
  const [rows, setRows] = useState(initialRows)
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
    setRows((prev) => [{ servicio, barbero, fecha, hora, estado: 'Pendiente' as const }, ...prev])
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

      <section className="mb-4 rounded-3xl border border-slate-200/80 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] p-px shadow-sm shadow-slate-300/40">
        <div className="rounded-[1.35rem] bg-linear-to-r from-[#151923] via-[#2a3142] to-slate-100 p-4">
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
        servicios={serviciosDisponibles}
        horasDisponibles={horasDisponibles}
        onReservar={handleReservar}
      />
      <ClienteBookingsTable
        rows={rows}
        onEdit={(row) =>
          showNotification({
            title: 'Reservas',
            message: `Editar reserva de ${row.servicio} (${row.fecha} ${row.hora}).`,
            variant: 'warning',
          })
        }
        onDelete={(row) =>
          showNotification({
            title: 'Reservas',
            message: `Eliminar reserva de ${row.servicio} (${row.fecha} ${row.hora}).`,
            variant: 'error',
          })
        }
      />
    </main>
  )
}
