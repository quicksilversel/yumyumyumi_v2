import React from 'react'

import { ThemeProvider } from '@emotion/react'
import { render } from '@testing-library/react'

import { lightTheme } from '@/styles/theme'

// Wrapper component that provides theme context
export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
}

// Custom render function that includes theme provider
export const renderWithTheme = (ui: React.ReactElement) => {
  return {
    ...render(<ThemeWrapper>{ui}</ThemeWrapper>),
  }
}