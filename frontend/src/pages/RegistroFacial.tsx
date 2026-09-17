import { CheckCircle2 } from 'lucide-react'
import { useState, type FormEvent } from 'react'
import CameraCapture from '../components/CameraCapture'
import { crearPersona, subirRostro } from '../services/api'

type Estado = 'formulario' | 'enviando' | 'exito'

export default function RegistroFacial() {
  const [nombre, setNombre] = useState('')
  const [email, setEmail] = useState('')
  const [imagenBase64, setImagenBase64] = useState<string | null>(null)
  const [estado, setEstado] = useState<Estado>('formulario')
  const [error, setError] = useState<string | null>(null)

  const puedeEnviar = nombre.trim() !== '' && email.trim() !== '' && imagenBase64 !== null

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!puedeEnviar || !imagenBase64) return

    setEstado('enviando')
    setError(null)
    try {
      const persona = await crearPersona({ nombre, email })
      await subirRostro(persona.id, imagenBase64)
      setEstado('exito')
    } catch {
      setError('No se pudo completar el registro. Intenta nuevamente.')
      setEstado('formulario')
    }
  }

  function handleReset() {
    setNombre('')
    setEmail('')
    setImagenBase64(null)
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
          <span className="mb-1 block text-sm font-medium text-gray-700">Captura facial</span>
          <CameraCapture onCapture={setImagenBase64} />
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
