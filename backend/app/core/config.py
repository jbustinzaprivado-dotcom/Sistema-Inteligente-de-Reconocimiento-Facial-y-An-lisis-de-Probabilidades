from pydantic_settings import BaseSettings, SettingsConfigDict


class Settings(BaseSettings):
    model_config = SettingsConfigDict(env_file=".env", env_file_encoding="utf-8", extra="ignore")

    # Conexion directa a Postgres (Supabase) via SQLAlchemy
    database_url: str

    # Cliente Supabase (Storage)
    supabase_url: str
    supabase_service_key: str
    supabase_storage_bucket: str = "rostros"

    # CORS
    frontend_origin: str = "http://localhost:5173"


settings = Settings()
