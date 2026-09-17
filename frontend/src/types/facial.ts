// Estos tipos reflejan los schemas Pydantic del backend (PersonaOut, PersonaCreate, RostroUploadOut)
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
}
