import {
  useQueryClient,
  type Query,
  type QueryClient,
  type QueryKey,
} from '@tanstack/react-query'
import { useSyncExternalStore } from 'react'
import { barberosQueryKeys } from '@/hooks/useBarberos'
import { perfumesQueryKeys } from '@/hooks/usePerfumes'
import { promocionesQueryKeys } from '@/hooks/usePromociones'
import { serviciosQueryKeys } from '@/hooks/useServicios'
import { usuariosQueryKeys } from '@/hooks/useUsuarios'

function isQueryKeyPrefix(queryKey: QueryKey, prefix: readonly unknown[]): boolean {
  if (queryKey.length < prefix.length) return false
  return prefix.every((part, i) => queryKey[i] === part)
}

/** Rutas con tablas/listados: el loader global espera la primera carga de datos (React Query). */
const ROUTE_TABLE_QUERY_PREFIXES: Record<string, readonly (readonly unknown[])[]> = {
  '/servicios': [serviciosQueryKeys.all],
  '/perfumes': [perfumesQueryKeys.all],
  '/promociones': [promocionesQueryKeys.all],
  '/promociones-cliente': [promocionesQueryKeys.all],
  '/promociones-barbero': [promocionesQueryKeys.all],
  '/Barberos': [barberosQueryKeys.all],
  '/barberos': [barberosQueryKeys.all],
  '/usuarios': [usuariosQueryKeys.all],
}

function prefixesForPath(pathname: string): readonly (readonly unknown[])[] | undefined {
  return ROUTE_TABLE_QUERY_PREFIXES[pathname] ?? ROUTE_TABLE_QUERY_PREFIXES[pathname.toLowerCase()]
}

export function routeHasTableQueries(pathname: string): boolean {
  return !!prefixesForPath(pathname)
}

function queryBlocksRouteLoad(query: Query, pathname: string): boolean {
  const prefixes = prefixesForPath(pathname)
  if (!prefixes?.length) return false
  if (!prefixes.some((prefix) => isQueryKeyPrefix(query.queryKey, prefix))) return false
  const noDataYet = query.state.data === undefined
  const loading =
    query.state.fetchStatus === 'fetching' ||
    (query.state.status === 'pending' && noDataYet)
  return noDataYet && loading
}

/**
 * True si la ruta actual es de tablas y aún no hay queries listas:
 * - no hay ninguna query del prefijo (la página aún no montó el hook), o
 * - alguna query del listado está en primera carga (sin datos).
 * Con datos en caché no bloquea refetch en segundo plano.
 */
export function shouldBlockTableRoute(queryClient: QueryClient, pathname: string): boolean {
  const prefixes = prefixesForPath(pathname)
  if (!prefixes) return false
  const list = queryClient.getQueryCache().findAll({
    predicate: (q) => prefixes.some((prefix) => isQueryKeyPrefix(q.queryKey, prefix)),
  })
  if (list.length === 0) return true
  return list.some((q) => queryBlocksRouteLoad(q, pathname))
}

export function useRouteTableLoaderBlocking(pathname: string): boolean {
  const queryClient = useQueryClient()

  return useSyncExternalStore(
    (onStoreChange) => {
      if (!prefixesForPath(pathname)) return () => {}
      return queryClient.getQueryCache().subscribe(onStoreChange)
    },
    () => shouldBlockTableRoute(queryClient, pathname),
    () => false,
  )
}
