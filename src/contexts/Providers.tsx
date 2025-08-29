'use client'

import { useState, useEffect } from 'react'

import { ThemeProvider } from '@emotion/react'

import { AuthProvider } from '@/contexts/AuthContext'
import { RecipeProvider } from '@/contexts/RecipeContext'
import EmotionRegistry from '@/lib/emotion/EmotionRegistry'
import { GlobalStyles } from '@/styles'
import { lightTheme } from '@/styles/theme'

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
          <RecipeProvider>
            <GlobalStyles />
            {children}
          </RecipeProvider>
        </AuthProvider>
      </ThemeProvider>
    </EmotionRegistry>
  )
}
