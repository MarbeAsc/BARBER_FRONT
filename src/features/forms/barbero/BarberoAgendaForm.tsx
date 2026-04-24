import { CustomButton } from '../../../components/Button'

export function BarberoAgendaForm() {
  return (
    <section className="mb-4 rounded-2xl border border-slate-200/90 bg-white p-4 shadow-sm shadow-slate-200/60">
      <div className="grid gap-3 sm:grid-cols-3">
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
          Fecha
          <input
            type="date"
            className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100"
          />
        </label>
        <label className="flex flex-col gap-1.5 text-xs font-semibold text-slate-700">
          Estado cita
          <select className="h-11 rounded-xl border border-slate-300 bg-white px-3.5 text-sm font-normal text-slate-700 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-100">
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
