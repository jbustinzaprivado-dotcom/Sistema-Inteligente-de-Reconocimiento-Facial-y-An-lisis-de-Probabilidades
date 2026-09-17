import { useState } from 'react'
import CameraCapture from '../components/CameraCapture'
import FaceResultCard from '../components/FaceResultCard'
import { reconocerRostro } from '../services/api'
import type { ReconocimientoResultado } from '../types/facial'

export default function Reconocimiento() {
  const [resultado, setResultado] = useState<ReconocimientoResultado | null>(null)
  const [cargando, setCargando] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [captura, setCaptura] = useState<string | null>(null)

  async function handleCapture(imagenBase64: string) {
    setCaptura(imagenBase64)
    setCargando(true)
    setError(null)
    setResultado(null)
    try {
      const data = await reconocerRostro(imagenBase64)
      setResultado(data)
    } catch {
      setError('No se pudo procesar el reconocimiento. Intenta nuevamente.')
    } finally {
      setCargando(false)
    }
  }

  function handleReintentar() {
    setCaptura(null)
    setResultado(null)
    setError(null)
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Reconocimiento facial</h1>

      {!captura && <CameraCapture onCapture={handleCapture} />}

      {cargando && <p className="mt-4 text-sm text-gray-500">Analizando rostro...</p>}

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {resultado && (
        <div className="mt-4">
          <FaceResultCard resultado={resultado} />
          <button
            type="button"
            onClick={handleReintentar}
            className="mt-4 rounded-md border border-gray-300 px-4 py-2 text-sm font-medium hover:bg-gray-50"
          >
            Probar con otra foto
          </button>
        </div>
      )}
    </div>
  )
}