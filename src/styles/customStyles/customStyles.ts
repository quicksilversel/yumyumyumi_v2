import { css } from '@emotion/react'

import type { Theme } from '@emotion/react'

export const customStyles = (theme: Theme) => css`
  body {
    color: ${theme.colors.text};
    accent-color: ${theme.colors.primary};
    background: ${theme.colors.background};
    transition:
      background 0.2s ease-in,
      color 0.2s ease-in;
  }

  a:hover,
  button:hover {
    opacity: 0.7;
    transition: opacity 0.2s ease-in;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
`
