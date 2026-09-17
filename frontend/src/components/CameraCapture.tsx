import { Camera, RotateCcw } from 'lucide-react'
import { useRef, useState } from 'react'
import Webcam from 'react-webcam'

interface CameraCaptureProps {
  onCapture: (imagenBase64: string) => void
}

const videoConstraints = {
  width: 480,
  height: 480,
  facingMode: 'user',
}

export default function CameraCapture({ onCapture }: CameraCaptureProps) {
  const webcamRef = useRef<Webcam>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  function handleCapture() {
    // getScreenshot() devuelve un data URL base64 (image/jpeg) del frame actual
    const screenshot = webcamRef.current?.getScreenshot()
    if (!screenshot) {
      setError('No se pudo capturar la imagen. Verifica el acceso a la cámara.')
      return
    }
    setError(null)
    setPreview(screenshot)
    // Se notifica al padre (RegistroFacial) para que quede listo para enviar
    onCapture(screenshot)
  }

  function handleRetake() {
    setPreview(null)
  }

  return (
    <div className="flex flex-col items-center gap-3">
      <div className="aspect-square w-full max-w-sm overflow-hidden rounded-lg border border-gray-300 bg-black">
        {/* Mientras no haya preview, se muestra el video en vivo; luego, la foto capturada */}
        {preview ? (
          <img src={preview} alt="Rostro capturado" className="h-full w-full object-cover" />
        ) : (
          <Webcam
            ref={webcamRef}
            audio={false}
            mirrored
            screenshotFormat="image/jpeg"
            videoConstraints={videoConstraints}
            onUserMediaError={() => setError('No se pudo acceder a la cámara.')}
            className="h-full w-full object-cover"
          />
        )}
      </div>

      {error && <p className="text-sm text-red-600">{error}</p>}

      {preview ? (
        <button
          type="button"
          onClick={handleRetake}
          className="flex items-center gap-2 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
        >
          <RotateCcw size={16} />
          Volver a capturar
        </button>
      ) : (
        <button
          type="button"
          onClick={handleCapture}
          className="flex items-center gap-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          <Camera size={16} />
          Capturar rostro
        </button>
      )}
    </div>
  )
}
