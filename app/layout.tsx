import type { Metadata, Viewport } from 'next'
import { Libre_Baskerville } from 'next/font/google'
import { Analytics } from '@vercel/analytics/next'
import './globals.css'

const _libreBaskerville = Libre_Baskerville({
  subsets: ['latin'],
  weight: ['400', '700'],
  style: ['normal', 'italic'],
  variable: '--font-libre',
})

export const metadata: Metadata = {
  title: '基督受難晚會 2026 — 台北旌旗教會',
  description:
    '在沉重與榮耀之間，重新看見那份為你而來的愛。基督受難晚會 4/3（五）、復活主日 4/5（日），台北旌旗教會。',

}

export const viewport: Viewport = {
  themeColor: '#0a0e17',
  width: 'device-width',
  initialScale: 1,
  userScalable: false,
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="zh-Hant">
      <head>
        <link rel="preload" href="/models/crown.glb" as="fetch" crossOrigin="anonymous" />
      </head>
      <body
        className={`${_libreBaskerville.variable} font-serif antialiased`}
      >
        {children}
        <Analytics />
      </body>
    </html>
  )
}
