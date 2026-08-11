import { config } from '@workspace/eslint-config/base';

/** @type {import("eslint").Linter.Config} */
export default [
  ...config,
  {
    rules: {
      '@typescript-eslint/no-explicit-any': 'off',
      '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    },
  },
  {
    ignores: ['dist/**'],
  },
];
