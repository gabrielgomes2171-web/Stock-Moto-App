import type { Page } from '@playwright/test';

/** Ativa o modo de simulação do app (dados falsos, sem Firebase real). */
export async function ativarModoE2E(page: Page) {
  await page.addInitScript(() => {
    (window as any).__STOCKMOTO_E2E__ = true;
  });
}
