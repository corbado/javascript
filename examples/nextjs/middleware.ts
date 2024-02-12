import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { SDK, Config } from '@corbado/node-sdk';
import { jwtDecode } from 'jwt-decode';

function readUserIP(request: NextRequest): string {
  return '127.0.0.1';
  // return (
  //   request.ip ??
  //   request.headers.get('x-real-ip') ??
  //   request.headers.get('x-forwarded-for') ??
  //   ''
  // );
}

function validateSession(shortSession: string | undefined) {
  if (!shortSession) {
    return false;
  }

  const decodedShortSession = jwtDecode(shortSession);
  return !!decodedShortSession.exp && decodedShortSession.exp > Date.now() / 1000;
}

export async function middleware(request: NextRequest) {
  let cookie = request.cookies.get('corbado_short_session');
  // const projectID = process.env.NEXT_PUBLIC_CORBADO_PROJECT_ID!;
  // const apiSecret = process.env.CORBADO_API_SECRET!;

  // const config = new Config(projectID, apiSecret);
  // const sdk = new SDK(config);
  // const req = {
  //   token: cookie?.value ?? '',
  //   clientInfo: {
  //     userAgent: request.headers.get('user-agent') ?? '',
  //     remoteAddress: readUserIP(request),
  //   },
  // };

  //await sdk.authTokens().validate(req);

  const isSessionValid = validateSession(cookie?.value);
  const url = request.nextUrl.clone();

  if (isSessionValid && (url.pathname === '/login' || url.pathname === '/signup')) {
    url.pathname = '/dashboard';
    return NextResponse.redirect(url);
  }

  if (!isSessionValid && url.pathname === '/dashboard') {
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
