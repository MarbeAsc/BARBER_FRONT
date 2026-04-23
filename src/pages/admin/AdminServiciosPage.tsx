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
  const [listIdInput, setListIdInput] = useState('')
  const listParentId = Number(listIdInput)
  const listParentIdValid = Number.isFinite(listParentId) && listParentId > 0

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
            onClick={() => {
              setServicioModal({ open: true, modoEdicion: false, servicio: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo servicio
          </CustomButton>
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

      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <label htmlFor="admin-servicios-list-id" className="block text-sm font-semibold text-slate-900">
          ID para listar servicios
        </label>
        <p className="mt-0.5 text-xs text-slate-500">Se usa en la ruta obtenerServicios/{'{id}'} del API.</p>
        <input
          id="admin-servicios-list-id"
          type="number"
          min={1}
          step={1}
          value={listIdInput}
          onChange={(e) => setListIdInput(e.target.value)}
          placeholder="Ej. 1"
          className="mt-2 w-full max-w-xs rounded-xl border border-slate-200 bg-slate-50 px-3 py-2 text-sm text-slate-900 outline-none ring-blue-200 transition focus:border-blue-300 focus:bg-white focus:ring-2 sm:w-56"
        />
        {!listParentIdValid && listIdInput !== '' ? (
          <p className="mt-2 text-xs text-amber-700">Introduce un número entero mayor que cero.</p>
        ) : null}
      </section>

      <AdminServiciosTable
        parentId={listParentIdValid ? listParentId : 0}
        onEditServicio={(row) => {
          setServicioModal({ open: true, modoEdicion: true, servicio: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
