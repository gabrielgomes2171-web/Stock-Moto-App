import { type Page, type Locator, expect } from '@playwright/test';

/** Page Object da tela de Cadastro de peças (/cadastrar). */
export class CadastroPage {
  readonly page: Page;
  readonly campoNome: Locator;
  readonly campoCodigo: Locator;
  readonly seletorModelo: Locator;
  readonly botaoSalvar: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoNome = page.getByPlaceholder('Ex: Pastilha de Freio').filter({ visible: true }).first();
    this.campoCodigo = page.getByPlaceholder('Ex: PF-001').filter({ visible: true }).first();
    this.seletorModelo = page.locator('select').filter({ visible: true }).first();
    this.botaoSalvar = page.getByText('SALVAR', { exact: true }).filter({ visible: true }).first();
  }

  async abrir() {
    await this.page.goto('/cadastrar');
    await expect(this.campoNome).toBeVisible();
    await expect(this.campoCodigo).toBeVisible();
  }

  async preencher(nome: string, codigo: string, modelo: string) {
    await this.campoNome.fill(nome);
    await this.campoCodigo.fill(codigo);
    await this.seletorModelo.selectOption({ label: modelo });
  }

  async salvar() {
    await this.botaoSalvar.click();
  }

  async esperarCamposVazios() {
    await expect(this.campoNome).toHaveValue('');
    await expect(this.campoCodigo).toHaveValue('');
  }
}
