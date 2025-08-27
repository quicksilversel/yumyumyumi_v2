import { colors as designColors } from '../designTokens'

const commonTheme = {
  primary: '#f5b2ac',
}

export const darkTheme = {
  colors: {
    ...commonTheme,
    background: designColors.gray[900],
    text: designColors.gray[50],
    muted: designColors.gray[400],
    floating: designColors.gray[800],
    backgroundhsl: '0deg, 0%, 10%',
  },
}

export const lightTheme = {
  colors: {
    ...commonTheme,
    background: designColors.white,
    text: designColors.black,
    muted: designColors.gray[600],
    floating: designColors.gray[50],
    backgroundhsl: '0deg, 0%, 100%',
  },
}
