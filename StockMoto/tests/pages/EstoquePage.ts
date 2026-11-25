import { type Page, type Locator, expect } from '@playwright/test';

/** Page Object da tela de Estoque de um modelo de moto (ex.: /estoquefan160). */
export class EstoquePage {
  readonly page: Page;
  readonly campoBusca: Locator;
  readonly listaVazia: Locator;

  constructor(page: Page) {
    this.page = page;
    this.campoBusca = page.getByPlaceholder('Buscar peça').filter({ visible: true }).first();
    this.listaVazia = page.getByText('Nenhuma peça cadastrada', { exact: true });
  }

  async abrir(rota: string) {
    await this.page.goto(rota);
    await expect(this.campoBusca).toBeVisible();
  }

  peca(nome: string): Locator {
    return this.page.getByText(nome, { exact: true });
  }

  async buscar(termo: string) {
    await this.campoBusca.fill(termo);
  }
}
