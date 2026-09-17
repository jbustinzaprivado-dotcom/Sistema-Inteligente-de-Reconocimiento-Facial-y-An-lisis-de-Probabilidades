import { Users } from 'lucide-react'
import { useEffect, useState } from 'react'
import { listarPersonas } from '../services/api'
import type { Persona } from '../types/facial'

export default function Dashboard() {
  const [personas, setPersonas] = useState<Persona[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Se carga una sola vez al montar; sin refetch automatico en esta fase
  useEffect(() => {
    listarPersonas()
      .then(setPersonas)
      .catch(() => setError('No se pudo cargar el resumen. ¿Está el backend corriendo?'))
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="mx-auto max-w-4xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Dashboard</h1>

      <div className="rounded-lg border border-gray-200 bg-white p-6 shadow-sm">
        <div className="flex items-center gap-4">
          <div className="rounded-full bg-blue-100 p-3">
            <Users className="text-blue-600" size={24} />
          </div>
          <div>
            <p className="text-sm text-gray-500">Personas registradas</p>
            <p className="text-2xl font-semibold text-gray-900">
              {loading ? '—' : personas.length}
            </p>
          </div>
        </div>
      </div>

      {error && <p className="mt-4 text-sm text-red-600">{error}</p>}

      {/* Aviso intencional: estas secciones no existen todavia, llegan en fases 2 y 3 */}
      <p className="mt-6 text-sm text-gray-500">
        Reconocimiento, probabilidades e historial se habilitarán en las siguientes fases del proyecto.
      </p>
    </div>
  )
}
