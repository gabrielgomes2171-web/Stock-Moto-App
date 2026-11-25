import { test, expect } from '@playwright/test';
import { CadastroPage } from './pages/CadastroPage';
import { ativarModoE2E } from './pages/e2e';

test.describe('Cadastro de peças', () => {
  let cadastro: CadastroPage;

  test.beforeEach(async ({ page }) => {
    await ativarModoE2E(page);
    cadastro = new CadastroPage(page);
  });

  // CT-02 - Impedir cadastro com campos obrigatórios vazios
  test('CT-02 - Impede cadastro com campos obrigatórios vazios', async ({ page }) => {
    const gravacoesFirebase: string[] = [];

    // Monitorar tentativas de gravação no Firestore
    page.on('request', request => {
      const url = request.url();
      if (url.includes('firestore.googleapis.com') && ['POST', 'PATCH', 'DELETE'].includes(request.method())) {
        gravacoesFirebase.push(`${request.method()} ${url}`);
      }
    });

    await cadastro.abrir();
    await cadastro.esperarCamposVazios();

    // Tentar salvar sem preencher os campos
    await cadastro.salvar();

    await cadastro.esperarCamposVazios();
    expect(gravacoesFirebase).toHaveLength(0);
    await expect(page).toHaveURL(/cadastrar/);
  });

  // CT-01 - Cadastrar produto com dados válidos
  test('CT-01 - Cadastra produto com dados válidos', async ({ page }) => {
    await cadastro.abrir();
    await cadastro.preencher('Pastilha de Freio Teste', 'PF-TESTE-001', 'CG 160 FAN');
    await cadastro.salvar();

    // Campos limpos após o sucesso e continua na tela de cadastro
    await cadastro.esperarCamposVazios();
    await expect(page).toHaveURL(/cadastrar/);
  });
});
