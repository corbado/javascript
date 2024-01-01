import type { CDPSession } from '@playwright/test';

export async function removeWebAuthn(client: CDPSession, authenticatorId: string) {
  await client.send('WebAuthn.removeVirtualAuthenticator', {
    authenticatorId: authenticatorId,
  });
}
