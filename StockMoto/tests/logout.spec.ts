import type { Page } from '@playwright/test';

import { esperarRotaEstavel, existeSessaoSalva, expect, fazerLogin, test, urlDoCaminho, usuarioDoEmail } from './support/fixtures';
import { CONTEUDO_INTERNO } from './support/rotas';

/**
 * Logout real (signOut do Firebase) e encerramento seguro da sessão.
 * Usa os fixtures isolados: o Firebase Auth é um mock local.
 */

type Instrumentacao = {
  /** Quantas vezes a sessão salva do Firebase foi removida do IndexedDB. */
  __remocoesSessao: number;
  /** Se true, a remoção falha (simula erro do Firebase ao sair). */
  __falharRemocaoSessao: boolean;
  /** Se o texto "SAINDO..." chegou a aparecer na tela. */
  __viuSaindo: boolean;
  /** Se a tela de login apareceu desde o último zerarObservacao(). */
  __loginApareceu: boolean;
  /** Se alguma tela interna apareceu DEPOIS do login (exibição indevida). */
  __internoAposLogin: boolean;
};

/** Instala a instrumentação em todo carregamento da página. */
async function instrumentar(page: Page) {
  await page.addInitScript((padraoInterno: string) => {
    const w = window as unknown as Instrumentacao;
    w.__remocoesSessao = 0;
    w.__falharRemocaoSessao = false;
    w.__viuSaindo = false;
    w.__loginApareceu = false;
    w.__internoAposLogin = false;

    const remover = IDBObjectStore.prototype.delete;
    IDBObjectStore.prototype.delete = function (this: IDBObjectStore, chave: IDBValidKey | IDBKeyRange) {
      if (String(chave).startsWith('firebase:authUser')) {
        w.__remocoesSessao++;
        if (w.__falharRemocaoSessao) {
          throw new DOMException('Falha simulada ao remover a sessão', 'UnknownError');
        }
      }
      return remover.call(this, chave);
    };

    const interno = new RegExp(padraoInterno);
    new MutationObserver(() => {
      const texto = document.body?.innerText ?? '';
      if (texto.includes('SAINDO...')) w.__viuSaindo = true;
      if (texto.includes('ENTRAR NA CONTA')) w.__loginApareceu = true;
      else if (w.__loginApareceu && interno.test(texto)) w.__internoAposLogin = true;
    }).observe(document, { subtree: true, childList: true, characterData: true });
  }, CONTEUDO_INTERNO.source);
}

function lerInstrumentacao(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as Instrumentacao;
    return {
      remocoesSessao: w.__remocoesSessao,
      viuSaindo: w.__viuSaindo,
      internoAposLogin: w.__internoAposLogin,
    };
  });
}

/** Zera os registros de tela antes do logout (o login inicial não conta). */
function zerarObservacao(page: Page) {
  return page.evaluate(() => {
    const w = window as unknown as Instrumentacao;
    w.__viuSaindo = false;
    w.__loginApareceu = false;
    w.__internoAposLogin = false;
  });
}

/** uid da sessão salva pelo Firebase no navegador, ou null. */
function uidDaSessao(page: Page): Promise<string | null> {
  return page.evaluate(
    () =>
      new Promise<string | null>((resolve) => {
        const pedido = indexedDB.open('firebaseLocalStorageDb');
        pedido.onerror = () => resolve(null);
        pedido.onsuccess = () => {
          const banco = pedido.result;
          if (!banco.objectStoreNames.contains('firebaseLocalStorage')) return resolve(null);
          const todos = banco.transaction('firebaseLocalStorage').objectStore('firebaseLocalStorage').getAll();
          todos.onsuccess = () => {
            const sessao = (todos.result as { fbase_key: string; value: { uid: string } }[]).find((item) =>
              item.fbase_key.startsWith('firebase:authUser')
            );
            resolve(sessao?.value.uid ?? null);
          };
        };
      })
  );
}

async function abrirPerfil(page: Page) {
  await page.goto('/perfil');
  await expect(page.getByText('Editar Perfil')).toBeVisible();
}

const botaoSair = (page: Page) => page.getByText('SAIR', { exact: true });

/** Confere que a sessão terminou de fato: login visível, sem sessão salva. */
async function esperarSessaoEncerrada(page: Page) {
  await expect(page.getByText('ENTRAR NA CONTA')).toBeVisible();
  await esperarRotaEstavel(page, '/login');
  await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
  expect(await existeSessaoSalva(page), 'a sessão do Firebase ainda está salva').toBe(false);
}

