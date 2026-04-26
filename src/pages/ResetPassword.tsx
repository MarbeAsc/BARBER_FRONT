import { useState } from 'react'
import { Link, useParams, useSearchParams } from 'react-router-dom'
import { CustomButton } from '@/components/Button'
import { useRestablecerContrasenaMutation } from '@/hooks/useCorreo'
import { mensajeRespuestaUsuario } from '@/lib/respuesta-api'
import { showNotification } from '@/lib/notifications'

export function ResetPassword() {
  const [searchParams] = useSearchParams()
  const { token: tokenEnRuta } = useParams()
  const tokenDetectado = (tokenEnRuta ?? searchParams.get('token') ?? searchParams.get('t') ?? '').trim()
  const [correo, setCorreo] = useState(searchParams.get('correo') ?? '')
  const [tokenRecuperacion] = useState(tokenDetectado)
  const [contrasena, setContrasena] = useState('')
  const [completado, setCompletado] = useState(false)
  const restablecerMutation = useRestablecerContrasenaMutation()

  return (
    <main className="login-page login-layout grid min-h-svh w-full text-slate-800 antialiased lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="login-hero login-hero-redesign relative hidden flex-col overflow-hidden p-10 text-zinc-100 sm:p-12 lg:flex">
        <div className="login-hero-canvas pointer-events-none absolute inset-0" aria-hidden />
        <div className="relative z-10 max-w-xl space-y-5">
          <span className="login-kicker inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[0.69rem] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Barber Shop
          </span>
          <h2 className="text-balance text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.15rem] lg:text-[2.45rem]">
            Restablece tu contraseña
          </h2>
          <p className="login-hero-description max-w-md text-sm text-slate-300/90">
            Ingresa tu correo y define una nueva contraseña segura.
          </p>
        </div>
      </aside>

      <section className="relative flex flex-col justify-center overflow-hidden bg-[#f8f8fb] px-5 py-14 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_10%,rgba(59,130,246,0.16),transparent_65%)]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-md rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Nueva contraseña</p>
          <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Restablecer contraseña</h1>
          <p className="mt-2 text-sm text-slate-500">Completa los datos para actualizar tu contraseña.</p>

          {completado ? (
            <div className="mt-5 space-y-3 rounded-2xl border border-emerald-200 bg-emerald-50 px-4 py-4 text-sm text-emerald-800">
              <p className="font-semibold">Contraseña restablecida correctamente</p>
              <p>Ya puedes iniciar sesión con tu nueva contraseña.</p>
              <Link to="/login" className="inline-flex text-sm font-semibold text-emerald-700 hover:text-emerald-800">
                Ir al inicio de sesión
              </Link>
            </div>
          ) : (
            <form
              className="mt-5 space-y-4"
              onSubmit={async (event) => {
                event.preventDefault()
                if (!correo.trim() || !contrasena.trim()) {
                  showNotification({
                    title: 'Datos incompletos',
                    message: 'Correo y contraseña son obligatorios.',
                    variant: 'warning',
                  })
                  return
                }
                if (!tokenRecuperacion) {
                  showNotification({
                    title: 'Enlace inválido',
                    message: 'No se encontró token de recuperación en el enlace.',
                    variant: 'warning',
                  })
                  return
                }

                try {
                  const response = await restablecerMutation.mutateAsync({
                    correo: correo.trim(),
                    token: tokenRecuperacion,
                    contrasena: contrasena.trim(),
                  })
                  const { ok, mensaje } = mensajeRespuestaUsuario(response)
                  if (ok) {
                    setCompletado(true)
                    showNotification({
                      title: 'Contraseña actualizada',
                      message: mensaje || 'La contraseña se restableció correctamente.',
                      variant: 'success',
                    })
                    return
                  }
                  showNotification({
                    title: 'No se pudo restablecer',
                    message: mensaje || 'Verifica los datos e intenta nuevamente.',
                    variant: 'warning',
                  })
                } catch (error) {
                  showNotification({
                    title: 'Error al restablecer',
                    message: error instanceof Error ? error.message : 'Error inesperado al restablecer la contraseña.',
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
                  value={correo}
                  onChange={(event) => setCorreo(event.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="cliente@barberia.com"
                />
              </label>

              <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
                Nueva contraseña
                <input
                  type="password"
                  required
                  value={contrasena}
                  onChange={(event) => setContrasena(event.target.value)}
                  className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm font-normal text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                  placeholder="********"
                />
              </label>

              <CustomButton
                type="submit"
                variant="primary"
                size="lg"
                className="w-full rounded-xl"
                disabled={restablecerMutation.isPending}
              >
                {restablecerMutation.isPending ? 'Restableciendo...' : 'Restablecer contraseña'}
              </CustomButton>
            </form>
          )}

          <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
            <Link to="/forgot-password" className="font-semibold text-blue-700 hover:text-blue-800">
              Volver a recuperar acceso
            </Link>
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
