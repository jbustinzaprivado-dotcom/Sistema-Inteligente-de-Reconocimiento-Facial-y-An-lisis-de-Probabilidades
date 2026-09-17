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