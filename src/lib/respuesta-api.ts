/** Fila de respuesta que algunos endpoints devuelven en array o suelto (misma forma que servicios). */
type FilaListaApi = {
  estatus?: boolean
  descripcion?: string
  Estatus?: boolean
  Descripcion?: string
}

/**
 * Normaliza respuestas de crear/editar en endpoints que tipan `[]` pero a veces devuelven un solo objeto
 * (misma lógica que en servicios: un `{ estatus, descripcion }`).
 */
export function mensajePrimeraRespuestaLista(
  res: FilaListaApi | FilaListaApi[] | undefined,
): { ok: boolean; mensaje: string } {
  if (res == null) return { ok: false, mensaje: 'Sin respuesta del servidor.' }
  const row: FilaListaApi | undefined = Array.isArray(res) ? res[0] : res
  if (!row || typeof row !== 'object') return { ok: false, mensaje: 'Sin respuesta del servidor.' }
  const ok = row.estatus === true || row.Estatus === true
  const mensaje = String(row.descripcion ?? row.Descripcion ?? '')
  return { ok, mensaje }
}

/** Respuesta usuario: API en PascalCase; acepta también camelCase si el backend alinea con otros módulos. */
export function mensajeRespuestaUsuario(
  res: FilaListaApi | undefined,
): { ok: boolean; mensaje: string } {
  if (!res) return { ok: false, mensaje: 'Sin respuesta del servidor.' }
  const ok = res.Estatus === true || res.estatus === true
  const mensaje = String(res.Descripcion ?? res.descripcion ?? '')
  return { ok, mensaje }
}
