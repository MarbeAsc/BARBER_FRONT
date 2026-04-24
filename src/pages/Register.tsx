import { useState, type FormEvent } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { CustomButton } from '../components/Button'
import { useCreateUsuarioMutation } from '@/hooks/useUsuarios'
import { showNotification } from '../lib/notifications'
import { mensajeRespuestaUsuario } from '@/lib/respuesta-api'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'

export function Register() {
  const navigate = useNavigate()
  const createUsuarioMutation = useCreateUsuarioMutation()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  })
  const [created, setCreated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nombre || !form.email || !form.password) {
      showNotification({
        title: 'Registro incompleto',
        message: 'Completa todos los campos para crear tu cuenta.',
        variant: 'warning',
      })
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirmRegister = async () => {
    try {
      const response = await createUsuarioMutation.mutateAsync({
        Username: form.nombre.trim(),
        Correo: form.email.trim(),
        Contrasena: form.password,
      })
      const { ok, mensaje } = mensajeRespuestaUsuario(response)
      if (!ok) {
        setConfirmOpen(false)
        showNotification({
          title: 'Registro',
          message: mensaje || 'No fue posible crear la cuenta.',
          variant: 'warning',
        })
        return
      }
      setConfirmOpen(false)
      setCreated(true)
      showNotification({
        title: 'Cuenta creada',
        message: mensaje || 'Tu cuenta de cliente fue creada correctamente.',
        variant: 'success',
      })
    } catch (error) {
      setConfirmOpen(false)
      showNotification({
        title: 'Registro',
        message: error instanceof Error ? error.message : 'Error al crear la cuenta.',
        variant: 'error',
      })
    }
  }

  const completion = [form.nombre, form.email, form.password].filter(Boolean).length
  const completionPct = `${Math.round((completion / 3) * 100)}%`

  return (
    <main className="login-page login-layout grid min-h-svh w-full text-slate-800 antialiased lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="login-hero login-hero-redesign relative hidden flex-col overflow-hidden p-10 text-zinc-100 sm:p-12 lg:flex">
        <div className="login-hero-canvas pointer-events-none absolute inset-0" aria-hidden />
        <div className="login-floating-card login-floating-card--top" aria-hidden>
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-cyan-100/90">Barberia</p>
          <p className="mt-1 text-lg font-semibold text-white">Sistema pro</p>
        </div>
        <div className="login-floating-card login-floating-card--bottom" aria-hidden>
          <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-blue-100/90">Operativo</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">Agenda + Clientes + Caja</p>
        </div>
        <div className="login-floating-card login-floating-card--mid login-floating-card--mini" aria-hidden>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-cyan-100/85">Cuenta</p>
          <p className="mt-1 text-sm font-medium text-white">Alta en minutos</p>
        </div>
        <div className="login-floating-card login-floating-card--left login-floating-card--mini" aria-hidden>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-blue-100/85">Inicio</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">Todo en una vista</p>
        </div>

        <div className="relative z-10 max-w-xl space-y-5">
          <span className="login-kicker inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[0.69rem] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Barber Shop
          </span>
          <h2 className="text-balance text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.15rem] lg:text-[2.45rem]">
            Crea tu cuenta de cliente
          </h2>
          <p className="login-hero-description max-w-md text-sm text-slate-300/90">
            Registra tus datos y empieza a reservar citas con una experiencia rapida y profesional.
          </p>
        </div>

        <div className="login-hero-metrics relative z-10 mt-auto max-w-xl" aria-label="Beneficios de registro">
          <div className="login-hero-metric">
            <span>Registro guiado paso a paso</span>
          </div>
          <div className="login-hero-metric">
            <span>Acceso inmediato al sistema</span>
          </div>
        </div>
      </aside>

      <section className="relative flex flex-col justify-center overflow-hidden bg-[#f8f8fb] px-5 py-14 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_10%,rgba(59,130,246,0.16),transparent_65%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_40%_at_15%_88%,rgba(14,165,233,0.12),transparent_62%)]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-lg rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">
          Crear cuenta
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Registro de cliente
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Completa tus datos para crear una cuenta de cliente y reservar citas.
        </p>
        <div className="mt-4">
          <div className="mb-1 flex items-center justify-between text-xs font-semibold text-slate-500">
            <span>Progreso de registro</span>
            <span>{completionPct}</span>
          </div>
          <div className="h-2 overflow-hidden rounded-full bg-slate-100">
            <div
              className="h-full rounded-full bg-linear-to-r from-blue-500 to-cyan-400 transition-all duration-300"
              style={{ width: completionPct }}
            />
          </div>
        </div>

        {created ? (
          <div className="mt-5 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Cuenta creada correctamente. Ya puedes iniciar sesión.
          </div>
        ) : null}

        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            void handleSubmit(event)
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 sm:col-span-2">
            Nombre completo
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="Juan Pérez"
            />
          </label>
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
            Correo
            <input
              type="email"
              required
              value={form.email}
              onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
              placeholder="cliente@barberia.com"
            />
          </label>
          
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 ">
            Contraseña
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                required
                minLength={6}
                value={form.password}
                onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                className="w-full rounded-xl border border-slate-300 px-3 py-2.5 pr-24 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Mínimo 6 caracteres"
              />
              <CustomButton
                type="button"
                variant="ghost"
                iconOnly
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-lg border border-slate-300 p-1.5 text-slate-600 hover:border-blue-300 hover:text-blue-700"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? 'Ocultar contraseña' : 'Mostrar contraseña'}
              >
                {showPassword ? <FaEyeSlash className="h-4 w-4" /> : <FaEye className="h-4 w-4" />}
              </CustomButton>
            </div>
          </label>
          <CustomButton
            type="submit"
            variant="primary"
            size="lg"
            className="sm:col-span-2 w-full rounded-xl"
            disabled={createUsuarioMutation.isPending}
          >
            {createUsuarioMutation.isPending ? 'Registrando...' : 'Registrarme'}
          </CustomButton>
        </form>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Volver a iniciar sesión
          </Link>
          <CustomButton
            type="button"
            variant="link"
            size="sm"
            className="p-0"
            onClick={() => navigate('/forgot-password', { state: { allowPublicFlow: true } })}
          >
            Recuperar contraseña
          </CustomButton>
        </div>
        </div>
      </section>
      <ConfirmacionDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmRegister()}
        title="Confirmar registro"
        subtitle="Verifica tus datos antes de crear la cuenta"
        message="¿Deseas crear tu cuenta de cliente con la información capturada?"
        confirmText="Sí, crear cuenta"
        cancelText="Revisar datos"
        loading={createUsuarioMutation.isPending}
        additionalInfo={
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre:</span>
              <span className="text-sm font-medium text-slate-900">{form.nombre.trim() || '—'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo:</span>
              <span className="text-sm font-medium text-slate-900">{form.email.trim() || '—'}</span>
            </div>
          </div>
        }
      />
    </main>
  )
}
