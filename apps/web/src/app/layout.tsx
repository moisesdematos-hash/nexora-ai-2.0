import type { Metadata } from 'next'
import './globals.css'
import { Providers } from './providers'

export const metadata: Metadata = {
  title: {
    default: 'NEXORA AI — Cria Apresentações, E-books e Muito Mais com IA',
    template: '%s | NEXORA AI',
  },
  description:
    'Plataforma profissional de criação de apresentações, e-books, documentos, mapas mentais, infográficos e websites com inteligência artificial.',
  keywords: ['IA', 'apresentações', 'e-books', 'inteligência artificial', 'SaaS', 'NEXORA'],
  authors: [{ name: 'NEXORA AI' }],
  openGraph: {
    type: 'website',
    locale: 'pt_PT',
    siteName: 'NEXORA AI',
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="pt" suppressHydrationWarning>
      <body className="font-sans antialiased">
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}
