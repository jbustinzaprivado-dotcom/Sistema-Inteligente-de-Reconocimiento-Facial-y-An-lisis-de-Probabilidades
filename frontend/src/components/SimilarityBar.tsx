interface SimilarityBarProps {
  similitud: number
  umbral: number
}

export default function SimilarityBar({ similitud, umbral }: SimilarityBarProps) {
  const porcentaje = Math.round(similitud * 100)
  const superaUmbral = similitud >= umbral

  return (
    <div>
      <div className="mb-1 flex items-center justify-between text-sm">
        <span className="text-gray-600">Similitud</span>
        <span className="font-medium text-gray-900">{porcentaje}%</span>
      </div>
      <div className="h-2 w-full overflow-hidden rounded-full bg-gray-200">
        <div
          className={`h-full rounded-full ${superaUmbral ? 'bg-green-500' : 'bg-red-400'}`}
          style={{ width: `${Math.min(porcentaje, 100)}%` }}
        />
      </div>
      <p className="mt-1 text-xs text-gray-500">Umbral de aceptación: {Math.round(umbral * 100)}%</p>
    </div>
  )
}