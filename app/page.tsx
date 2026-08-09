'use client'

import { useState } from 'react'
import { generateImage } from './actions'

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
      const url = await generateImage(prompt)
      setImageUrl(url)
    } catch (err: any) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-4 bg-gray-950 text-white font-mono">
      <div className="z-10 max-w-3xl w-full flex flex-col gap-8 items-center text-center">
        <h1 className="text-4xl font-bold mt-10">BESO-IA</h1>
        
        <form onSubmit={handleGenerate} className="w-full bg-gray-900 p-6 rounded-2xl border border-gray-800">
          <textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            placeholder="Describe tu imagen..."
            rows={3}
            className="w-full p-3 rounded-xl bg-gray-950 border border-gray-800 text-white mb-4"
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-xl bg-amber-500 text-gray-950 font-bold"
          >
            {loading ? 'Generando...' : 'Crear Imagen'}
          </button>
        </form>

        {error && <p className="text-red-400">{error}</p>}
        {imageUrl && <img src={imageUrl} className="w-full max-w-md rounded-lg border border-gray-800" />}
      </div>
    </main>
  )
}
