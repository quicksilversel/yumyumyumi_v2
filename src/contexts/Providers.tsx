'use client'

import { Suspense } from 'react'

import { ThemeProvider } from '@emotion/react'
import { SessionProvider } from 'next-auth/react'

import { AuthProvider } from '@/contexts/AuthContext'
import { BookmarksProvider } from '@/contexts/BookmarksContext'
import { RecipeProvider } from '@/contexts/RecipeContext'
import EmotionRegistry from '@/lib/emotion/EmotionRegistry'
import { GlobalStyles } from '@/styles'
import { lightTheme } from '@/styles/themes'

export const Providers = ({ children }: { children: React.ReactNode }) => {
  return (
    <EmotionRegistry>
      <ThemeProvider theme={lightTheme}>
        <SessionProvider>
          <AuthProvider>
            <BookmarksProvider>
              <Suspense fallback={null}>
                <RecipeProvider>
                  <GlobalStyles />
                  {children}
                </RecipeProvider>
              </Suspense>
            </BookmarksProvider>
          </AuthProvider>
        </SessionProvider>
      </ThemeProvider>
    </EmotionRegistry>
  )
}
