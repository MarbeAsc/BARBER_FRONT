import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import { CustomButton } from '../components/Button'
import { showNotification } from '../lib/notifications'

export function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  })
  const [created, setCreated] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  const completion = [form.nombre, form.email, form.password].filter(Boolean).length
  const completionPct = `${Math.round((completion / 3) * 100)}%`

  return (
    <main className="grid min-h-svh w-full bg-[#f4f4f5] text-slate-800 antialiased lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#111215] p-10 text-zinc-100 sm:p-12 lg:flex lg:border-r lg:border-white/10 lg:shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]">
        <div
          className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,12,0.96)_0%,rgba(22,23,28,0.92)_42%,rgba(10,10,12,0.96)_100%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_70%_at_10%_10%,rgba(59,130,246,0.2),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_100%_100%,rgba(59,130,246,0.18),transparent_60%)]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute right-[-11%] top-[-9%] h-[58%] w-[22%] rotate-12 rounded-full bg-[repeating-linear-gradient(180deg,rgba(239,68,68,0.9)_0_16px,rgba(255,255,255,0.92)_16px_32px,rgba(37,99,235,0.9)_32px_48px)] opacity-20 blur-[1px]"
          aria-hidden
        />
        <div
          className="pointer-events-none absolute bottom-[-17%] left-[-8%] h-[60%] w-[20%] -rotate-15 rounded-full bg-[repeating-linear-gradient(180deg,rgba(239,68,68,0.86)_0_16px,rgba(255,255,255,0.88)_16px_32px,rgba(37,99,235,0.86)_32px_48px)] opacity-15 blur-[2px]"
          aria-hidden
        />

        <div className="relative z-10 max-w-lg space-y-5">
          <span className="inline-flex rounded-full border border-blue-300/35 bg-blue-400/10 px-3 py-1 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-blue-200">
            Barber Suite
          </span>
          <h2 className="text-balance text-[1.65rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.125rem]">
            BarberShop Manager
          </h2>
          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-zinc-300">
            Controla citas, barberos y clientes en una sola plataforma.
            Diseñado para barberías que cuidan cada detalle del servicio.
          </p>
        </div>

        <ul
          className="login-feature-list relative z-10 mt-14 max-w-lg space-y-4 text-[0.9375rem] leading-snug"
          aria-label="Capacidades principales"
        >
          {[
            'Agenda diaria con disponibilidad en tiempo real',
            'Historial de clientes y servicios por barbero',
            'Gestión de caja, turnos y productividad del equipo',
          ].map((label) => (
            <li
              key={label}
              className="flex gap-3.5 text-zinc-200 transition-[opacity,transform] duration-300 ease-out hover:translate-x-0.5 hover:opacity-95"
            >
              <span
                className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-blue-300 shadow-[0_0_0_1px_rgba(191,219,254,0.45)] transition-opacity duration-300"
                aria-hidden
              />
              <span>{label}</span>
            </li>
          ))}
        </ul>

        <p className="relative z-10 mt-auto max-w-md pt-14 text-[0.6875rem] leading-relaxed text-zinc-400">
          Acceso exclusivo para personal autorizado. Si olvidaste tus
          credenciales, consulta con el administrador del local.
        </p>
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
            event.preventDefault()
            if (!form.nombre || !form.email || !form.password) {
              showNotification({
                title: 'Registro incompleto',
                message: 'Completa todos los campos para crear tu cuenta.',
                variant: 'warning',
              })
              return
            }
            setCreated(true)
            showNotification({
              title: 'Cuenta creada',
              message: 'Tu cuenta de cliente fue creada correctamente.',
              variant: 'success',
            })
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
          >
            Registrarme
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
            onClick={() => navigate('/forgot-password')}
          >
            Recuperar contraseña
          </CustomButton>
        </div>
        </div>
      </section>
    </main>
  )
}
