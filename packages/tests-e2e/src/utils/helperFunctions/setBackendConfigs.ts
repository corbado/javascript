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

interface SocialProvider {
  clientID: string;
  clientSecret: string;
  enabled: boolean;
  providerType: string;
  redirectURI: string;
  scopes: string[];
  useOwnAccount: boolean;
}

export enum SocialProviderType {
  Microsoft = 'microsoft',
  Github = 'github',
  Google = 'google',
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

export function makeSocialProvider(providerType: SocialProviderType): SocialProvider {
  const redirectURI = `https://shared.${process.env.FRONTEND_API_URL_SUFFIX}/v2/auth/social/verify/callback`;
  let scopes: string[] = [];
  switch (providerType) {
    case SocialProviderType.Microsoft:
      scopes = ['openid', 'profile', 'email'];
      break;
    case SocialProviderType.Github:
      scopes = ['user:email', 'read:user'];
      break;
    case SocialProviderType.Google:
      scopes = [
        'openid',
        'https://www.googleapis.com/auth/userinfo.email',
        'https://www.googleapis.com/auth/userinfo.profile',
      ];
      break;
    default:
      throw new Error('Unsupported social provider type');
  }

  return {
    clientID: '',
    clientSecret: '',
    enabled: true,
    providerType,
    redirectURI,
    scopes,
    useOwnAccount: false,
  };
}

export async function setBackendConfigs(
  projectId: string,
  identifiers: Identifier[],
  socialProviders: SocialProvider[] = [],
) {
  const response = await fetch(`${process.env.CORE_API_URL}/v1/projects/${projectId}/componentConfig`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PLAYWRIGHT_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      fullNameRequired: false,
      publicSignupEnabled: true,
      passkeyAppendInterval: '1d',
      identifiers,
      socialProviders,
    }),
  });
  console.log(response);
  expect(response.ok).toBeTruthy();
}
