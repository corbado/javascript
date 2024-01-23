import type { CDPSession } from '@playwright/test';

export async function setWebAuthnAutomaticPresenceSimulation(client: CDPSession, authenticatorId: string, automatic: boolean) {
  await client.send('WebAuthn.setAutomaticPresenceSimulation', {
    authenticatorId: authenticatorId,
    enabled: automatic,
  });
}
