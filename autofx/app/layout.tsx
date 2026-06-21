import type { Metadata, Viewport } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: {
    default: 'AutoFX — Premium Trade Mirroring',
    template: '%s | AutoFX',
  },
  description:
    'AutoFX mirrors elite trading strategies directly into your own Exness account. Your funds stay under your control. Professionals do the work.',
  metadataBase: new URL(process.env.NEXT_PUBLIC_APP_URL ?? 'https://autofx.ae'),
  openGraph: {
    type: 'website',
    siteName: 'AutoFX',
    title: 'AutoFX — Premium Trade Mirroring',
    description:
      'Mirror professional trading into your Exness account. You stay in control.',
  },
  twitter: {
    card: 'summary_large_image',
  },
  icons: {
    icon: '/favicon.svg',
  },
}

export const viewport: Viewport = {
  themeColor: '#07071A',
  width: 'device-width',
  initialScale: 1,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link
          rel="preconnect"
          href="https://fonts.gstatic.com"
          crossOrigin="anonymous"
        />
      </head>
      <body className="bg-void text-slate-100 font-body antialiased">
        {children}
      </body>
    </html>
  )
}
