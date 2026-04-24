function firstNonEmpty(...values: (string | undefined)[]): string | undefined {
  for (const value of values) {
    const trimmed = value?.trim()
    if (trimmed) return trimmed
  }
  return undefined
}

/**
 * Configuración HTTP compartida por `api-client` y servicios.
 * Prioridad: `VITE_API_URL`, luego `VITE_API_URL_LOCAL`, luego el valor por defecto local.
 * Documentación de variables: `.env.example`.
 */
export const API_CONFIG = {
  BASE_URL: firstNonEmpty(import.meta.env.VITE_API_URL, import.meta.env.VITE_API_URL_LOCAL) ?? 'http://localhost:5064/api',
  AUTH_LOGIN_PATH: firstNonEmpty(import.meta.env.VITE_AUTH_LOGIN_PATH) ?? '/usuario/login',
} as const
