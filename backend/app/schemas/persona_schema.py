from datetime import datetime

from pydantic import BaseModel, ConfigDict, EmailStr


class PersonaCreate(BaseModel):
    nombre: str
    email: EmailStr


class PersonaOut(BaseModel):
    model_config = ConfigDict(from_attributes=True)

    id: int
    nombre: str
    email: EmailStr
    foto_url: str | None
    activo: bool
    created_at: datetime


class RostroUploadIn(BaseModel):
    imagen_base64: str


class RostroUploadOut(BaseModel):
    success: bool
    imagen_url: str
    persona_id: int
