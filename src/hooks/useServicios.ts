import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createService,
  deleteService,
  editService,
  getServices,
  type RespuestaDTO,
  type ServicioConArchivoDTO,
  type ServicioDTO,
} from '@/services/serviciosService'

export const serviciosQueryKeys = {
  all: ['servicios'] as const,
  list: () => [...serviciosQueryKeys.all, 'list'] as const,
}

type UseServiciosQueryOptions = {
  enabled?: boolean
}

export function useServiciosQuery(options?: UseServiciosQueryOptions) {
  return useQuery<ServicioDTO[]>({
    queryKey: serviciosQueryKeys.list(),
    queryFn: () => getServices(),
    enabled: options?.enabled ?? true,
  })
}

/** Aplica al renglón los campos enviados al API (creación/edición parcial o completa). */
function mergeServicioRow(current: ServicioDTO, patch: ServicioConArchivoDTO): ServicioDTO {
  return {
    ...current,
    nombre: patch.nombre,
    descripcion: patch.descripcion,
    idTipo: patch.idTipo,
    precioBase: patch.precioBase,
    base64: patch.base64,
    estatus: patch.estatus,
  }
}

type EditServicioContext = {
  previous: ServicioDTO[] | undefined
}

/**
 * Crea un servicio (`POST /servicio/crearServicio`).
 * Tras éxito invalida el listado para traer el registro con id asignado por el backend.
 */
export function useCreateServicioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, ServicioConArchivoDTO>({
    mutationFn: (data) => createService(data),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: serviciosQueryKeys.all })
    },
  })
}

/**
 * Edita un servicio (`POST /servicio/editarServicio`) — mismo contrato para el modal (todos los campos)
 * o para el switch (solo cambia `estatus`; el resto se reenvía igual que en el listado).
 * Actualización optimista del renglón en caché y rollback si la petición falla.
 */
export function useEditServicioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, ServicioConArchivoDTO, EditServicioContext>({
    mutationFn: (data) => editService(data),
    onMutate: async (variables) => {
      await queryClient.cancelQueries({ queryKey: serviciosQueryKeys.list() })
      const key = serviciosQueryKeys.list()
      const previous = queryClient.getQueryData<ServicioDTO[]>(key)
      if (previous) {
        queryClient.setQueryData<ServicioDTO[]>(
          key,
          previous.map((s) => (s.id === variables.id ? mergeServicioRow(s, variables) : s)),
        )
      }
      return { previous }
    },
    onSuccess: (data, _variables, context) => {
      if (!data.estatus && context?.previous) {
        queryClient.setQueryData(serviciosQueryKeys.list(), context.previous)
      }
    },
    onError: (_err, _variables, context) => {
      if (context?.previous) {
        queryClient.setQueryData(serviciosQueryKeys.list(), context.previous)
      }
    },
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: serviciosQueryKeys.all })
    },
  })
}

export function useDeleteServicioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, number>({
    mutationFn: (id) => deleteService(id),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: serviciosQueryKeys.all })
    },
  })
}
