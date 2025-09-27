import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginQuery from '@tanstack/eslint-plugin-query';
import * as reactHooks from 'eslint-plugin-react-hooks';
// Import typescript-eslint
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  // Include TypeScript ESLint configs
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],
  reactHooks.configs.recommended,
  {
    ignores: [
      'node_modules',
      'dist',
      '.next',
      '.env',
      '.cache',
      'components/ui',
      'build',
      'public/build',
      '.env',
      'src/components/ui/*',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: {
        ...globals.browser,
        ...globals.node,
        ...globals.es2025,
      },
      parserOptions: {
        ecmaVersion: 'latest',
        ecmaFeatures: { jsx: true },
        sourceType: 'module',
      },
    },
    settings: { react: { version: '19.1.0' } },
    plugins: {
      react,
      'react-refresh': reactRefresh,
      ...reactHooks.configs.recommended.plugins,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules,
      '@typescript-eslint/no-explicit-any': 'off',
      'react/jsx-no-target-blank': 'off',
      'no-console': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
      'react-hooks/react-compiler': 'error',
    },
  },
];
