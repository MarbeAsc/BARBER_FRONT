import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { FormularioBarberoModal } from '../../features/forms/admin/FormularioBarberoModal'
import { AdminBarberosTable } from '../../features/tables/admin/AdminBarberosTable'
import { AdminSectionFrame } from './AdminSectionFrame'
import type { BarberoListadoDTO } from '@/services/barberosService'

type BarberoModalState = {
  open: boolean
  modoEdicion: boolean
  barbero: BarberoListadoDTO | null
}

const barberoModalClosed: BarberoModalState = { open: false, modoEdicion: false, barbero: null }

export function AdminBarberosPage() {
  const [barberoModal, setBarberoModal] = useState<BarberoModalState>(barberoModalClosed)
  const [formModalKey, setFormModalKey] = useState(0)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de barberos"
      description="Registra barberos y relaciona cada perfil con los servicios que sabe realizar."
    >
      <section className="mb-4 rounded-3xl border border-slate-200/80 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] p-px shadow-sm shadow-slate-300/40">
        <div className="rounded-[1.35rem] bg-linear-to-r from-[#151923] via-[#2a3142] to-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Acciones rapidas de barberos</p>
            <p className="text-xs text-slate-300">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar barbero"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => {
              setBarberoModal({ open: true, modoEdicion: false, barbero: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo barbero
          </CustomButton>
        </div>
        </div>
      </section>

      {barberoModal.open ? (
        <FormularioBarberoModal
          key={formModalKey}
          modoEdicion={barberoModal.modoEdicion}
          barbero={barberoModal.barbero}
          onClose={() => setBarberoModal(barberoModalClosed)}
        />
      ) : null}

      <AdminBarberosTable
        onEditBarbero={(row) => {
          setBarberoModal({ open: true, modoEdicion: true, barbero: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
