'use client'

import { useState } from 'react'
import Replicate from 'replicate'

export default function Home() {
  const [prompt, setPrompt] = useState('')
  const [loading, setLoading] = useState(false)
  const [imageUrl, setImageUrl] = useState('')
  const [error, setError] = useState('')

  const handleGenerate = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!prompt.trim()) return

    setLoading(true)
    setError('')
    setImageUrl('')

    try {
      // Llamada directa a Replicate sin pasar por archivos de API intermedios
      const response = await fetch('https://api.replicate.com/v1/predictions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${process.env.NEXT_PUBLIC_REPLICATE_API_TOKEN}`,
          'Content-Type': 'application/json',
          'Prefer': 'wait'
        },
        body: JSON.stringify({
          version: "lucataco/flux-schnell-uncensored", // O el hash de versión si se prefiere, pero el nombre directo suele funcionar o manejarse mediante proxy. 
          input: {
            prompt: prompt,
            go_fast: true,
            num_outputs: 1,
            aspect_ratio: "1:1",
            output_format: "webp",
            output_quality: 80
          }
        })
      })

      // Nota de seguridad: Como las Server Actions corren en el servidor de forma segura, 
      // lo ideal para ocultar tu token es usar una Server Action de Next.js.
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 sm:p-24 bg-gray-950 text-white font-mono">
      <div className="z-10 max-w-3xl w-full flex flex-col gap-8 items-center text-center">
        
        <div className="flex flex-col items-center gap-3">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 border border-amber-500/30 text-amber-300">
            ✨ Sin censura y ultra rápido
          </span>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-wider text-white font-serif">
            BESO-IA
          </h1>
          <p className="text-gray-400 text-sm sm:text-base max-w-md">
            Genera imágenes sin restricciones en segundos con FLUX.
          </p>
        </div>

        <form onSubmit={handleGenerate} className="w-full flex flex-col gap-4 bg-gray-900 p-6 rounded-2xl border border-gray-800 shadow-xl">
          <div className="flex flex-col gap-2 text-left">
            <label className="text-xs text-gray-300 font-semibold uppercase tracking-wider">
              Describe tu imagen
            </label>
            <textarea
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              placeholder="Ej: Un paisaje futurista..."
              rows={3}
              className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white placeholder-gray-600 focus:outline-none focus:border-amber-500 text-sm resize-none"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 px-6 rounded-xl bg-gradient-to-r from-amber-500 to-orange-600 text-gray-950 font-bold text-sm tracking-wide hover:opacity-90 transition disabled:opacity-50 cursor-pointer shadow-lg shadow-amber-500/20"
          >
            {loading ? 'Generando magia...' : 'Crear Imagen ✨'}
          </button>
        </form>

        {error && (
          <div className="w-full p-4 rounded-xl bg-red-950/50 border border-red-800 text-red-300 text-xs">
            {error}
          </div>
        )}

        {imageUrl && (
          <div className="w-full flex flex-col items-center gap-4 bg-gray-900 p-4 rounded-2xl border border-gray-800">
            <p className="text-xs text-amber-400 font-semibold">¡Imagen generada con éxito!</p>
            <div className="relative w-full aspect-square max-w-md rounded-lg overflow-hidden border border-gray-800 shadow-2xl">
              <img src={imageUrl} alt={prompt} className="w-full h-full object-cover" />
            </div>
          </div>
        )}
      </div>
    </main>
  )
      }
    
