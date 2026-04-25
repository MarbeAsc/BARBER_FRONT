import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCita,
  getCitasByBarbero,
  type CitaCreacionDTO,
  type CitaDTO,
  type RespuestaDTO,
} from '@/services/citaService'

export const citasQueryKeys = {
  all: ['citas'] as const,
  byBarbero: (idBarbero: number) => [...citasQueryKeys.all, 'barbero', idBarbero] as const,
}

type UseCitasByBarberoQueryOptions = {
  enabled?: boolean
}

export function useCitasByBarberoQuery(idBarbero: number, options?: UseCitasByBarberoQueryOptions) {
  return useQuery<CitaDTO>({
    queryKey: citasQueryKeys.byBarbero(idBarbero),
    queryFn: () => getCitasByBarbero(idBarbero),
    enabled: (options?.enabled ?? true) && Number.isFinite(idBarbero) && idBarbero > 0,
  })
}

export function useCreateCitaMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, CitaCreacionDTO>({
    mutationFn: (data) => createCita(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: citasQueryKeys.all })
    },
  })
}
