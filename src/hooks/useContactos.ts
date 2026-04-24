import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createContact,
  editContact,
  getContact,
  type ConsultaCreacionDTO,
  type ConsultaDTO,
  type RespuestaDTO,
} from '@/services/contactosService'

export const contactosQueryKeys = {
  all: ['contactos'] as const,
  list: () => [...contactosQueryKeys.all, 'list'] as const,
}

type UseContactosListQueryOptions = {
  enabled?: boolean
}

export function useContactosListQuery(options?: UseContactosListQueryOptions) {
  return useQuery<ConsultaDTO[]>({
    queryKey: contactosQueryKeys.list(),
    queryFn: () => getContact(),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateContactoMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, ConsultaCreacionDTO>({
    mutationFn: (data) => createContact(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactosQueryKeys.all })
    },
  })
}

export function useEditContactoMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO[], Error, ConsultaCreacionDTO>({
    mutationFn: (data) => editContact(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: contactosQueryKeys.all })
    },
  })
}
