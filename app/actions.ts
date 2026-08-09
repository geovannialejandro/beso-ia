'use server'

import Replicate from 'replicate'

export async function generateImage(prompt: string) {
  if (!prompt) {
    throw new Error('Falta el prompt')
  }

  const token = process.env.REPLICATE_API_TOKEN
  if (!token) {
    throw new Error('Falta configurar REPLICATE_API_TOKEN en Vercel')
  }

  const replicate = new Replicate({
    auth: token,
  })

  try {
    // Usamos el modelo flux-schnell con su versión exacta para evitar errores de ruta
    const output = await replicate.run(
      "black-forest-labs/flux-schnell",
      {
        input: {
          prompt: prompt,
          go_fast: true,
          num_outputs: 1,
          aspect_ratio: "1:1",
          output_format: "webp",
          output_quality: 80,
        }
      }
    )

    return Array.isArray(output) ? output[0] : String(output)
  } catch (error: any) {
    console.error('Error detallado de Replicate:', error)
    throw new Error(error.message || 'Error al generar la imagen')
  }
}
