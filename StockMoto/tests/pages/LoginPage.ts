import { type Page, type Locator, expect } from '@playwright/test';

/**
 * Page Object da tela de Login.
 * Guarda os locators, expõe ações e centraliza a manutenção:
 * se o botão ou os campos mudarem, corrige só aqui.
 */
export class LoginPage {
  readonly page: Page;
  readonly campoEmail: Locator;
  readonly campoSenha: Locator;
  readonly botaoEntrar: Locator;

  constructor(page: Page) {
    this.page = page;
    // No web, o expo-router pode manter uma cópia escondida da tela na pilha de navegação.
    // Filtrar por elementos visíveis deixa o locator robusto contra isso.
    this.campoEmail = page.getByPlaceholder('Email').filter({ visible: true }).first();
    this.campoSenha = page.getByPlaceholder('Senha').filter({ visible: true }).first();
    this.botaoEntrar = page.getByText('ENTRAR NA CONTA', { exact: true }).filter({ visible: true }).first();
  }

  async abrir() {
    await this.page.goto('/');
    await expect(this.campoEmail).toBeVisible();
    await expect(this.campoSenha).toBeVisible();
  }

  async login(email: string, senha: string) {
    await this.campoEmail.fill(email);
    await this.campoSenha.fill(senha);
    await this.botaoEntrar.click();
  }

  /** Simula a resposta do Firebase Auth para credenciais inválidas. */
  async simularCredenciaisInvalidas() {
    await this.page.route('**/identitytoolkit.googleapis.com/**', async route => {
      if (route.request().url().includes('signInWithPassword')) {
        await route.fulfill({
          status: 400,
          contentType: 'application/json',
          body: JSON.stringify({ error: { code: 400, message: 'INVALID_LOGIN_CREDENTIALS' } }),
        });
      } else {
        await route.continue();
      }
    });
  }

  async esperarPermanecerNoLogin(timeout = 15000) {
    await expect(this.page).toHaveURL(/login/, { timeout });
  }
}
