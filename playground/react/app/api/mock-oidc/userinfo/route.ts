import { NextRequest } from 'next/server';
import { OidcDb } from '../../../../src/server/test-tools/oidc-db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const authHeader = req.headers.get('authorization');
  if (!authHeader?.startsWith('Bearer ')) {
    return Response.json({ error: 'invalid_token' }, { status: 401 });
  }

  const accessToken = authHeader.slice(7);
  try {
    const decoded = JSON.parse(Buffer.from(accessToken, 'base64url').toString('utf8')) as { userId: string };
    console.log('Decoded access token:', decoded);
    const user = OidcDb.getUserById(decoded.userId);
    console.log('User from OidcDb:', user);
    if (!user) {
      return Response.json({ error: 'invalid_token' }, { status: 401 });
    }

    return Response.json({
      sub: user.id,
      email: user.email,
      email_verified: true,
      name: user.email,
    });
  } catch {
    return Response.json({ error: 'invalid_token' }, { status: 401 });
  }
}
