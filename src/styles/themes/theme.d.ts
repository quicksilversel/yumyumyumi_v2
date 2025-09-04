import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    colors: {
      primary: string
      background: string
      text: string
      muted: string
      floating: string
      border: string
      backgroundhsl: string
      white: string
      black: string
      gray: {
        50: string
        100: string
        200: string
        300: string
        400: string
        500: string
        600: string
        700: string
        800: string
        900: string
      }
      error: string
      success: string
      warning: string
      info: string
    }
    typography: {
      fontSize: {
        xs: string
        sm: string
        base: string
        lg: string
        xl: string
        '2xl': string
        '3xl': string
        '4xl': string
      }
      fontWeight: {
        light: number
        normal: number
        medium: number
        semibold: number
        bold: number
      }
      lineHeight: {
        tight: number
        normal: number
        relaxed: number
        loose: number
      }
      letterSpacing: {
        tight: string
        normal: string
        wide: string
        wider: string
      }
    }
    spacing: {
      px: string
      0: string
      0.5: string
      1: string
      2: string
      3: string
      4: string
      5: string
      6: string
      8: string
      10: string
      12: string
      16: string
      20: string
      24: string
      32: string
    }
    borderRadius: {
      none: string
      sm: string
      default: string
      md: string
      lg: string
      xl: string
      full: string
    }
    shadow: {
      none: string
      xs: string
      sm: string
      default: string
      md: string
      lg: string
      xl: string
    }
    transition: {
      fast: string
      default: string
      slow: string
    }
    breakpoints: {
      sm: string
      md: string
      lg: string
      xl: string
      '2xl': string
    }
  }
}
