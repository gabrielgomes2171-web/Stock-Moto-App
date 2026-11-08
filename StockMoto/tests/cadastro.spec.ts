
import { test, expect } from '@playwright/test';

// Ativar o modo de simulação antes de abrir o aplicativo
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__STOCKMOTO_E2E__ = true;
  });
});

// CT-02 - Impedir cadastro com campos obrigatórios vazios
test('CT-02 - Impede cadastro com campos obrigatórios vazios', async ({ page }) => {
  const gravacoesFirebase: string[] = [];

  // Monitorar tentativas de gravação no Firestore
  page.on('request', request => {
    const url = request.url();
    const metodo = request.method();

    if (
      url.includes('firestore.googleapis.com') &&
      ['POST', 'PATCH', 'DELETE'].includes(metodo)
    ) {
      gravacoesFirebase.push(`${metodo} ${url}`);
    }
  });

  await page.goto('/cadastrar');

  const campoNome = page.getByPlaceholder('Ex: Pastilha de Freio');
  const campoCodigo = page.getByPlaceholder('Ex: PF-001');

  await expect(campoNome).toBeVisible();
  await expect(campoCodigo).toBeVisible();

  await expect(campoNome).toHaveValue('');
  await expect(campoCodigo).toHaveValue('');

  // Tentar salvar sem preencher os campos
  await page.getByText('SALVAR', { exact: true }).click();

  // Verificar se os campos continuam vazios
  await expect(campoNome).toHaveValue('');
  await expect(campoCodigo).toHaveValue('');

  // Confirmar que não houve gravação no Firebase
  expect(gravacoesFirebase).toHaveLength(0);

  await expect(page).toHaveURL(/cadastrar/);
});

// CT-01 - Cadastrar produto com dados válidos
test('CT-01 - Cadastra produto com dados válidos', async ({ page }) => {
  await page.goto('/cadastrar');

  const campoNome = page.getByPlaceholder('Ex: Pastilha de Freio');
  const campoCodigo = page.getByPlaceholder('Ex: PF-001');

  // Preencher os campos obrigatórios
  await campoNome.fill('Pastilha de Freio Teste');
  await campoCodigo.fill('PF-TESTE-001');

  // Selecionar modelo da moto
  await page.locator('select').selectOption({
    label: 'CG 160 FAN',
  });

  // Salvar cadastro
  await page.getByText('SALVAR', { exact: true }).click();

  // Verificar se os campos foram limpos após o sucesso
  await expect(campoNome).toHaveValue('');
  await expect(campoCodigo).toHaveValue('');

  // Confirmar que permanece na tela de cadastro
  await expect(page).toHaveURL(/cadastrar/);
});
