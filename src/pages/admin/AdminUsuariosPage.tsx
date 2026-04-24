import { useState } from 'react'
import { FaPlusCircle } from 'react-icons/fa'
import { CustomButton } from '../../components/Button'
import { FormularioUsuarioModal } from '../../features/forms/admin/FormularioUsuarioModal'
import { AdminUsuariosTable } from '../../features/tables/admin/AdminUsuariosTable'
import { AdminSectionFrame } from './AdminSectionFrame'
import type { UsuarioDTO } from '@/services/usuarioService'

type UsuarioModalState = {
  open: boolean
  modoEdicion: boolean
  usuario: UsuarioDTO | null
}

const usuarioModalClosed: UsuarioModalState = { open: false, modoEdicion: false, usuario: null }

export function AdminUsuariosPage() {
  const [usuarioModal, setUsuarioModal] = useState<UsuarioModalState>(usuarioModalClosed)
  const [formModalKey, setFormModalKey] = useState(0)

  return (
    <AdminSectionFrame
      eyebrow="Administrador"
      title="Gestión de usuarios"
      description="Consulta cuentas registradas, roles y estatus. Las ediciones definitivas deben alinearse con las reglas del backend."
    >
      <section className="mb-4 rounded-3xl border border-slate-200/80 bg-linear-to-r from-[#121216] via-[#15151b] to-[#0f0f14] p-px shadow-sm shadow-slate-300/40">
        <div className="rounded-[1.35rem] bg-linear-to-r from-[#151923] via-[#2a3142] to-slate-100 p-4">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-100">Acciones rápidas de usuarios</p>
            <p className="text-xs text-slate-300">Registro ligero desde modal; para credenciales completas usa el flujo de alta formal.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar usuario"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-400/70 bg-linear-to-r from-blue-500 via-blue-600 to-blue-500 text-white shadow-[0_12px_24px_-16px_rgba(59,130,246,0.65)] transition hover:border-blue-700 hover:from-blue-600 hover:via-blue-700 hover:to-blue-600 hover:shadow-[0_14px_28px_-16px_rgba(29,78,216,0.8)]"
            onClick={() => {
              setUsuarioModal({ open: true, modoEdicion: false, usuario: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo usuario
          </CustomButton>
        </div>
        </div>
      </section>

      {usuarioModal.open ? (
        <FormularioUsuarioModal
          key={formModalKey}
          modoEdicion={usuarioModal.modoEdicion}
          usuario={usuarioModal.usuario}
          onClose={() => setUsuarioModal(usuarioModalClosed)}
        />
      ) : null}

      <AdminUsuariosTable
        onEditUsuario={(row) => {
          setUsuarioModal({ open: true, modoEdicion: true, usuario: row })
          setFormModalKey((k) => k + 1)
        }}
      />
    </AdminSectionFrame>
  )
}