test.describe('logout', () => {
  test.beforeEach(async ({ page }) => {
    await instrumentar(page);
  });

  test('usuário autenticado sai: o Firebase encerra a sessão e o app mostra o login', async ({ page }) => {
    await fazerLogin(page);
    await abrirPerfil(page);
    expect(await uidDaSessao(page)).toBe(usuarioDoEmail('e2e@exemplo.com').localId);
    await zerarObservacao(page);

    await botaoSair(page).click();

    await esperarSessaoEncerrada(page);
    const registro = await lerInstrumentacao(page);
    expect(registro.remocoesSessao, 'o signOut removeu a sessão uma única vez').toBe(1);
    expect(registro.viuSaindo, 'feedback "SAINDO..." exibido durante o encerramento').toBe(true);
    expect(registro.internoAposLogin, 'tela interna exibida depois do logout').toBe(false);
  });

  test('após sair, o acesso direto a rotas internas volta para o login', async ({ page }) => {
    await fazerLogin(page);
    await abrirPerfil(page);
    await botaoSair(page).click();
    await esperarSessaoEncerrada(page);

    for (const rota of ['/inicial', '/perfil', '/estoque']) {
      await page.goto(rota);
      await esperarSessaoEncerrada(page);
    }
  });

  test('após sair, o botão voltar não reabre telas internas', async ({ page }) => {
    await fazerLogin(page);
    // Navegação pelo próprio app: inicial > estoque > perfil (pelo cabeçalho).
    await page.getByText('Meu Estoque').click();
    await expect(page.getByText('MARCAS DE MOTOS')).toBeVisible();
    // As telas anteriores continuam montadas (ocultas) no Stack: usa o cabeçalho visível.
    await page.getByText('Moto Stock').filter({ visible: true }).click();
    await expect(page.getByText('Editar Perfil')).toBeVisible();

    await botaoSair(page).click();
    await esperarSessaoEncerrada(page);

    for (let i = 0; i < 4; i++) {
      await page.goBack().catch(() => undefined);
      if (!page.url().startsWith('http')) break; // saiu do app
      await page.waitForTimeout(800);
      await expect(page.locator('body')).not.toHaveText(CONTEUDO_INTERNO);
      await expect(page).not.toHaveURL(urlDoCaminho('/inicial'));
    }

    // Se o voltar saiu do app (about:blank), reabre o app: tem que cair no
    // login, sem sessão salva — o histórico não devolve a sessão.
    if (!page.url().startsWith('http')) await page.goto('/inicial');
    await esperarSessaoEncerrada(page);
  });

  test('cliques repetidos no Sair disparam um único encerramento', async ({ page }) => {
    await fazerLogin(page);
    await abrirPerfil(page);
    await zerarObservacao(page);

    // 5 cliques no mesmo instante, antes de a tela reagir ao primeiro.
    await botaoSair(page).evaluate((elemento) => {
      for (let i = 0; i < 5; i++) (elemento as HTMLElement).click();
    });

    await esperarSessaoEncerrada(page);
    const registro = await lerInstrumentacao(page);
    expect(registro.remocoesSessao, 'número de encerramentos executados').toBe(1);
    expect(registro.viuSaindo).toBe(true);
  });

  test('erro ao sair: avisa, mantém a sessão e a tela consistentes e permite tentar de novo', async ({ page }) => {
    await fazerLogin(page);
    await abrirPerfil(page);
    await page.evaluate(() => {
      (window as unknown as Instrumentacao).__falharRemocaoSessao = true;
    });

    await botaoSair(page).click();

    // A falha é informada e a tela volta ao estado normal, ainda autenticada.
    await expect(page.getByText('Não foi possível sair da conta. Tente novamente.')).toBeVisible();
    await expect(botaoSair(page)).toBeVisible();
    await expect(page.getByText('SAINDO...')).toHaveCount(0);
    await expect(page.getByText('Editar Perfil')).toBeVisible();
    await esperarRotaEstavel(page, '/perfil');
    expect(await existeSessaoSalva(page), 'a sessão continua salva após a falha').toBe(true);

    // Nova tentativa, sem a falha: sai normalmente e a mensagem some.
    await page.evaluate(() => {
      (window as unknown as Instrumentacao).__falharRemocaoSessao = false;
    });
    await botaoSair(page).click();
    await esperarSessaoEncerrada(page);
    await expect(page.getByText('Não foi possível sair da conta. Tente novamente.')).toHaveCount(0);
  });

  test('segundo usuário entra sem ver nome nem foto do primeiro', async ({ page }) => {
    const ana = usuarioDoEmail('ana@exemplo.com');
    const bruno = usuarioDoEmail('bruno@exemplo.com');

    // Chaves globais da versão anterior do app (sem dono): não podem vazar.
    await page.goto('/login');
    await page.evaluate(() => {
      localStorage.setItem('@nome', 'Nome Legado Compartilhado');
      localStorage.setItem('@imagem', 'data:image/png;base64,iVBORw0KGgo=');
    });

    // Ana entra e salva o próprio nome.
    await fazerLogin(page, ana.email);
    await abrirPerfil(page);
    await expect(page.getByPlaceholder('Nome Completo')).toHaveValue('Moto Stock');
    await page.getByPlaceholder('Nome Completo').fill('Ana Primeira');
    await page.getByText('SALVAR', { exact: true }).click();
    await page.goto('/inicial');
    await expect(page.getByText('Ana Primeira')).toBeVisible();

    // Ana sai e Bruno entra.
    await abrirPerfil(page);
    await botaoSair(page).click();
    await esperarSessaoEncerrada(page);
    await fazerLogin(page, bruno.email);
    expect(await uidDaSessao(page)).toBe(bruno.localId);

    for (const rota of ['/inicial', '/perfil']) {
      await page.goto(rota);
      await expect(page.getByText('Moto Stock').filter({ visible: true })).toBeVisible();
      await expect(page.locator('body')).not.toContainText('Ana Primeira');
      await expect(page.locator('body')).not.toContainText('Nome Legado Compartilhado');
    }
    await expect(page.getByPlaceholder('Nome Completo')).toHaveValue('Moto Stock');
    await expect(page.locator('img[src^="data:image/png"]')).toHaveCount(0);

    // Os dados de Ana não foram apagados (pertencem a ela), nem as chaves antigas.
    const armazenado = await page.evaluate(
      (uidAna) => ({
        nomeAna: localStorage.getItem(`@perfil:${uidAna}:nome`),
        legado: localStorage.getItem('@nome'),
      }),
      ana.localId
    );
    expect(armazenado).toEqual({ nomeAna: 'Ana Primeira', legado: 'Nome Legado Compartilhado' });

    // Bruno sai e Ana volta: o perfil dela é restaurado.
    await botaoSair(page).click();
    await esperarSessaoEncerrada(page);
    await fazerLogin(page, ana.email);
    await expect(page.getByText('Ana Primeira')).toBeVisible();
  });
});
