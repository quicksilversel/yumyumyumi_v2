export const typography = {
  fontSize: {
    xs: '0.75rem', // 12px
    sm: '0.875rem', // 14px
    base: '1rem', // 16px
    lg: '1.125rem', // 18px
    xl: '1.25rem', // 20px
    '2xl': '1.5rem', // 24px
    '3xl': '1.875rem', // 30px
    '4xl': '2.25rem', // 36px
  },
  fontWeight: {
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  lineHeight: {
    tight: 1.2,
    normal: 1.5,
    relaxed: 1.75,
    loose: 2,
  },
  letterSpacing: {
    tight: '-0.02em',
    normal: '0',
    wide: '0.02em',
    wider: '0.04em',
  },
} as const

export const spacing = {
  px: '1px',
  0: '0',
  0.5: '0.125rem', // 2px
  1: '0.25rem', // 4px
  2: '0.5rem', // 8px
  3: '0.75rem', // 12px
  4: '1rem', // 16px
  5: '1.25rem', // 20px
  6: '1.5rem', // 24px
  8: '2rem', // 32px
  10: '2.5rem', // 40px
  12: '3rem', // 48px
  16: '4rem', // 64px
  20: '5rem', // 80px
  24: '6rem', // 96px
  32: '8rem', // 128px
} as const

export const borderRadius = {
  none: '0',
  sm: '0.125rem', // 2px
  default: '0.25rem', // 4px
  md: '0.375rem', // 6px
  lg: '0.5rem', // 8px
  xl: '0.75rem', // 12px
  full: '9999px',
} as const

export const shadow = {
  none: 'none',
  xs: '0 1px 2px rgba(0, 0, 0, 0.05)',
  sm: '0 2px 4px rgba(0, 0, 0, 0.05)',
  default: '0 4px 6px rgba(0, 0, 0, 0.05)',
  md: '0 6px 12px rgba(0, 0, 0, 0.05)',
  lg: '0 10px 20px rgba(0, 0, 0, 0.05)',
  xl: '0 20px 40px rgba(0, 0, 0, 0.05)',
} as const

export const transition = {
  fast: '150ms ease',
  default: '200ms ease',
  slow: '300ms ease',
} as const

export const breakpoints = {
  sm: '640px',
  md: '768px',
  lg: '1024px',
  xl: '1280px',
  '2xl': '1536px',
} as const

const commonTheme = {
  colors: {
    primary: '#f5b2ac',
    white: '#FFFFFF',
    black: '#000000',
    gray: {
      50: '#FAFAFA',
      100: '#F5F5F5',
      200: '#E5E5E5',
      300: '#D4D4D4',
      400: '#A3A3A3',
      500: '#737373',
      600: '#525252',
      700: '#404040',
      800: '#262626',
      900: '#171717',
    },
    error: '#DC2626',
    success: '#16A34A',
    warning: '#CA8A04',
    info: '#2563EB',
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
    background: commonTheme.colors.white,
    text: commonTheme.colors.black,
    muted: commonTheme.colors.gray[600],
    floating: commonTheme.colors.gray[50],
    backgroundhsl: '0deg, 0%, 100%',
    border: commonTheme.colors.gray[200],
  },
}

export const darkTheme = {
  ...commonTheme,
  colors: {
    ...commonTheme.colors,
    background: commonTheme.colors.gray[900],
    text: commonTheme.colors.gray[50],
    muted: commonTheme.colors.gray[400],
    floating: commonTheme.colors.gray[800],
    backgroundhsl: '0deg, 0%, 10%',
    border: commonTheme.colors.gray[700],
  },
}

export type Theme = typeof lightTheme
