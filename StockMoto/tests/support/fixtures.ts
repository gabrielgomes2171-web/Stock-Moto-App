import { test as base, expect, type Page, type Route } from '@playwright/test';

/**
 * Fixtures dos testes E2E.
 *
 * Nenhuma requisição sai da máquina:
 * - identitytoolkit.googleapis.com (Firebase Auth) é respondido por um
 *   mock local, com um usuário fictício;
 * - qualquer outro host externo (Firestore etc.) é bloqueado.
 * Não há credenciais reais nem chamadas ao projeto Firebase.
 */

/** Como o mock responde à validação do usuário (accounts:lookup). */
export type ModoValidacao =
  | 'ok' // responde normalmente
  | 'pendente' // segura a resposta até liberarValidacao()
  | 'falha-rede' // derruba a conexão (Firebase: auth/network-request-failed)
  | 'revogado'; // conta desativada (Firebase invalida a sessão)

const USUARIO = { localId: 'uid-teste-e2e', email: 'e2e@exemplo.com' };
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};

export class FirebaseAuthMock {
  modoValidacao: ModoValidacao = 'ok';
  /** Operações do Auth recebidas pelo mock (ex.: signInWithPassword). */
  readonly operacoes: string[] = [];
  /** Hosts externos que o app tentou acessar e foram bloqueados. */
  readonly hostsBloqueados = new Set<string>();
  private pendentes: Route[] = [];

  async instalar(page: Page, baseURL: string) {
    const contexto = page.context();

    await contexto.route(
      (url) => !url.href.startsWith(baseURL),
      (route) => {
        this.hostsBloqueados.add(new URL(route.request().url()).host);
        return route.abort();
      }
    );

    await contexto.route('**/identitytoolkit.googleapis.com/**', (route) => {
      const requisicao = route.request();
      if (requisicao.method() === 'OPTIONS') {
        return route.fulfill({ status: 204, headers: CORS });
      }
      const operacao = new URL(requisicao.url()).pathname.split(':').pop() ?? '';
      this.operacoes.push(operacao);

      if (operacao === 'lookup') {
        if (this.modoValidacao === 'pendente') {
          this.pendentes.push(route);
          return;
        }
        if (this.modoValidacao === 'falha-rede') {
          return route.abort('internetdisconnected');
        }
        if (this.modoValidacao === 'revogado') {
          return responder(route, 400, { error: { code: 400, message: 'USER_DISABLED' } });
        }
      }
      return responderOperacao(route, operacao);
    });
  }

  /** Libera as validações seguradas no modo 'pendente'. */
  async liberarValidacao() {
    this.modoValidacao = 'ok';
    const pendentes = this.pendentes.splice(0);
    await Promise.all(pendentes.map((route) => responderOperacao(route, 'lookup')));
  }
}

function responder(route: Route, status: number, corpo: unknown) {
  return route.fulfill({ status, headers: CORS, body: JSON.stringify(corpo) });
}

function responderOperacao(route: Route, operacao: string) {
  const tokens = { idToken: 'id-token-falso', refreshToken: 'refresh-falso', expiresIn: '3600', ...USUARIO };
  switch (operacao) {
    case 'signInWithPassword':
    case 'signUp':
      return responder(route, 200, tokens);
    case 'lookup':
      return responder(route, 200, {
        users: [{ ...USUARIO, emailVerified: false, providerUserInfo: [], createdAt: '1', lastLoginAt: '1' }],
      });
    case 'sendOobCode':
      return responder(route, 200, { email: USUARIO.email });
    default:
      return responder(route, 400, { error: { code: 400, message: 'OPERACAO_NAO_MOCKADA' } });
  }
}

/**
 * Registra no navegador cada rota pela qual o app passa (pushState,
 * replaceState e voltar), para detectar redirecionamentos indevidos.
 */
