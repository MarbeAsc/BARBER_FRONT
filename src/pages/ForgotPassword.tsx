import { useState } from 'react'
import { Link } from 'react-router-dom'
import { showNotification } from '../lib/notifications'

export function ForgotPassword() {
  const [email, setEmail] = useState('')
  const [submitted, setSubmitted] = useState(false)

  return (
    <main className="grid min-h-svh place-items-center bg-[#f8f8fb] px-4 py-10">
      <section className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">
          Recuperar acceso
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          ¿Olvidaste tu contraseña?
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>

        {submitted ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Si el correo existe, recibirás instrucciones en unos minutos.
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
                className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
                placeholder="cliente@barberia.com"
              />
            </label>
            <button
              type="submit"
              className="w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
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
      </section>
    </main>
  )
}
