import { apiSSO } from "@/lib/api-client";
import axios from "axios";

export interface ServicioDTO
{
    id: number;
    nombre: string;
    descripcion: string | null;
    idTipo: number | null;
    precioBase: number;
    base64: string | null;
    estatus: number | null;
}
export interface ServicioConArchivoDTO extends ServicioDTO
{
    archivo: File | null;
}
export interface RespuestaDTO
{
    estatus: boolean;
    descripcion: string;
}



export async function getServices(): Promise<ServicioDTO[]> {
	try {
		const response = await apiSSO.get(`/servicio/obtenerServicios`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerServicios: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener los servicios.`);
		} else {
			console.error('Error al obtener los servicios:', error);
			throw new Error('Error inesperado al obtener los servicios.');
		}
	}
}
export async function createService(data: ServicioConArchivoDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/servicio/crearServicio`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearServicio: ${error.response?.status} - ${error.response?.data}`, error);
			    throw new Error(`Error ${error.response?.status}: No se pudo crear el servicio.`);
		} else {
			console.error('Error al crear el servicio:', error);
			throw new Error('Error inesperado al crear el servicio.');
		}
	}
}
export async function editService(data: ServicioConArchivoDTO): Promise<RespuestaDTO> {   
	try {
		const response = await apiSSO.post(`/servicio/editarServicio`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarServicio: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar el servicio.`);
		} else {        
			console.error('Error al editar el servicio:', error);
			throw new Error('Error inesperado al editar el servicio.');
		}
	}
}
export async function deleteService(id: number): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.get(`/servicio/eliminarServicio/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en eliminarServicio: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo eliminar el servicio.`);
		} else {        
			console.error('Error al eliminar el servicio:', error);
			throw new Error('Error inesperado al eliminar el servicio.');
		}
	}
}


