import { useMutation } from '@tanstack/react-query'
import {
  Correo,
  RestablecerContrasena,
  type CorreoDTO,
  type RespuestaDTO,
  type RestablecerContrasenaDTO,
} from '@/services/correoService'

export function useCorreoRecuperacionMutation() {
  return useMutation<RespuestaDTO, Error, CorreoDTO>({
    mutationFn: (data) => Correo(data),
  })
}

export function useRestablecerContrasenaMutation() {
  return useMutation<RespuestaDTO, Error, RestablecerContrasenaDTO>({
    mutationFn: (data) => RestablecerContrasena(data),
  })
}
