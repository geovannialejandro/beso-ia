'use server'

export async function generateImage(prompt: string) {
  if (!prompt) throw new Error('Escribe tu descripción')

  try {
    const crear = await fetch('https://api.replicate.com/v1/predictions', {
      method: 'POST',
      headers: {
        'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        version: 'lucataco/flux-schnell-uncensored',
        input: {
          prompt: prompt,
          disable_safety_checker: true,
          go_fast: true,
          num_outputs: 1
        }
      })
    })

    const prediccion = await crear.json()
    if (!crear.ok) throw new Error(prediccion.error || 'Error en Replicate')

    let estado = prediccion
    while (estado.status !== 'succeeded' && estado.status !== 'failed') {
      await new Promise(r => setTimeout(r, 1500))
      const revisar = await fetch(`https://api.replicate.com/v1/predictions/${estado.id}`, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      })
      estado = await revisar.json()
    }

    if (estado.status === 'failed') throw new Error(estado.error || 'Falló la generación')
    return Array.isArray(estado.output) ? estado.output[0] : String(estado.output)

  } catch (err: any) {
    console.error('Error:', err)
    throw new Error('No se pudo generar la imagen')
  }
}
