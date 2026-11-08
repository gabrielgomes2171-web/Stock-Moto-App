
import { test, expect } from '@playwright/test';

// Ativar simulação antes de abrir o aplicativo
test.beforeEach(async ({ page }) => {
  await page.addInitScript(() => {
    (window as any).__STOCKMOTO_E2E__ = true;
  });
});

// CT-01 - Consultar peça existente no estoque
test('CT-01 - Pesquisa peça existente na CG 160 FAN', async ({ page }) => {
  await page.goto('/estoquefan160');

  // Confirmar que a tela do modelo foi carregada
  await expect(
    page.getByText('CG 160 FAN', { exact: true }).first()
  ).toBeVisible();

  // Confirmar que as peças simuladas foram carregadas
  await expect(
    page.getByText('Pastilha de Freio', { exact: true })
  ).toBeVisible();

  // Pesquisar pelo nome da peça
  const campoBusca = page.getByPlaceholder('Buscar peça');

  await campoBusca.fill('Pastilha de Freio');

  // A peça pesquisada deve aparecer
  await expect(
    page.getByText('Pastilha de Freio', { exact: true })
  ).toBeVisible();

  // A outra peça não deve aparecer
  await expect(
    page.getByText('Filtro de Óleo', { exact: true })
  ).toHaveCount(0);
});

// CT-02 - Pesquisar peça inexistente
test('CT-02 - Pesquisa peça inexistente na CG 160 FAN', async ({ page }) => {
  await page.goto('/estoquefan160');

  const campoBusca = page.getByPlaceholder('Buscar peça');

  await expect(campoBusca).toBeVisible();

  // Pesquisar uma peça que não existe
  await campoBusca.fill('Peça Inexistente 999');

  // Nenhuma peça deve aparecer
  await expect(
    page.getByText('Pastilha de Freio', { exact: true })
  ).toHaveCount(0);

  await expect(
    page.getByText('Filtro de Óleo', { exact: true })
  ).toHaveCount(0);

  // Deve aparecer a mensagem de lista vazia
  await expect(
    page.getByText('Nenhuma peça cadastrada', { exact: true })
  ).toBeVisible();
});
