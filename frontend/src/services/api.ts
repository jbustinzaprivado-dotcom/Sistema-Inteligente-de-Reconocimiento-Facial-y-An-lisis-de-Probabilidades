import axios from 'axios'
import type { Persona, PersonaCreate, RostroUploadResponse } from '../types/facial'

const api = axios.create({
  baseURL: '/api',
})

export async function listarPersonas(): Promise<Persona[]> {
  const { data } = await api.get<Persona[]>('/personas')
  return data
}

export async function crearPersona(payload: PersonaCreate): Promise<Persona> {
  const { data } = await api.post<Persona>('/personas', payload)
  return data
}

export async function subirRostro(personaId: number, imagenBase64: string): Promise<RostroUploadResponse> {
  const { data } = await api.post<RostroUploadResponse>(`/personas/${personaId}/rostro`, {
    imagen_base64: imagenBase64,
  })
  return data
}

export default api
