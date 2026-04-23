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
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Acciones rapidas de perfumes</p>
            <p className="text-xs text-slate-500">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar perfume"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => {
              setPerfumeModal({ open: true, modoEdicion: false, perfume: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo perfume
          </CustomButton>
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
