import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import {
  createUser,
  deleteUser,
  editUser,
  getUsers,
  type RespuestaDTO,
  type UsuarioCreacionDTO,
  type UsuarioDTO,
  type UsuarioEdicionDTO,
} from '@/services/usuarioService'

export const usuariosQueryKeys = {
  all: ['usuarios'] as const,
  list: () => [...usuariosQueryKeys.all, 'list'] as const,
}

type UseUsuariosListQueryOptions = {
  enabled?: boolean
}

export function useUsuariosListQuery(options?: UseUsuariosListQueryOptions) {
  return useQuery<UsuarioDTO[]>({
    queryKey: usuariosQueryKeys.list(),
    queryFn: () => getUsers(),
    enabled: options?.enabled ?? true,
  })
}

export function useCreateUsuarioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, UsuarioCreacionDTO>({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.all })
    },
  })
}

export function useEditUsuarioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, UsuarioEdicionDTO>({
    mutationFn: (data) => editUser(data),
    onSuccess: () => {
      void queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.all })
    },
  })
}

export function useDeleteUsuarioMutation() {
  const queryClient = useQueryClient()
  return useMutation<RespuestaDTO, Error, number>({
    mutationFn: (id) => deleteUser(id),
    onSettled: () => {
      void queryClient.invalidateQueries({ queryKey: usuariosQueryKeys.all })
    },
  })
}
