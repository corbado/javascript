import type { Page } from '@playwright/test';

export async function initializeCDPSession(page: Page) {
  const client = await page.context().newCDPSession(page);

  return client;
}
