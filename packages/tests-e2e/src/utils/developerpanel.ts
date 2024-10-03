import { expect } from '@playwright/test';

import type { IdentifierEnforceVerification, IdentifierType } from './constants';
import { SocialProviderType } from './constants';

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

export const createProjectNew = async () => {
  const random = Math.floor(Math.random() * 10000);
  const name = `e2etest-${random}`;
  const createRes = await fetch(`${process.env.DEVELOPERPANEL_API_URL}/v1/projects`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PLAYWRIGHT_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      name,
    }),
  });
  expect(createRes.ok).toBeTruthy();

  const projectId = (await createRes.json()).data.projectId;
  console.log(`Created project ${name} ${projectId}`);

  const configureRes = await fetch(`${process.env.BACKEND_API_URL}/v1/projectConfig`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
      'X-Corbado-ProjectID': projectId,
    },
    body: JSON.stringify({
      frontendFramework: 'react',
      allowStaticChallenges: true,
      webauthnRPID: process.env.CI ? 'playground.corbado.io' : 'playground.corbado.io',
    }),
  });
  expect(configureRes.ok).toBeTruthy();

  const activateRes = await fetch(`${process.env.BACKEND_API_URL}/v1/projects/activate`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Cookie: `cbo_short_session=${process.env.PLAYWRIGHT_JWT_TOKEN}`,
      'X-Corbado-ProjectID': projectId,
    },
  });
  expect(activateRes.ok).toBeTruthy();

  return projectId;
};

export async function deleteProjectNew(projectId: string) {
  const deleteRes = await fetch(`${process.env.DEVELOPERPANEL_API_URL}/v1/projects`, {
    method: 'DELETE',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PLAYWRIGHT_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      projectId: projectId,
    }),
  });

  expect(deleteRes.ok).toBeTruthy();
  console.log(`Deleted project ${projectId}`);
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

export async function setComponentConfig(
  projectId: string,
  identifiers: Identifier[],
  socialProviders: SocialProvider[] = [],
  fullNameRequired = false,
  publicSignupEnabled = true,
) {
  const response = await fetch(`${process.env.DEVELOPERPANEL_API_URL}/v1/projects/${projectId}/componentConfig`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.PLAYWRIGHT_JWT_TOKEN}`,
    },
    body: JSON.stringify({
      fullNameRequired: fullNameRequired,
      publicSignupEnabled: publicSignupEnabled,
      passkeyAppendInterval: '1d',
      identifiers,
      socialProviders,
    }),
  });
  expect(response.ok).toBeTruthy();
}
