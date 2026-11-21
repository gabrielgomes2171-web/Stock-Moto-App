// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*'],
  },
  {
    // O Auth deve ser criado só em firebase/authInstance*.ts (com a
    // persistência correta por plataforma). Um getAuth() em outro lugar,
    // executado antes, deixaria o Android/iOS sem persistência.
    files: ['**/*.{js,jsx,ts,tsx}'],
    ignores: ['firebase/authInstance.ts', 'firebase/authInstance.native.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            {
              name: 'firebase/auth',
              importNames: ['getAuth', 'initializeAuth', 'getReactNativePersistence'],
              message: 'Use o `auth` exportado por firebase/firebaseConfig.js.',
            },
          ],
        },
      ],
    },
  },
  {
    // Testes E2E devem usar o `test` de tests/support/fixtures.ts, que
    // bloqueia a rede externa e mocka o Firebase Auth.
    files: ['tests/**/*.ts'],
    ignores: ['tests/support/fixtures.ts'],
    rules: {
      'no-restricted-imports': [
        'error',
        {
          paths: [
            // Mantém também a restrição do Firebase Auth do bloco anterior
            // (esta regra substitui a anterior para os arquivos de teste).
            {
              name: 'firebase/auth',
              importNames: ['getAuth', 'initializeAuth', 'getReactNativePersistence'],
              message: 'Use o `auth` exportado por firebase/firebaseConfig.js.',
            },
            {
              name: '@playwright/test',
              importNames: ['test'],
              message: 'Importe `test` de ./support/fixtures (bloqueia a rede e mocka o Firebase).',
            },
          ],
        },
      ],
    },
  },
]);
