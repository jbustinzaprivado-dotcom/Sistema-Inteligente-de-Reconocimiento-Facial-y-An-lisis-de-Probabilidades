"""Crea las tablas del MVP en la base de datos configurada (DATABASE_URL)."""

from app.database.connection import Base, engine
from app.models import Persona  # noqa: F401  (registra el modelo en Base.metadata)

if __name__ == "__main__":
    Base.metadata.create_all(bind=engine)
    print("Tablas creadas correctamente.")
