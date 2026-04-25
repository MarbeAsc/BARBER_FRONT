import { apiSSO } from '@/lib/api-client'

import axios from 'axios'

export interface CitaDTO {
  id: number
  fechaInicio: string
  fechaTermino: string
  idCliente: number | null
  estatus: number | null
}

export interface ServicioCitaDTO {
  id: number
  idCita: number | null
  idBarbero: number | null
  idServicio: number | null
  precio: number
}

export interface CitaCreacionDTO extends CitaDTO {
  servicios: ServicioCitaDTO[]
}

export interface RespuestaDTO {
  estatus: boolean
  descripcion: string
}
export interface ServicioCitaDetalladoDTO extends ServicioCitaDTO
{
  nombreBarbero: string
  nombreServicio: string
}

export interface CitaDetalladaDTO extends CitaDTO {
  nombreCliente: string
  estatusDescripcion: string
  total: number
  servicios: ServicioCitaDetalladoDTO[]
}

export async function createCita(data: CitaCreacionDTO): Promise<RespuestaDTO> {
  try {
    const response = await apiSSO.post('/cita/crearCita', data)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(`Error de API en createCita: ${error.response?.status} - ${error.response?.data}`, error)
      throw new Error(`Error ${error.response?.status}: No se pudo crear la cita.`)
    }
    console.error('Error al crear la cita:', error)
    throw new Error('Error inesperado al crear la cita.')
  }
}

export async function getCitasByBarbero(idBarbero: number): Promise<CitaDTO> {
  try {
    const response = await apiSSO.get(`/cita/obtenerCitasXbarbero/${idBarbero}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error de API en getCitasByBarbero: ${error.response?.status} - ${error.response?.data}`,
        error,
      )
      throw new Error(`Error ${error.response?.status}: No se pudieron obtener las citas del barbero.`)
    }
    console.error('Error al obtener las citas del barbero:', error)
    throw new Error('Error inesperado al obtener las citas del barbero.')
  }
}

export async function getCitasByUserId(idUsuario: number): Promise<CitaDetalladaDTO> {
  try {
    const response = await apiSSO.get(`/cita/obtenerListadoDetalladoXUsuario/${idUsuario}`)
    return response.data
  } catch (error) {
    if (axios.isAxiosError(error)) {
      console.error(
        `Error de API en getCitasByUserId: ${error.response?.status} - ${error.response?.data}`,
        error,
      )
      throw new Error(`Error ${error.response?.status}: No se pudieron obtener las citas del usuario.`)
    }
    console.error('Error al obtener las citas del usuario:', error)
    throw new Error('Error inesperado al obtener las citas del usuario.')
  }
}

