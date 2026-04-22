import { useState } from 'react'
import { Link } from 'react-router-dom'
import { showNotification } from '../lib/notifications'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

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
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(52%_40%_at_15%_88%,rgba(16,185,129,0.12),transparent_62%)]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
        <div className="mb-4 flex items-center gap-2">
          <span className="h-2 w-2 rounded-full bg-emerald-400" />
          <span className="h-2 w-2 rounded-full bg-blue-400" />
          <span className="h-2 w-2 rounded-full bg-slate-300" />
        </div>

        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Recuperar acceso</p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">¿Olvidaste tu contraseña?</h1>
        <p className="mt-2 text-sm text-slate-500">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña de forma segura.
        </p>

        {submitted ? (
          <div className="mt-5 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
            <p className="font-semibold">Solicitud enviada correctamente</p>
            <p>Si el correo existe, recibirás instrucciones en unos minutos.</p>
            <button
              type="button"
              className="rounded-lg border border-emerald-300 bg-white px-3 py-1.5 text-xs font-semibold text-emerald-700 transition hover:bg-emerald-100"
              onClick={() =>
                showNotification({
                  title: 'Enlace reenviado',
                  message: 'Revisamos tu solicitud y reenviamos el correo de recuperación.',
                  variant: 'success',
                })
              }
            >
              Reenviar enlace
            </button>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={(event) => {
              event.preventDefault()
              if (!email.trim()) {
                showNotification({
                  title: 'Correo requerido',
                  message: 'Ingresa tu correo para recuperar la contraseña.',
                  variant: 'warning',
                })
                return
              }
              setSubmitted(true)
              showNotification({
                title: 'Solicitud enviada',
                message: 'Si el correo existe, te enviamos el enlace de recuperación.',
                variant: 'info',
              })
            }}
          >
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Correo
              <input
                type="email"
                required
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="cliente@barberia.com"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-3 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(37,99,235,0.8)] transition hover:brightness-110"
            >
              Enviar enlace de recuperación
            </button>
          </form>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Volver a iniciar sesión
          </Link>
          <Link to="/register" className="font-semibold text-blue-700 hover:text-blue-800">
            Crear cuenta
          </Link>
        </div>
        </div>
      </section>
    </main>
  )
}
