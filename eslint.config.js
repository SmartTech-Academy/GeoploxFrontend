import js from '@eslint/js';
import globals from 'globals';
import react from 'eslint-plugin-react';
import reactRefresh from 'eslint-plugin-react-refresh';
import pluginQuery from '@tanstack/eslint-plugin-query';
import reactHooks from 'eslint-plugin-react-hooks';
import tseslint from 'typescript-eslint';

export default [
  ...tseslint.configs.recommended,
  ...pluginQuery.configs['flat/recommended'],
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
      'src/components/ui/*',
    ],
  },
  {
    files: ['**/*.{js,jsx,ts,tsx}'],
    languageOptions: {
      ecmaVersion: 2020,
      globals: { ...globals.browser, ...globals.node, ...globals.es2025 },
      parserOptions: { ecmaVersion: 'latest', ecmaFeatures: { jsx: true }, sourceType: 'module' },
    },
    settings: { react: { version: '19.2.0' } },
    plugins: {
      react,
      'react-hooks': reactHooks,
      'react-refresh': reactRefresh,
    },
    rules: {
      ...js.configs.recommended.rules,
      ...react.configs.recommended.rules,
      ...react.configs['jsx-runtime'].rules,
      ...reactHooks.configs.recommended.rules, // hooks + compiler (basic)
      ...reactHooks.configs['recommended-latest'].rules, // hooks + compiler (full)

      /* -------------------------------------------------
         React-Compiler opt-in rules (all explicitly on)
      -------------------------------------------------- */
      'react-hooks/component-hook-factories': 'warn',
      'react-hooks/config': 'warn',
      'react-hooks/error-boundaries': 'warn',
      'react-hooks/gating': 'warn',
      'react-hooks/globals': 'warn',
      'react-hooks/immutability': 'warn',
      'react-hooks/incompatible-library': 'warn',
      'react-hooks/preserve-manual-memoization': 'warn',
      'react-hooks/purity': 'warn',
      'react-hooks/refs': 'warn',
      'react-hooks/set-state-in-effect': 'warn',
      'react-hooks/set-state-in-render': 'warn',
      'react-hooks/static-components': 'warn',
      'react-hooks/unsupported-syntax': 'warn',
      'react-hooks/use-memo': 'warn',

      /* -------------------------------------------------
         Your existing overrides
      -------------------------------------------------- */
      '@typescript-eslint/no-explicit-any': 'off',
      'react/jsx-no-target-blank': 'off',
      'no-console': 'warn',
      'react-refresh/only-export-components': ['warn', { allowConstantExport: true }],
    },
  },
];
