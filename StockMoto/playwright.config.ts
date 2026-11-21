import { defineConfig, devices } from '@playwright/test';

import { PORTA_TESTES, PROXY_BLOQUEADO } from './tests/support/rede';

/**
 * Testes E2E do build web do app. Ver a seção "Testes automatizados" do
 * README para instalação e execução.
 *
 * O webServer:
 * 1. gera um build web PRÓPRIO dos testes em dist-e2e/ (não toca no dist/),
 *    com EXPO_PUBLIC_FIREBASE_AMBIENTE=teste => projeto fictício
 *    "demo-stockmoto", nunca o Firebase de produção;
 * 2. confere que o build só contém projetos "demo-"
 *    (tests/support/verificar-build-teste.mjs) — se não, a suíte não roda;
 * 3. serve o build em uma porta exclusiva, sempre iniciado do zero
 *    (sem reaproveitar um servidor antigo).
 *
 * A rede dos testes é isolada em camadas: proxy inexistente, service
 * workers bloqueados e os fixtures de tests/support/fixtures.ts.
 *
 * See https://playwright.dev/docs/test-configuration.
 */
const BASE_URL = `http://localhost:${PORTA_TESTES}`;

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
    /* Camada de rede: todo tráfego externo vai para um proxy inexistente.
       - proxy: requisições das páginas e do fixture `request` (por contexto);
       - launchOptions.proxy: tráfego do próprio navegador (serviços de
         segundo plano, atualizações), que não passa pelos contextos. */
    proxy: PROXY_BLOQUEADO,
    launchOptions: { proxy: PROXY_BLOQUEADO },
    serviceWorkers: 'block',

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

  /* Gera o build de teste, confere que é "demo-" e serve antes dos testes. */
  webServer: {
    command:
      'npx expo export --platform web --clear --output-dir dist-e2e' +
      ' && node tests/support/verificar-build-teste.mjs dist-e2e' +
      ` && npx expo serve dist-e2e --port ${PORTA_TESTES}`,
    url: BASE_URL,
    /* Nunca reaproveita silenciosamente um servidor antigo: se a porta já
       estiver ocupada, a execução falha. */
    reuseExistingServer: false,
    timeout: 5 * 60 * 1000,
    env: {
      CI: '1',
      EXPO_PUBLIC_FIREBASE_AMBIENTE: 'teste',
      EXPO_NO_TELEMETRY: '1',
    },
  },
});
