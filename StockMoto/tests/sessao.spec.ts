import {
  apagarSessaoSalva,
  esperarRotaEstavel,
  existeSessaoSalva,
  expect,
  fazerLogin,
  rotasVisitadas,
  test,
  urlDoCaminho,
} from './support/fixtures';
import { CONTEUDO_INTERNO } from './support/rotas';

/** Tempo a partir do qual o app avisa que a verificação está demorando. */
const AVISO_DEMORA_MS = 10_000;

test.describe('sessão salva', () => {
  test.beforeEach(async ({ page }) => {
    await fazerLogin(page);
    expect(await existeSessaoSalva(page)).toBe(true);
  });

  test('recarregar uma rota interna mantém a rota e os parâmetros', async ({ page }) => {
    await page.goto('/editarorcamento?id=orcamento-teste');
    await expect(page.getByText('Salvar Alterações')).toBeVisible();

    await page.reload();

    await expect(page.getByText('Salvar Alterações')).toBeVisible();
    expect(new URL(page.url()).searchParams.get('id')).toBe('orcamento-teste');
    expect(await rotasVisitadas(page)).not.toContain('/login');
  });

  test('Firebase lento: avisa a demora, não redireciona e preserva a rota original', async ({ page, firebase }) => {
    test.setTimeout(60_000);
    firebase.modoValidacao = 'pendente';

    await page.goto('/estoque');
    await expect(page.getByText('Carregando...')).toBeVisible();

    // Após o limite: só um aviso; continua na rota pedida e sem conteúdo interno.
    await expect(page.getByText('Verificando sua sessão...')).toBeVisible({ timeout: AVISO_DEMORA_MS + 5000 });
    await expect(page.getByText('A conexão está demorando mais que o esperado.')).toBeVisible();
    await page.waitForTimeout(3000);
    await expect(page).toHaveURL(urlDoCaminho('/estoque'));
    await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
    await expect(page.getByText('ENTRAR NA CONTA')).toHaveCount(0);

    // O Firebase confirma a sessão: a navegação é liberada na rota original.
    await firebase.liberarValidacao();
    await expect(page.getByText('MARCAS DE MOTOS')).toBeVisible();
    await esperarRotaEstavel(page, '/estoque');
    await expect(page.getByText('Verificando sua sessão...')).toHaveCount(0);
    expect(await rotasVisitadas(page)).not.toContain('/login');
  });

  test('falha temporária de rede não desloga: o Firebase mantém a sessão', async ({ page, firebase }) => {
    firebase.modoValidacao = 'falha-rede';

    await page.goto('/configuracoes');

    await expect(page.getByText('Personalize o sistema conforme a sua necessidade')).toBeVisible();
    await esperarRotaEstavel(page, '/configuracoes');
    expect(await rotasVisitadas(page)).not.toContain('/login');
    expect(await existeSessaoSalva(page)).toBe(true);
  });

  test('sessão revogada (conta desativada) leva para /login e apaga a sessão', async ({ page, firebase }) => {
    firebase.modoValidacao = 'revogado';

    await page.goto('/estoque');

    await expect(page.getByText('ENTRAR NA CONTA')).toBeVisible();
    await esperarRotaEstavel(page, '/login');
    await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
    expect(await existeSessaoSalva(page)).toBe(false);
  });

  test('sessão perdida com o app aberto leva para /login e o voltar não reexibe telas internas', async ({ page }) => {
    await page.getByText('Meu Estoque').click();
    await page.getByText('HONDA', { exact: true }).click();
    await expect(page.getByText('ESCOLHA O MODELO')).toBeVisible();

    // Simula logout em outra aba / sessão removida: o Firebase detecta e avisa.
    await apagarSessaoSalva(page);

    await expect(page.getByText('ENTRAR NA CONTA')).toBeVisible({ timeout: 10_000 });
    await esperarRotaEstavel(page, '/login');

    for (let i = 0; i < 3; i++) {
      await page.goBack().catch(() => undefined);
      if (!page.url().startsWith('http')) break; // saiu do app
      await page.waitForTimeout(800);
      await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
    }
  });
});

test.describe('Firebase sem resposta', () => {
  test('sem confirmação do Firebase, o app aguarda com aviso e não libera nem redireciona', async ({ page }) => {
    test.setTimeout(60_000);
    // IndexedDB que nunca responde: o Firebase não consegue concluir a
    // verificação inicial da sessão.
    await page.context().addInitScript(() => {
      const pendente = {
        addEventListener() {},
        removeEventListener() {},
        set onsuccess(_v: unknown) {},
        set onerror(_v: unknown) {},
        set onupgradeneeded(_v: unknown) {},
        set onblocked(_v: unknown) {},
      };
      indexedDB.open = (() => pendente) as unknown as IDBFactory['open'];
    });

    await page.goto('/estoque');

    await expect(page.getByText('Verificando sua sessão...')).toBeVisible({ timeout: AVISO_DEMORA_MS + 5000 });
    await page.waitForTimeout(5000);
    await expect(page).toHaveURL(urlDoCaminho('/estoque'));
    await expect(page.getByText('Verificando sua sessão...')).toBeVisible();
    await expect(page.getByText('ENTRAR NA CONTA')).toHaveCount(0);
    await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
  });
});
