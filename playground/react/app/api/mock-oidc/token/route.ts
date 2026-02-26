import { NextRequest } from 'next/server';
import { signIdToken } from '../../../../src/server/test-tools/mock-oidc-keys';
import { OidcDb } from '../../../../src/server/test-tools/oidc-db';

export const runtime = 'nodejs';

export async function POST(req: NextRequest) {
  const contentType = req.headers.get('content-type') || '';
  let code: string | null = null;
  let clientId: string | null = null;

  if (contentType.includes('application/x-www-form-urlencoded')) {
    const body = await req.formData();
    code = body.get('code') as string;
    clientId = body.get('client_id') as string;
  } else {
    const body = (await req.json()) as { code?: string; client_id?: string };
    code = body.code || null;
    clientId = body.client_id || null;
  }

  if (!code) {
    return Response.json({ error: 'invalid_request', error_description: 'code required' }, { status: 400 });
  }

  const authCode = OidcDb.getAuthCode(code);
  if (!authCode) {
    return Response.json({ error: 'invalid_grant', error_description: 'Invalid code' }, { status: 400 });
  }

  const user = OidcDb.getUserById(authCode.userId);
  if (!user) {
    OidcDb.deleteAuthCode(code);
    return Response.json({ error: 'invalid_grant', error_description: 'User not found' }, { status: 400 });
  }

  OidcDb.deleteAuthCode(code);
  const issuer = `${req.nextUrl.origin}/api/mock-oidc`;
  const idToken = await signIdToken({
    sub: user.id,
    email: user.email,
    issuer,
    audience: clientId || 'mock-client',
  });
  const accessToken = Buffer.from(
    JSON.stringify({
      userId: user.id,
      sessionId: authCode.sessionId,
    }),
  ).toString('base64url');

  return Response.json({
    access_token: accessToken,
    token_type: 'Bearer',
    expires_in: 3600,
    id_token: idToken,
    scope: 'openid email profile',
  });
}
