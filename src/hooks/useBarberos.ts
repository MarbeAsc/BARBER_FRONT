import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  AsignBarber,
  createBarber,
  deleteBarber,
  editBarber,
  getBarbers,
  type AsignacionBarberoDTO,
  type BarberoDTO,
  type BarberoListadoDTO,
  type RespuestaDTO,
} from '@/services/barberosService'

export const barberosQueryKeys = {
  all: ['barberos'] as const,
  list: () => [...barberosQueryKeys.all, 'list'] as const,
}

type UseBarberosListQueryOptions = {
  enabled?: boolean
}

export function useBarberosListQuery(options?: UseBarberosListQueryOptions) {
  return useQuery<BarberoListadoDTO[]>({
    queryKey: barberosQueryKeys.list(),
    queryFn: () => getBarbers(),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateBarberMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, BarberoDTO>({
    mutationFn: (data) => createBarber(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: barberosQueryKeys.all })
    },
  })
}

export function useEditBarberMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, BarberoDTO>({
    mutationFn: (data) => editBarber(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: barberosQueryKeys.all })
    },
  })
}

export function useDeleteBarberMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, number>({
    mutationFn: (id) => deleteBarber(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: barberosQueryKeys.all })
    },
  })
}

export function useAssignBarberMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, AsignacionBarberoDTO>({
    mutationFn: (data) => AsignBarber(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: barberosQueryKeys.all })
    },
  })
}
