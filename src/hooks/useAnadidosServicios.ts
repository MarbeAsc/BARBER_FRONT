import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createAddService,
  deleteAddService,
  editAddService,
  getAddServices,
  type AnadidoServicioDTO,
  type RespuestaDTO,
} from '@/services/añadidosService'

export const anadidosServiciosQueryKeys = {
  all: ['anadidosServicios'] as const,
  byServicio: (servicioId: number) =>
    [...anadidosServiciosQueryKeys.all, 'servicio', servicioId] as const,
}

type UseAnadidosServiciosQueryOptions = {
  enabled?: boolean
}

export function useAnadidosServiciosQuery(
  servicioId: number,
  options?: UseAnadidosServiciosQueryOptions,
) {
  return useQuery<AnadidoServicioDTO[]>({
    queryKey: anadidosServiciosQueryKeys.byServicio(servicioId),
    queryFn: () => getAddServices(servicioId),
    enabled: (options?.enabled ?? true) && Number.isFinite(servicioId) && servicioId > 0,
  })
}

export function useCreateAnadidoServicioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, AnadidoServicioDTO>({
    mutationFn: (data) => createAddService(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: anadidosServiciosQueryKeys.all })
    },
  })
}

export function useEditAnadidoServicioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, AnadidoServicioDTO>({
    mutationFn: (data) => editAddService(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: anadidosServiciosQueryKeys.all })
    },
  })
}

export function useDeleteAnadidoServicioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, number>({
    mutationFn: (id) => deleteAddService(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: anadidosServiciosQueryKeys.all })
    },
  })
}
