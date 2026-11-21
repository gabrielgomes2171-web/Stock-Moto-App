import { esperarRotaEstavel, expect, test } from './support/fixtures';
import { AVISO_DEMORA_MS, CONTEUDO_INTERNO, ROTAS_AUTENTICACAO, ROTAS_INTERNAS } from './support/rotas';

/** Usuário realmente deslogado: não existe sessão salva no navegador. */
test.describe('sem sessão', () => {
  for (const { rota } of [...ROTAS_INTERNAS, { rota: '/' }]) {
    test(`acesso direto a ${rota} redireciona para /login sem exibir a tela interna`, async ({ page, firebase }) => {
      await page.goto(rota);

      await expect(page.getByText('ENTRAR NA CONTA')).toBeVisible();
      await esperarRotaEstavel(page, '/login');
      await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
      // Sem sessão salva o Firebase não precisa validar nada na rede.
      expect(firebase.operacoes).not.toContain('lookup');
    });
  }

  for (const { rota, texto } of ROTAS_AUTENTICACAO) {
    test(`tela de autenticação ${rota} continua acessível`, async ({ page }) => {
      await page.goto(rota);

      await expect(page.getByText(texto)).toBeVisible();
      await esperarRotaEstavel(page, rota);
    });
  }

  test('confirmação de "sem sessão" é imediata e nada muda depois do limite de 10 s', async ({ page }) => {
    test.setTimeout(40_000);
    await page.goto('/estoque');

    // O Firebase confirma "sem usuário" na hora: login em poucos segundos.
    await expect(page.getByText('ENTRAR NA CONTA')).toBeVisible({ timeout: 5000 });

    // Passado o limite do aviso, continua no login: sem aviso de demora,
    // sem voltar à tela de carregamento e sem novo redirecionamento.
    await page.waitForTimeout(AVISO_DEMORA_MS + 2000);
    await expect(page.getByText('Verificando sua sessão...')).toHaveCount(0);
    await expect(page.getByText('Carregando...')).toHaveCount(0);
    await expect(page.getByText('ENTRAR NA CONTA')).toBeVisible();
    await esperarRotaEstavel(page, '/login');
  });

  test('rota inexistente mostra a tela "não encontrada" sem redirecionar', async ({ page }) => {
    const resposta = await page.goto('/rota-que-nao-existe');

    expect(resposta?.status()).toBe(404);
    await esperarRotaEstavel(page, '/rota-que-nao-existe');
    await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
  });
});
