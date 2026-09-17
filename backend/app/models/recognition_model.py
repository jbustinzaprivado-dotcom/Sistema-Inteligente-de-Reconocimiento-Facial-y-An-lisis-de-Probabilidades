from datetime import datetime

from sqlalchemy import ARRAY, Boolean, DateTime, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    persona_id: Mapped[int] = mapped_column(ForeignKey("personas.id", ondelete="CASCADE"), nullable=False)
    embedding: Mapped[list[float]] = mapped_column(ARRAY(Float), nullable=False)
    modelo: Mapped[str] = mapped_column(String(100), nullable=False, default="buffalo_l")
    calidad_imagen: Mapped[float | None] = mapped_column(Float, nullable=True)
    iluminacion: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class RecognitionLog(Base):
    __tablename__ = "recognition_logs"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    persona_id: Mapped[int | None] = mapped_column(
        ForeignKey("personas.id", ondelete="SET NULL"), nullable=True
    )
    similitud: Mapped[float] = mapped_column(Float, nullable=False)
    distancia: Mapped[float] = mapped_column(Float, nullable=False)
    umbral: Mapped[float] = mapped_column(Float, nullable=False)
    coincide: Mapped[bool] = mapped_column(Boolean, nullable=False)
    probabilidad_calibrada: Mapped[float | None] = mapped_column(Float, nullable=True)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())


class MLTrainingRecord(Base):
    __tablename__ = "ml_training_records"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    similitud: Mapped[float] = mapped_column(Float, nullable=False)
    calidad_imagen: Mapped[float] = mapped_column(Float, nullable=False)
    iluminacion: Mapped[float] = mapped_column(Float, nullable=False)
    resultado_real: Mapped[bool] = mapped_column(Boolean, nullable=False)
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())