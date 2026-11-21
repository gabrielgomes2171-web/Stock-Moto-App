import { esperarRotaEstavel, expect, fazerLogin, rotasVisitadas, test, urlDoCaminho } from './support/fixtures';
import { ROTAS_AUTENTICACAO, ROTAS_INTERNAS, caminhoSemQuery } from './support/rotas';

test.describe('com sessão', () => {
  test.beforeEach(async ({ page }) => {
    await fazerLogin(page);
  });

  for (const { rota, textos } of ROTAS_INTERNAS) {
    test(`acesso direto a ${rota} abre a tela`, async ({ page }) => {
      await page.goto(rota);

      for (const texto of textos) {
        await expect(page.getByText(texto, { exact: true }).first()).toBeVisible();
      }
      await esperarRotaEstavel(page, caminhoSemQuery(rota));
    });
  }

  test('"/" leva para /inicial', async ({ page }) => {
    await page.goto('/');

    await expect(page.getByText('Painel de Controle')).toBeVisible();
    await esperarRotaEstavel(page, '/inicial');
  });

  test('parâmetros da rota são preservados no acesso direto', async ({ page }) => {
    await page.goto('/editarorcamento?id=orcamento-teste');

    await expect(page.getByText('Salvar Alterações')).toBeVisible();
    expect(new URL(page.url()).searchParams.get('id')).toBe('orcamento-teste');
  });

  for (const { rota } of ROTAS_AUTENTICACAO) {
    test(`tela de autenticação ${rota} redireciona para /inicial`, async ({ page }) => {
      await page.goto(rota);

      await expect(page.getByText('Painel de Controle')).toBeVisible();
      await esperarRotaEstavel(page, '/inicial');
    });
  }

  test('navegação interna e botão voltar seguem o histórico', async ({ page }) => {
    await page.getByText('Meu Estoque').click();
    await expect(page).toHaveURL(urlDoCaminho('/estoque'));
    await page.getByText('HONDA', { exact: true }).click();
    await expect(page.getByText('ESCOLHA O MODELO')).toBeVisible();

    await page.goBack();
    await expect(page.getByText('MARCAS DE MOTOS')).toBeVisible();
    await expect(page).toHaveURL(urlDoCaminho('/estoque'));

    await page.goBack();
    await expect(page.getByText('Painel de Controle')).toBeVisible();
    await expect(page).toHaveURL(urlDoCaminho('/inicial'));
  });
});

test.describe('fluxos de autenticação', () => {
  test('login leva para /inicial e o voltar não reexibe telas de autenticação', async ({ page, firebase }) => {
    await page.goto('/esqueceu-senha');
    await page.getByText('Voltar para o Login').click();
    await expect(page).toHaveURL(urlDoCaminho('/login'));
    await page.getByPlaceholder('Email').fill('  E2E@Exemplo.com ');
    await page.getByPlaceholder('Senha').fill('senha-de-teste');
    await page.getByText('ENTRAR NA CONTA').click();

    await expect(page.getByText('Painel de Controle')).toBeVisible();
    expect(firebase.operacoes).toContain('signInWithPassword');

    // O histórico das telas de autenticação foi descartado: voltar sai do app
    // (about:blank) em vez de mostrar login ou recuperação de senha.
    await page.goBack();
    await expect(page).not.toHaveURL(/\/(login|esqueceu-senha)(\?|$)/);
    await expect(page.getByText('ENTRAR NA CONTA')).toHaveCount(0);
    await expect(page.getByText('ENVIAR INSTRUÇÕES')).toHaveCount(0);
  });

  test('cadastro autentica e termina em /inicial', async ({ page, firebase }) => {
    await page.goto('/cadastre-se');
    await page.getByPlaceholder('Nome Completo').fill('Teste E2E');
    await page.getByPlaceholder('Seu E-mail').fill('e2e@exemplo.com');
    await page.getByPlaceholder('Nova Senha').fill('senha123');
    await page.getByPlaceholder('Confirmar Senha').fill('senha123');
    await page.getByText('CADASTRAR').click();

    await expect(page.getByText('Painel de Controle')).toBeVisible();
    await esperarRotaEstavel(page, '/inicial');
    expect(firebase.operacoes).toContain('signUp');
  });

  test('recuperação de senha envia o pedido e abre /verificar-email', async ({ page, firebase }) => {
    await page.goto('/esqueceu-senha');
    await page.getByPlaceholder('Seu e-mail').fill('e2e@exemplo.com');
    await page.getByText('ENVIAR INSTRUÇÕES').click();

    await expect(page.getByText('Enviar novamente')).toBeVisible();
    await expect(page).toHaveURL(urlDoCaminho('/verificar-email'));
    expect(firebase.operacoes).toContain('sendOobCode');
  });

  test('redirecionamento de tela de autenticação não entra em loop', async ({ page }) => {
    await fazerLogin(page);
    await page.goto('/login');
    await esperarRotaEstavel(page, '/inicial');

    const rotas = await rotasVisitadas(page);
    expect(rotas.length, `rotas: ${rotas.join(' > ')}`).toBeLessThanOrEqual(5);
  });
});
