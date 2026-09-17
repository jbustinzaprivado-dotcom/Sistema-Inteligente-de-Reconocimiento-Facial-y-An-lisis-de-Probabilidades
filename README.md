# Sistema Inteligente de Reconocimiento Facial y Análisis de Probabilidades

Monorepo con `frontend/` (React + Vite + TypeScript + Tailwind) y `backend/` (FastAPI + SQLAlchemy), sobre Supabase (Postgres + Storage).

Este proyecto se desarrolla **por fases**, siguiendo el plan del documento técnico. Estado actual: **Fase 1 — MVP** (registro de personas + captura facial). Reconocimiento, probabilidades, Machine Learning y producción llegan en fases posteriores.

## Decisiones tomadas para esta fase

- Base de datos: **Supabase (Postgres administrado)**.
- Almacenamiento de imágenes: **Supabase Storage**.
- Toolchain: **npm** (frontend) + **venv/pip** (backend), tal como indica el documento.
- Estructura: **monorepo**, carpetas `frontend/` y `backend/` en este mismo repositorio.
- Acceso a datos: SQLAlchemy conectado directamente al Postgres de Supabase; `supabase-py` se usa únicamente para subir imágenes al bucket de Storage.
- Ruteo del frontend: `react-router-dom`.

## 1. Crear el proyecto en Supabase

1. Crea un proyecto en [supabase.com](https://supabase.com).
2. En **Project Settings → Database**, copia la cadena de conexión (modo *Session pooler* recomendado) y arma tu `DATABASE_URL` con el driver `postgresql+psycopg2://`.
3. En **Project Settings → API**, copia `Project URL` y la `service_role key` (¡no la `anon key`! la service key es necesaria para subir archivos desde el backend).
4. En **Storage**, crea un bucket llamado `rostros` (o el nombre que prefieras) y márcalo como público si quieres URLs públicas directas, o privado si prefieres URLs firmadas (a evaluar en la fase de seguridad).

## 2. Backend

```bash
cd backend
python -m venv venv
source venv/bin/activate      # Windows: venv\Scripts\activate
pip install -r requirements-dev.txt   # incluye requirements.txt + pytest/httpx

cp .env.example .env
# Completa DATABASE_URL, SUPABASE_URL, SUPABASE_SERVICE_KEY, SUPABASE_STORAGE_BUCKET

python scripts/init_db.py     # crea la tabla `personas`
uvicorn app.main:app --reload --port 8000
```

Pruébalo: `curl http://localhost:8000/api/health` → `{"status": "ok"}`.

Tests: `python -m pytest -q` (dentro del venv, con las variables de entorno cargadas).

## 3. Frontend

```bash
cd frontend
npm install
npm run dev
```

Abre `http://localhost:5173`. El dev server de Vite proxéa `/api` hacia `http://localhost:8000` (ver `vite.config.ts`), así que backend y frontend deben correr en paralelo.

## Endpoints disponibles (Fase 1)

| Método | Endpoint | Función |
|---|---|---|
| GET | `/api/health` | Chequeo de salud |
| GET | `/api/personas` | Listar personas registradas |
| POST | `/api/personas` | Registrar persona (nombre, email) |
| POST | `/api/personas/{id}/rostro` | Subir imagen facial (base64) y asociarla a la persona |

## Qué falta (próximas fases, según el documento)

- **Fase 2 — Reconocimiento:** integrar modelo de Deep Learning (InsightFace/ArcFace), generar embeddings reales y comparar rostros.
- **Fase 3 — Probabilidades:** umbrales, métricas y gráficos de similitud/confianza.
- **Fase 4 — Machine Learning:** dataset de comparaciones, entrenamiento y calibración de probabilidades.
- **Fase 5 — Producción:** autenticación, auditoría, endurecimiento de seguridad y despliegue.
