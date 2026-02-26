let originalGet: typeof navigator.credentials.get | null = null;
let originalCreate: typeof navigator.credentials.create | null = null;
let originalIsUvpa: typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable | null = null;
let originalIsConditional: typeof PublicKeyCredential.isConditionalMediationAvailable | null = null;
let isEnabled = false;
let currentSessionId: string | null = null;

function arrayBufferToBase64Url(buffer: ArrayBuffer): string {
  const bytes = new Uint8Array(buffer);
  let binary = '';
  for (let i = 0; i < bytes.length; i++) {
    binary += String.fromCharCode(bytes[i]);
  }
  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=/g, '');
}

function base64ToArrayBuffer(base64: string): ArrayBuffer {
  const cleanBase64 = base64.replace(/-/g, '+').replace(/_/g, '/');
  const padded = cleanBase64 + '=='.substring(0, (4 - (cleanBase64.length % 4)) % 4);

  const binary = atob(padded);
  const bytes = new Uint8Array(binary.length);
  for (let i = 0; i < binary.length; i++) {
    bytes[i] = binary.charCodeAt(i);
  }
  return bytes.buffer;
}

function concatArrayBuffers(...buffers: ArrayBuffer[]): ArrayBuffer {
  const totalLength = buffers.reduce((sum, buf) => sum + buf.byteLength, 0);
  const result = new Uint8Array(totalLength);
  let offset = 0;
  buffers.forEach(buf => {
    result.set(new Uint8Array(buf), offset);
    offset += buf.byteLength;
  });
  return result.buffer;
}

function toDerInteger(bytes: Uint8Array): number[] {
  let start = 0;
  while (start < bytes.length - 1 && bytes[start] === 0) {
    start += 1;
  }
  const unsigned = Array.from(bytes.slice(start));
  if (unsigned[0] & 0x80) {
    unsigned.unshift(0x00);
  }
  return [0x02, unsigned.length, ...unsigned];
}

function ensureDerEncodedEcdsaSignature(signature: ArrayBuffer): ArrayBuffer {
  const bytes = new Uint8Array(signature);
  if (bytes.length > 2 && bytes[0] === 0x30) {
    return signature;
  }
  if (bytes.length % 2 !== 0) {
    return signature;
  }

  const half = bytes.length / 2;
  const r = bytes.slice(0, half);
  const s = bytes.slice(half);
  const rDer = toDerInteger(r);
  const sDer = toDerInteger(s);
  const sequenceLength = rDer.length + sDer.length;
  const der = new Uint8Array(2 + sequenceLength);
  der[0] = 0x30;
  der[1] = sequenceLength;
  der.set(rDer, 2);
  der.set(sDer, 2 + rDer.length);
  return der.buffer;
}

function base64UrlToUint8Array(value: string): Uint8Array {
  const padded = value + '==='.slice((value.length + 3) % 4);
  const base64 = padded.replace(/-/g, '+').replace(/_/g, '/');
  return Uint8Array.from(atob(base64), c => c.charCodeAt(0));
}

async function sha256(data: BufferSource): Promise<ArrayBuffer> {
  return crypto.subtle.digest('SHA-256', data);
}

async function createAuthenticatorData(rpId: string, flags: number, signCount: number): Promise<ArrayBuffer> {
  const rpIdHash = await sha256(new TextEncoder().encode(rpId));
  const flagsByte = new Uint8Array([flags]);
  const counterBytes = new Uint8Array(4);
  new DataView(counterBytes.buffer).setUint32(0, signCount, false);
  return concatArrayBuffers(rpIdHash, flagsByte.buffer, counterBytes.buffer);
}

interface StoredCredential {
  credentialId: string;
  privateKey: string;
  rpId: string;
  signCount?: number;
  userHandle?: string;
}

interface MockBehavior {
  action: 'complete' | 'cancel' | 'error' | 'not-started';
  credentialId?: string;
}

