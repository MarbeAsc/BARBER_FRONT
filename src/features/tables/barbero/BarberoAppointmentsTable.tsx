type AppointmentRow = {
  hora: string
  cliente: string
  servicio: string
  duracion: string
  estado: 'Pendiente' | 'Confirmada' | 'En curso' | 'Finalizada'
}

type BarberoAppointmentsTableProps = {
  rows: AppointmentRow[]
}

function badgeClass(status: AppointmentRow['estado']) {
  if (status === 'Finalizada') return 'bg-slate-200 text-slate-700'
  if (status === 'En curso') return 'bg-blue-100 text-blue-700'
  if (status === 'Confirmada') return 'bg-emerald-100 text-emerald-700'
  return 'bg-amber-100 text-amber-700'
}

export function BarberoAppointmentsTable({ rows }: BarberoAppointmentsTableProps) {
  return (
    <section className="rounded-2xl border border-slate-200 bg-white shadow-sm">
      <div className="border-b border-slate-200 bg-slate-50 px-5 py-4">
        <h2 className="text-lg font-semibold text-slate-900">Citas programadas</h2>
        <p className="mt-1 text-sm text-slate-500">
          Solo se muestran citas relacionadas con tus servicios asignados.
        </p>
      </div>
      <div className="overflow-x-auto p-4">
        <table className="min-w-full border-separate border-spacing-0 overflow-hidden rounded-xl border border-slate-200">
          <thead className="bg-slate-50">
            <tr>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Hora</th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Cliente</th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Servicio</th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Duración</th>
              <th className="border-b border-slate-200 px-3 py-2 text-left text-xs font-semibold uppercase tracking-wide text-slate-500">Estado</th>
            </tr>
          </thead>
          <tbody>
            {rows.map((row) => (
              <tr key={`${row.hora}-${row.cliente}`} className="hover:bg-slate-50/80">
                <td className="border-b border-slate-100 px-3 py-2 text-sm font-semibold text-slate-800">{row.hora}</td>
                <td className="border-b border-slate-100 px-3 py-2 text-sm text-slate-700">{row.cliente}</td>
                <td className="border-b border-slate-100 px-3 py-2 text-sm text-slate-700">{row.servicio}</td>
                <td className="border-b border-slate-100 px-3 py-2 text-sm text-slate-700">{row.duracion}</td>
                <td className="border-b border-slate-100 px-3 py-2 text-sm">
                  <span className={`inline-flex rounded-full px-2.5 py-1 text-xs font-semibold ${badgeClass(row.estado)}`}>
                    {row.estado}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </section>
  )
}
