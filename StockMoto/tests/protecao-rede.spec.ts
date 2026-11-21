import { expect, test } from './support/fixtures';

/**
 * Verifica a própria proteção de rede dos testes, com tentativas
 * deliberadas de acesso externo.
 *
 * O destino é um domínio ".invalid" (reservado pela RFC 2606, nunca existe
 * na internet): mesmo que uma tentativa escapasse da proteção, não haveria
 * para onde ir. Cada teste retira as tentativas registradas com
 * consumirViolacoes() e confere que foram bloqueadas.
 */
const EXTERNO = 'http://servidor-externo.invalid';

test.describe('proteção de rede dos testes', () => {
  test('fetch, XHR, imagem e beacon externos são bloqueados e registrados', async ({ page, rede }) => {
    await page.goto('/login');

    const resultado = await page.evaluate(async (externo) => {
      const fetchPassou = await fetch(`${externo}/fetch`).then(
        () => true,
        () => false
      );
      const xhrPassou = await new Promise<boolean>((resolve) => {
        const xhr = new XMLHttpRequest();
        xhr.open('GET', `${externo}/xhr`);
        xhr.onload = () => resolve(true);
        xhr.onerror = () => resolve(false);
        xhr.send();
      });
      const imagemCarregou = await new Promise<boolean>((resolve) => {
        const imagem = new Image();
        imagem.onload = () => resolve(true);
        imagem.onerror = () => resolve(false);
        imagem.src = `${externo}/imagem.png`;
      });
      navigator.sendBeacon(`${externo}/beacon`, 'dados');
      return { fetchPassou, xhrPassou, imagemCarregou };
    }, EXTERNO);
    await page.waitForTimeout(500);

    expect(resultado).toEqual({ fetchPassou: false, xhrPassou: false, imagemCarregou: false });
    const urls = rede.consumirViolacoes().map((v) => `${v.tipo} ${v.url}`);
    for (const caminho of ['fetch', 'xhr', 'imagem.png', 'beacon']) {
      expect(urls).toContain(`http ${EXTERNO}/${caminho}`);
    }
  });

  test('WebSocket externo é bloqueado e registrado', async ({ page, rede }) => {
    await page.goto('/login');

    const conectou = await page.evaluate(
      (url) =>
        new Promise<boolean>((resolve) => {
          const socket = new WebSocket(url);
          socket.onopen = () => resolve(true);
          socket.onclose = () => resolve(false);
        }),
      `${EXTERNO.replace('http', 'ws')}/socket`
    );

    expect(conectou).toBe(false);
    expect(rede.consumirViolacoes()).toEqual([{ tipo: 'websocket', url: 'ws://servidor-externo.invalid/socket' }]);
  });

  test('fixture request só acessa o servidor de testes', async ({ request, rede }) => {
    // Uso legítimo continua funcionando.
    const login = await request.get('/login');
    expect(login.status()).toBe(200);

    await expect(request.get(`${EXTERNO}/api`)).rejects.toThrow('Requisição externa bloqueada pelos testes');
    expect(rede.consumirViolacoes()).toEqual([{ tipo: 'api', url: `${EXTERNO}/api` }]);
  });

  test('page.request e context.request também ficam restritos', async ({ page, rede }) => {
    await expect(page.request.post(`${EXTERNO}/pagina`)).rejects.toThrow('bloqueada');
    await expect(page.context().request.get(`${EXTERNO}/contexto`)).rejects.toThrow('bloqueada');

    expect(rede.consumirViolacoes().map((v) => v.url)).toEqual([`${EXTERNO}/pagina`, `${EXTERNO}/contexto`]);
  });

  test('browser.newContext(), browser.newPage() e novas abas nascem protegidos', async ({ browser, page, rede }) => {
    const contextoNovo = await browser.newContext();
    const paginaAvulsa = await browser.newPage();
    const novaAba = await page.context().newPage();

    for (const [nome, pagina] of [
      ['novo-contexto', await contextoNovo.newPage()],
      ['nova-pagina', paginaAvulsa],
      ['nova-aba', novaAba],
    ] as const) {
      await expect(pagina.goto(`${EXTERNO}/${nome}`)).rejects.toThrow();
    }
    await expect(contextoNovo.request.get(`${EXTERNO}/api-novo-contexto`)).rejects.toThrow('bloqueada');

    expect(rede.consumirViolacoes().map((v) => v.url)).toEqual([
      `${EXTERNO}/novo-contexto`,
      `${EXTERNO}/nova-pagina`,
      `${EXTERNO}/nova-aba`,
      `${EXTERNO}/api-novo-contexto`,
    ]);
    await contextoNovo.close();
    await paginaAvulsa.close();
  });

  test('service workers são bloqueados', async ({ page, context }) => {
    await page.goto('/login');
    // Serve um service worker válido na própria origem: sem o bloqueio, o
    // registro devolveria um ServiceWorkerRegistration e o worker subiria.
    await page.route('**/sw-de-teste.js', (route) =>
      route.fulfill({ contentType: 'text/javascript', body: 'self.addEventListener("fetch", () => {});' })
    );

    // Com serviceWorkers: 'block', o Playwright troca register() por uma
    // função que não registra nada e devolve undefined.
    const registro = await page.evaluate(async () => {
      const resultado = await navigator.serviceWorker.register('/sw-de-teste.js');
      return resultado === undefined ? 'nenhum registro' : `registrado (escopo ${resultado.scope})`;
    });
    await page.waitForTimeout(1000);

    expect(registro).toBe('nenhum registro');
    expect(context.serviceWorkers()).toHaveLength(0);
    expect(await page.evaluate(() => navigator.serviceWorker.getRegistrations().then((r) => r.length))).toBe(0);
  });

  test('chamada ao Firebase Auth com chave que não é de teste é rejeitada', async ({ page, rede, firebase }) => {
    await page.goto('/login');
    // Chave fictícia no formato das chaves reais (AIza...). A requisição é
    // interceptada localmente e não sai da máquina.
    const passou = await page.evaluate(() =>
      fetch('https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=AIza-chave-ficticia', { method: 'POST' }).then(
        () => true,
        () => false
      )
    );

    expect(passou).toBe(false);
    expect(firebase.operacoes).not.toContain('lookup');
    expect(rede.consumirViolacoes()).toEqual([
      { tipo: 'chave-api', url: 'https://identitytoolkit.googleapis.com/v1/accounts:lookup?key=***' },
    ]);
  });

  test('camada de proxy: sem as rotas dos fixtures, o tráfego externo também não sai', async ({ page, context }) => {
    // Remove as rotas de proteção SÓ neste teste para comprovar a segunda
    // camada. Com proxy, o erro é de conexão com o proxy (não de DNS).
    await context.unrouteAll({ behavior: 'ignoreErrors' });

    const erro = await page.goto(`${EXTERNO}/sem-rotas`).then(
      () => 'carregou',
      (e: Error) => e.message
    );

    expect(erro).toMatch(/proxy/i);
  });

  test.describe('falha da suíte', () => {
    // Este teste TEM que falhar: faz uma requisição externa sem consumi-la,
    // e o fixture `rede` reprova o teste ao final.
    test.fail();
    test('tentativa externa não autorizada reprova o teste', async ({ page }) => {
      await page.goto('/login');
      await page.evaluate((externo) => fetch(`${externo}/nao-autorizado`).catch(() => undefined), EXTERNO);
    });
  });
});
