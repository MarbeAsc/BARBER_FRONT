import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'

export function Register() {
  const navigate = useNavigate()
  const [form, setForm] = useState({
    nombre: '',
    email: '',
    password: '',
  })
  const [created, setCreated] = useState(false)

  return (
    <main className="grid min-h-svh place-items-center bg-[#f8f8fb] px-4 py-10">
      <section className="w-full max-w-lg rounded-2xl border border-slate-200 bg-white p-6 shadow-sm sm:p-8">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-amber-700/90">
          Crear cuenta
        </p>
        <h1 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">
          Registro de cliente
        </h1>
        <p className="mt-2 text-sm text-slate-500">
          Completa tus datos para crear una cuenta de cliente y reservar citas.
        </p>

        {created ? (
          <div className="mt-5 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm text-emerald-800">
            Cuenta creada correctamente. Ya puedes iniciar sesión.
          </div>
        ) : null}

        <form
          className="mt-5 grid gap-4 sm:grid-cols-2"
          onSubmit={(event) => {
            event.preventDefault()
            if (!form.nombre || !form.email || !form.password) return
            setCreated(true)
          }}
        >
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 sm:col-span-2">
            Nombre completo
            <input
              type="text"
              required
              value={form.nombre}
              onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
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
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
              placeholder="cliente@barberia.com"
            />
          </label>
          
          <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600 ">
            Contraseña
            <input
              type="password"
              required
              minLength={6}
              value={form.password}
              onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
              className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
              placeholder="Mínimo 6 caracteres"
            />
          </label>
          <button
            type="submit"
            className="sm:col-span-2 w-full rounded-lg bg-slate-900 px-3 py-2.5 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Registrarme
          </button>
        </form>

        <div className="mt-5 flex items-center justify-between border-t border-slate-200 pt-4 text-sm">
          <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
            Volver a iniciar sesión
          </Link>
          <button
            type="button"
            className="font-semibold text-blue-700 hover:text-blue-800"
            onClick={() => navigate('/forgot-password')}
          >
            Recuperar contraseña
          </button>
        </div>
      </section>
    </main>
  )
}
