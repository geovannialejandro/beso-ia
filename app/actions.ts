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
        version: 'SG161222/Realistic_Vision_V6.0_B1_noVAE',
        input: {
          prompt: prompt,
          negative_prompt: 'deformado, feo, borroso, mala calidad, agua marca',
          disable_safety_checker: true,
          num_inference_steps: 30,
          guidance_scale: 7.5,
          num_outputs: 1
        }
      })
    })

    const prediccion = await crear.json()
    if (!crear.ok) throw new Error(prediccion.error || 'Error al conectar')

    let estado = prediccion
    while (estado.status !== 'succeeded' && estado.status !== 'failed') {
      await new Promise(r => setTimeout(r, 2000))
      const revisar = await fetch(`https://api.replicate.com/v1/predictions/${estado.id}`, {
        headers: { 'Authorization': `Token ${process.env.REPLICATE_API_TOKEN}` }
      })
      estado = await revisar.json()
    }

    if (estado.status === 'failed') throw new Error(estado.error || 'No se pudo generar')
    return Array.isArray(estado.output) ? estado.output[0] : String(estado.output)

  } catch (err: any) {
    console.error('Error:', err)
    throw new Error('Ocurrió un error al generar la imagen')
  }
}
