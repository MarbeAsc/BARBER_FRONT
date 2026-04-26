import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createCita,
  getCitasByBarbero,
  getCitasByUserId,
  type CitaCreacionDTO,
  type CitaDetalladaDTO,
  type RespuestaDTO,
} from '@/services/citaService'

export const citasQueryKeys = {
  all: ['citas'] as const,
  byBarbero: (idBarbero: number) => [...citasQueryKeys.all, 'barbero', idBarbero] as const,
  byUser: (idUser: number) => [...citasQueryKeys.all, 'user', idUser] as const,
}

type UseCitasByBarberoQueryOptions = {
  enabled?: boolean
}
type UseCitasByUserQueryOptions = {
  enabled?: boolean
}
export function useCitasByBarberoQuery(idBarbero: number, options?: UseCitasByBarberoQueryOptions) {
  return useQuery<CitaDetalladaDTO[]>({
    queryKey: citasQueryKeys.byBarbero(idBarbero),
    queryFn: () => getCitasByBarbero(idBarbero),
    enabled: (options?.enabled ?? true) && Number.isFinite(idBarbero) && idBarbero > 0,
  })
}

export function useCitasByUserQuery(idUser: number, options?: UseCitasByUserQueryOptions) {
  return useQuery<CitaDetalladaDTO[]>({
    queryKey: citasQueryKeys.byUser(idUser),
    queryFn: () => getCitasByUserId(idUser),
    enabled: (options?.enabled ?? true) && Number.isFinite(idUser) && idUser > 0,
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
