import axios from 'axios'
import type {
  HistorialItem,
  Persona,
  PersonaCreate,
  ReconocimientoResultado,
  RostroUploadResponse,
} from '../types/facial'

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

export async function subirRostro(personaId: number, imagenesBase64: string[]): Promise<RostroUploadResponse> {
  const { data } = await api.post<RostroUploadResponse>(`/personas/${personaId}/rostro`, {
    imagenes_base64: imagenesBase64,
  })
  return data
}

export async function reconocerRostro(imagenBase64: string): Promise<ReconocimientoResultado> {
  const { data } = await api.post<ReconocimientoResultado>('/reconocimiento', {
    imagen_base64: imagenBase64,
  })
  return data
}

export async function obtenerHistorial(): Promise<HistorialItem[]> {
  const { data } = await api.get<HistorialItem[]>('/reconocimiento/historial')
  return data
}

export default api 