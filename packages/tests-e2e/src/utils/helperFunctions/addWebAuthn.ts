import type { CDPSession } from '@playwright/test';

export async function addWebAuthn(client: CDPSession, successful: boolean) {
  await client.send('WebAuthn.enable');

  const result = await client.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      automaticPresenceSimulation: false,
      isUserVerified: successful,
    },
  });

  return result.authenticatorId;
}
