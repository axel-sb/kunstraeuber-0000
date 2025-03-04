import { default as defaultConfig } from '@epic-web/config/eslint'

/** @type {import("eslint").Linter.Config} */
export default [
  ...defaultConfig,
  // add custom config objects here:
  parserOptions: {
    project: './tsconfig.eslint.json',
  },
  {
    files: ['**/tests/**/*.ts'],
    rules: { 'react-hooks/rules-of-hooks': 'off' },
  },
  {
    ignores: ['.react-router/*'],
  },
]
