import type { ReactNode } from 'react'

type Column<T> = {
  key: keyof T
  label: string
  className?: string
  render?: (value: T[keyof T], row: T) => ReactNode
}

type AdminCatalogTableProps<T extends Record<string, unknown>> = {
  title: string
  description: string
  addActionLabel: string
  columns: Array<Column<T>>
  rows: T[]
}

function statusBadge(value: unknown) {
  const source = String(value ?? '').toLowerCase()
  const active = source === 'activo' || source === 'true'
  return (
    <span
      className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${
        active ? 'bg-emerald-100 text-emerald-700' : 'bg-amber-100 text-amber-700'
      }`}
    >
      {active ? 'Activo' : 'Inactivo'}
    </span>
  )
}

export function AdminCatalogTable<T extends Record<string, unknown>>({
  title,
  description,
  addActionLabel,
  columns,
  rows,
}: AdminCatalogTableProps<T>) {
  const activeCount = rows.filter((row) => {
    const state = String(row.estado ?? row.activo ?? '').toLowerCase()
    return state === 'activo' || state === 'true'
  }).length
  const inactiveCount = rows.length - activeCount

  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-linear-to-br from-slate-50 to-white px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h2 className="text-lg font-semibold text-slate-900 sm:text-xl">{title}</h2>
            <p className="mt-1 text-xs text-slate-500 sm:text-sm">{description}</p>
          </div>
          <button
            type="button"
            className="rounded-lg bg-slate-900 px-3 py-2 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            {addActionLabel}
          </button>
        </div>

        <div className="mt-4 grid grid-cols-3 gap-2 text-xs sm:max-w-md">
          <article className="rounded-lg border border-slate-200 bg-white px-3 py-2">
            <p className="text-slate-500">Total</p>
            <p className="text-base font-semibold text-slate-900">{rows.length}</p>
          </article>
          <article className="rounded-lg border border-emerald-200 bg-emerald-50/60 px-3 py-2">
            <p className="text-emerald-700">Activos</p>
            <p className="text-base font-semibold text-emerald-800">{activeCount}</p>
          </article>
          <article className="rounded-lg border border-amber-200 bg-amber-50/70 px-3 py-2">
            <p className="text-amber-700">Inactivos</p>
            <p className="text-base font-semibold text-amber-800">{inactiveCount}</p>
          </article>
        </div>
      </div>

      <div className="overflow-x-auto p-4">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              {columns.map((column) => (
                <th
                  key={String(column.key)}
                  className={`border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500 ${column.className ?? ''}`}
                >
                  {column.label}
                </th>
              ))}
              <th className="border-b border-slate-200 px-3 py-2 text-right text-xs font-semibold uppercase tracking-wide text-slate-500">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row, idx) => (
              <tr key={idx} className="bg-white transition-colors hover:bg-slate-50/70">
                {columns.map((column) => {
                  const value = row[column.key]
                  const content = column.render
                    ? column.render(value, row)
                    : String(value ?? '-')
                  return (
                    <td
                      key={String(column.key)}
                      className={`border-b border-slate-100 px-3 py-2 text-sm text-slate-700 ${column.className ?? ''}`}
                    >
                      {String(column.key).toLowerCase() === 'estado'
                        ? statusBadge(value)
                        : content}
                    </td>
                  )
                })}
                <td className="border-b border-slate-100 px-3 py-2 text-right">
                  <div className="inline-flex gap-2">
                    <button
                      type="button"
                      className="rounded-md border border-slate-300 bg-white px-2.5 py-1 text-xs font-semibold text-slate-700 transition hover:border-slate-400"
                    >
                      Editar
                    </button>
                    <button
                      type="button"
                      className="rounded-md border border-rose-200 bg-rose-50 px-2.5 py-1 text-xs font-semibold text-rose-700 transition hover:bg-rose-100"
                    >
                      Eliminar
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
