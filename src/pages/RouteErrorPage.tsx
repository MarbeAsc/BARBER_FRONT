import { isRouteErrorResponse, useNavigate, useRouteError } from 'react-router-dom'
import { CustomButton } from '../components/Button'

function errorMessage(error: unknown): string {
  if (isRouteErrorResponse(error)) {
    return typeof error.data === 'string' && error.data
      ? error.data
      : error.statusText || `Error ${error.status}`
  }
  if (error instanceof Error) return error.message
  return 'Ocurrió un problema al cargar esta página.'
}

export function RouteErrorPage() {
  const error = useRouteError()
  const navigate = useNavigate()
  const message = errorMessage(error)

  return (
    <div className="flex min-h-svh flex-col items-center justify-center bg-slate-50 px-4 py-12 text-slate-800">
      <div className="w-full max-w-md rounded-2xl border border-slate-200 bg-white p-8 text-center shadow-sm">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-blue-700">
          Algo salió mal
        </p>
        <h1 className="mt-2 text-xl font-semibold text-slate-900">No pudimos mostrar esta vista</h1>
        <p className="mt-3 text-sm text-slate-600">{message}</p>
        <div className="mt-6 flex flex-col gap-2 sm:flex-row sm:justify-center">
          <CustomButton type="button" variant="primary" size="lg" onClick={() => navigate('/', { replace: true })}>
            Ir al panel principal
          </CustomButton>
          <CustomButton type="button" variant="secondary" size="lg" onClick={() => navigate(-1)}>
            Regresar
          </CustomButton>
        </div>
      </div>
    </div>
  )
}
