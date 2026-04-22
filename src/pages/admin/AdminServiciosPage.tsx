import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { AdminQuickActionModal } from '../../features/modals/admin/AdminQuickActionModal'
import { AdminServiciosTable } from '../../features/tables/admin/AdminServiciosTable'
import { showNotification } from '../../lib/notifications'
import { AdminSectionFrame } from './AdminSectionFrame'

export function AdminServiciosPage() {
  const [adminModalOpen, setAdminModalOpen] = useState(false)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de servicios"
      description="Administra el catálogo principal de servicios de la barbería, incluyendo duración, precio y estado."
    >
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Acciones rapidas del catalogo</p>
            <p className="text-xs text-slate-500">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar servicio"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => setAdminModalOpen(true)}
          >
            Nuevo servicio
          </CustomButton>
        </div>
      </section>

      <AdminQuickActionModal
        open={adminModalOpen}
        entity="servicio"
        onClose={() => setAdminModalOpen(false)}
        onConfirm={(value) =>
          showNotification({
            title: 'Servicio creado',
            message: `Se registro "${value}" desde el modal.`,
            variant: 'success',
          })
        }
      />

      <AdminServiciosTable />
    </AdminSectionFrame>
  )
}
