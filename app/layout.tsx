export const metadata = {
  title: 'BESO-IA',
  description: 'Generador de imágenes sin censura',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
