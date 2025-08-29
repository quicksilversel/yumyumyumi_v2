import { css } from '@emotion/react'

export const variables = css`
  :root {
    /* Font Families */
    --font-family: -apple-system, 'system-ui', 'Segoe UI',
      'Hiragino Kaku Gothic ProN', 'Hiragino Sans', Meiryo, sans-serif;

    /* Font Sizes - Desktop */
    --font-size-extra-large: 2.25rem; /* ~36px - headlines */
    --font-size-large: 1.75rem; /* ~28px */
    --font-size-medium-large: 1.5rem; /* ~24px - subheadings */
    --font-size-medium: 1.25rem; /* ~20px - normal body large */
    --font-size-small: 1rem; /* ~16px - standard text */
    --font-size-extra-small: 0.875rem; /* ~14px - captions */
  }

  /* Mobile Adjustments */
  @media (width <= 35.1875rem) {
    :root {
      --font-size-extra-large: 1.75rem; /* ~28px */
      --font-size-large: 1.5rem; /* ~24px */
      --font-size-medium-large: 1.25rem; /* ~20px */
      --font-size-medium: 1.125rem; /* ~18px */
      --font-size-small: 0.95rem; /* ~15px */
      --font-size-extra-small: 0.85rem; /* ~13px */
    }
  }
`
