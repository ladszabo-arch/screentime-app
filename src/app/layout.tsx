import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'Rodinný Screen Time',
  description: 'Správa screen time minút pre rodinu',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="sk">
      <body className="min-h-screen bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}

