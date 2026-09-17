import { useEffect, useState } from 'react'
import ProbabilityChart from '../components/ProbabilityChart'
import { obtenerHistorial } from '../services/api'
import type { HistorialItem } from '../types/facial'

export default function Probabilidades() {
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    obtenerHistorial()
      .then(setHistorial)
      .catch(() => setError('No se pudo cargar los datos.'))
      .finally(() => setLoading(false))
  }, [])

  const totalIntentos = historial.length
  const coincidencias = historial.filter((h) => h.coincide).length
  const tasaCoincidencia = totalIntentos > 0 ? (coincidencias / totalIntentos) * 100 : 0
  const similitudPromedio =
    totalIntentos > 0 ? historial.reduce((sum, h) => sum + h.similitud, 0) / totalIntentos : 0

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Probabilidades</h1>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && totalIntentos === 0 && (
        <p className="text-sm text-gray-500">
          Todavía no hay intentos de reconocimiento para analizar. Probá la página de Reconocimiento primero.
        </p>
      )}

      {totalIntentos > 0 && (
        <>
          <div className="mb-6 grid grid-cols-3 gap-4">
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Intentos totales</p>
              <p className="text-2xl font-semibold text-gray-900">{totalIntentos}</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Tasa de coincidencia</p>
              <p className="text-2xl font-semibold text-gray-900">{tasaCoincidencia.toFixed(0)}%</p>
            </div>
            <div className="rounded-lg border border-gray-200 bg-white p-4">
              <p className="text-sm text-gray-500">Similitud promedio</p>
              <p className="text-2xl font-semibold text-gray-900">{(similitudPromedio * 100).toFixed(0)}%</p>
            </div>
          </div>

          <div className="rounded-lg border border-gray-200 bg-white p-4">
            <p className="mb-3 text-sm font-medium text-gray-700">
              Similitud de los últimos {Math.min(historial.length, 20)} intentos
            </p>
            <ProbabilityChart historial={historial.slice(0, 20)} />
          </div>
        </>
      )}
    </div>
  )
}