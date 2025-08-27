import { css } from '@emotion/react'

import type { Theme } from '@emotion/react'

export const customStyles = (theme: Theme) => css`
  body {
    color: ${theme.colors.text};
    background: ${theme.colors.background};
    accent-color: ${theme.colors.primary};
    font-family: var(--font-family);
    transition:
      background 0.2s ease-in,
      color 0.2s ease-in;
  }

  a:hover,
  button:hover {
    color: ${theme.colors.primary};
    transition: color 0.2s ease-in;
  }

  /* MUI Icon sizing constraints */
  svg.MuiSvgIcon-root {
    width: 1.5rem;
    height: 1.5rem;
    display: inline-block;
    flex-shrink: 0;
  }

  /* Prevent images from overflowing */
  img {
    max-width: 100%;
    height: auto;
    display: block;
  }
`
