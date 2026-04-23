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
            onClick={() => {
              setBarberoModal({ open: true, modoEdicion: false, barbero: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo barbero
          </CustomButton>
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
