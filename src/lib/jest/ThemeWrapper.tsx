import React from 'react'

import { ThemeProvider } from '@emotion/react'
import { render } from '@testing-library/react'

import { lightTheme } from '@/styles/themes'

export const ThemeWrapper = ({ children }: { children: React.ReactNode }) => {
  return <ThemeProvider theme={lightTheme}>{children}</ThemeProvider>
}

export const renderWithTheme = (ui: React.ReactElement) => {
  return {
    ...render(<ThemeWrapper>{ui}</ThemeWrapper>),
  }
}
