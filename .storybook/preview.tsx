import type { Preview } from '@storybook/nextjs-vite'
import { ThemeProvider } from '@emotion/react'

import { GlobalStyles } from '../src/styles/GlobalStyles'

import { lightTheme } from '../src/styles/theme'

const preview: Preview = {
  decorators: [
    (Story) => (
      <ThemeProvider theme={lightTheme}>
        <GlobalStyles />
        <Story />
      </ThemeProvider>
    ),
  ],
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },

    a11y: {
      // 'todo' - show a11y violations in the test UI only
      // 'error' - fail CI on a11y violations
      // 'off' - skip a11y checks entirely
      test: 'todo',
    },
  },
}

export default preview
