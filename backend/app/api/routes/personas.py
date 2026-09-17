from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.persona_model import Persona
from app.models.recognition_model import FaceEmbedding
from app.schemas.persona_schema import (
    PersonaCreate,
    PersonaOut,
    RostroUploadIn,
    RostroUploadOut,
)
from app.services.embedding_service import RostroNoDetectadoError, analizar_captura
from app.services.face_service import ImagenInvalidaError, decodificar_imagen_base64
from app.services.storage_service import subir_rostro

router = APIRouter(prefix="/personas", tags=["personas"])

CAPTURAS_REQUERIDAS = 3


@router.get("", response_model=list[PersonaOut])
def listar_personas(db: Session = Depends(get_db)) -> list[Persona]:
    return list(db.scalars(select(Persona).order_by(Persona.created_at.desc())))


@router.post("", response_model=PersonaOut, status_code=201)
def crear_persona(payload: PersonaCreate, db: Session = Depends(get_db)) -> Persona:
    persona = Persona(nombre=payload.nombre, email=payload.email)
    db.add(persona)
    try:
        db.commit()
    except IntegrityError as exc:
        db.rollback()
        raise HTTPException(status_code=409, detail="Ya existe una persona con ese email.") from exc
    db.refresh(persona)
    return persona


@router.post("/{persona_id}/rostro", response_model=RostroUploadOut)
def registrar_rostro(
    persona_id: int, payload: RostroUploadIn, db: Session = Depends(get_db)
) -> RostroUploadOut:
    persona = db.get(Persona, persona_id)
    if persona is None:
        raise HTTPException(status_code=404, detail="Persona no encontrada.")

    if len(payload.imagenes_base64) != CAPTURAS_REQUERIDAS:
        raise HTTPException(
            status_code=422,
            detail=f"Se requieren exactamente {CAPTURAS_REQUERIDAS} capturas.",
        )

    datos_imagenes: list[bytes] = []
    analisis: list[tuple[list[float], float, float]] = []
    for i, imagen_base64 in enumerate(payload.imagenes_base64, start=1):
        try:
            datos = decodificar_imagen_base64(imagen_base64)
        except ImagenInvalidaError as exc:
            raise HTTPException(status_code=422, detail=f"Captura {i}: {exc}") from exc
        try:
            resultado = analizar_captura(datos)
        except RostroNoDetectadoError as exc:
            raise HTTPException(status_code=422, detail=f"Captura {i}: {exc}") from exc
        datos_imagenes.append(datos)
        analisis.append(resultado)

    imagen_url = subir_rostro(persona_id, datos_imagenes[0])
    persona.foto_url = imagen_url

    for embedding, calidad_imagen, iluminacion in analisis:
        db.add(
            FaceEmbedding(
                persona_id=persona_id,
                embedding=embedding,
                modelo="buffalo_l",
                calidad_imagen=calidad_imagen,
                iluminacion=iluminacion,
            )
        )

    db.commit()

    return RostroUploadOut(
        success=True,
        imagen_url=imagen_url,
        persona_id=persona_id,
        embeddings_generados=len(analisis),
    )