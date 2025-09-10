import { css } from '@emotion/react'

export const resetCss = css`
  *,
  *::before,
  *::after {
    box-sizing: border-box;
  }

  * {
    padding: 0;
    margin: 0;
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
    font: inherit;
    vertical-align: middle;
    color: inherit;
    text-align: inherit;
    text-transform: inherit;
    background: transparent;
    border-style: none;
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
