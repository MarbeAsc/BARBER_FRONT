import { useState } from 'react'
import { FaClock } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { useAuth } from '@/hooks/useAuthContext'
import { BarberoBloqueoModal } from '../../features/modals/barbero/BarberoBloqueoModal'
import { BarberoAppointmentsTable } from '../../features/tables/barbero/BarberoAppointmentsTable'
import { showNotification } from '../../lib/notifications'

const demoCitas = [
  {
    hora: '10:00',
    cliente: 'Cliente demo',
    servicio: 'Corte + barba',
    duracion: '45 min',
    estado: 'Confirmada' as const,
  },
]

export function BarberoCitasPage() {
  const { user } = useAuth()
  const [bloqueoModalOpen, setBloqueoModalOpen] = useState(false)

  return (
    <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 rounded-2xl border border-blue-100 bg-linear-to-r from-blue-50/70 to-white px-6 py-5">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Barbero</p>
        <h1 className="mt-1 text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Mi agenda del día</h1>
        <p className="mt-2 text-sm text-slate-500">
          Bienvenido, {user?.username}. Aquí ves únicamente tus citas programadas.
        </p>
      </header>

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Gestion de disponibilidad</p>
            <p className="text-xs text-slate-500">
              Registra bloqueos de horario para evitar reservas en franjas ocupadas.
            </p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar bloqueo"
            leftIcon={<FaClock className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => setBloqueoModalOpen(true)}
          >
            Bloquear horario
          </CustomButton>
        </div>
      </section>

      <BarberoBloqueoModal
        open={bloqueoModalOpen}
        onClose={() => setBloqueoModalOpen(false)}
        onSave={({ fecha, hora, motivo }) =>
          showNotification({
            title: 'Horario bloqueado',
            message: `Se registro bloqueo para ${fecha} ${hora}. Motivo: ${motivo}.`,
            variant: 'success',
          })
        }
      />

      <BarberoAppointmentsTable
        rows={demoCitas}
        onEdit={(row) =>
          showNotification({
            title: 'Citas',
            message: `Editar cita ${row.hora} — ${row.cliente} (${row.servicio}).`,
            variant: 'warning',
          })
        }
        onDelete={(row) =>
          showNotification({
            title: 'Citas',
            message: `Eliminar cita ${row.hora} — ${row.cliente} (${row.servicio}).`,
            variant: 'error',
          })
        }
      />
    </main>
  )
}
