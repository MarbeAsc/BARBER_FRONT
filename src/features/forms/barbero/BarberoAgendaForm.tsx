import { CustomButton } from '../../../components/Button'

export function BarberoAgendaForm() {
  return (
    <section className="mb-4 rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Fecha
          <input
            type="date"
            className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500"
          />
        </label>
        <label className="flex flex-col gap-1 text-xs font-semibold text-slate-600">
          Estado cita
          <select className="rounded-lg border border-slate-300 px-3 py-2 text-sm font-normal text-slate-700 outline-none transition focus:border-slate-500">
            <option>Todas</option>
            <option>Pendiente</option>
            <option>Confirmada</option>
            <option>En curso</option>
            <option>Finalizada</option>
          </select>
        </label>
        <div className="flex items-end">
          <CustomButton
            type="button"
            variant="primary"
            size="lg"
            className="w-full rounded-lg"
          >
            Aplicar filtros
          </CustomButton>
        </div>
      </div>
    </section>
  )
}
