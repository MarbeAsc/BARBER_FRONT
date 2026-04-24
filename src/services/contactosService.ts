import { apiSSO } from "@/lib/api-client";
import axios from "axios";

export class ConsultaDTO {
    id: number;
    nombre: string;
    correo: string;
    mensaje: string;
    estatus: number;
}

export class ConsultaCreacionDTO {
    nombre: string;
    correo: string;
    mensaje: string;
}
export class RespuestaDTO {

    estatus: boolean;
    descripcion: string;
}


/**
 * Obtiene la lista de consultas
 * @returns Lista de consultas
 */
export async function getContact(): Promise< ConsultaDTO[]> {
	try {
		const response = await apiSSO.get(`/consultas/obtenerConsultas`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerConsultas: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener las consultas.`);
		} else {
			console.error('Error al obtener las consultas:', error);
			throw new Error('Error inesperado al obtener las consultas.');
		}
	}
}

/**
 * Crea un nuevo contacto
 * @param data Datos del contacto a crear
 * @returns Respuesta de la creacion del contacto
 */
export async function createContact(data:ConsultaCreacionDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/consultas/crearConsulta`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearConsulta: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo crear la consulta.`);
		} else {
			console.error('Error al crear la consulta:', error);
			throw new Error('Error inesperado al crear la consulta.');
		}
	}
}

/**
 * Edita un contacto
 * @param data Datos del barbero a editar
 * @returns Respuesta de la edicion del barbero
 */
export async function editContact(data:ConsultaCreacionDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/consultas/editarConsulta`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarConsulta: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar la consulta.`);
		} else {
			console.error('Error al editar la consulta:', error);
			throw new Error('Error inesperado al editar la consulta.');
		}
	}
}
