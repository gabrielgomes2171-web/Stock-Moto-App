
import { test, expect } from '@playwright/test';

// CT-01 - Impedir login com campos vazios
test('CT-01 - Impede login com campos vazios', async ({ page }) => {
  await page.goto('/');

  // Verificar se os campos estão visíveis
  await expect(page.getByPlaceholder('Email')).toBeVisible();
  await expect(page.getByPlaceholder('Senha')).toBeVisible();

  // Tentar entrar sem preencher os campos
  await page.getByText('ENTRAR NA CONTA', { exact: true }).click();

  // Confirmar que permanece na tela de login
  await expect(page).toHaveURL(/login/);
});

// CT-02 - Impedir login com credenciais inválidas
test('CT-02 - Impede login com credenciais inválidas', async ({ page }) => {
  // Simular resposta de credenciais inválidas do Firebase
  await page.route('**/identitytoolkit.googleapis.com/**', async route => {
    if (route.request().url().includes('signInWithPassword')) {
      await route.fulfill({
        status: 400,
        contentType: 'application/json',
        body: JSON.stringify({
          error: {
            code: 400,
            message: 'INVALID_LOGIN_CREDENTIALS',
          },
        }),
      });
    } else {
      await route.continue();
    }
  });

  await page.goto('/');

  // Preencher credenciais inválidas
  await page.getByPlaceholder('Email').fill('teste@stockmoto.com');
  await page.getByPlaceholder('Senha').fill('senhaerrada123');

  // Tentar entrar
  await page.getByText('ENTRAR NA CONTA', { exact: true }).click();

  // Confirmar que permanece na tela de login
  await expect(page).toHaveURL(/login/, { timeout: 15000 });
});
