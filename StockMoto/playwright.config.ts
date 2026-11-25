
import { defineConfig, devices } from '@playwright/test';

export default defineConfig({
  testDir: './tests',

  fullyParallel: false,

  // O Expo (Metro) compila a página na primeira visita, o que pode passar de 5s
  expect: { timeout: 15000 },

  reporter: [['html', { open: 'never' }], ['list']],

  use: {
    baseURL: 'http://127.0.0.1:8081',
    trace: 'on',        // grava trace de todos os testes (evidência passo a passo)
    screenshot: 'on',   // screenshot ao final de cada teste
  },

  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },
  ],

  webServer: {
    command: 'npx expo start --web --host localhost --port 8081',
    url: 'http://127.0.0.1:8081',
    reuseExistingServer: !process.env.CI,
    timeout: 120000,
  },
});
