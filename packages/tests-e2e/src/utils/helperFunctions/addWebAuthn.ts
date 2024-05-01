import type { CDPSession } from '@playwright/test';

export async function addWebAuthn(client: CDPSession, passkeySupported: boolean) {
  await client.send('WebAuthn.enable');

  const result = await client.send('WebAuthn.addVirtualAuthenticator', {
    options: passkeySupported ? 
    {
      protocol: 'ctap2',
      transport: 'internal',
      hasResidentKey: true,
      hasUserVerification: true,
      automaticPresenceSimulation: false,
    }
    :
    {
      protocol: 'u2f',
      transport: 'usb',
    },
  });

  return result.authenticatorId;
}
