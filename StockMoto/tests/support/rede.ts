/**
 * Constantes de isolamento de rede dos testes E2E, compartilhadas entre
 * playwright.config.ts e tests/support/fixtures.ts.
 */

/**
 * Proxy inexistente (porta 9 local). Todo tráfego do navegador e das
 * requisições de API do Playwright é enviado a ele e falha; só o próprio
 * servidor de testes (localhost) é acessado diretamente. É a camada de rede:
 * mesmo que as rotas dos fixtures falhassem, nada sairia da máquina.
 */
export const PROXY_BLOQUEADO = {
  server: 'http://127.0.0.1:9',
  bypass: 'localhost,127.0.0.1,[::1]',
};

/**
 * Chave fictícia do projeto "demo-stockmoto", usada pelo build de testes
 * (EXPO_PUBLIC_FIREBASE_AMBIENTE=teste em firebase/firebaseConfig.js).
 */
export const CHAVE_API_TESTE = 'demo-api-key-stockmoto-testes';

/** Porta exclusiva do servidor de testes. */
export const PORTA_TESTES = 8935;
