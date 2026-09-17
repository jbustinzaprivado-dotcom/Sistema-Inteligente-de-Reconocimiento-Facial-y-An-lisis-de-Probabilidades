import uuid

from supabase import Client, create_client

from app.core.config import settings

_client: Client | None = None


def get_supabase_client() -> Client:
    global _client
    if _client is None:
        _client = create_client(settings.supabase_url, settings.supabase_service_key)
    return _client


def subir_rostro(persona_id: int, datos_imagen: bytes) -> str:
    ruta = f"personas/{persona_id}/{uuid.uuid4()}.jpg"
    cliente = get_supabase_client()
    bucket = cliente.storage.from_(settings.supabase_storage_bucket)
    bucket.upload(ruta, datos_imagen, {"content-type": "image/jpeg"})
    return bucket.get_public_url(ruta)