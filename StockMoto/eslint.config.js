// https://docs.expo.dev/guides/using-eslint/
const { defineConfig } = require('eslint/config');
const expoConfig = require('eslint-config-expo/flat');

module.exports = defineConfig([
  expoConfig,
  {
    ignores: ['dist/*', 'dist-e2e/*'],
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
    // Testes E2E devem usar o `test` de tests/support/fixtures.ts, que isola
    // a rede (bloqueia tráfego externo e mocka o Firebase Auth). Qualquer
    // outra forma de obter o Playwright contornaria essa proteção.
    files: ['tests/**/*.{js,mjs,cjs,jsx,ts,mts,cts,tsx}'],
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
              // Tipos e utilitários (expect, devices, type Page...) continuam permitidos.
              name: '@playwright/test',
              importNames: ['test', 'default'],
              message: 'Importe `test` de ./support/fixtures (isola a rede e mocka o Firebase).',
            },
          ],
          patterns: [
            {
              group: ['playwright', 'playwright/*', 'playwright-core', 'playwright-core/*', '@playwright/test/*'],
              message: 'Use ./support/fixtures: importar o Playwright diretamente contorna o isolamento de rede.',
            },
          ],
        },
      ],
      'no-restricted-syntax': [
        'error',
        {
          selector:
            "CallExpression[callee.name='require'][arguments.0.value=/^(@playwright\\/test|playwright|playwright-core)(\\/.*)?$/]",
          message: 'Use ./support/fixtures: require() do Playwright contorna o isolamento de rede.',
        },
        {
          selector: "ImportExpression[source.value=/^(@playwright\\/test|playwright|playwright-core)(\\/.*)?$/]",
          message: 'Use ./support/fixtures: import() dinâmico do Playwright contorna o isolamento de rede.',
        },
      ],
    },
  },
]);
