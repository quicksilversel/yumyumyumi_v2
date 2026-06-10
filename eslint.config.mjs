// For more info, see https://github.com/storybookjs/eslint-plugin-storybook#configuration-flat-config-format

import { defineConfig } from 'eslint/config'
import nextCoreWebVitals from 'eslint-config-next/core-web-vitals'
import unusedImports from 'eslint-plugin-unused-imports'

export default defineConfig([
  ...nextCoreWebVitals,
  {
    plugins: {
      'unused-imports': unusedImports,
    },

    rules: {
      'no-console': [
        'error',
        {
          allow: ['warn', 'dir'],
        },
      ],

      'no-restricted-syntax': ['error', 'TSEnumDeclaration', 'WithStatement'],
      'no-unused-expressions': 'error',
      '@typescript-eslint/interface-name-prefix': 'off',
      '@typescript-eslint/member-delimiter-style': 'off',
      '@typescript-eslint/no-empty-interface': 'off',
      'unused-imports/no-unused-imports': 'error',

      'react/self-closing-comp': [
        'error',
        {
          component: true,
          html: true,
        },
      ],

      'import/order': [
        'error',
        {
          groups: [
            'builtin',
            'external',
            'type',
            'internal',
            'sibling',
            'parent',
            'index',
            'object',
          ],

          'newlines-between': 'always',
          pathGroupsExcludedImportTypes: ['react'],

          alphabetize: {
            order: 'asc',
            caseInsensitive: true,
          },

          pathGroups: [
            {
              pattern: 'react',
              group: 'external',
              position: 'before',
            },
          ],
        },
      ],
    },
  },
])
