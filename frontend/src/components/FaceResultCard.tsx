import { CheckCircle2, XCircle } from 'lucide-react'
import type { ReconocimientoResultado } from '../types/facial'
import SimilarityBar from './SimilarityBar'

interface FaceResultCardProps {
  resultado: ReconocimientoResultado
}

export default function FaceResultCard({ resultado }: FaceResultCardProps) {
  return (
    <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
      <div className="mb-4 flex items-center gap-3">
        {resultado.coincide ? (
          <CheckCircle2 className="text-green-600" size={32} />
        ) : (
          <XCircle className="text-red-500" size={32} />
        )}
        <div>
          <p className="text-lg font-semibold text-gray-900">
            {resultado.coincide ? resultado.nombre : 'No se encontró coincidencia'}
          </p>
          <p className="text-sm text-gray-500">
            {resultado.coincide ? `Persona #${resultado.persona_id}` : 'Rostro no reconocido en el sistema'}
          </p>
        </div>
      </div>

      <SimilarityBar similitud={resultado.similitud} umbral={resultado.umbral} />

      <p className="mt-3 text-xs text-gray-400">Distancia: {resultado.distancia}</p>
    </div>
  )
}