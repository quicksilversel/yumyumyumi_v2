import { css } from '@emotion/react'

export const resetCss = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    margin: 0;
    padding: 0;
  }

  body {
    line-height: 1.5;
    -webkit-font-smoothing: antialiased;
  }

  img,
  picture,
  video,
  canvas,
  svg {
    display: block;
    max-width: 100%;
  }

  button {
    cursor: pointer;
  }

  input,
  button,
  textarea,
  select {
    padding: 0;
    border-style: none;
    background: transparent;
    color: inherit;
    font: inherit;
    text-align: inherit;
    text-transform: inherit;
    vertical-align: middle;
  }

  li {
    list-style: none;
  }

  p,
  h1,
  h2,
  h3,
  h4,
  h5,
  h6 {
    overflow-wrap: break-word;
  }

  a {
    color: inherit;
    text-decoration: none;
  }

  #root,
  #__next {
    isolation: isolate;
  }
`
