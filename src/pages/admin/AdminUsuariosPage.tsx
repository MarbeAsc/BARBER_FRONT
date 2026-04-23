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
      <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-semibold text-slate-900">Acciones rápidas de usuarios</p>
            <p className="text-xs text-slate-500">Registro ligero desde modal; para credenciales completas usa el flujo de alta formal.</p>
          </div>
          <CustomButton
            type="button"
            variant="primary"
            tooltip="Agregar usuario"
            leftIcon={<FaPlusCircle className="h-3.5 w-3.5" />}
            className="rounded-xl border border-blue-500 shadow-[0_10px_24px_-16px_rgba(37,99,235,0.85)]"
            onClick={() => {
              setUsuarioModal({ open: true, modoEdicion: false, usuario: null })
              setFormModalKey((k) => k + 1)
            }}
          >
            Nuevo usuario
          </CustomButton>
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
