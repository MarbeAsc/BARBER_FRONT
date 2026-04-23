import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createFragance,
  deleteFragance,
  editFragance,
  getFragances,
  type PerfumeConArchivoDTO,
  type PerfumeDTO,
  type RespuestaDTO,
} from '@/services/perfumesService'

export const perfumesQueryKeys = {
  all: ['perfumes'] as const,
  list: () => [...perfumesQueryKeys.all, 'list'] as const,
}

type UsePerfumesListQueryOptions = {
  enabled?: boolean
}

export function usePerfumesListQuery(options?: UsePerfumesListQueryOptions) {
  return useQuery<PerfumeDTO[]>({
    queryKey: perfumesQueryKeys.list(),
    queryFn: () => getFragances(),
    enabled: options?.enabled ?? true,
  })
}

export function useCreatePerfumeMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, PerfumeConArchivoDTO>({
    mutationFn: (data) => createFragance(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: perfumesQueryKeys.all })
    },
  })
}

export function useEditPerfumeMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, PerfumeConArchivoDTO>({
    mutationFn: (data) => editFragance(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: perfumesQueryKeys.all })
    },
  })
}

export function useDeletePerfumeMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, number>({
    mutationFn: (id) => deleteFragance(id),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: perfumesQueryKeys.all })
    },
  })
}
