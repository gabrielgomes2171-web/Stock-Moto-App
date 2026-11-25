# Evidências: testes Playwright do StockMoto

Entrega da aula de 17/11/2026 (Engenharia de Requisitos, Teste e Qualidade de Software).

## Page Object Model
Cada Page Object fica em `tests/pages/` e é usado por pelo menos 2 testes:

| Page Object | Usado por |
|---|---|
| `LoginPage.ts` | `login.spec.ts`: CT-01 (campos vazios) e CT-02 (credenciais inválidas) |
| `CadastroPage.ts` | `cadastro.spec.ts`: CT-01 (dados válidos) e CT-02 (campos obrigatórios vazios) |
| `EstoquePage.ts` | `estoque.spec.ts`: CT-01 (peça existente) e CT-02 (peça inexistente) |

Os locators filtram só os elementos visíveis (`filter({ visible: true })`), porque no web o expo-router pode manter uma cópia escondida da tela na pilha de navegação.

## Evidências desta execução (6 passed)
- **HTML Report:** `playwright-report/index.html` (abra com `npx playwright show-report evidencias/playwright-report`)
- **Trace:** `trace-login-credenciais-invalidas.zip` (abra com `npx playwright show-trace evidencias/trace-login-credenciais-invalidas.zip`)
- **Screenshot:** `screenshot-login-credenciais-invalidas.png`

O relatório também traz o trace de cada um dos 6 testes, porque a configuração usa `trace: 'on'`.

## Como rodar
```bash
cd StockMoto
npm install
npx playwright install chromium
npx playwright test --reporter=html
npx playwright show-report
```
Se o Expo mostrar "Requiring unknown module", limpe o cache: `npx expo start --web --clear`.
