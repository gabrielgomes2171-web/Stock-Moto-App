import {
  test as base,
  expect,
  type APIRequestContext,
  type Browser,
  type BrowserContext,
  type BrowserType,
  type Page,
  type Route,
} from '@playwright/test';

import { CHAVE_API_TESTE, PROXY_BLOQUEADO } from './rede';

/**
 * Fixtures dos testes E2E — isolamento total de rede.
 *
 * Camadas (qualquer uma sozinha já impede acesso ao Firebase de produção):
 * 1. Build de teste com projeto fictício "demo-stockmoto" (verificado antes
 *    de o servidor subir: tests/support/verificar-build-teste.mjs).
 * 2. Proxy inexistente + service workers bloqueados (playwright.config.ts e
 *    forçados aqui em todo contexto criado).
 * 3. Estes fixtures: TODO contexto (o padrão, os de browser.newContext(),
 *    browser.newPage(), launch manual), suas abas, WebSockets e as
 *    requisições de API do Playwright só alcançam a origem do app. O
 *    Firebase Auth é respondido por um mock local; o Firestore recebe uma
 *    falha local (como se estivesse offline).
 *
 * Qualquer outra tentativa de comunicação externa é bloqueada, registrada e
 * FAZ O TESTE FALHAR ao final (fixture `rede`).
 */

/** Como o mock responde à validação do usuário (accounts:lookup). */
export type ModoValidacao =
  | 'ok' // responde normalmente
  | 'pendente' // segura a resposta até liberarValidacao()
  | 'falha-rede' // derruba a conexão (Firebase: auth/network-request-failed)
  | 'revogado'; // conta desativada (Firebase invalida a sessão)

export type Violacao = {
  tipo: 'http' | 'websocket' | 'api' | 'chave-api';
  url: string;
};

/** Usuário padrão dos testes. Outros e-mails viram usuários fictícios distintos. */
export const EMAIL_PADRAO = 'e2e@exemplo.com';

/** Usuário fictício correspondente a um e-mail (uid estável por e-mail). */
export function usuarioDoEmail(email: string) {
  const normalizado = email.trim().toLowerCase();
  const localId = normalizado === EMAIL_PADRAO ? 'uid-teste-e2e' : `uid-${normalizado.replace(/[^a-z0-9]/g, '-')}`;
  return { localId, email: normalizado };
}

const PREFIXO_TOKEN = 'id-token-falso:';
/** E-mail de cada uid que já entrou (para responder accounts:lookup). */
const emailsPorUid = new Map<string, string>([[usuarioDoEmail(EMAIL_PADRAO).localId, EMAIL_PADRAO]]);
const CORS = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': '*',
  'Content-Type': 'application/json',
};
const HOST_AUTH = 'identitytoolkit.googleapis.com';
const HOST_FIRESTORE = 'firestore.googleapis.com';
const CONECTIVIDADE_FIRESTORE = '/images/cleardot.gif';

/** Opções aplicadas a todo contexto criado durante os testes. */
const OPCOES_OBRIGATORIAS = {
  serviceWorkers: 'block' as const,
  proxy: PROXY_BLOQUEADO,
};

/**
 * Tentativas não autorizadas do teste em execução. Cada worker é um
 * processo e roda um teste por vez, então a lista é zerada a cada teste.
 */
const violacoes: Violacao[] = [];

function registrar(tipo: Violacao['tipo'], url: string) {
  violacoes.push({ tipo, url: ocultarChave(url) });
}

function ocultarChave(url: string) {
  return url.replace(/([?&]key=)[^&]+/, '$1***');
}

export class FirebaseAuthMock {
  modoValidacao: ModoValidacao = 'ok';
  /** Operações do Auth recebidas pelo mock (ex.: signInWithPassword). */
  readonly operacoes: string[] = [];
  /** Requisições ao Firestore, respondidas localmente com falha. */
  requisicoesFirestore = 0;
  private pendentes: Route[] = [];

  /** Trata uma requisição para fora da origem do app. */
  tratarExterna(route: Route) {
    const url = new URL(route.request().url());

    if (url.host === HOST_AUTH) return this.responderAuth(route, url);

    // Firestore e o teste de conectividade do WebChannel que o SDK do
    // Firestore faz quando a conexão falha (imagem fixa do google.com).
    // Ambos recebem uma falha local, como se o aparelho estivesse offline.
    if (url.host === HOST_FIRESTORE || (url.host === 'www.google.com' && url.pathname === CONECTIVIDADE_FIRESTORE)) {
      this.requisicoesFirestore++;
      return route.abort('internetdisconnected');
    }

    registrar('http', url.href);
    return route.abort('blockedbyclient');
  }

