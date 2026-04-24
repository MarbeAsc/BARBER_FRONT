import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { FormularioServicioModal } from '../../features/forms/admin/FormularioServicioModal'
import { AdminServiciosTable } from '../../features/tables/admin/AdminServiciosTable'
import { AdminSectionFrame } from './AdminSectionFrame'
import type { ServicioDTO } from '@/services/serviciosService'

type ServicioModalState = {
  open: boolean
  modoEdicion: boolean
  servicio: ServicioDTO | null
}

const servicioModalClosed: ServicioModalState = {
  open: false,
  modoEdicion: false,
  servicio: null,
}

export function AdminServiciosPage() {
  const [servicioModal, setServicioModal] = useState<ServicioModalState>(servicioModalClosed)
  const [formModalKey, setFormModalKey] = useState(0)
  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de servicios"
      description="Administra el catálogo principal de servicios de la barbería, incluyendo duración, precio y estado."
    >
      <section className="mb-4 rounded-3xl border border-cyan-300/30 bg-[linear-gradient(130deg,#0b2346_0%,#123a75_52%,#0f4c81_100%)] p-px shadow-[0_10px_24px_-18px_rgba(2,6,23,0.5)]">
        <div className="rounded-[1.35rem] bg-[linear-gradient(140deg,rgba(10,27,54,0.95)_0%,rgba(17,52,102,0.9)_55%,rgba(11,39,77,0.94)_100%)] p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Acciones rápidas del catálogo</p>
            <p className="text-xs text-slate-300">Crea registros nuevos desde un modal ligero y mantén actualizado el catálogo.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar servicio"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => {
              setServicioModal({ open: true, modoEdicion: false, servicio: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo servicio
          </CustomButton>
        </div>
        </div>
      </section>

      {servicioModal.open ? (
        <FormularioServicioModal
          key={formModalKey}
          modoEdicion={servicioModal.modoEdicion}
          servicio={servicioModal.servicio}
          onClose={() => setServicioModal(servicioModalClosed)}
        />
      ) : null}

    

      <AdminServiciosTable
        parentId={0}
        onEditServicio={(row) => {
          setServicioModal({ open: true, modoEdicion: true, servicio: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
