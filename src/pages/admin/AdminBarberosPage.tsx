import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { AdminQuickActionModal } from '../../features/modals/admin/AdminQuickActionModal'
import { AdminBarberosTable } from '../../features/tables/admin/AdminBarberosTable'
import { showNotification } from '../../lib/notifications'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminBarberosPage() {
  const [adminModalOpen, setAdminModalOpen] = useState(false)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de barberos"
      description="Registra barberos y relaciona cada perfil con los servicios que sabe realizar."
    >
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Acciones rapidas de barberos</p>
            <p className="text-xs text-slate-500">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar barbero"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => setAdminModalOpen(true)}
          >
            Nuevo barbero
          </CustomButton>
        </div>
      </section>

      <AdminQuickActionModal
        open={adminModalOpen}
        entity="barbero"
        onClose={() => setAdminModalOpen(false)}
        onConfirm={(value) =>
          showNotification({
            title: 'Barbero creado',
            message: `Se registro "${value}" desde el modal.`,
            variant: 'success',
          })
        }
      />

      <AdminBarberosTable />
    </AdminSectionFrame>
  )
}
