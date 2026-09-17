export interface Persona {
  id: number
  nombre: string
  email: string
  activo: boolean
  created_at: string
}

export interface PersonaCreate {
  nombre: string
  email: string
}

export interface RostroUploadResponse {
  success: boolean
  imagen_url: string
  persona_id: number
  embeddings_generados: number
}

export interface ReconocimientoResultado {
  coincide: boolean
  persona_id: number | null
  nombre: string | null
  similitud: number
  distancia: number
  umbral: number
}