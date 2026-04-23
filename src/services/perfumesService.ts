import { apiSSO } from "@/lib/api-client"
import axios from "axios";

export interface PerfumeDTO 
{
    id: number;
    
    nombre: string;

    descripcion: string | null;

    base64: string | null;

    disponible: boolean | null;
}
export interface RespuestaDTO
{
    estatus: boolean;
    descripcion: string;
}

export interface PerfumeConArchivoDTO extends PerfumeDTO
{
    archivo: File | null;
}



/**
 * Obtiene la lista de  perfumes
 * @returns Lista de perfumes con su informacion
 */
export async function getFragances(): Promise< PerfumeDTO[]> {
	try {
		const response = await apiSSO.get(`/perfume/obtenerPerfumes`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerPerfumes: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener los perfumes.`);
		} else {
			console.error('Error al obtener los perfumes:', error);
			throw new Error('Error inesperado al obtener los perfumes.');
		}
	}
}

/**
 * Crea un nuevo perfume
 * @param data Datos del perfume a crear
 * @returns Respuesta de la creacion del perfume
 */
export async function createFragance(data:PerfumeConArchivoDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/perfume/crearPerfume`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearPerfume: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo crear el perfume.`);
		} else {
			console.error('Error al crear el perfume:', error);
			throw new Error('Error inesperado al crear el perfume.');
		}
	}
}

/**
 * Edita un perfume
 * @param data Datos del perfume a editar
 * @returns Respuesta de la edicion del perfume
 */
export async function editFragance(data:PerfumeConArchivoDTO): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.post(`/perfume/editarPerfume`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarPerfume: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar el perfume.`);
		} else {
			console.error('Error al editar el perfume:', error);
			throw new Error('Error inesperado al editar el perfume.');
		}
	}
}

/**
 * Elimina un perfume
 * @param id Id del perfume a eliminar
 * @returns Respuesta de la eliminacion del perfume
 */
export async function deleteFragance(id:number): Promise< RespuestaDTO[]> {
	try {
		const response = await apiSSO.get(`/perfume/eliminarPerfume/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en eliminarPerfume: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo eliminar el perfume.`);
		} else {
			console.error('Error al eliminar el perfume:', error);
			throw new Error('Error inesperado al eliminar el perfume.');
		}
	}
}