function registrarHistorico() {
  const w = window as unknown as { __rotas: string[] };
  w.__rotas = [location.pathname];
  const registrar = () => w.__rotas.push(location.pathname);
  for (const metodo of ['pushState', 'replaceState'] as const) {
    const original = history[metodo];
    history[metodo] = function (this: History, ...args: Parameters<History['pushState']>) {
      const resultado = original.apply(this, args);
      registrar();
      return resultado;
    };
  }
  addEventListener('popstate', registrar);
}

export const test = base.extend<{ firebase: FirebaseAuthMock }>({
  // auto: true => instalado em TODO teste e hook (beforeEach incluído),
  // mesmo que o teste não peça o fixture. Sem isso, um teste que só usa
  // `page` poderia acessar o Firebase real.
  firebase: [
    async ({ page, baseURL }, use) => {
      const mock = new FirebaseAuthMock();
      await page.context().addInitScript(registrarHistorico);
      await mock.instalar(page, baseURL!);
      await use(mock);
    },
    { auto: true },
  ],
});

export { expect };

/** Rotas registradas desde o último carregamento da página. */
export function rotasVisitadas(page: Page): Promise<string[]> {
  return page.evaluate(() => (window as unknown as { __rotas: string[] }).__rotas);
}

/** Espera a URL e confirma que nenhuma nova navegação acontece depois. */
export async function esperarRotaEstavel(page: Page, caminho: string) {
  await expect(page).toHaveURL(urlDoCaminho(caminho));
  const antes = (await rotasVisitadas(page)).length;
  await page.waitForTimeout(1000);
  expect(await rotasVisitadas(page), `navegou novamente depois de chegar em ${caminho}`).toHaveLength(antes);
  await expect(page).toHaveURL(urlDoCaminho(caminho));
}

export function urlDoCaminho(caminho: string) {
  const escapado = caminho.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  return new RegExp(`^[^?#]+//[^/]+${escapado}(\\?.*)?$`);
}

/** Faz login pela tela de login (Auth mockado) e espera chegar em /inicial. */
export async function fazerLogin(page: Page) {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill('e2e@exemplo.com');
  await page.getByPlaceholder('Senha').fill('senha-de-teste');
  await page.getByText('ENTRAR NA CONTA').click();
  await expect(page.getByText('Painel de Controle')).toBeVisible();
  await expect(page).toHaveURL(urlDoCaminho('/inicial'));
}

/** true se existe sessão do Firebase salva no IndexedDB do navegador. */
export function existeSessaoSalva(page: Page): Promise<boolean> {
  return page.evaluate(
    () =>
      new Promise<boolean>((resolve) => {
        const pedido = indexedDB.open('firebaseLocalStorageDb');
        pedido.onerror = () => resolve(false);
        pedido.onsuccess = () => {
          const banco = pedido.result;
          if (!banco.objectStoreNames.contains('firebaseLocalStorage')) return resolve(false);
          const todos = banco.transaction('firebaseLocalStorage').objectStore('firebaseLocalStorage').getAll();
          todos.onsuccess = () =>
            resolve(todos.result.some((item: { fbase_key: string }) => item.fbase_key.startsWith('firebase:authUser')));
        };
      })
  );
}

/** Apaga a sessão salva por fora do app (como um logout em outra aba). */
export function apagarSessaoSalva(page: Page): Promise<void> {
  return page.evaluate(
    () =>
      new Promise<void>((resolve) => {
        const pedido = indexedDB.open('firebaseLocalStorageDb');
        pedido.onsuccess = () => {
          const loja = pedido.result.transaction('firebaseLocalStorage', 'readwrite').objectStore('firebaseLocalStorage');
          const todos = loja.getAll();
          todos.onsuccess = () => {
            for (const item of todos.result as { fbase_key: string }[]) {
              if (item.fbase_key.startsWith('firebase:authUser')) loja.delete(item.fbase_key);
            }
            resolve();
          };
        };
      })
  );
}
