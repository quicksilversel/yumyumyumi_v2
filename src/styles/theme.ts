import {
  colors as designColors,
  typography,
  spacing,
  borderRadius,
  shadow,
  transition,
  breakpoints,
} from './designTokens'

const commonTheme = {
  colors: {
    primary: '#f5b2ac',
    white: designColors.white,
    black: designColors.black,
    gray: designColors.gray,
    accent: designColors.accent,
    error: designColors.error,
    success: designColors.success,
    warning: designColors.warning,
    info: designColors.info,
  },
  typography,
  spacing,
  borderRadius,
  shadow,
  transition,
  breakpoints,
}

export const lightTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    background: designColors.white,
    text: designColors.black,
    muted: designColors.gray[600],
    floating: designColors.gray[50],
    backgroundhsl: '0deg, 0%, 100%',
    border: designColors.gray[200],
  },
}

export const darkTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    background: designColors.gray[900],
    text: designColors.gray[50],
    muted: designColors.gray[400],
    floating: designColors.gray[800],
    backgroundhsl: '0deg, 0%, 10%',
    border: designColors.gray[700],
  },
}

export type Theme = typeof lightTheme