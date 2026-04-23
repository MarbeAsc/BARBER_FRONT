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
  const [servicioIdInput, setServicioIdInput] = useState('')
  const servicioId = Number(servicioIdInput)
  const servicioIdValid = Number.isFinite(servicioId) && servicioId > 0

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de añadidos"
      description="Configura los añadidos opcionales de cada servicio para ampliar la oferta y ajustar tiempos/precios."
    >
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Acciones rapidas de añadidos</p>
            <p className="text-xs text-slate-500">Crea registros nuevos desde un modal ligero.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            disabled={!servicioIdValid}
            tooltip={!servicioIdValid ? 'Indica un ID de servicio base válido' : 'Agregar añadido'}
            onClick={() => {
              setAnadidoModal({ open: true, modoEdicion: false, anadido: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo añadido
          </CustomButton>
        </div>
      </section>

      {anadidoModal.open ? (
        <FormularioAnadidoModal
          key={formModalKey}
          modoEdicion={anadidoModal.modoEdicion}
          anadido={anadidoModal.anadido}
          servicioBaseId={servicioIdValid ? servicioId : 0}
          onClose={() => setAnadidoModal(anadidoModalClosed)}
        />
      ) : null}

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="admin-anadidos-servicio-id" className="block text-sm font-semibold text-slate-900">
          ID servicio base
        </label>
        <p className="mt-0.5 text-xs text-slate-500">Se usa en la ruta obtenerAnadidosServicios/{'{id}'} del API.</p>
        <input
          id="admin-anadidos-servicio-id"
          type="number"
          min={1}
          step={1}
          value={servicioIdInput}
          onChange={(e) => setServicioIdInput(e.target.value)}
          placeholder="Ej. 1"
          className="mt-2 w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-200 transition focus:border-blue-300 focus:bg-white focus:ring-2 sm:w-56"
        />
        {!servicioIdValid && servicioIdInput !== '' ? (
          <p className="mt-2 text-xs text-amber-700">Introduce un número entero mayor que cero.</p>
        ) : null}
      </section>

      <AdminAnadidosTable
        servicioId={servicioIdValid ? servicioId : 0}
        onEditAnadido={(row) => {
          setAnadidoModal({ open: true, modoEdicion: true, anadido: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
