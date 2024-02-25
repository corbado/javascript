import type { Page } from '@playwright/test';

import { waitAfterLoad } from '../constants';

export async function loadAuth(page: Page) {
  await page.goto('/pro-8125835201872404154/auth');
  // Note: The page will make an API call to fetch project config after navigation
  await page.waitForTimeout(waitAfterLoad);
}
