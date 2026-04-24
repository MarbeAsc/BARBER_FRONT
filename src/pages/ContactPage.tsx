import { useState, type FormEvent } from 'react'
import { Link } from 'react-router-dom'
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt, FaWhatsapp } from 'react-icons/fa'
import { CustomButton } from '../components/Button'
import { showNotification } from '../lib/notifications'
import { useCreateContactoMutation } from '@/hooks/useContactos'
import { mensajePrimeraRespuestaLista } from '@/lib/respuesta-api'
import { ConfirmacionDialog } from '@/components/ConfirmacionDialog'

export function ContactPage() {
  const createContactoMutation = useCreateContactoMutation()
  const [form, setForm] = useState({
    nombre: '',
    correo: '',
    mensaje: '',
  })
  const [confirmOpen, setConfirmOpen] = useState(false)

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    if (!form.nombre || !form.correo || !form.mensaje) {
      showNotification({
        title: 'Formulario incompleto',
        message: 'Completa nombre, correo y mensaje para enviarnos tu consulta.',
        variant: 'warning',
      })
      return
    }
    setConfirmOpen(true)
  }

  const handleConfirmSubmit = async () => {
    try {
      const response = await createContactoMutation.mutateAsync({
        nombre: form.nombre.trim(),
        correo: form.correo.trim(),
        mensaje: form.mensaje.trim(),
      })
      const { ok, mensaje } = mensajePrimeraRespuestaLista(response)
      if (!ok) {
        setConfirmOpen(false)
        showNotification({
          title: 'Contacto',
          message: mensaje || 'No se pudo enviar tu consulta.',
          variant: 'warning',
        })
        return
      }

      setConfirmOpen(false)
      showNotification({
        title: 'Mensaje enviado',
        message: mensaje || 'Gracias por contactarnos. Te responderemos pronto.',
        variant: 'success',
      })
      setForm({ nombre: '', correo: '', mensaje: '' })
    } catch (error) {
      setConfirmOpen(false)
      showNotification({
        title: 'Contacto',
        message: error instanceof Error ? error.message : 'Error al enviar la consulta.',
        variant: 'error',
      })
    }
  }

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
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-cyan-100/85">Soporte</p>
          <p className="mt-1 text-sm font-medium text-white">Respuesta hoy</p>
        </div>
        <div className="login-floating-card login-floating-card--left login-floating-card--mini" aria-hidden>
          <p className="text-[0.62rem] font-semibold uppercase tracking-[0.15em] text-blue-100/85">Equipo</p>
          <p className="mt-1 text-sm font-medium text-zinc-100">Atencion dedicada</p>
        </div>

        <div className="relative z-10 max-w-xl space-y-5">
          <span className="login-kicker inline-flex rounded-full border border-cyan-300/30 bg-cyan-300/10 px-3 py-1 text-[0.69rem] font-semibold uppercase tracking-[0.2em] text-cyan-100">
            Contáctanos
          </span>
          <h1 className="text-balance text-[1.8rem] font-semibold leading-[1.12] tracking-[-0.02em] text-white sm:text-[2.15rem] lg:text-[2.45rem]">
            Estamos listos para ayudarte
          </h1>
          <p className="login-hero-description max-w-md text-sm text-slate-300/90">
            Si necesitas acceso, soporte o informacion comercial, nuestro equipo te responde rapido.
          </p>
        </div>

        <div className="login-hero-metrics relative z-10 mt-auto max-w-xl" aria-label="Beneficios de soporte">
          <div className="login-hero-metric">
            <span>Correo y WhatsApp el mismo dia</span>
          </div>
          <div className="login-hero-metric">
            <span>Acompanamiento tecnico y comercial</span>
          </div>
        </div>
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
              <p className="mt-1 text-sm font-semibold text-slate-900">soporte.tejupilco@barbershop.com</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaPhoneAlt className="text-blue-600" /> Teléfono
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">+52 724 267 1845</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaWhatsapp className="text-blue-600" /> WhatsApp
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">+52 724 112 9036</p>
            </article>
            <article className="rounded-xl border border-slate-200 bg-slate-50/80 p-3">
              <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
                <FaClock className="text-blue-600" /> Horario
              </p>
              <p className="mt-1 text-sm font-semibold text-slate-900">Lun - Sáb: 09:00 a 19:30</p>
            </article>
          </div>

          <div className="mt-3 rounded-xl border border-slate-200 bg-white p-3">
            <p className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-600">
              <FaMapMarkerAlt className="text-blue-600" /> Dirección
            </p>
            <p className="mt-1 text-sm text-slate-700">Calle Benito Juárez 45, Centro, Tejupilco de Hidalgo, Estado de México</p>
          </div>

          <form
            className="mt-6 grid gap-3 sm:grid-cols-2"
            onSubmit={(event) => {
              void handleSubmit(event)
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
            <CustomButton
              type="submit"
              variant="primary"
              size="lg"
              className="sm:col-span-2 rounded-xl"
              disabled={createContactoMutation.isPending}
            >
              {createContactoMutation.isPending ? 'Enviando...' : 'Enviar consulta'}
            </CustomButton>
          </form>

          <div className="mt-5 border-t border-slate-200 pt-4 text-sm">
            <Link to="/login" className="font-semibold text-blue-700 hover:text-blue-800">
              Volver a iniciar sesión
            </Link>
          </div>
        </div>
      </section>
      <ConfirmacionDialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        onConfirm={() => void handleConfirmSubmit()}
        title="Confirmar consulta"
        subtitle="Revisa tus datos antes de enviar"
        message="¿Deseas enviar esta consulta a soporte?"
        confirmText="Sí, enviar consulta"
        cancelText="Revisar datos"
        loading={createContactoMutation.isPending}
        additionalInfo={
          <div className="space-y-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Nombre:</span>
              <span className="text-sm font-medium text-slate-900">{form.nombre.trim() || '—'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Correo:</span>
              <span className="text-sm font-medium text-slate-900">{form.correo.trim() || '—'}</span>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <span className="text-xs font-semibold uppercase tracking-wide text-slate-500">Mensaje:</span>
              <span className="text-sm font-medium text-slate-900">{form.mensaje.trim() || '—'}</span>
            </div>
          </div>
        }
      />
    </main>
  )
}
