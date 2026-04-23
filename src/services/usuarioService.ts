import axios from "axios";
import { apiSSO } from "../lib/api-client";

export interface RespuestaAutenticacionDTO {
  Estatus: boolean
  Token: string
}
export interface RespuestaDTO
{
    Estatus: boolean;
    Descripcion: string;
}
export interface CredencialesUsuarioDTO
{
    Email: string;
    Contrasena: string;
}
export interface UsuarioCreacionDTO
{
    Username: string;
    Correo: string;
    Contrasena: string;
}
export interface UsuarioEdicionDTO extends UsuarioCreacionDTO
{
    Id: number;
    Estatus: number;

}
export interface UsuarioDTO
{
    Id: number;
    Username: string;
    Correo: string;
    PasswordHash: string;
    HoraCreacion: Date;
    Estatus: number;
    IdRol: number;
}


export async function loginUsuarioService(data: CredencialesUsuarioDTO): Promise<RespuestaAutenticacionDTO> {
	try {
		const response = await apiSSO.post(`/usuario/login`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en login: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo iniciar sesión.`);
		} else {
			console.error('Error al iniciar sesión:', error);
			throw new Error('Error inesperado al iniciar sesión.');
		}
	}
}
