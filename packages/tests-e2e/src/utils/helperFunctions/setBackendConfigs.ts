import { expect } from '@playwright/test';

import type { IdentifierEnforceVerification, IdentifierType } from '../constants';

interface Identifier {
  type: IdentifierType;
  enforceVerification: IdentifierEnforceVerification;
  useAsLoginIdentifier: boolean;
  metadata: {
    verifications: string[];
  };
}

export function makeIdentifier(
  type: IdentifierType,
  enforceVerification: IdentifierEnforceVerification,
  useAsLoginIdentifier: boolean,
  verifications: string[],
): Identifier {
  return {
    type,
    enforceVerification,
    useAsLoginIdentifier,
    metadata: {
      verifications,
    },
  };
}

export async function setBackendConfigs(projectId: string, identifiers: Identifier[]) {
  const response = await fetch(
    `${process.env.CORE_API_URL}/v1/projects/${projectId}/componentConfig`,
    {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Cookie': `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
      },
      body: JSON.stringify({
        fullNameRequired: false,
        publicSignupEnabled: true,
        passkeyAppendInterval: '1d',
        identifiers: identifiers,
        socialProviders: [],
      }),
    },
  );

  expect(response.ok).toBeTruthy();
}
