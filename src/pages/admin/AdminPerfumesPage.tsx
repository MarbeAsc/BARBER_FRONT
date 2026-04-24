import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { FormularioPerfumeModal } from '../../features/forms/admin/FormularioPerfumeModal'
import { AdminPerfumesTable } from '../../features/tables/admin/AdminPerfumesTable'
import { AdminSectionFrame } from './AdminSectionFrame'
import type { PerfumeDTO } from '@/services/perfumesService'

type PerfumeModalState = {
  open: boolean
  modoEdicion: boolean
  perfume: PerfumeDTO | null
}

const perfumeModalClosed: PerfumeModalState = { open: false, modoEdicion: false, perfume: null }

export function AdminPerfumesPage() {
  const [perfumeModal, setPerfumeModal] = useState<PerfumeModalState>(perfumeModalClosed)
  const [formModalKey, setFormModalKey] = useState(0)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de perfumes"
      description="Administra perfumes disponibles para cerrar la experiencia de cada servicio en barbería."
    >
      <section className="mb-4 rounded-3xl border border-slate-200/80 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] p-px shadow-sm shadow-slate-300/40">
        <div className="rounded-[1.35rem] bg-linear-to-r from-[#151923] via-[#2a3142] to-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Acciones rapidas de perfumes</p>
            <p className="text-xs text-slate-300">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar perfume"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => {
              setPerfumeModal({ open: true, modoEdicion: false, perfume: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo perfume
          </CustomButton>
        </div>
        </div>
      </section>

      {perfumeModal.open ? (
        <FormularioPerfumeModal
          key={formModalKey}
          modoEdicion={perfumeModal.modoEdicion}
          perfume={perfumeModal.perfume}
          onClose={() => setPerfumeModal(perfumeModalClosed)}
        />
      ) : null}

      <AdminPerfumesTable
        onEditPerfume={(row) => {
          setPerfumeModal({ open: true, modoEdicion: true, perfume: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
