import { apiSSO } from "@/lib/api-client";
import axios from "axios";

export class PromocionDTO
{
    id: number;
    descripcion: string;
    fechaInicio: string | Date;
    fechaFin: string | Date;
}
export class RespuestaDTO
{
    estatus: boolean;
    descripcion: string;
}

type PromocionApiPayload = {
	Id: number;
	Descripcion: string;
	FechaInicio: string;
	FechaFin: string;
};

function toDateOnly(value: string | Date): string {
	if (typeof value === 'string') {
		// Accept both yyyy-MM-dd and ISO date time.
		return value.includes('T') ? value.slice(0, 10) : value;
	}
	const year = value.getFullYear();
	const month = String(value.getMonth() + 1).padStart(2, '0');
	const day = String(value.getDate()).padStart(2, '0');
	return `${year}-${month}-${day}`;
}

function toApiPayload(data: PromocionDTO): PromocionApiPayload {
	return {
		Id: data.id ?? 0,
		Descripcion: (data.descripcion ?? '').trim(),
		FechaInicio: toDateOnly(data.fechaInicio),
		FechaFin: toDateOnly(data.fechaFin),
	};
}



export async function getPromotion(): Promise<PromocionDTO[]> {
	try {
		const response = await apiSSO.get(`/promocion/obtenerPromociones`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerPromociones: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener las promociones.`);
		} else {
			console.error('Error al obtener las promociones:', error);
			throw new Error('Error inesperado al obtener las promociones.');
		}
	}
}
export async function getPromotionActive(): Promise<PromocionDTO> {
	try {
		const response = await apiSSO.get(`/promocion/obtenerPromocionesvigentes`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerPromocionesActivas: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener las promociones activas.`);
		} else {
			console.error('Error al obtener las promociones activas:', error);
			throw new Error('Error inesperado al obtener las promociones activas.');
		}
	}
}
export async function createPromotion(data: PromocionDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/promocion/crearPromocion`, toApiPayload(data));
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearPromocion: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo crear la promocion.`);
		} else {        
			console.error('Error al crear la promocion:', error);
			throw new Error('Error inesperado al crear la promocion.');
		}
	}
}
export async function editPromotion(data: PromocionDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/promocion/editarPromocion`, toApiPayload(data));
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarPromocion: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar la promocion.`);
		} else {        
			console.error('Error al editar la promocion:', error);
			throw new Error('Error inesperado al editar la promocion.');
		}
	}
}
export async function deletePromotion(id: number): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.get(`/promocion/eliminarPromocion/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en eliminarPromocion: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo eliminar la promocion.`);
		} else {        
			console.error('Error al eliminar la promocion:', error);
			throw new Error('Error inesperado al eliminar la promocion.');
		}
	}
}


