import type { CDPSession, Page } from '@playwright/test';

import { waitAfterLoad } from '../constants';
import { addWebAuthn } from './addWebAuthn';
import { initializeCDPSession } from './initializeCDPSession';

export async function enableVirtualAuthenticator(
  page: Page,
  successful: boolean,
): Promise<[cdpClient: CDPSession, authenticatorId: string]> {
  const cdpClient = await initializeCDPSession(page);
  const authenticatorId = await addWebAuthn(cdpClient, successful);
  // Corbado backend checks for passkey availability upon page load, so reloading the page prevents race condition
  await page.reload();
  await page.waitForTimeout(waitAfterLoad);

  return [cdpClient, authenticatorId];
}
