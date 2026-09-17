import base64
import binascii

import cv2
import numpy as np

MAX_IMAGE_BYTES = 8 * 1024 * 1024


class ImagenInvalidaError(Exception):
    pass


def decodificar_imagen_base64(imagen_base64: str) -> bytes:
    contenido = imagen_base64
    if "," in contenido and contenido.strip().startswith("data:"):
        contenido = contenido.split(",", 1)[1]

    try:
        datos = base64.b64decode(contenido, validate=True)
    except (binascii.Error, ValueError) as exc:
        raise ImagenInvalidaError("El contenido no es base64 válido.") from exc

    if len(datos) == 0 or len(datos) > MAX_IMAGE_BYTES:
        raise ImagenInvalidaError("La imagen está vacía o excede el tamaño máximo permitido.")

    arreglo = np.frombuffer(datos, dtype=np.uint8)
    imagen = cv2.imdecode(arreglo, cv2.IMREAD_COLOR)
    if imagen is None:
        raise ImagenInvalidaError("No se pudo decodificar la imagen enviada.")

    return datos
