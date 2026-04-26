import { useMemo, useState } from 'react'
import { FaBullhorn, FaClock, FaFilter, FaRegCalendarCheck, FaSyncAlt, FaTags } from 'react-icons/fa'
import { useAuth } from '@/hooks/useAuthContext'
import { usePromocionActiveQuery } from '@/hooks/usePromociones'
import type { PromocionDTO } from '@/services/promocionesSevice'
import { CustomButton } from '@/components/Button'

type VistaPromocion = 'todas' | 'por-vencer' | 'nuevas'

function toDate(value: string | Date): Date {
  return value instanceof Date ? value : new Date(value)
}

function formatDate(value: string | Date): string {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return 'Sin fecha'
  return new Intl.DateTimeFormat('es-MX', { dateStyle: 'medium', timeStyle: 'short' }).format(date)
}

function daysUntil(value: string | Date): number {
  const date = toDate(value)
  if (Number.isNaN(date.getTime())) return Number.POSITIVE_INFINITY
  const diff = date.getTime() - Date.now()
  return Math.ceil(diff / (1000 * 60 * 60 * 24))
}

export function ClientePromocionesPage() {
  const { user } = useAuth()
  const [vista, setVista] = useState<VistaPromocion>('todas')
  const [expandedPromos, setExpandedPromos] = useState<number[]>([])
  const { data = [], isPending, isError, error, refetch, isFetching } = usePromocionActiveQuery()

  const vigentes = useMemo(() => {
    const now = new Date()
    return (data as PromocionDTO[]).filter((row) => {
      const inicio = toDate(row.fechaInicio)
      const fin = toDate(row.fechaFin)
      return !Number.isNaN(inicio.getTime()) && !Number.isNaN(fin.getTime()) && now >= inicio && now <= fin
    })
  }, [data])

  const visibles = useMemo(() => {
    if (vista === 'por-vencer') return vigentes.filter((row) => daysUntil(row.fechaFin) <= 3)
    if (vista === 'nuevas') return vigentes.filter((row) => daysUntil(row.fechaInicio) >= -2)
    return vigentes
  }, [vigentes, vista])

  const porVencer = useMemo(() => vigentes.filter((row) => daysUntil(row.fechaFin) <= 3).length, [vigentes])
  const nuevas = useMemo(() => vigentes.filter((row) => daysUntil(row.fechaInicio) >= -2).length, [vigentes])

  const filtros: Array<{ key: VistaPromocion; label: string; total: number }> = [
    { key: 'todas', label: 'Todas', total: vigentes.length },
    { key: 'por-vencer', label: 'Por vencer', total: porVencer },
    { key: 'nuevas', label: 'Nuevas', total: nuevas },
  ]

  const toggleDetalles = (id: number) => {
    setExpandedPromos((prev) => (prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]))
  }


  return (
    <main className="mx-auto w-full px-4 py-8 sm:px-6 lg:px-8 lg:py-10">
      <header className="mb-6 overflow-hidden rounded-3xl border border-blue-100 bg-linear-to-r from-blue-50 via-indigo-50/60 to-white px-6 py-5 shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700/90">Cliente</p>
        <div className="mt-1 flex flex-wrap items-end justify-between gap-3">
          <h1 className="text-2xl font-semibold tracking-tight text-slate-900 sm:text-3xl">Promociones vigentes</h1>
          <span className="inline-flex items-center gap-2 rounded-full border border-blue-100 bg-white/85 px-3 py-1 text-xs font-medium text-blue-700">
            <FaBullhorn className="h-3 w-3" />
            {vigentes.length} disponibles
          </span>
        </div>
        <p className="mt-2 text-sm text-slate-600">Hola, {user?.username}. Revisa ofertas activas y aprovecha las que vencen pronto.</p>
      </header>

      <section className="mb-5 flex flex-wrap items-center gap-2 rounded-2xl border border-slate-200 bg-white p-3 shadow-sm">
        <span className="inline-flex items-center gap-2 rounded-full bg-slate-100 px-3 py-1 text-xs font-semibold text-slate-600">
          <FaFilter className="h-3 w-3" /> Filtros
        </span>
        {filtros.map((filtro) => (
          <CustomButton
            key={filtro.key}
            type="button"
            size="sm"
            variant={vista === filtro.key ? 'primary' : 'secondary'}
            onClick={() => setVista(filtro.key)}
          >
            {filtro.label} ({filtro.total})
          </CustomButton>
        ))}
        <div className="min-w-0 flex-1" />
        <CustomButton type="button" size="sm" variant="ghost" onClick={() => void refetch()} disabled={isFetching}>
          <span className="inline-flex items-center gap-2">
            <FaSyncAlt className={`h-3.5 w-3.5 ${isFetching ? 'animate-spin' : ''}`} />
            Actualizar
          </span>
        </CustomButton>
      </section>

      {isError ? (
        <div className="mb-4 rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm text-rose-700">
          {error instanceof Error ? error.message : 'No se pudieron cargar las promociones.'}
        </div>
      ) : null}

      {isPending ? (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="h-44 animate-pulse rounded-2xl border border-slate-200 bg-slate-100" />
          ))}
        </section>
      ) : visibles.length === 0 ? (
        <section className="rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
          <FaTags className="mx-auto h-6 w-6 text-slate-400" />
          <p className="mt-3 text-sm font-medium text-slate-700">No hay promociones vigentes para esta vista.</p>
        </section>
      ) : (
        <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
          {visibles.map((promo: PromocionDTO) => {
            const diasRestantes = daysUntil(promo.fechaFin)
            const isExpanded = expandedPromos.includes(promo.id)
            const estadoClase =
              diasRestantes <= 1
                ? 'bg-rose-50 text-rose-700'
                : diasRestantes <= 3
                  ? 'bg-amber-50 text-amber-700'
                  : 'bg-emerald-50 text-emerald-700'
            const estadoTexto =
              diasRestantes <= 1 ? 'Urgente' : diasRestantes <= 3 ? 'Por vencer' : 'Tiempo suficiente'
            return (
              <article
                key={promo.id}
                className="group rounded-2xl border border-slate-200 bg-linear-to-b from-white to-slate-50/60 p-4 shadow-sm transition duration-200 hover:-translate-y-1 hover:border-blue-200 hover:shadow-lg"
              >
                <div className="mb-3 flex items-center justify-between gap-2">
                  <span className="inline-flex items-center gap-2 rounded-full bg-emerald-50 px-2.5 py-1 text-[11px] font-semibold text-emerald-700">
                    <FaBullhorn className="h-3 w-3" /> Vigente
                  </span>
                  <span className="text-xs font-semibold text-slate-500">#{promo.id}</span>
                </div>
                <p className="text-sm font-semibold text-slate-900 line-clamp-3">{promo.descripcion?.trim() || 'Promoción especial'}</p>
                <div className="mt-3 flex items-center justify-between gap-2">
                  <div className={`inline-flex rounded-full px-2.5 py-1 text-[11px] font-semibold ${estadoClase}`}>{estadoTexto}</div>
                  <button
                    type="button"
                    onClick={() => toggleDetalles(promo.id)}
                    className="rounded-md px-2.5 py-1 text-xs font-semibold text-blue-700 transition hover:bg-blue-50 hover:text-blue-800"
                  >
                    {isExpanded ? 'Ocultar detalles' : 'Ver detalles'}
                  </button>
                </div>
                <p className="mt-2 text-xs font-semibold text-slate-500">
                  {diasRestantes <= 0 ? 'Termina hoy' : `Termina en ${diasRestantes} día(s)`}
                </p>
                <div className="mt-3 h-2 overflow-hidden rounded-full bg-slate-100">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${diasRestantes <= 1 ? 'bg-rose-500' : diasRestantes <= 3 ? 'bg-amber-500' : 'bg-emerald-500'}`}
                    style={{ width: `${Math.max(12, Math.min(100, (7 - Math.max(diasRestantes, 0)) * 14))}%` }}
                  />
                </div>
                {isExpanded ? (
                  <div className="mt-4 space-y-2 border-t border-slate-100 pt-3 text-xs text-slate-600">
                    <p className="inline-flex items-center gap-2">
                      <FaRegCalendarCheck className="h-3.5 w-3.5 text-blue-600" />
                      Inicio: {formatDate(promo.fechaInicio)}
                    </p>
                    <p className="inline-flex items-center gap-2">
                      <FaClock className="h-3.5 w-3.5 text-amber-600" />
                      Fin: {formatDate(promo.fechaFin)}
                    </p>
                  </div>
                ) : null}
              </article>
            )
          })}
        </section>
      )}
    </main>
  )
}
