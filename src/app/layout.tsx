import { Analytics } from '@vercel/analytics/next'
import { SpeedInsights } from '@vercel/speed-insights/next'
import { Inter } from 'next/font/google'

import type { Metadata } from 'next'

import { Header } from '@/components/ui/Header'
import { Providers } from '@/contexts/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YumYumYumi',
  description: 'Passionate About Cooking in Style',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="ja">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
          <Analytics />
          <SpeedInsights />
        </Providers>
      </body>
    </html>
  )
}
