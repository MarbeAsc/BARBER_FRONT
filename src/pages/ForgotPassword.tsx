import { useState } from 'react'
import { Link } from 'react-router-dom'
import { CustomButton } from '../components/Button'
import { useCorreoRecuperacionMutation } from '@/hooks/useCorreo'
import { mensajeRespuestaUsuario } from '@/lib/respuesta-api'
import { showNotification } from '../lib/notifications'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)
  const correoRecuperacionMutation = useCorreoRecuperacionMutation()

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
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-cyan-100/85">Seguridad</p>
          <p className="mt-1 text-sm font-medium text-white">Recuperacion segura</p>
        </div>
        <div className="login-floating-card login-floating-card--left login-floating-card--mini" aria-hidden>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-blue-100/85">Acceso</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">Restablece rapido</p>
        </div>

        <div className="relative z-10 max-w-xl space-y-5">
          <span className="login-kicker inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[0.69rem] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Barber Shop
          </span>
          <h2 className="text-balance text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.15rem] lg:text-[2.45rem]">
            Recupera tu acceso
          </h2>
          <p className="login-hero-description max-w-md text-sm text-slate-300/90">
            Restablece tu contrasena para volver a gestionar agenda, clientes y caja.
          </p>
        </div>

        <div className="login-hero-metrics relative z-10 mt-auto max-w-xl" aria-label="Ventajas de recuperacion">
          <div className="login-hero-metric">
            <span>Enlace de recuperacion en minutos</span>
          </div>
          <div className="login-hero-metric">
            <span>Proceso rapido y seguro</span>
          </div>
        </div>
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
            <Link to="/reset-password" className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
              Ya tengo token, restablecer contraseña
            </Link>
            <CustomButton
              type="button"
              variant="secondary"
              size="sm"
              className="rounded-lg border-emerald-300 text-emerald-700 hover:bg-emerald-100"
              onClick={() =>
                showNotification({
                  title: 'Enlace reenviado',
                  message: 'Revisamos tu solicitud y reenviamos el correo de recuperación.',
                  variant: 'success',
                })
              }
            >
              Reenviar enlace
            </CustomButton>
          </div>
        ) : (
          <form
            className="mt-5 space-y-4"
            onSubmit={async (event) => {
              event.preventDefault()
              if (!email.trim()) {
                showNotification({
                  title: 'Correo requerido',
                  message: 'Ingresa tu correo para recuperar la contraseña.',
                  variant: 'warning',
                })
                return
              }
              try {
                const response = await correoRecuperacionMutation.mutateAsync({
                  email: email.trim(),
                })
                const { ok: envioCorrecto, mensaje } = mensajeRespuestaUsuario(response)

                if (envioCorrecto) {
                  setSubmitted(true)
                  showNotification({
                    title: 'Solicitud enviada',
                    message: mensaje || 'El correo de recuperación se envió correctamente.',
                    variant: 'success',
                  })
                  return
                }

                showNotification({
                  title: 'No se pudo enviar el correo',
                  message: mensaje || 'Intenta nuevamente en unos minutos.',
                  variant: 'warning',
                })
              } catch (error) {
                const message =
                  error instanceof Error
                    ? error.message
                    : 'Ocurrió un error inesperado al enviar el correo de recuperación.'
                showNotification({
                  title: 'Error al enviar correo',
                  message,
                  variant: 'error',
                })
              }
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
            <CustomButton
              type="submit"
              variant="primary"
              size="lg"
              className="w-full rounded-xl"
              disabled={correoRecuperacionMutation.isPending}
            >
              {correoRecuperacionMutation.isPending ? 'Enviando...' : 'Enviar enlace de recuperación'}
            </CustomButton>
          </form>
        )}

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Volver a iniciar sesión
          </Link>
          <Link
            to="/register"
            state={{ allowPublicFlow: true }}
            className="font-semibold text-blue-700 hover:text-blue-800"
          >
            Crear cuenta
          </Link>
        </div>
        </div>
      </section>
    </main>
  )
}
