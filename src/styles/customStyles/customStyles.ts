import { css } from '@emotion/react'

import type { Theme } from '@emotion/react'

export const customStyles = (theme: Theme) => css`
  body {
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font-family: var(--font-family);
    transition:
      background 0.2s ease-in,
      color 0.2s ease-in;
    accent-color: ${theme.colors.primary};
  }

  a:hover,
  button:hover {
    transition: opacity 0.2s ease-in;
    opacity: 0.7;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }
`
