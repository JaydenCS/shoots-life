import type { Metadata, Viewport } from 'next'
import Script from 'next/script'
import './globals.css'

export const metadata: Metadata = {
  title: 'shoots.life',
  description: 'One photo. One day. Just for you.',
  manifest: '/manifest.json',
}

export const viewport: Viewport = {
  themeColor: '#F8F4EF',
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  userScalable: false,
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>
        {children}
        <Script src="https://haptics.lochie.me/haptics.js" strategy="lazyOnload" />
      </body>
    </html>
  )
}
