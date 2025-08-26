import '@emotion/react'

declare module '@emotion/react' {
  export interface Theme {
    background: string
    text: string
    muted: string
    floating: string
    primary: string
    secondary: string
    accentOrange: string
    accentLavender: string
    skylineBlue: string
    syntaxBackground: string
    backgroundhsl: string
    colors: {
      background: string
      text: string
      muted: string
      floating: string
      primary: string
      secondary: string
      syntaxBackground: string
      backgroundhsl: string
    }
  }
}
