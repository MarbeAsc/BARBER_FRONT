import { apiSSO } from "@/lib/api-client";
import axios from "axios";

export interface AnadidoServicioDTO
{
    id: number;

    nombre: string;

    descripcion: string | null;

    idPerteneciente: number | null;

    precio: number;
}

export interface AnadidoServicioDTO
{
    id: number;

    nombre: string;

    descripcion: string | null;

    idPerteneciente: number | null;

    precio: number;
}
export interface RespuestaDTO
{
    estatus: boolean;
    descripcion: string;
}

export async function getAddServices(id: number): Promise<AnadidoServicioDTO[]> {
	try {
		const response = await apiSSO.get(`/servicio/obtenerAnadidosServicios/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerAnadidosServicios: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener los anadidos servicios.`);
		} else {
			console.error('Error al obtener los anadidos servicios:', error);
			throw new Error('Error inesperado al obtener los anadidos servicios.');
		}
	}
}
export async function createAddService(data: AnadidoServicioDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/servicio/crearAnadidoServicio`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearAnadidoServicio: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo crear el anadido servicio.`);
		} else {
			console.error('Error al crear el anadido servicio:', error);
			throw new Error('Error inesperado al crear el anadido servicio.');
		}
	}
}
export async function editAddService(data: AnadidoServicioDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/servicio/editarAnadidoServicio`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarAnadidoServicio: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar el anadido servicio.`);
		} else {        
			console.error('Error al editar el anadido servicio:', error);
			throw new Error('Error inesperado al editar el usuario.');
		}
	}
}
export async function deleteAddService(id: number): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.get(`/servicio/eliminarAnadidoServicio/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en eliminarAnadidoServicio: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo eliminar el anadido servicio.`);
		} else {        
			console.error('Error al eliminar el anadido servicio:', error);
			throw new Error('Error inesperado al eliminar el anadido servicio.');
		}
	}
}


