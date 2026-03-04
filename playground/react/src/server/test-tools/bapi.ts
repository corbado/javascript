const BAPI_BASE_URL = process.env.CORBADO_BACKEND_API_URL;
const BAPI_BASIC_AUTH = process.env.CORBADO_BACKEND_API_BASIC_AUTH;
function assertEnv() {
  if (!BAPI_BASE_URL) {
    throw new Error('CORBADO_BACKEND_API_URL is not configured');
  }
  if (!BAPI_BASIC_AUTH) {
    throw new Error('CORBADO_BACKEND_API_BASIC_AUTH is not configured');
  }
}

function getHeaders() {
  assertEnv();
  return {
    'Content-Type': 'application/json',
    Authorization: `Basic ${BAPI_BASIC_AUTH}`,
  };
}

function toBapiUrl(path: string) {
  assertEnv();
  return `${BAPI_BASE_URL!.replace(/\/+$/, '')}/v2${path}`;
}

async function bapiFetch(path: string, init?: RequestInit) {
  const response = await fetch(toBapiUrl(path), {
    ...init,
    headers: {
      ...getHeaders(),
      ...(init?.headers || {}),
    },
  });
  if (!response.ok) {
    const text = await response.text();
    throw new Error(`BAPI request failed: ${path} -> ${response.status} ${text}`);
  }
  if (response.status === 204) {
    return null;
  }

  // check if there's content to parse
  const contentLength = response.headers.get('Content-Length');
  if (contentLength && parseInt(contentLength) === 0) {
    return null;
  }

  const contentType = response.headers.get('Content-Type');
  if (contentType && contentType.includes('application/json')) {
    return response.json();
  }

  return null;
}

export interface BapiUserAggregate {
  userID: string;
  status: string;
  fullName?: string;
  emailIdentifiers?: Array<{ value: string }>;
}

export interface BapiCredential {
  id: string;
  credentialID: string;
  aaguid?: string;
  status?: string;
}

export async function createActiveUser(fullName: string) {
  return bapiFetch('/users', {
    method: 'POST',
    body: JSON.stringify({
      status: 'active',
      fullName,
    }),
  }) as Promise<{ userID: string; status: string }>;
}

export async function addEmailIdentifier(userID: string, email: string, status: 'primary' | 'verified' = 'verified') {
  return bapiFetch(`/users/${encodeURIComponent(userID)}/identifiers`, {
    method: 'POST',
    body: JSON.stringify({
      identifierType: 'email',
      identifierValue: email,
      status,
    }),
  });
}

export async function createSocialAccount(userID: string, email: string, fullName: string) {
  return bapiFetch(`/users/${encodeURIComponent(userID)}/socialAccounts`, {
    method: 'POST',
    body: JSON.stringify({
      providerType: 'custom',
      identifierValue: email,
      foreignID: crypto.randomUUID(),
      avatarURL: 'https://example.com/avatar.png',
      fullName,
    }),
  });
}

export async function deleteUser(userID: string) {
  return bapiFetch(`/users/${encodeURIComponent(userID)}`, {
    method: 'DELETE',
  });
}

export async function listUsersByIDs(userIDs: string[]) {
  if (!userIDs.length) {
    return [];
  }
  const query = new URLSearchParams({
    includeIdentifiers: 'true',
    pageSize: '1000',
    userIDs: userIDs.join(','),
  });
  const rsp = (await bapiFetch(`/users?${query.toString()}`, {
    method: 'GET',
  })) as { users: BapiUserAggregate[] };
  return rsp.users;
}

export async function listCredentials(userID: string) {
  try {
    const rsp = (await bapiFetch(`/users/${encodeURIComponent(userID)}/credentials?includeAllStatus=true`, {
      method: 'GET',
    })) as { credentials: BapiCredential[] };
    return rsp.credentials;
  } catch {
    return [];
  }
}

export async function deleteCredential(userID: string, credentialID: string) {
  try {
    return bapiFetch(`/users/${encodeURIComponent(userID)}/credentials/${encodeURIComponent(credentialID)}`, {
      method: 'DELETE',
    });
  } catch (e) {
    console.error(`Failed to delete credential ${credentialID} for user ${userID}:`, e);
  }
}

interface ClientInformation {
  remoteAddress: string;
  userAgent: string;
  userVerifyingPlatformAuthenticatorAvailable: boolean;
  conditionalMediationAvailable: boolean;
  clientCapabilities: {
    conditionalCreate: boolean;
    conditionalMediation: boolean;
    hybridTransport: boolean;
    passkeyPlatformAuthenticator: boolean;
    userVerifyingPlatformAuthenticator: boolean;
  };
  parsedDeviceInfo: {
    browserName: string;
    browserVersion: string;
    osName: string;
    osVersion: string;
  };
}

const defaultClientInformation: ClientInformation = {
  remoteAddress: '127.0.0.1',
  userAgent:
    'Mozilla/5.0 (Macintosh; Intel Mac OS X 14_0) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0.0.0 Safari/537.36',
  userVerifyingPlatformAuthenticatorAvailable: true,
  conditionalMediationAvailable: true,
  clientCapabilities: {
    conditionalCreate: true,
    conditionalMediation: true,
    hybridTransport: true,
    passkeyPlatformAuthenticator: true,
    userVerifyingPlatformAuthenticator: true,
  },
  parsedDeviceInfo: {
    browserName: 'Chrome',
    browserVersion: '124.0.0.0',
    osName: 'Mac OS X',
    osVersion: '14.0.0',
  },
};

export async function passkeyAppendStart(userID: string, username: string, processID: string) {
  return bapiFetch('/passkey/append/start', {
    method: 'POST',
    body: JSON.stringify({
      userID,
      processID,
      username,
      clientInformation: defaultClientInformation,
      passkeyIntelFlags: {
        forcePasskeyAppend: true,
      },
      situation: 'default',
    }),
  }) as Promise<{ appendAllow: boolean; attestationOptions: string }>;
}

export async function passkeyAppendFinish(
  userID: string,
  processID: string,
  trackingID: string,
  attestationResponse: string,
) {
  return bapiFetch('/passkey/append/finish', {
    method: 'POST',
    body: JSON.stringify({
      userID,
      processID,
      trackingID,
      attestationResponse,
      clientInformation: defaultClientInformation,
    }),
  }) as Promise<{ passkeyData: { id: string } }>;
}
