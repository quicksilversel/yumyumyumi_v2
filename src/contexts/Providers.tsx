'use client'

import { useState, useEffect } from 'react'

import { ThemeProvider } from '@emotion/react'

import { AuthProvider } from '@/contexts/AuthContext'
import { BookmarksProvider } from '@/contexts/BookmarksContext'
import { RecipeProvider } from '@/contexts/RecipeContext'
import EmotionRegistry from '@/lib/emotion/EmotionRegistry'
import { GlobalStyles } from '@/styles'
import { lightTheme } from '@/styles/themes'

export type ThemeContext = {
  theme: 'light' | 'dark'
  setTheme: (theme: 'light' | 'dark') => void
}

export const Providers = ({ children }: { children: React.ReactNode }) => {
  const [theme, setTheme] = useState<ThemeContext['theme']>('dark')

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme')
    const prefersLight =
      window.matchMedia &&
      window.matchMedia('(prefers-color-scheme: light)').matches

    if (savedTheme) {
      setTheme(savedTheme === 'dark' ? 'dark' : 'light')
    }

    if (prefersLight) {
      setTheme('light')
    }
  }, [])

  return (
    <EmotionRegistry>
      <ThemeProvider theme={lightTheme}>
        <AuthProvider>
          <BookmarksProvider>
            <RecipeProvider>
              <GlobalStyles />
              {children}
            </RecipeProvider>
          </BookmarksProvider>
        </AuthProvider>
      </ThemeProvider>
    </EmotionRegistry>
  )
}
