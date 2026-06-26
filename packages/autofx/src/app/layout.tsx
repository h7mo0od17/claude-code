import type { Metadata } from "next"
import "./globals.css"

export const metadata: Metadata = {
  title: {
    default: "AutoFX — Professional Copy Trading Platform",
    template: "%s | AutoFX",
  },
  description:
    "Join AutoFX and automatically copy professional forex trades. Subscribe to BronzeFX, SilverFX, or GoldFX and grow your portfolio with expert-managed copy trading.",
  keywords: ["copy trading", "forex", "automated trading", "AutoFX", "MT4", "investment"],
  openGraph: {
    type: "website",
    locale: "en_US",
    url: process.env.NEXT_PUBLIC_APP_URL,
    siteName: "AutoFX",
    title: "AutoFX — Professional Copy Trading Platform",
    description: "Automatically copy professional forex trades with AutoFX.",
  },
  twitter: {
    card: "summary_large_image",
    title: "AutoFX — Professional Copy Trading Platform",
    description: "Automatically copy professional forex trades with AutoFX.",
  },
  robots: {
    index: true,
    follow: true,
  },
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body>{children}</body>
    </html>
  )
}
