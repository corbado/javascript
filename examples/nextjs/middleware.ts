import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtDecode } from 'jwt-decode';
import createNodeSDK from './app/utils/createNodeSDK';

async function validateSession(shortSession: string | undefined) {
  if (!shortSession) {
    return false;
  }

  const sdk = createNodeSDK();
  const verifiedSession = await sdk.sessions().validateShortSessionValue(shortSession);

  if (!verifiedSession.isAuthenticated()) {
    return false;
  }

  const decodedShortSession = jwtDecode(shortSession);
  return !!decodedShortSession.exp && decodedShortSession.exp > Date.now() / 1000;
}

export async function middleware(request: NextRequest) {
  const cookie = request.cookies.get('cbo_short_session');
  const shortSession = cookie?.value;
  const url = request.nextUrl.clone();
  const isSessionValid = await validateSession(shortSession);

  if (isSessionValid && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!isSessionValid && url.pathname.startsWith('/dashboard')) {
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
