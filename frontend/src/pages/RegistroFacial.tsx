import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import CameraCapture from '../components/CameraCapture'
import { crearPersona, subirRostro } from '../services/api'

type Estado = 'formulario' | 'enviando' | 'exito'

const CAPTURAS_REQUERIDAS = 3

export default function RegistroFacial() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [capturas, setCapturas] = useState<string[]>([])
  const [estado, setEstado] = useState<Estado>('formulario')
  const [error, setError] = useState<string | null>(null)

  const puedeEnviar =
    nombre.trim() !== '' && email.trim() !== '' && capturas.length === CAPTURAS_REQUERIDAS

  function handleCapture(imagenBase64: string) {
    setCapturas((prev) => [...prev, imagenBase64])
  }

  function handleReiniciarCapturas() {
    setCapturas([])
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!puedeEnviar) return

    setEstado('enviando')
    setError(null)
    try {
      const persona = await crearPersona({ nombre, email })
      await subirRostro(persona.id, capturas)
      setEstado('exito')
    } catch {
      setError('No se pudo completar el registro. Intenta nuevamente.')
      setEstado('formulario')
    }
  }

  function handleReset() {
    setNombre('')
    setEmail('')
    setCapturas([])
    setEstado('formulario')
    setError(null)
  }

  if (estado === 'exito') {
    return (
      <div className="mx-auto max-w-xl p-6 text-center">
        <CheckCircle2 className="mx-auto mb-4 text-green-600" size={48} />
        <h1 className="mb-2 text-xl font-semibold text-gray-900">Persona registrada</h1>
        <p className="mb-6 text-gray-500">{nombre} fue registrado correctamente con su rostro.</p>
        <button
          type="button"
          onClick={handleReset}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700"
        >
          Registrar otra persona
        </button>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-xl p-6">
      <h1 className="mb-6 text-2xl font-semibold text-gray-900">Registro facial</h1>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        <div>
          <label htmlFor="nombre" className="mb-1 block text-sm font-medium text-gray-700">
            Nombre completo
          </label>
          <input
            id="nombre"
            type="text"
            required
            value={nombre}
            onChange={(e) => setNombre(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <label htmlFor="email" className="mb-1 block text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            id="email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between">
            <span className="text-sm font-medium text-gray-700">
              Captura facial ({capturas.length}/{CAPTURAS_REQUERIDAS})
            </span>
            {capturas.length > 0 && (
              <button
                type="button"
                onClick={handleReiniciarCapturas}
                className="text-xs text-blue-600 hover:underline"
              >
                Reiniciar capturas
              </button>
            )}
          </div>

          {capturas.length < CAPTURAS_REQUERIDAS ? (
            <CameraCapture key={capturas.length} onCapture={handleCapture} />
          ) : (
            <div className="flex gap-2">
              {capturas.map((captura, i) => (
                <img
                  key={i}
                  src={captura}
                  alt={`Captura ${i + 1}`}
                  className="h-24 w-24 rounded-md border border-gray-300 object-cover"
                />
              ))}
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-600">{error}</p>}

        <button
          type="submit"
          disabled={!puedeEnviar || estado === 'enviando'}
          className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:cursor-not-allowed disabled:bg-gray-300"
        >
          {estado === 'enviando' ? 'Registrando...' : 'Registrar persona'}
        </button>
      </form>
    </div>
  )
}