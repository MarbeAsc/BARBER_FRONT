import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createPromotion,
  deletePromotion,
  editPromotion,
  getPromotion,
  getPromotionActive,
  type PromocionDTO,
  type RespuestaDTO,
} from '@/services/promocionesSevice'

export const promocionesQueryKeys = {
  all: ['promociones'] as const,
  list: () => [...promocionesQueryKeys.all, 'list'] as const,
  active: () => [...promocionesQueryKeys.all, 'active'] as const,
}

type UsePromocionesListQueryOptions = {
  enabled?: boolean
}

type UsePromocionActiveQueryOptions = {
  enabled?: boolean
}

export function usePromocionesListQuery(options?: UsePromocionesListQueryOptions) {
  return useQuery<PromocionDTO[]>({
    queryKey: promocionesQueryKeys.list(),
    queryFn: () => getPromotion(),
    enabled: options?.enabled ?? true,
  })
}

export function usePromocionActiveQuery(options?: UsePromocionActiveQueryOptions) {
  return useQuery<PromocionDTO>({
    queryKey: promocionesQueryKeys.active(),
    queryFn: () => getPromotionActive(),
    enabled: options?.enabled ?? true,
  })
}

export function useCreatePromocionMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, PromocionDTO>({
    mutationFn: (data) => createPromotion(data),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: promocionesQueryKeys.all })
    },
  })
}

export function useEditPromocionMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, PromocionDTO>({
    mutationFn: (data) => editPromotion(data),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: promocionesQueryKeys.all })
    },
  })
}

export function useDeletePromocionMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, number>({
    mutationFn: (id) => deletePromotion(id),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: promocionesQueryKeys.all })
    },
  })
}
