import type { CDPSession } from '@playwright/test';

export async function addWebAuthn(client: CDPSession) {
  await client.send('WebAuthn.enable');

  const result = await client.send('WebAuthn.addVirtualAuthenticator', {
    options: {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      isUserVerified: true,
    },
  });

  return result.authenticatorId;
}
