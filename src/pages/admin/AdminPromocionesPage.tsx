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
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Acciones rápidas de promociones</p>
            <p className="text-xs text-slate-500">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar promoción"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => {
              setPromocionModal({ open: true, modoEdicion: false, promocion: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nueva promoción
          </CustomButton>
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
