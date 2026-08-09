'use server'

import Replicate from 'replicate'

// El servidor lee esto de las variables de entorno de Vercel de forma privada
const replicate = new Replicate({
  auth: process.env.REPLICATE_API_TOKEN, 
})

export async function generateImage(prompt: string) {
  if (!prompt) throw new Error('Falta el prompt')

  try {
    const output = await replicate.run(
      "lucataco/flux-schnell-uncensored",
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
    console.error('Error en Replicate:', error)
    throw new Error('Error al generar la imagen')
  }
}
