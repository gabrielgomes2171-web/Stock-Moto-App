import { test } from '@playwright/test';
import { LoginPage } from './pages/LoginPage';

test.describe('Login', () => {
  let login: LoginPage;

  test.beforeEach(async ({ page }) => {
    login = new LoginPage(page);
  });

  // CT-01 - Impedir login com campos vazios
  test('CT-01 - Impede login com campos vazios', async () => {
    await login.abrir();
    await login.botaoEntrar.click();
    await login.esperarPermanecerNoLogin();
  });

  // CT-02 - Impedir login com credenciais inválidas
  test('CT-02 - Impede login com credenciais inválidas', async () => {
    await login.simularCredenciaisInvalidas();
    await login.abrir();
    await login.login('teste@stockmoto.com', 'senhaerrada123');
    await login.esperarPermanecerNoLogin();
  });
});
