import { useState } from 'react'
import { Link } from 'react-router-dom'
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { showNotification } from '../lib/notifications'

export function ContactPage() {
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
  })

  return (
    <main className="grid min-h-svh w-full bg-[#f4f4f5] text-slate-800 antialiased lg:grid-cols-[minmax(0,1.05fr)_minmax(0,1fr)]">
      <aside className="relative hidden flex-col justify-between overflow-hidden bg-[#111215] p-10 text-zinc-100 sm:p-12 lg:flex lg:border-r lg:border-white/10 lg:shadow-[inset_-1px_0_0_rgba(255,255,255,0.06)]">
        <div className="pointer-events-none absolute inset-0 bg-[linear-gradient(135deg,rgba(10,10,12,0.96)_0%,rgba(22,23,28,0.92)_42%,rgba(10,10,12,0.96)_100%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(95%_70%_at_10%_10%,rgba(59,130,246,0.2),transparent_60%)]" aria-hidden />
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(75%_60%_at_100%_100%,rgba(14,165,233,0.18),transparent_60%)]" aria-hidden />
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
            Contáctanos
          </span>
          <h1 className="text-balance text-[1.65rem] font-semibold leading-[1.2] tracking-[-0.02em] text-white sm:text-3xl lg:text-[2.125rem]">
            Estamos listos para ayudarte
          </h1>
          <p className="max-w-prose text-[0.9375rem] leading-relaxed text-zinc-300">
            Si necesitas acceso, soporte o información comercial, nuestro equipo te responde rápidamente.
          </p>
        </div>

        <ul
          className="relative z-10 mt-14 max-w-lg space-y-4 text-[0.9375rem] leading-snug"
          aria-label="Beneficios de soporte"
        >
          {[
            'Respuesta por correo y WhatsApp el mismo día',
            'Asistencia para acceso, usuarios y reservas',
            'Acompañamiento para implementación en barbería',
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
          Equipo de soporte disponible para ayudarte con dudas técnicas, acceso al sistema y coordinación comercial.
        </p>
      </aside>

      <section className="relative flex flex-col justify-center overflow-hidden bg-[#f8f8fb] px-5 py-12 sm:px-10 sm:py-16">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(55%_45%_at_85%_10%,rgba(59,130,246,0.16),transparent_65%)]" aria-hidden />
        <div className="relative z-10 mx-auto w-full max-w-2xl rounded-3xl border border-slate-200 bg-white/95 p-6 shadow-[0_20px_50px_-30px_rgba(15,23,42,0.35)] backdrop-blur-sm sm:p-8">
          <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Soporte BarberShop</p>
          <h2 className="mt-2 text-2xl font-semibold tracking-tight text-slate-900">Canales de atención</h2>

          <div className="mt-5 grid gap-3 sm:grid-cols-2">
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaEnvelope className="text-blue-600" /> Correo
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">soporte@barbershop.com</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaPhoneAlt className="text-blue-600" /> Teléfono
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">+593 99 123 4567</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaWhatsapp className="text-blue-600" /> WhatsApp
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">+593 98 765 4321</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaClock className="text-blue-600" /> Horario
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Lun - Sáb: 09:00 a 20:00</p>
            </article>
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <FaMapMarkerAlt className="text-blue-600" /> Dirección
            </p>
            <p className="mt-1 text-sm text-slate-700">Av. Principal 123 y Calle Barber, Quito - Ecuador</p>
          </div>

          <form
            className="mt-6 grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              event.preventDefault()
              if (!form.nombre || !form.correo || !form.mensaje) {
                showNotification({
                  title: 'Formulario incompleto',
                  message: 'Completa nombre, correo y mensaje para enviarnos tu consulta.',
                  variant: 'warning',
                })
                return
              }
              showNotification({
                title: 'Mensaje enviado',
                message: 'Gracias por contactarnos. Te responderemos pronto.',
                variant: 'success',
              })
              setForm({ nombre: '', correo: '', mensaje: '' })
            }}
          >
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Nombre
              <input
                type="text"
                value={form.nombre}
                onChange={(event) => setForm((prev) => ({ ...prev, nombre: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Tu nombre"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Correo
              <input
                type="email"
                value={form.correo}
                onChange={(event) => setForm((prev) => ({ ...prev, correo: event.target.value }))}
                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="correo@dominio.com"
              />
            </label>
            <label className="sm:col-span-2 flex flex-col gap-1 text-xs font-semibold text-slate-600">
              Mensaje
              <textarea
                value={form.mensaje}
                onChange={(event) => setForm((prev) => ({ ...prev, mensaje: event.target.value }))}
                rows={4}
                className="rounded-xl border border-slate-300 px-3 py-2.5 text-sm text-slate-700 outline-none transition focus:border-blue-500 focus:ring-2 focus:ring-blue-200"
                placeholder="Cuéntanos qué necesitas..."
              />
            </label>
            <button
              type="submit"
              className="sm:col-span-2 rounded-xl bg-linear-to-r from-blue-600 to-blue-500 px-4 py-2.5 text-sm font-semibold text-white shadow-[0_10px_24px_-14px_rgba(37,99,235,0.8)] transition hover:brightness-110"
            >
              Enviar consulta
            </button>
          </form>

          <div className="mt-5 border-t border-slate-200 pt-4 text-sm">
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </section>
    </main>
  )
}
