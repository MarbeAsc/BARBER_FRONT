import { apiSSO } from "@/lib/api-client";
import axios from "axios";

export interface CorreoDTO {
  
    email: string;
  
}


export class RestablecerContrasenaDTO {
    correo: string;
    token: string;
    contrasena: string;
}
export class RespuestaDTO
{
    estatus?:boolean;
    descripcion?:string;
    Estatus?: boolean;
    Descripcion?: string;
}

/**
 * Envia un email de recuperacion de contraseña
 * @returns Respuesta de la operacion
 */
export async function Correo(data:CorreoDTO): Promise< RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/usuario/enviarEmailRecuperacion`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en enviarEmailRecuperacion: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo enviar el email de recuperacion.`);
		} else {
			console.error('Error al enviar el email de recuperacion:', error);
			throw new Error('Error inesperado al enviar el email de recuperacion.');
		}
	}
}

/**
 * Restablece la contraseña de un usuario
 * @param data Datos de la operacion
 * @returns Respuesta de la operacion
 */
export async function RestablecerContrasena(data:RestablecerContrasenaDTO): Promise< RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/usuario/restablecerPassword`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			    console.error(`Error de API en restablecerContrasena: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo restablecer la contraseña.`);
		} else {
			console.error('Error al restablecer la contraseña:', error);
			throw new Error('Error inesperado al restablecer la contraseña.');
		}
	}
}
