import { useState } from 'react'
import { FaCalendarPlus } from 'react-icons/fa'
import { useAuth } from '../../context/AuthContext'
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
          Hola, {user?.name}. Elige un servicio, revisa los barberos disponibles y agenda fecha/hora para tu cita.
        </p>
      </header>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Agenda una nueva cita</p>
            <p className="text-xs text-slate-500">
              Abre el modal interactivo para elegir servicio, barbero, fecha y hora.
            </p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar reserva"
            leftIcon={<FaCalendarPlus className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => setReservaModalOpen(true)}
          >
            Nueva reserva
          </CustomButton>
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
