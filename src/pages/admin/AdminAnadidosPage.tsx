import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { FormularioAnadidoModal } from '../../features/forms/admin/FormularioAnadidoModal'
import { AdminAnadidosTable } from '../../features/tables/admin/AdminAnadidosTable'
import { AdminSectionFrame } from './AdminSectionFrame'
import type { AnadidoServicioDTO } from '@/services/añadidosService'

type AnadidoModalState = {
  open: boolean
  modoEdicion: boolean
  anadido: AnadidoServicioDTO | null
}

const anadidoModalClosed: AnadidoModalState = { open: false, modoEdicion: false, anadido: null }

export function AdminAnadidosPage() {
  const [anadidoModal, setAnadidoModal] = useState<AnadidoModalState>(anadidoModalClosed)
  const [formModalKey, setFormModalKey] = useState(0)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de añadidos"
      description="Configura los añadidos opcionales de cada servicio para ampliar la oferta y ajustar tiempos/precios."
    >
      <section className="mb-4 rounded-3xl border border-slate-200/80 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] p-px shadow-sm shadow-slate-300/40">
        <div className="rounded-[1.35rem] bg-linear-to-r from-[#151923] via-[#2a3142] to-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Acciones rapidas de añadidos</p>
            <p className="text-xs text-slate-300">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => {
              setAnadidoModal({ open: true, modoEdicion: false, anadido: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo añadido
          </CustomButton>
        </div>
        </div>
      </section>

      {anadidoModal.open ? (
        <FormularioAnadidoModal
          key={formModalKey}
          modoEdicion={anadidoModal.modoEdicion}
          anadido={anadidoModal.anadido}
          servicioBaseId={0}
          onClose={() => setAnadidoModal(anadidoModalClosed)}
        />
      ) : null}

    

      <AdminAnadidosTable
        servicioId={0}
        onEditAnadido={(row) => {
          setAnadidoModal({ open: true, modoEdicion: true, anadido: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
