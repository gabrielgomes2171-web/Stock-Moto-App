import { defineConfig, devices } from '@playwright/test';

/**
 * Testes E2E do build web do app.
 *
 * O webServer gera o build web estático (expo export) e o serve com
 * `expo serve`. Os testes não acessam o Firebase real: o Auth é mockado
 * e todo host externo é bloqueado (ver tests/support/fixtures.ts).
 *
 * Para reaproveitar um servidor já em execução localmente:
 *   npx expo export --platform web && npx expo serve --port 8085
 *
 * See https://playwright.dev/docs/test-configuration.
 */
const PORTA = 8085;
const BASE_URL = `http://localhost:${PORTA}`;

export default defineConfig({
  testDir: './tests',
  /* Arquivos de apoio (fixtures, listas de rotas) não são testes. */
  testIgnore: ['**/support/**'],
  /* Run tests in files in parallel */
  fullyParallel: true,
  /* Fail the build on CI if you accidentally left test.only in the source code. */
  forbidOnly: !!process.env.CI,
  /* Retry on CI only */
  retries: process.env.CI ? 2 : 0,
  /* Opt out of parallel tests on CI. */
  workers: process.env.CI ? 1 : undefined,
  /* Reporter to use. See https://playwright.dev/docs/test-reporters */
  reporter: process.env.CI ? 'list' : 'html',
  /* Shared settings for all the projects below. See https://playwright.dev/docs/api/class-testoptions. */
  use: {
    baseURL: BASE_URL,

    /* Collect trace when retrying the failed test. See https://playwright.dev/docs/trace-viewer */
    trace: 'on-first-retry',
  },

  /* Configure projects for major browsers */
  projects: [
    {
      name: 'chromium',
      use: { ...devices['Desktop Chrome'] },
    },

    {
      name: 'firefox',
      use: { ...devices['Desktop Firefox'] },
    },

    {
      name: 'webkit',
      use: { ...devices['Desktop Safari'] },
    },
  ],

  /* Gera o build web e serve antes dos testes. */
  webServer: {
    command: `npx expo export --platform web && npx expo serve --port ${PORTA}`,
    url: BASE_URL,
    reuseExistingServer: !process.env.CI,
    timeout: 5 * 60 * 1000,
    env: { CI: '1' },
  },
});