interface StoredMockAuthState {
  login: {
    withIdentifier: MockBehavior['action'];
    withIdentifierCompleteWithCredentialId?: string;
    withoutIdentifier: MockBehavior['action'];
    withoutIdentifierCompleteWithCredentialId?: string;
  };
  create: {
    action: MockBehavior['action'];
  };
  enabled: boolean;
}

function getCredentialsStorageKey(sessionId: string): string {
  return `mock-auth-credentials:${sessionId}`;
}

function getStoredCredentials(sessionId: string): StoredCredential[] {
  const raw = localStorage.getItem(getCredentialsStorageKey(sessionId));
  if (!raw) {
    return [];
  }
  try {
    const parsed = JSON.parse(raw) as StoredCredential[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function setStoredCredentials(sessionId: string, credentials: StoredCredential[]): void {
  localStorage.setItem(getCredentialsStorageKey(sessionId), JSON.stringify(credentials));
}

function parseCreationOptions(attestationOptions: string): PublicKeyCredentialCreationOptions {
  const parsed = JSON.parse(attestationOptions) as { publicKey: Record<string, unknown> };
  if (PublicKeyCredential.parseCreationOptionsFromJSON) {
    return PublicKeyCredential.parseCreationOptionsFromJSON(parsed.publicKey as never);
  }

  const publicKey = parsed.publicKey as {
    challenge: string;
    user: { id: string };
    excludeCredentials?: Array<{ id: string; type: string; transports?: string[] }>;
  };

  return {
    ...(publicKey as unknown as PublicKeyCredentialCreationOptions),
    challenge: base64ToArrayBuffer(publicKey.challenge),
    user: {
      ...(publicKey.user as unknown as PublicKeyCredentialUserEntity),
      id: base64ToArrayBuffer(publicKey.user.id),
    },
    excludeCredentials: publicKey.excludeCredentials?.map(descriptor => ({
      id: base64ToArrayBuffer(descriptor.id),
      transports: descriptor.transports?.map(transport => transport.toLowerCase() as AuthenticatorTransport) ?? [],
      type: descriptor.type as PublicKeyCredentialType,
    })),
  };
}

async function generateAssertionResponse(
  credential: StoredCredential,
  challenge: ArrayBuffer,
  origin: string,
  rpIdOverride?: string,
): Promise<PublicKeyCredential> {
  const rpId = rpIdOverride || credential.rpId;
  const clientData = {
    type: 'webauthn.get',
    challenge: arrayBufferToBase64Url(challenge),
    origin,
    crossOrigin: false,
  };
  const clientDataJSON = new TextEncoder().encode(JSON.stringify(clientData));
  // UP | UV | BE | BS -> keep synced/backed up state consistent on assertions.
  const authenticatorData = await createAuthenticatorData(rpId, 0x1d, credential.signCount || 0);
  const clientDataHash = await sha256(clientDataJSON);
  const dataToSign = concatArrayBuffers(authenticatorData, clientDataHash);

  const privateKeyDer = base64ToArrayBuffer(credential.privateKey);
  const privateKey = await crypto.subtle.importKey(
    'pkcs8',
    privateKeyDer,
    { name: 'ECDSA', namedCurve: 'P-256' },
    false,
    ['sign'],
  );
  const rawSignature = await crypto.subtle.sign({ name: 'ECDSA', hash: 'SHA-256' }, privateKey, dataToSign);
  const signature = ensureDerEncodedEcdsaSignature(rawSignature);

  return {
    id: credential.credentialId,
    rawId: base64ToArrayBuffer(credential.credentialId),
    response: {
      clientDataJSON: clientDataJSON.buffer,
      authenticatorData,
      signature,
      userHandle: credential.userHandle ? base64ToArrayBuffer(credential.userHandle) : null,
    },
    type: 'public-key',
    authenticatorAttachment: 'platform',
    getClientExtensionResults: () => ({}),
  } as unknown as PublicKeyCredential;
}

async function getBehavior(operation: 'get' | 'create', mediation: 'required' | 'conditional'): Promise<MockBehavior> {
  if (!currentSessionId) {
    return { action: 'complete' };
  }

  const raw = localStorage.getItem(`mock-auth-behavior:${currentSessionId}`);
  if (!raw) {
    return { action: 'complete' };
  }

  try {
    const parsed = JSON.parse(raw) as StoredMockAuthState;
    if (operation === 'create') {
      return { action: parsed.create.action };
    }
    if (mediation === 'required') {
      return {
        action: parsed.login.withIdentifier,
        credentialId: parsed.login.withIdentifierCompleteWithCredentialId,
      };
    }
    return {
      action: parsed.login.withoutIdentifier,
      credentialId: parsed.login.withoutIdentifierCompleteWithCredentialId,
    };
  } catch {
    return { action: 'complete' };
  }
}

async function mockCredentialsGet(options?: CredentialRequestOptions): Promise<Credential | null> {
  if (!options?.publicKey || !currentSessionId || !originalGet) {
    return originalGet?.call(navigator.credentials, options) ?? null;
  }

  const mediation = (options.mediation || 'required') as 'required' | 'conditional';
  const behavior = await getBehavior('get', mediation);
  if (behavior.action === 'not-started') {
    await new Promise(resolve => setTimeout(resolve, 60_000));
  }
  if (behavior.action === 'cancel') {
    throw new DOMException('User cancelled', 'NotAllowedError');
  }
  if (behavior.action === 'error') {
    throw new DOMException('Authenticator error', 'UnknownError');
  }

  const credentials = getStoredCredentials(currentSessionId);
  if (!credentials.length) {
    throw new DOMException('No credentials available', 'NotAllowedError');
  }

  const allowedIds =
    options.publicKey.allowCredentials?.map(descriptor => arrayBufferToBase64Url(descriptor.id as ArrayBuffer)) ?? [];
  const candidates =
    allowedIds.length > 0
      ? credentials.filter(credential => allowedIds.includes(credential.credentialId))
      : credentials;
  if (!candidates.length) {
    throw new DOMException('No matching credentials available', 'NotAllowedError');
  }

  let selected = candidates[candidates.length - 1];
  if (behavior.credentialId) {
    selected = candidates.find(c => c.credentialId === behavior.credentialId) ?? selected;
  }

  return generateAssertionResponse(
    selected,
    options.publicKey.challenge as ArrayBuffer,
    window.location.origin,
    options.publicKey.rpId,
  );
}

interface MockRegistrationCredential extends PublicKeyCredential {
  _privateKeyBase64: string;
  _publicKeyBase64: string;
  toJSON: () => Record<string, unknown>;
}

function hexToBytes(hex: string): Uint8Array {
  const bytes = new Uint8Array(hex.length / 2);
  for (let i = 0; i < hex.length; i += 2) {
    bytes[i / 2] = Number.parseInt(hex.substring(i, i + 2), 16);
  }
  return bytes;
}

function encodeCoseKey(x: Uint8Array, y: Uint8Array): ArrayBuffer {
  const header = [
    0xa5, // map(5)
    0x01,
    0x02, // 1:2 (kty EC2)
    0x03,
    0x26, // 3:-7 (ES256)
    0x20,
    0x01, // -1:1 (P-256)
    0x21,
    0x58,
    x.length, // -2:<x>
  ];
  const middle = [0x22, 0x58, y.length]; // -3:<y>
  const result = new Uint8Array(header.length + x.length + middle.length + y.length);
  result.set(header, 0);
  result.set(x, header.length);
  result.set(middle, header.length + x.length);
  result.set(y, header.length + x.length + middle.length);
  return result.buffer;
}

function createNoneAttestationObject(authenticatorData: ArrayBuffer): ArrayBuffer {
  const authDataBytes = new Uint8Array(authenticatorData);
  const parts = [
    0xa3,
    0x63,
    0x66,
    0x6d,
    0x74, // "fmt"
    0x64,
    0x6e,
    0x6f,
    0x6e,
    0x65, // "none"
    0x67,
    0x61,
    0x74,
    0x74,
    0x53,
    0x74,
    0x6d,
    0x74, // "attStmt"
    0xa0, // {}
    0x68,
    0x61,
    0x75,
    0x74,
    0x68,
    0x44,
    0x61,
    0x74,
    0x61, // "authData"
    0x58,
    authDataBytes.length, // bytes
  ];
  const result = new Uint8Array(parts.length + authDataBytes.length);
  result.set(parts, 0);
  result.set(authDataBytes, parts.length);
  return result.buffer;
}

async function createAuthenticatorDataWithCredential(
  rpId: string,
  credentialId: Uint8Array,
  publicKey: CryptoKey,
): Promise<ArrayBuffer> {
  const rpIdHash = await sha256(new TextEncoder().encode(rpId));
  // UP | UV | BE | BS | AT -> marks passkey as backed up/synced.
  const flagsByte = new Uint8Array([0x5d]);
  const counterBytes = new Uint8Array(4);
  new DataView(counterBytes.buffer).setUint32(0, 0, false);
  const aaguid = hexToBytes('fbfc3007154e4ecc8c0b6e020557d7bd');
  const credIdLenBytes = new Uint8Array(2);
  new DataView(credIdLenBytes.buffer).setUint16(0, credentialId.length, false);
  const publicJwk = await crypto.subtle.exportKey('jwk', publicKey);
  const x = base64UrlToUint8Array(publicJwk.x!);
  const y = base64UrlToUint8Array(publicJwk.y!);
  const cosePublicKey = encodeCoseKey(x, y);

  return concatArrayBuffers(
    rpIdHash,
    flagsByte.buffer as ArrayBuffer,
    counterBytes.buffer as ArrayBuffer,
    aaguid.buffer as ArrayBuffer,
    credIdLenBytes.buffer as ArrayBuffer,
    credentialId.buffer as ArrayBuffer,
    cosePublicKey,
  );
}

async function generateRegistrationResponse(
  publicKeyOptions: PublicKeyCredentialCreationOptions,
  origin: string,
): Promise<MockRegistrationCredential> {
  const rpId = publicKeyOptions.rp.id || 'localhost';
  const keyPair = await crypto.subtle.generateKey({ name: 'ECDSA', namedCurve: 'P-256' }, true, ['sign', 'verify']);
  const privateKeyDer = await crypto.subtle.exportKey('pkcs8', keyPair.privateKey);
  const publicKeySpki = await crypto.subtle.exportKey('spki', keyPair.publicKey);
  const publicJwk = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
  const x = base64UrlToUint8Array(publicJwk.x!);
  const y = base64UrlToUint8Array(publicJwk.y!);

  const credentialIdBytes = new Uint8Array(32);
  crypto.getRandomValues(credentialIdBytes);
  const credentialId = arrayBufferToBase64Url(credentialIdBytes.buffer);

  const clientData = {
    type: 'webauthn.create',
    challenge: arrayBufferToBase64Url(publicKeyOptions.challenge as ArrayBuffer),
    origin,
    crossOrigin: false,
  };
  const clientDataJSON = new TextEncoder().encode(JSON.stringify(clientData));

  const authenticatorData = await createAuthenticatorDataWithCredential(rpId, credentialIdBytes, keyPair.publicKey);
  const attestationObject = createNoneAttestationObject(authenticatorData);

  return {
    id: credentialId,
    rawId: credentialIdBytes.buffer,
    response: {
      clientDataJSON: clientDataJSON.buffer,
      attestationObject,
      authenticatorData,
      publicKey: publicKeySpki,
      publicKeyAlgorithm: -7,
      getTransports: () => ['internal', 'hybrid'],
      getPublicKey: () => publicKeySpki,
      getPublicKeyAlgorithm: () => -7,
      getAuthenticatorData: () => authenticatorData,
    },
    type: 'public-key',
    authenticatorAttachment: 'platform',
    getClientExtensionResults: () => ({}),
    toJSON: () => ({
      type: 'public-key',
      id: credentialId,
      rawId: arrayBufferToBase64Url(credentialIdBytes.buffer),
      authenticatorAttachment: 'platform',
      response: {
        clientDataJSON: arrayBufferToBase64Url(clientDataJSON.buffer as ArrayBuffer),
        attestationObject: arrayBufferToBase64Url(attestationObject),
        authenticatorData: arrayBufferToBase64Url(authenticatorData),
        publicKey: arrayBufferToBase64Url(publicKeySpki),
        publicKeyAlgorithm: -7,
        transports: ['internal', 'hybrid'],
      },
      clientExtensionResults: {},
    }),
    _privateKeyBase64: arrayBufferToBase64Url(privateKeyDer),
    _publicKeyBase64: arrayBufferToBase64Url(encodeCoseKey(x, y)),
  } as unknown as MockRegistrationCredential;
}

function persistCredentialForSession(
  sessionId: string,
  credential: MockRegistrationCredential,
  publicKeyOptions: PublicKeyCredentialCreationOptions,
): void {
  const userHandle = publicKeyOptions.user.id ? arrayBufferToBase64Url(publicKeyOptions.user.id as ArrayBuffer) : '';
  const existing = getStoredCredentials(sessionId);
  existing.push({
    credentialId: credential.id,
    privateKey: credential._privateKeyBase64,
    userHandle,
    rpId: publicKeyOptions.rp.id || 'localhost',
    signCount: 0,
  });
  setStoredCredentials(sessionId, existing);
}

export async function createMockAttestationResponse(attestationOptions: string, sessionId: string): Promise<string> {
  const publicKeyOptions = parseCreationOptions(attestationOptions);
  const credential = await generateRegistrationResponse(publicKeyOptions, window.location.origin);
  persistCredentialForSession(sessionId, credential, publicKeyOptions);
  return JSON.stringify(credential.toJSON());
}

async function mockCredentialsCreate(options?: CredentialCreationOptions): Promise<Credential | null> {
  if (!options?.publicKey || !currentSessionId || !originalCreate) {
    return originalCreate?.call(navigator.credentials, options) ?? null;
  }

  const behavior = await getBehavior('create', 'required');
  if (behavior.action === 'not-started') {
    await new Promise(resolve => setTimeout(resolve, 60_000));
  }
  if (behavior.action === 'cancel') {
    throw new DOMException('User cancelled', 'NotAllowedError');
  }
  if (behavior.action === 'error') {
    throw new DOMException('Authenticator error', 'UnknownError');
  }

  const credential = await generateRegistrationResponse(options.publicKey, window.location.origin);
  persistCredentialForSession(currentSessionId, credential, options.publicKey);

  return credential;
}

export function enableMockAuthenticator(sessionId: string): void {
  if (isEnabled) {
    return;
  }

  currentSessionId = sessionId;
  originalGet = navigator.credentials.get.bind(navigator.credentials);
  originalCreate = navigator.credentials.create.bind(navigator.credentials);
  originalIsUvpa = PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable
    ? PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable.bind(PublicKeyCredential)
    : null;
  originalIsConditional = PublicKeyCredential.isConditionalMediationAvailable
    ? PublicKeyCredential.isConditionalMediationAvailable.bind(PublicKeyCredential)
    : null;
  navigator.credentials.get = mockCredentialsGet;
  navigator.credentials.create = mockCredentialsCreate;
  if (PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable) {
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = async () => true;
  }
  if (PublicKeyCredential.isConditionalMediationAvailable) {
    PublicKeyCredential.isConditionalMediationAvailable = async () => true;
  }
  isEnabled = true;
}

export function disableMockAuthenticator(): void {
  if (!isEnabled || !originalGet || !originalCreate) {
    return;
  }

  navigator.credentials.get = originalGet;
  navigator.credentials.create = originalCreate;
  if (originalIsUvpa) {
    PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable = originalIsUvpa;
  }
  if (originalIsConditional) {
    PublicKeyCredential.isConditionalMediationAvailable = originalIsConditional;
  }
  originalIsUvpa = null;
  originalIsConditional = null;
  currentSessionId = null;
  isEnabled = false;
}
