import { apiSSO } from "@/lib/api-client";
import axios from "axios";

export interface BarberoListadoDTO extends BarberoDTO
{
    nombreUsuario: string;
    descripcionEstatus: string;
}
export interface BarberoDTO 
{
    id: number;

    nombre: string;

    idUsuario: number;

    estatus: number;
}
export interface AsignacionBarberoDTO
{
    idUsuario: number;
    idBarbero: number;
}
export interface RespuestaDTO
{
    estatus: boolean;
    descripcion: string;
}
/**
 * Obtiene la lista de barberos
 * @returns Lista de barberos con su informacion y el nombre del usuario
 */
export async function getBarbers(): Promise< BarberoListadoDTO[]> {
	try {
		const response = await apiSSO.get(`/barbero/obtenerBarberos`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerBarberos: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener los barberos.`);
		} else {
			console.error('Error al obtener los barberos:', error);
			throw new Error('Error inesperado al obtener los barberos.');
		}
	}
}

/**
 * Crea un nuevo barbero
 * @param data Datos del barbero a crear
 * @returns Respuesta de la creacion del barbero
 */
export async function createBarber(data:BarberoDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/barbero/crearBarbero`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearBarbero: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo crear el barbero.`);
		} else {
			console.error('Error al crear el barbero:', error);
			throw new Error('Error inesperado al crear el barbero.');
		}
	}
}

/**
 * Edita un barbero
 * @param data Datos del barbero a editar
 * @returns Respuesta de la edicion del barbero
 */
export async function editBarber(data:BarberoDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/barbero/editarBarbero`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarBarbero: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar el barbero.`);
		} else {
			console.error('Error al editar el barbero:', error);
			throw new Error('Error inesperado al editar el barbero.');
		}
	}
}

/**
 * Elimina un barbero
 * @param id Id del barbero a eliminar
 * @returns Respuesta de la eliminacion del barbero
 */
export async function deleteBarber(id:number): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.get(`/barbero/eliminarBarbero/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en eliminarBarbero: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo eliminar el barbero.`);
		} else {
			console.error('Error al eliminar el barbero:', error);
			throw new Error('Error inesperado al eliminar el barbero.');
		}
	}
}



/**
 * Asigna un perfil a un barbero
 * @param data Datos de la asignacion del perfil del barbero
 * @returns Respuesta de la asignacion del perfil del barbero
 */
export async function AsignBarber(data:AsignacionBarberoDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/barbero/asignarPerfilBarbero`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en asignarPerfilBarbero: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo asignar el perfil del barbero.`);
		} else {
			console.error('Error al asignar el perfil del barbero:', error);
			throw new Error('Error inesperado al asignar el perfil del barbero.');
		}
	}
}