from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy import select
from sqlalchemy.orm import Session

from app.database.connection import get_db
from app.models.persona_model import Persona
from app.models.recognition_model import FaceEmbedding, RecognitionLog
from app.schemas.recognition_schema import HistorialItem, ReconocimientoIn, ReconocimientoOut
from app.services.embedding_service import (
    RostroNoDetectadoError,
    generar_embedding,
    similitud_coseno,
)
from app.services.face_service import ImagenInvalidaError, decodificar_imagen_base64

router = APIRouter(prefix="/reconocimiento", tags=["reconocimiento"])

UMBRAL_ACEPTACION = 0.5


@router.post("", response_model=ReconocimientoOut)
def reconocer_rostro(payload: ReconocimientoIn, db: Session = Depends(get_db)) -> ReconocimientoOut:
    try:
        datos = decodificar_imagen_base64(payload.imagen_base64)
    except ImagenInvalidaError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    try:
        embedding_capturado = generar_embedding(datos)
    except RostroNoDetectadoError as exc:
        raise HTTPException(status_code=422, detail=str(exc)) from exc

    registros = db.execute(select(FaceEmbedding.persona_id, FaceEmbedding.embedding)).all()

    mejor_persona_id: int | None = None
    mejor_similitud = 0.0
    for persona_id, embedding_guardado in registros:
        similitud = similitud_coseno(embedding_capturado, embedding_guardado)
        if similitud > mejor_similitud:
            mejor_similitud = similitud
            mejor_persona_id = persona_id

    coincide = mejor_persona_id is not None and mejor_similitud >= UMBRAL_ACEPTACION
    nombre = None
    if coincide:
        persona = db.get(Persona, mejor_persona_id)
        nombre = persona.nombre if persona else None

    distancia = round(2 - 2 * mejor_similitud, 4)

    db.add(
        RecognitionLog(
            persona_id=mejor_persona_id if coincide else None,
            similitud=round(mejor_similitud, 4),
            distancia=distancia,
            umbral=UMBRAL_ACEPTACION,
            coincide=coincide,
        )
    )
    db.commit()

    return ReconocimientoOut(
        coincide=coincide,
        persona_id=mejor_persona_id if coincide else None,
        nombre=nombre,
        similitud=round(mejor_similitud, 4),
        distancia=distancia,
        umbral=UMBRAL_ACEPTACION,
    )


@router.get("/historial", response_model=list[HistorialItem])
def obtener_historial(db: Session = Depends(get_db)) -> list[HistorialItem]:
    filas = db.execute(
        select(RecognitionLog, Persona.nombre)
        .outerjoin(Persona, Persona.id == RecognitionLog.persona_id)
        .order_by(RecognitionLog.created_at.desc())
        .limit(100)
    ).all()

    return [
        HistorialItem(
            id=log.id,
            persona_id=log.persona_id,
            nombre=nombre,
            similitud=log.similitud,
            distancia=log.distancia,
            umbral=log.umbral,
            coincide=log.coincide,
            created_at=log.created_at,
        )
        for log, nombre in filas
    ]