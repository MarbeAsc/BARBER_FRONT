import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { FormularioPromocionModal } from '../../features/forms/admin/FormularioPromocionModal'
import { AdminPromocionesTable } from '../../features/tables/admin/AdminPromocionesTable'
import { AdminSectionFrame } from './AdminSectionFrame'
import type { PromocionDTO } from '@/services/promocionesSevice'

type PromocionModalState = {
  open: boolean
  modoEdicion: boolean
  promocion: PromocionDTO | null
}

const promocionModalClosed: PromocionModalState = { open: false, modoEdicion: false, promocion: null }

export function AdminPromocionesPage() {
  const [promocionModal, setPromocionModal] = useState<PromocionModalState>(promocionModalClosed)
  const [formModalKey, setFormModalKey] = useState(0)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de promociones"
      description="Administra promociones vigentes, programadas y finalizadas para la barbería."
    >
      <section className="mb-4 rounded-3xl border border-slate-200/80 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] p-px shadow-sm shadow-slate-300/40">
        <div className="rounded-[1.35rem] bg-linear-to-r from-[#151923] via-[#2a3142] to-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Acciones rápidas de promociones</p>
            <p className="text-xs text-slate-300">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar promoción"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => {
              setPromocionModal({ open: true, modoEdicion: false, promocion: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nueva promoción
          </CustomButton>
        </div>
        </div>
      </section>

      {promocionModal.open ? (
        <FormularioPromocionModal
          key={formModalKey}
          modoEdicion={promocionModal.modoEdicion}
          promocion={promocionModal.promocion}
          onClose={() => setPromocionModal(promocionModalClosed)}
        />
      ) : null}

      <AdminPromocionesTable
        onEditPromocion={(row) => {
          setPromocionModal({ open: true, modoEdicion: true, promocion: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
