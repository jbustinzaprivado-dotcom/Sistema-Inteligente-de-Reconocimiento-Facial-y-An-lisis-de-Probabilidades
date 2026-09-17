from datetime import datetime

from pydantic import BaseModel


class ReconocimientoIn(BaseModel):
    imagen_base64: str


class ReconocimientoOut(BaseModel):
    coincide: bool
    persona_id: int | None
    nombre: str | None
    similitud: float
    distancia: float
    umbral: float


class HistorialItem(BaseModel):
    id: int
    persona_id: int | None
    nombre: str | None
    similitud: float
    distancia: float
    umbral: float
    coincide: bool
    created_at: datetime