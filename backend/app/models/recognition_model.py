from datetime import datetime

from sqlalchemy import ARRAY, DateTime, Float, ForeignKey, String, func
from sqlalchemy.orm import Mapped, mapped_column

from app.database.connection import Base


class FaceEmbedding(Base):
    __tablename__ = "face_embeddings"

    id: Mapped[int] = mapped_column(primary_key=True, autoincrement=True)
    persona_id: Mapped[int] = mapped_column(ForeignKey("personas.id", ondelete="CASCADE"), nullable=False)
    embedding: Mapped[list[float]] = mapped_column(ARRAY(Float), nullable=False)
    modelo: Mapped[str] = mapped_column(String(100), nullable=False, default="buffalo_l")
    created_at: Mapped[datetime] = mapped_column(DateTime(timezone=True), server_default=func.now())