  private responderAuth(route: Route, url: URL) {
    if (route.request().method() === 'OPTIONS') {
      return route.fulfill({ status: 204, headers: CORS });
    }
    // Só o build de teste (projeto demo-) é aceito pelo mock.
    if (url.searchParams.get('key') !== CHAVE_API_TESTE) {
      registrar('chave-api', url.href);
      return route.abort('blockedbyclient');
    }

    const operacao = url.pathname.split(':').pop() ?? '';
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
  const corpo = (route.request().postDataJSON() ?? {}) as { email?: string; idToken?: string };
  switch (operacao) {
    case 'signInWithPassword':
    case 'signUp': {
      // Cada e-mail é um usuário distinto; o uid vai dentro do token falso.
      const usuario = usuarioDoEmail(corpo.email ?? EMAIL_PADRAO);
      emailsPorUid.set(usuario.localId, usuario.email);
      return responder(route, 200, {
        idToken: PREFIXO_TOKEN + usuario.localId,
        refreshToken: 'refresh-falso',
        expiresIn: '3600',
        ...usuario,
      });
    }
    case 'lookup': {
      const localId = corpo.idToken?.startsWith(PREFIXO_TOKEN)
        ? corpo.idToken.slice(PREFIXO_TOKEN.length)
        : usuarioDoEmail(EMAIL_PADRAO).localId;
      const email = emailsPorUid.get(localId) ?? EMAIL_PADRAO;
      return responder(route, 200, {
        users: [{ localId, email, emailVerified: false, providerUserInfo: [], createdAt: '1', lastLoginAt: '1' }],
      });
    }
    case 'sendOobCode':
      return responder(route, 200, { email: corpo.email ?? EMAIL_PADRAO });
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
  const registrarRota = () => w.__rotas.push(location.pathname);
  for (const metodo of ['pushState', 'replaceState'] as const) {
    const original = history[metodo];
    history[metodo] = function (this: History, ...args: Parameters<History['pushState']>) {
      const resultado = original.apply(this, args);
      registrarRota();
      return resultado;
    };
  }
  addEventListener('popstate', registrarRota);
}

// ---------------------------------------------------------------------------
// Proteção de contextos, navegadores e requisições de API
// ---------------------------------------------------------------------------

const mocksPorContexto = new WeakMap<BrowserContext, Promise<FirebaseAuthMock>>();
const apisProtegidas = new WeakSet<APIRequestContext>();
const browsersProtegidos = new WeakSet<Browser>();

/** Instala a proteção num contexto (idempotente) e devolve o mock do Auth. */
function protegerContexto(contexto: BrowserContext, origem: string): Promise<FirebaseAuthMock> {
  let pronto = mocksPorContexto.get(contexto);
  if (!pronto) {
    pronto = (async () => {
      const mock = new FirebaseAuthMock();
      await contexto.routeWebSocket(
        () => true,
        (ws) => {
          registrar('websocket', ws.url());
          return ws.close({ code: 1008, reason: 'Bloqueado pelos testes' });
        }
      );
      await contexto.route(
        (url) => url.origin !== origem,
        (route) => mock.tratarExterna(route)
      );
      await contexto.addInitScript(registrarHistorico);
      protegerApi(contexto.request, origem);
      return mock;
    })();
    mocksPorContexto.set(contexto, pronto);
  }
  return pronto;
}

const METODOS_API = ['fetch', 'get', 'post', 'put', 'patch', 'delete', 'head'] as const;

/** Restringe um APIRequestContext à origem do app (idempotente). */
function protegerApi(api: APIRequestContext, origem: string): APIRequestContext {
  if (apisProtegidas.has(api)) return api;
  apisProtegidas.add(api);
  for (const metodo of METODOS_API) {
    const original = api[metodo].bind(api) as (...args: unknown[]) => Promise<unknown>;
    Object.defineProperty(api, metodo, {
      value: (alvo: string | { url(): string }, ...resto: unknown[]) => {
        const url = new URL(typeof alvo === 'string' ? alvo : alvo.url(), origem);
        if (url.origin !== origem) {
          registrar('api', url.href);
          return Promise.reject(new Error(`Requisição externa bloqueada pelos testes: ${ocultarChave(url.href)}`));
        }
        return original(alvo, ...resto);
      },
    });
  }
  return api;
}

/** Faz todo contexto criado por este navegador nascer protegido. */
function protegerBrowser(browser: Browser, origem: string) {
  if (browsersProtegidos.has(browser)) return;
  browsersProtegidos.add(browser);
  const novoContexto = browser.newContext.bind(browser);
  // browser.newPage() usa this.newContext() internamente, então também é coberto.
  browser.newContext = async (opcoes = {}) => {
    const contexto = await novoContexto({ ...opcoes, ...OPCOES_OBRIGATORIAS });
    await protegerContexto(contexto, origem);
    return contexto;
  };
}

/** Garante a proteção também em navegadores lançados manualmente. */
function protegerTipoDeNavegador(tipo: BrowserType, origem: string) {
  const launch = tipo.launch.bind(tipo);
  tipo.launch = async (opcoes = {}) => {
    // Proxy no nível do navegador: cobre também o tráfego de segundo plano.
    const browser = await launch({ ...opcoes, proxy: PROXY_BLOQUEADO });
    protegerBrowser(browser, origem);
    return browser;
  };
  const connect = tipo.connect.bind(tipo) as BrowserType['connect'];
  tipo.connect = (async (...args: Parameters<BrowserType['connect']>) => {
    const browser = await connect(...args);
    protegerBrowser(browser, origem);
    return browser;
  }) as BrowserType['connect'];
  const connectOverCDP = tipo.connectOverCDP.bind(tipo) as BrowserType['connectOverCDP'];
  tipo.connectOverCDP = (async (...args: Parameters<BrowserType['connectOverCDP']>) => {
    const browser = await connectOverCDP(...args);
    protegerBrowser(browser, origem);
    return browser;
  }) as BrowserType['connectOverCDP'];
  const persistente = tipo.launchPersistentContext.bind(tipo);
  tipo.launchPersistentContext = async (pasta, opcoes = {}) => {
    const contexto = await persistente(pasta, { ...opcoes, ...OPCOES_OBRIGATORIAS });
    await protegerContexto(contexto, origem);
    return contexto;
  };
}

/** Controle das tentativas de comunicação externa do teste atual. */
export type ControleRede = {
  /** Retira e devolve as tentativas registradas (para testes da própria proteção). */
  consumirViolacoes(): Violacao[];
};

export const test = base.extend<
  { firebase: FirebaseAuthMock; rede: ControleRede },
  { _protecaoWorker: { origem: string } }
>({
  // Worker: protege launch/connect e as requisições de API antes de
  // qualquer navegador ou fixture `request` ser criado.
  _protecaoWorker: [
    async ({ playwright }, use, workerInfo) => {
      const baseURL = workerInfo.project.use.baseURL;
      if (!baseURL) throw new Error('baseURL é obrigatório para isolar a rede dos testes');
      const origem = new URL(baseURL).origin;

      for (const tipo of [playwright.chromium, playwright.firefox, playwright.webkit]) {
        protegerTipoDeNavegador(tipo, origem);
      }
      const novaApi = playwright.request.newContext.bind(playwright.request);
      playwright.request.newContext = async (opcoes = {}) =>
        protegerApi(await novaApi({ ...opcoes, proxy: PROXY_BLOQUEADO }), origem);

      await use({ origem });
    },
    { scope: 'worker', auto: true },
  ],

  // Caso o navegador padrão tenha sido criado antes do patch acima.
  browser: [
    async ({ browser, _protecaoWorker }, use) => {
      protegerBrowser(browser, _protecaoWorker.origem);
      await use(browser);
    },
    { scope: 'worker' },
  ],

  // Contexto padrão dos testes (também cobre o modo de reuso do --ui).
  context: async ({ context, _protecaoWorker }, use) => {
    await protegerContexto(context, _protecaoWorker.origem);
    await use(context);
  },

  // Falha o teste se houve qualquer tentativa externa não autorizada.
  // auto: true => vale para todo teste e hook, mesmo que não o peçam.
  rede: [
    async ({}, use) => {
      violacoes.length = 0;
      await use({ consumirViolacoes: () => violacoes.splice(0) });
      expect(violacoes, 'Tentativas de comunicação externa não autorizadas').toEqual([]);
    },
    { auto: true },
  ],

  // Mock do Firebase Auth do contexto padrão. auto: true => instalado
  // antes de qualquer hook (beforeEach incluído).
  firebase: [
    async ({ context, _protecaoWorker }, use) => {
      await use(await protegerContexto(context, _protecaoWorker.origem));
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
export async function fazerLogin(page: Page, email = EMAIL_PADRAO) {
  await page.goto('/login');
  await page.getByPlaceholder('Email').fill(email);
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
