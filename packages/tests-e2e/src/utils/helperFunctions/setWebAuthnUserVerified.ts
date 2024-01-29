import type { CDPSession } from '@playwright/test';

export async function setWebAuthnUserVerified(client: CDPSession, authenticatorId: string, isUserVerified: boolean) {
  await client.send('WebAuthn.setUserVerified', {
    authenticatorId,
    isUserVerified,
  });
}
