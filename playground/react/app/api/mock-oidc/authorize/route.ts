import { cookies } from 'next/headers';
import { NextRequest } from 'next/server';
import { OidcDb } from '../../../../src/server/test-tools/oidc-db';

export const runtime = 'nodejs';

export async function GET(req: NextRequest) {
  const redirectUri = req.nextUrl.searchParams.get('redirect_uri');
  const state = req.nextUrl.searchParams.get('state') || '';
  if (!redirectUri) {
    return Response.json({ error: 'redirect_uri required' }, { status: 400 });
  }

  const cookieStore = await cookies();
  const devSessionId = cookieStore.get('mock_oidc_dev_session')?.value;
  if (!devSessionId) {
    const errorUrl = new URL(redirectUri);
    errorUrl.searchParams.set('error', 'server_error');
    errorUrl.searchParams.set('error_description', 'No devSessionId found');
    if (state) {
      errorUrl.searchParams.set('state', state);
    }
    return Response.redirect(errorUrl.toString());
  }

  const users = OidcDb.listUsers(devSessionId);
  if (!users.length) {
    const errorUrl = new URL(redirectUri);
    errorUrl.searchParams.set('error', 'access_denied');
    errorUrl.searchParams.set('error_description', 'No mock OIDC users configured');
    if (state) {
      errorUrl.searchParams.set('state', state);
    }
    return Response.redirect(errorUrl.toString());
  }

  const mockUser = users[0];
  if (mockUser.behavior === 'error') {
    const errorUrl = new URL(redirectUri);
    errorUrl.searchParams.set('error', 'server_error');
    if (state) {
      errorUrl.searchParams.set('state', state);
    }
    return Response.redirect(errorUrl.toString());
  }

  if (mockUser.behavior === 'cancel') {
    const errorUrl = new URL(redirectUri);
    errorUrl.searchParams.set('error', 'access_denied');
    if (state) {
      errorUrl.searchParams.set('state', state);
    }
    return Response.redirect(errorUrl.toString());
  }

  if (mockUser.behavior === 'navigate_back') {
    const referer = req.headers.get('referer');
    const refererUrl = new URL(referer!);
    return Response.redirect(refererUrl.toString());
  }

  const code = crypto.randomUUID();
  OidcDb.storeAuthCode(code, mockUser.id, devSessionId);

  const successUrl = new URL(redirectUri);
  successUrl.searchParams.set('code', code);
  if (state) {
    successUrl.searchParams.set('state', state);
  }
  return Response.redirect(successUrl.toString());
}
