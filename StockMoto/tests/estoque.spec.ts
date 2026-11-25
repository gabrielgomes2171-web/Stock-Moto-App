import { test, expect } from '@playwright/test';
import { EstoquePage } from './pages/EstoquePage';
import { ativarModoE2E } from './pages/e2e';

test.describe('Estoque CG 160 FAN', () => {
  let estoque: EstoquePage;

  test.beforeEach(async ({ page }) => {
    await ativarModoE2E(page);
    estoque = new EstoquePage(page);
    await estoque.abrir('/estoquefan160');
  });

  // CT-01 - Consultar peça existente no estoque
  test('CT-01 - Pesquisa peça existente na CG 160 FAN', async ({ page }) => {
    await expect(page.getByText('CG 160 FAN', { exact: true }).first()).toBeVisible();
    await expect(estoque.peca('Pastilha de Freio')).toBeVisible();

    await estoque.buscar('Pastilha de Freio');

    await expect(estoque.peca('Pastilha de Freio')).toBeVisible();
    await expect(estoque.peca('Filtro de Óleo')).toHaveCount(0);
  });

  // CT-02 - Pesquisar peça inexistente
  test('CT-02 - Pesquisa peça inexistente na CG 160 FAN', async () => {
    await estoque.buscar('Peça Inexistente 999');

    await expect(estoque.peca('Pastilha de Freio')).toHaveCount(0);
    await expect(estoque.peca('Filtro de Óleo')).toHaveCount(0);
    await expect(estoque.listaVazia).toBeVisible();
  });
});
