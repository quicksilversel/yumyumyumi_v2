import { Inter } from 'next/font/google'

import type { Metadata } from 'next'

import { Header } from '@/components/ui/Header'
import { Providers } from '@/contexts/Providers'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'YumYumYumi',
  description: 'Discover and save your favorite recipes',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en">
      <body className={inter.className}>
        <Providers>
          <Header />
          {children}
        </Providers>
      </body>
    </html>
  )
}
