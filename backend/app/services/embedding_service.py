import cv2
import numpy as np
from insightface.app import FaceAnalysis

_face_app: FaceAnalysis | None = None


class RostroNoDetectadoError(Exception):
    pass


def get_face_app() -> FaceAnalysis:
    global _face_app
    if _face_app is None:
        _face_app = FaceAnalysis(name="buffalo_l")
        _face_app.prepare(ctx_id=0, det_size=(640, 640))
    return _face_app


def _area_bbox(rostro) -> float:
    x1, y1, x2, y2 = rostro.bbox
    return (x2 - x1) * (y2 - y1)


def _calcular_iluminacion(imagen_gris: np.ndarray) -> float:
    return round(float(np.mean(imagen_gris)) / 255.0, 4)


def _calcular_calidad_imagen(imagen_gris: np.ndarray) -> float:
    varianza_laplaciano = cv2.Laplacian(imagen_gris, cv2.CV_64F).var()
    return round(min(varianza_laplaciano / 500.0, 1.0), 4)


def analizar_captura(datos_imagen: bytes) -> tuple[list[float], float, float]:
    arreglo = np.frombuffer(datos_imagen, dtype=np.uint8)
    imagen = cv2.imdecode(arreglo, cv2.IMREAD_COLOR)

    rostros = get_face_app().get(imagen)
    if len(rostros) == 0:
        raise RostroNoDetectadoError("No se detectó ningún rostro en la imagen.")

    rostro_principal = max(rostros, key=_area_bbox)
    embedding = rostro_principal.normed_embedding.tolist()

    gris = cv2.cvtColor(imagen, cv2.COLOR_BGR2GRAY)
    calidad_imagen = _calcular_calidad_imagen(gris)
    iluminacion = _calcular_iluminacion(gris)

    return embedding, calidad_imagen, iluminacion


def generar_embedding(datos_imagen: bytes) -> list[float]:
    embedding, _, _ = analizar_captura(datos_imagen)
    return embedding


def similitud_coseno(a: list[float], b: list[float]) -> float:
    va = np.array(a)
    vb = np.array(b)
    return float(np.dot(va, vb) / (np.linalg.norm(va) * np.linalg.norm(vb)))