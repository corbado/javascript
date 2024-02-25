import { expect } from '@playwright/test';

export enum IdentifierType {
  Email = 'email',
  Phone = 'phone',
  Social = 'social',
  Username = 'username',
}

export enum IdentifierEnforceVerification {
  None = 'none',
  BeforePasskeyLogin = 'before-passkey-login',
  Signup = 'signup',
}

export enum IdentifierVerification {
  EmailOtp = 'email-otp',
  EmailLink = 'email-link',
  SmsOtp = 'sms-otp',
}

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
  const response = await fetch(`https://${projectId}.frontendapi.corbado.io/v2/component-config?=`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Corbado-ProjectID': projectId,
    },
    body: JSON.stringify({
      identifiers: identifiers,
    }),
  });

  expect(response.ok).toBeTruthy();
}
