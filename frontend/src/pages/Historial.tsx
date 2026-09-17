import { useEffect, useState } from 'react'
import { obtenerHistorial } from '../services/api'
import type { HistorialItem } from '../types/facial'

export default function Historial() {
  const [historial, setHistorial] = useState<HistorialItem[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    obtenerHistorial()
      .then(setHistorial)
      .catch(() => setError('No se pudo cargar el historial.'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Historial de reconocimientos</h1>

      {loading && <p className="text-sm text-gray-500">Cargando...</p>}
      {error && <p className="text-sm text-red-600">{error}</p>}

      {!loading && !error && historial.length === 0 && (
        <p className="text-sm text-gray-500">Todavía no hay intentos de reconocimiento registrados.</p>
      )}

      {historial.length > 0 && (
        <div className="overflow-hidden rounded-lg border border-gray-200 bg-white">
          <table className="w-full text-left text-sm">
            <thead className="bg-gray-50 text-gray-500">
              <tr>
                <th className="px-4 py-2 font-medium">Fecha</th>
                <th className="px-4 py-2 font-medium">Persona</th>
                <th className="px-4 py-2 font-medium">Similitud</th>
                <th className="px-4 py-2 font-medium">Umbral</th>
                <th className="px-4 py-2 font-medium">Resultado</th>
              </tr>
            </thead>
            <tbody>
              {historial.map((item) => (
                <tr key={item.id} className="border-t border-gray-100">
                  <td className="px-4 py-2 text-gray-600">
                    {new Date(item.created_at).toLocaleString()}
                  </td>
                  <td className="px-4 py-2 text-gray-900">{item.nombre ?? '—'}</td>
                  <td className="px-4 py-2 text-gray-600">{(item.similitud * 100).toFixed(1)}%</td>
                  <td className="px-4 py-2 text-gray-600">{(item.umbral * 100).toFixed(0)}%</td>
                  <td className="px-4 py-2">
                    <span
                      className={`rounded-full px-2 py-0.5 text-xs font-medium ${
                        item.coincide ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
                      }`}
                    >
                      {item.coincide ? 'Coincide' : 'No coincide'}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}