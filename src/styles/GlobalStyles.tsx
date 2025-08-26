import { Global, css } from '@emotion/react'
import { useTheme } from '@emotion/react'

import { customStyles } from './customStyles'
import { resetCss } from './resetCss'
import { variables } from './variables'

export const GlobalStyles = () => {
  const theme = useTheme()
  return (
    <Global
      styles={css`
        ${resetCss}
        ${customStyles(theme)}
        ${variables}
      `}
    />
  )
}
