import { SignJWT, exportJWK, generateKeyPair, type JWK } from 'jose';

let keyPairPromise: Promise<CryptoKeyPair> | null = null;
const KID = 'mock-oidc-key-1';

async function getKeyPair() {
  if (!keyPairPromise) {
    keyPairPromise = generateKeyPair('RS256');
  }
  return keyPairPromise;
}

export async function getPublicJwk(): Promise<JWK> {
  const keyPair = await getKeyPair();
  const jwk = await exportJWK(keyPair.publicKey);
  return {
    ...jwk,
    use: 'sig',
    alg: 'RS256',
    kid: KID,
  };
}

export async function signIdToken(payload: {
  sub: string;
  email: string;
  name?: string;
  issuer: string;
  audience: string;
}) {
  const keyPair = await getKeyPair();
  const now = Math.floor(Date.now() / 1000);

  return new SignJWT({
    sub: payload.sub,
    email: payload.email,
    email_verified: true,
    name: payload.name,
  })
    .setProtectedHeader({ alg: 'RS256', kid: KID, typ: 'JWT' })
    .setIssuer(payload.issuer)
    .setAudience(payload.audience)
    .setIssuedAt(now)
    .setExpirationTime(now + 3600)
    .sign(keyPair.privateKey);
}
