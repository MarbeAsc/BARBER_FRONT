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
    HoraCreacion: Date | string;
    Estatus: number;
    IdRol: number;
}

type UsuarioApiRow = Record<string, unknown>

function toUsuarioDTO(row: UsuarioApiRow): UsuarioDTO {
  return {
    Id: Number(row.Id ?? row.id ?? 0),
    Username: String(row.Username ?? row.username ?? ''),
    Correo: String(row.Correo ?? row.correo ?? ''),
    PasswordHash: String(row.PasswordHash ?? row.passwordHash ?? ''),
    HoraCreacion: (row.HoraCreacion ?? row.horaCreacion ?? '') as Date | string,
    Estatus: Number(row.Estatus ?? row.estatus ?? 0),
    IdRol: Number(row.IdRol ?? row.idRol ?? 0),
  }
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
export async function getUsers(): Promise<UsuarioDTO[]> {
	try {
		const response = await apiSSO.get(`/usuario/obtenerListadoUsuarios`);
		const raw = response.data as UsuarioApiRow[] | undefined
		if (!Array.isArray(raw)) return []
		return raw.map(toUsuarioDTO)
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en obtenerListadoUsuarios: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo obtener el listado de usuarios.`);
		} else {
			console.error('Error al obtener el listado de usuarios:', error);
			throw new Error('Error inesperado al obtener el listado de usuarios.');
		}
	}
}
export async function createUser(data: UsuarioCreacionDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/usuario/crearUsuario`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en crearUsuario: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo crear el usuario.`);
		} else {
			console.error('Error al crear el usuario:', error);
			throw new Error('Error inesperado al crear el usuario.');
		}
	}
}
export async function editUser(data: UsuarioEdicionDTO): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.post(`/usuario/editarUsuario`, data);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en editarUsuario: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo editar el usuario.`);
		} else {        
			console.error('Error al editar el usuario:', error);
			throw new Error('Error inesperado al editar el usuario.');
		}
	}
}

export async function deleteUser(id: number): Promise<RespuestaDTO> {
	try {
		const response = await apiSSO.get(`/usuario/eliminarUsuario/${id}`);
		return response.data;
	} catch (error) {
		if (axios.isAxiosError(error)) {
			console.error(`Error de API en eliminarUsuario: ${error.response?.status} - ${error.response?.data}`, error);
			throw new Error(`Error ${error.response?.status}: No se pudo eliminar el usuario.`);
		} else {
			console.error('Error al eliminar el usuario:', error);
			throw new Error('Error inesperado al eliminar el usuario.');
		}
	}
}

